const http = require('http');

const API_BASE = 'http://localhost:5001';

async function request(path, options = {}) {
  const url = new URL(path, API_BASE);
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
    if (body) {
      req.write(body);
    }
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Starting End-to-End CMS Test Suite...\n');
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

  try {
    // 1. Health check
    const health = await request('/api/health');
    assert(health.status === 200 && health.data.success === true, '1. Health check endpoint responds with 200 OK');

    // 2. Unauthenticated access check (Protected route rejection)
    const unauthorizedCheck = await request('/api/admin/content');
    assert(unauthorizedCheck.status === 401, '2. Unauthenticated request to /api/admin/content is rejected (401)');

    // 3. Admin login with wrong password
    const badLogin = await request('/api/auth/login', {
      method: 'POST',
      body: { email: 'admin@cms.com', password: 'WrongPassword' },
    });
    assert(badLogin.status === 401, '3. Invalid credentials rejected with 401');

    // 4. Admin login with correct credentials
    const goodLogin = await request('/api/auth/login', {
      method: 'POST',
      body: { email: 'admin@cms.com', password: 'Admin@123456' },
    });
    assert(goodLogin.status === 200 && goodLogin.data.token, '4. Admin login succeeds and returns JWT token');
    const token = goodLogin.data.token;
    const authHeaders = { Authorization: `Bearer ${token}` };

    // 5. Verify /api/auth/me returns admin profile
    const me = await request('/api/auth/me', { headers: authHeaders });
    assert(me.status === 200 && me.data.admin.email === 'admin@cms.com', '5. /api/auth/me returns authenticated admin data');

    // 6. Create content record (as Draft)
    const createRes = await request('/api/admin/content', {
      method: 'POST',
      headers: authHeaders,
      body: {
        title: 'Building Modern Scalable MERN Applications',
        description: 'An in-depth guide to building resilient and production-ready full-stack systems.',
        category: 'Technology',
        image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c',
        content: 'Full article body content explaining architectural patterns, authentication, and state management.',
        status: 'Draft',
      },
    });
    assert(createRes.status === 201 && createRes.data.success, '6. Admin can create new content record');
    const contentId = createRes.data.data._id;
    assert(Boolean(contentId), '   Content ID generated and returned');

    // 7. Verify it is saved in MongoDB and retrieved via admin list
    const adminList = await request('/api/admin/content', { headers: authHeaders });
    const foundInAdmin = adminList.data.data.find((item) => item._id === contentId);
    assert(foundInAdmin && foundInAdmin.status === 'Draft', '7. Content is saved in MongoDB and listed in admin panel (status: Draft)');

    // 8. Verify Draft is NOT displayed on public website
    const publicList1 = await request('/api/content');
    const inPublic1 = publicList1.data.data.find((item) => item._id === contentId);
    assert(!inPublic1, '8. Draft content is NOT displayed on public website (/api/content)');

    const publicItem1 = await request(`/api/content/${contentId}`);
    assert(publicItem1.status === 404, '   Public endpoint rejects fetching draft item by ID (404)');

    // 9. Edit the record
    const updateRes = await request(`/api/admin/content/${contentId}`, {
      method: 'PUT',
      headers: authHeaders,
      body: {
        title: 'Building Modern Scalable MERN Applications [Updated Edition]',
        description: 'Updated comprehensive guide to building resilient production-ready systems.',
        category: 'Technology',
        image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c',
        content: 'Updated content body with advanced caching and deployment best practices.',
      },
    });
    assert(updateRes.status === 200 && updateRes.data.data.title.includes('[Updated Edition]'), '9. Admin can edit existing content record');

    // 10. Publish the record
    const publishRes = await request(`/api/admin/content/${contentId}/status`, {
      method: 'PATCH',
      headers: authHeaders,
      body: { status: 'Published' },
    });
    assert(publishRes.status === 200 && publishRes.data.data.status === 'Published', '10. Content status changed to Published');

    // 11. Verify it appears on public website
    const publicList2 = await request('/api/content');
    const inPublic2 = publicList2.data.data.find((item) => item._id === contentId);
    assert(inPublic2 && inPublic2.title.includes('[Updated Edition]'), '11. Published content appears dynamically on public website');

    const publicItem2 = await request(`/api/content/${contentId}`);
    assert(publicItem2.status === 200 && publicItem2.data.data._id === contentId, '    Single published content is retrievable by ID publicly');

    // 12. Change status back to Draft and verify it disappears publicly
    const draftRes = await request(`/api/admin/content/${contentId}/status`, {
      method: 'PATCH',
      headers: authHeaders,
      body: { status: 'Draft' },
    });
    assert(draftRes.status === 200 && draftRes.data.data.status === 'Draft', '12. Content status reverted back to Draft');

    const publicList3 = await request('/api/content');
    const inPublic3 = publicList3.data.data.find((item) => item._id === contentId);
    assert(!inPublic3, '    Content immediately disappears from public website upon reverting to Draft');

    // 13. Delete the record and verify it is removed
    const deleteRes = await request(`/api/admin/content/${contentId}`, {
      method: 'DELETE',
      headers: authHeaders,
    });
    assert(deleteRes.status === 200 && deleteRes.data.success, '13. Content deleted successfully via admin panel');

    const adminListAfterDelete = await request('/api/admin/content', { headers: authHeaders });
    const inAdminAfterDelete = adminListAfterDelete.data.data.find((item) => item._id === contentId);
    assert(!inAdminAfterDelete, '    Verified record is completely removed from database');

    console.log(`\n🎉 Summary: ${passed} of ${total} tests passed!`);
  } catch (err) {
    console.error('Fatal test error:', err);
    process.exit(1);
  }
}

runTests();

