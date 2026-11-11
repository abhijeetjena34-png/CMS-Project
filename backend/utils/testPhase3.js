require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const http = require('http');
const Content = require('../models/Content');
const connectDB = require('../config/db');

async function testPhase3() {
  console.log('🧪 Starting Phase 3: MongoDB Integration & Content Model Verification\n');
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

  // 1. Verify MONGODB_URI exists in .env
  const uri = process.env.MONGODB_URI;
  assert(Boolean(uri), `1. MONGODB_URI is defined in .env (${uri ? uri.replace(/\/\/.*@/, '//***@') : 'MISSING'})`);

  if (!uri) {
    console.error('\n❌ MONGODB_URI is missing. Please set MONGODB_URI in backend/.env');
    process.exit(1);
  }

  // 2. Test Mongoose connection to MongoDB
  try {
    const conn = await connectDB();
    assert(conn && mongoose.connection.readyState === 1, '2. MongoDB connected successfully via Mongoose (readyState = 1)');
  } catch (err) {
    assert(false, `2. MongoDB connection failed: ${err.message}`);
    process.exit(1);
  }

  // 3. Test Content Model schema & validations
  console.log('\n--- Content Model Schema & Validation Tests ---');

  // 3a. Valid document validation
  const validDoc = new Content({
    title: 'Phase 3 Verification Article',
    description: 'Testing the content model validation rules and schema fields.',
    category: 'Technology',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97',
    content: 'Detailed body content for Phase 3 testing.',
  });
  const validErr = validDoc.validateSync();
  assert(!validErr, '3a. Valid Content document passes Mongoose validation');
  assert(validDoc.status === 'Draft', '3b. Content status defaults to "Draft" when omitted');

  // 3c. Missing required fields validation
  const emptyDoc = new Content({});
  const emptyErr = emptyDoc.validateSync();
  assert(emptyErr && emptyErr.errors.title, '3c. Validation rejects missing title');
  assert(emptyErr && emptyErr.errors.description, '3d. Validation rejects missing description');
  assert(emptyErr && emptyErr.errors.category, '3e. Validation rejects missing category');
  assert(emptyErr && emptyErr.errors.image, '3f. Validation rejects missing image URL');
  assert(emptyErr && emptyErr.errors.content, '3g. Validation rejects missing content body');

  // 3h. Invalid image URL validation
  const invalidImageDoc = new Content({
    title: 'Test Title',
    description: 'Test Description',
    category: 'Tech',
    image: 'not-a-valid-url',
    content: 'Test content body',
  });
  const invalidImageErr = invalidImageDoc.validateSync();
  assert(
    invalidImageErr && invalidImageErr.errors.image,
    '3h. Validation rejects invalid image URL (must start with http:// or https://)'
  );

  // 3i. Invalid status validation
  const invalidStatusDoc = new Content({
    title: 'Test Title',
    description: 'Test Description',
    category: 'Tech',
    image: 'https://example.com/test.jpg',
    content: 'Test content body',
    status: 'Archived', // not in ['Draft', 'Published']
  });
  const invalidStatusErr = invalidStatusDoc.validateSync();
  assert(
    invalidStatusErr && invalidStatusErr.errors.status,
    '3i. Validation rejects invalid status (only "Draft" or "Published" allowed)'
  );

  // 4. Test MongoDB save & retrieval of Content document
  console.log('\n--- Database Persistence & Timestamp Test ---');
  try {
    const saved = await validDoc.save();
    assert(Boolean(saved._id), `4a. Content document successfully saved to MongoDB (ID: ${saved._id})`);
    assert(Boolean(saved.createdAt) && Boolean(saved.updatedAt), '4b. createdAt and updatedAt timestamps automatically generated');
    assert(Boolean(saved.slug), `4c. Slug automatically generated (${saved.slug})`);

    // Clean up test document
    await Content.findByIdAndDelete(saved._id);
    console.log('   (Test document cleaned up from database)');
  } catch (err) {
    assert(false, `4. Database persistence failed: ${err.message}`);
  }

  // 5. Test existing health-check API
  console.log('\n--- Health-Check API Test ---');
  const port = process.env.PORT || 5001;
  await new Promise((resolve) => {
    http.get(`http://localhost:${port}/api/health`, (res) => {
      let raw = '';
      res.on('data', (c) => (raw += c));
      res.on('end', () => {
        let json;
        try { json = JSON.parse(raw); } catch { json = {}; }
        assert(res.statusCode === 200, '5a. Health-check endpoint responds with HTTP 200');
        assert(json.success === true && json.message === 'CMS API is running', '5b. Health-check JSON response preserves expected structure');
        resolve();
      });
    }).on('error', (e) => {
      assert(false, `5. Health-check request failed: ${e.message}`);
      resolve();
    });
  });

  console.log(`\n🎉 Phase 3 Result: ${passed} of ${total} tests passed!`);
  await mongoose.disconnect();
}

testPhase3();

