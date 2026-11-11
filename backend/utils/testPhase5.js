require('dotenv').config({ path: __dirname + '/../.env' });
const http = require('http');

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

async function testPhase5() {
  console.log('🧪 Starting Phase 5: Content Management CRUD & Error Handling Verification\n');
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

  // Step 0: Login as admin to get token
  const loginRes = await request('/api/auth/login', {
    method: 'POST',
    body: {
      email: process.env.SEED_ADMIN_EMAIL,
      password: process.env.SEED_ADMIN_PASSWORD,
    },
  });
  assert(loginRes.status === 200 && loginRes.data.token, '0. Admin login succeeds to obtain JWT token for CRUD tests');
  const token = loginRes.data.token;
  const authHeaders = { Authorization: `Bearer ${token}` };

  // ─── 1. Content Creation (POST /api/admin/content) ─────────────
  console.log('\n--- 1. Content Creation & Validation Tests ---');

  // 1a. Unauthenticated creation rejected
  const unauthCreate = await request('/api/admin/content', {
    method: 'POST',
    body: { title: 'Test' },
  });
  assert(unauthCreate.status === 401, '1a. Unauthenticated content creation is rejected (HTTP 401)');

  // 1b. Missing required fields
  const missingFields = await request('/api/admin/content', {
    method: 'POST',
    headers: authHeaders,
    body: { title: 'Missing Other Fields' },
  });
  assert(missingFields.status === 400, '1b. Content creation with missing fields rejected (HTTP 400)');

  // 1c. Invalid image URL
  const invalidImage = await request('/api/admin/content', {
    method: 'POST',
    headers: authHeaders,
    body: {
      title: 'Invalid Image Test',
      description: 'A valid description',
      category: 'Technology',
      image: 'not_a_valid_url',
      content: 'Some content body',
    },
  });
  assert(invalidImage.status === 400, '1c. Invalid image URL rejected with HTTP 400');

  // 1d. Valid creation (as Draft)
  const createRes = await request('/api/admin/content', {
    method: 'POST',
    headers: authHeaders,
    body: {
      title: 'Mastering Full-Stack CRUD with Node & Mongoose',
      description: 'A comprehensive deep-dive into creating resilient RESTful API endpoints.',
      category: 'Technology',
      image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97',
      content: 'In this guide, we break down controllers, models, and centralized error handling.',
      status: 'Draft',
    },
  });
  assert(createRes.status === 201 && createRes.data.success, '1d. Valid content creation returns HTTP 201 Created');
  const createdItem = createRes.data.data;
  assert(Boolean(createdItem._id), '1e. Created item has generated MongoDB ObjectId');
  assert(Boolean(createdItem.slug), `1f. Created item has auto-generated slug: ${createdItem.slug}`);
  assert(createdItem.status === 'Draft', '1g. Status correctly set to Draft');

  const contentId = createdItem._id;
  let currentSlug = createdItem.slug;

  // ─── 2. Get All Admin Content (GET /api/admin/content) ───────────
  console.log('\n--- 2. Get All Content (Admin) Tests ---');
  const adminList = await request('/api/admin/content', { headers: authHeaders });
  assert(adminList.status === 200, '2a. GET /api/admin/content returns HTTP 200');
  assert(Array.isArray(adminList.data.data), '2b. Response data is an array of content items');
  const foundInList = adminList.data.data.find((item) => item._id === contentId);
  assert(Boolean(foundInList), '2c. Newly created item is included in admin content list');

  // ─── 3. Get Individual Content by ID (GET /api/admin/content/:id)
  console.log('\n--- 3. Get Individual Content Tests ---');

  // 3a. Invalid MongoDB ID format (CastError handling)
  const badIdRes = await request('/api/admin/content/123-invalid-id', { headers: authHeaders });
  assert(badIdRes.status === 400, '3a. Invalid MongoDB ID rejected with HTTP 400 (Bad Request)');

  // 3b. Non-existent valid ObjectId
  const nonExistentIdRes = await request('/api/admin/content/650000000000000000000000', { headers: authHeaders });
  assert(nonExistentIdRes.status === 404, '3b. Non-existent content ID returns HTTP 404 (Not Found)');

  // 3c. Valid ID fetch
  const getByIdRes = await request(`/api/admin/content/${contentId}`, { headers: authHeaders });
  assert(getByIdRes.status === 200, '3c. Valid content ID returns HTTP 200');
  assert(getByIdRes.data.data.title === createdItem.title, '3d. Fetched content matches stored record');

  // ─── 4. Update Content (PUT /api/admin/content/:id) ──────────────
  console.log('\n--- 4. Update Content Tests ---');

  // 4a. Update with invalid ID
  const badUpdateId = await request('/api/admin/content/invalid-id', {
    method: 'PUT',
    headers: authHeaders,
    body: { title: 'New Title' },
  });
  assert(badUpdateId.status === 400, '4a. Update with invalid ID format rejected with HTTP 400');

  // 4b. Update with invalid image URL
  const badUpdateImage = await request(`/api/admin/content/${contentId}`, {
    method: 'PUT',
    headers: authHeaders,
    body: { image: 'invalid-image-url' },
  });
  assert(badUpdateImage.status === 400, '4b. Update with invalid image URL rejected with HTTP 400');

  // 4c. Successful update
  const updatedTitle = 'Mastering Full-Stack CRUD with Node & Mongoose [Updated]';
  const updateRes = await request(`/api/admin/content/${contentId}`, {
    method: 'PUT',
    headers: authHeaders,
    body: {
      title: updatedTitle,
      category: 'Education',
    },
  });
  assert(updateRes.status === 200, '4c. Successful content update returns HTTP 200');
  assert(updateRes.data.data.title === updatedTitle, '4d. Updated record reflects modified title');
  assert(updateRes.data.data.category === 'Education', '4e. Updated record reflects modified category');
  currentSlug = updateRes.data.data.slug || currentSlug;

  // ─── 5. Status Toggle (PATCH /api/admin/content/:id/status) ──────
  console.log('\n--- 5. Status Toggle Tests ---');

  // 5a. Invalid status value
  const badStatusRes = await request(`/api/admin/content/${contentId}/status`, {
    method: 'PATCH',
    headers: authHeaders,
    body: { status: 'Archived' },
  });
  assert(badStatusRes.status === 400, '5a. Invalid status value rejected with HTTP 400');

  // 5b. Update status to Published
  const publishRes = await request(`/api/admin/content/${contentId}/status`, {
    method: 'PATCH',
    headers: authHeaders,
    body: { status: 'Published' },
  });
  assert(publishRes.status === 200, '5b. Updating status to Published returns HTTP 200');
  assert(publishRes.data.data.status === 'Published', '5c. Status confirmed as Published in response');

  // ─── 6. Public Content Endpoints (GET /api/content) ─────────────
  console.log('\n--- 6. Public Content Endpoints Tests ---');

  // 6a. Public list includes published item
  const publicList = await request('/api/content');
  assert(publicList.status === 200, '6a. Public GET /api/content returns HTTP 200');
  const foundInPublic = publicList.data.data.find((item) => item._id === contentId);
  assert(Boolean(foundInPublic), '6b. Published content item is visible on public website');

  // 6c. Public get by ID
  const publicById = await request(`/api/content/${contentId}`);
  assert(publicById.status === 200, '6c. Public GET by ID returns HTTP 200 for published content');

  // 6d. Public get by Slug
  const publicBySlug = await request(`/api/content/${currentSlug}`);
  assert(publicBySlug.status === 200, '6d. Public GET by Slug returns HTTP 200 for published content');

  // 6e. Set back to Draft and verify public visibility is revoked
  await request(`/api/admin/content/${contentId}/status`, {
    method: 'PATCH',
    headers: authHeaders,
    body: { status: 'Draft' },
  });

  const publicListDraft = await request('/api/content');
  const inPublicDraft = publicListDraft.data.data.find((item) => item._id === contentId);
  assert(!inPublicDraft, '6e. Draft content is NOT included in public content list');

  const publicDraftById = await request(`/api/content/${contentId}`);
  assert(publicDraftById.status === 404, '6f. Public GET by ID returns HTTP 404 for draft content');

  // ─── 7. Content Deletion (DELETE /api/admin/content/:id) ─────────
  console.log('\n--- 7. Content Deletion Tests ---');

  // 7a. Invalid ID on delete
  const badDeleteId = await request('/api/admin/content/invalid-id', {
    method: 'DELETE',
    headers: authHeaders,
  });
  assert(badDeleteId.status === 400, '7a. Delete with invalid ID format rejected with HTTP 400');

  // 7b. Non-existent ID on delete
  const nonExistentDelete = await request('/api/admin/content/650000000000000000000000', {
    method: 'DELETE',
    headers: authHeaders,
  });
  assert(nonExistentDelete.status === 404, '7b. Delete non-existent ID returns HTTP 404');

  // 7c. Successful deletion
  const deleteRes = await request(`/api/admin/content/${contentId}`, {
    method: 'DELETE',
    headers: authHeaders,
  });
  assert(deleteRes.status === 200, '7c. Content deletion returns HTTP 200');

  // 7d. Verify deletion in database
  const getAfterDelete = await request(`/api/admin/content/${contentId}`, { headers: authHeaders });
  assert(getAfterDelete.status === 404, '7d. Deleted content no longer exists in database (HTTP 404)');

  console.log(`\n🎉 Phase 5 Result: ${passed} of ${total} tests passed!`);
}

testPhase5();
