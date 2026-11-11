require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const http = require('http');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const connectDB = require('../config/db');

async function request(path, options = {}) {
  const port = process.env.PORT || 5001;
  const url = new URL(path, `http://localhost:${port}`);
  return new Promise((resolve, reject) => {
    const headers = options.headers || {};
    let body = options.body;
    if (body && typeof body === 'object') {
      body = JSON.stringify(body);
      headers['Content-Type'] = 'application/json';
    }

    const req = http.request(
      url,
      {
        method: options.method || 'GET',
        headers,
      },
      (res) => {
        let rawData = '';
        res.on('data', (chunk) => (rawData += chunk));
        res.on('end', () => {
          let data;
          try {
            data = JSON.parse(rawData);
          } catch {
            data = rawData;
          }
          resolve({ status: res.statusCode, headers: res.headers, data });
        });
      }
    );

    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

async function testPhase4() {
  console.log('🧪 Starting Phase 4: Admin Authentication & Middleware Verification\n');
  let passed = 0;
  let total = 0;

  function assert(condition, message) {
    total++;
    if (condition) {
      console.log(`✅ [PASS] ${message}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${message}`);
      process.exitCode = 1;
    }
  }

  // Connect to DB for model tests
  await connectDB();

  // ─── 1. Admin Model & bcryptjs Hashing Tests ────────────────────
  console.log('\n--- 1. Admin Model & Password Hashing Tests ---');
  const testPassword = 'SecureAdminPassword123!';
  const tempEmail = `test_admin_${Date.now()}@example.com`;

  const adminDoc = new Admin({
    name: 'Temporary Admin Tester',
    email: tempEmail,
    password: testPassword,
  });

  await adminDoc.save();
  assert(adminDoc.password !== testPassword, '1a. Password is automatically hashed before saving (pre-save hook)');
  assert(adminDoc.password.startsWith('$2'), '1b. Password hash algorithm is bcryptjs (format $2a$ / $2b$)');

  // Verify comparePassword method
  const isCorrect = await adminDoc.comparePassword(testPassword);
  assert(isCorrect === true, '1c. comparePassword() returns true for matching password');

  const isWrong = await adminDoc.comparePassword('WrongPassword123');
  assert(isWrong === false, '1d. comparePassword() returns false for incorrect password');

  // Verify password exclusion by default
  const queriedAdmin = await Admin.findById(adminDoc._id);
  assert(queriedAdmin.password === undefined, '1e. Password field is hidden by default in queries (select: false)');

  // Clean up temporary admin
  await Admin.findByIdAndDelete(adminDoc._id);

  // ─── 2. Environment Variables & Seed Script Tests ───────────────
  console.log('\n--- 2. Environment Variables & Admin Seed Verification ---');
  assert(Boolean(process.env.JWT_SECRET), '2a. JWT_SECRET is configured in environment');
  assert(Boolean(process.env.SEED_ADMIN_EMAIL), '2b. SEED_ADMIN_EMAIL is configured in environment');
  assert(Boolean(process.env.SEED_ADMIN_PASSWORD), '2c. SEED_ADMIN_PASSWORD is configured in environment');

  const seededAdmin = await Admin.findOne({ email: process.env.SEED_ADMIN_EMAIL });
  assert(Boolean(seededAdmin), `2d. Seed admin (${process.env.SEED_ADMIN_EMAIL}) exists in MongoDB`);

  // ─── 3. Public Admin Login Endpoint (POST /api/auth/login) ──────
  console.log('\n--- 3. Login Endpoint & Credentials Verification ---');

  // 3a. Missing email / password
  const missingCreds = await request('/api/auth/login', {
    method: 'POST',
    body: {},
  });
  assert(missingCreds.status === 400, '3a. Missing credentials rejected with HTTP 400');

  // 3b. Non-existent email
  const nonexistentUser = await request('/api/auth/login', {
    method: 'POST',
    body: { email: 'nonexistent@cms.com', password: 'SomePassword123' },
  });
  assert(nonexistentUser.status === 401, '3b. Non-existent email rejected with HTTP 401');

  // 3c. Wrong password
  const badPassword = await request('/api/auth/login', {
    method: 'POST',
    body: { email: process.env.SEED_ADMIN_EMAIL, password: 'IncorrectPassword' },
  });
  assert(badPassword.status === 401, '3c. Wrong password rejected with HTTP 401');

  // 3d. Correct credentials
  const validLogin = await request('/api/auth/login', {
    method: 'POST',
    body: { email: process.env.SEED_ADMIN_EMAIL, password: process.env.SEED_ADMIN_PASSWORD },
  });
  assert(validLogin.status === 200, '3d. Valid credentials return HTTP 200');
  assert(Boolean(validLogin.data.token), '3e. Login response includes JWT token');
  assert(validLogin.data.admin && validLogin.data.admin.password === undefined, '3f. Login response never exposes password');
  assert(validLogin.data.admin.email === process.env.SEED_ADMIN_EMAIL, '3g. Login response returns correct admin profile');

  const validToken = validLogin.data.token;

  // ─── 4. Public Registration Prevention ─────────────────────────
  console.log('\n--- 4. Security: No Public Registration Route ---');
  const registerAttempt = await request('/api/auth/register', {
    method: 'POST',
    body: { name: 'Attacker', email: 'attacker@cms.com', password: 'Password123' },
  });
  assert(registerAttempt.status === 404, '4a. Public registration (/api/auth/register) does not exist (HTTP 404)');

  // ─── 5. Authentication Guard Middleware (protect) ───────────────
  console.log('\n--- 5. Authentication Guard Middleware Tests ---');

  // 5a. Request with no token
  const noToken = await request('/api/auth/me');
  assert(noToken.status === 401, '5a. Accessing protected /api/auth/me with no token rejected with HTTP 401');

  // 5b. Request with malformed / tampered token
  const badToken = await request('/api/auth/me', {
    headers: { Authorization: 'Bearer this.is.a.fake.token' },
  });
  assert(badToken.status === 401, '5b. Malformed / forged token rejected with HTTP 401');

  // 5c. Request with valid Bearer token
  const authorizedMe = await request('/api/auth/me', {
    headers: { Authorization: `Bearer ${validToken}` },
  });
  assert(authorizedMe.status === 200, '5c. Accessing protected /api/auth/me with valid Bearer token succeeds (HTTP 200)');
  assert(authorizedMe.data.admin.email === process.env.SEED_ADMIN_EMAIL, '5d. req.admin populated correctly from token decoding');

  // 5d. Protected admin content route access
  const protectedAdminContent = await request('/api/admin/content', {
    headers: { Authorization: `Bearer ${validToken}` },
  });
  assert(protectedAdminContent.status === 200, '5e. Protected /api/admin/content accessible with valid token');

  const unauthenticatedAdminContent = await request('/api/admin/content');
  assert(unauthenticatedAdminContent.status === 401, '5f. Protected /api/admin/content rejected without token');

  console.log(`\n🎉 Phase 4 Result: ${passed} of ${total} tests passed!`);
  await mongoose.disconnect();
}

testPhase4();
