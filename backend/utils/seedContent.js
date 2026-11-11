require('dotenv').config();
const mongoose = require('mongoose');
const Content = require('../models/Content');

const sampleArticles = [
  {
    title: 'Modern Web Architecture: Building Scalable Systems with MERN',
    description: 'An architectural exploration of decoupling business logic, state management, and building clean RESTful APIs.',
    category: 'Technology',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1000&auto=format&fit=crop&q=80',
    content: `Building scalable web applications requires thoughtful architecture from the database layer all the way to the user interface.

### The Foundation of Modern Full-Stack Systems
In modern enterprise applications, the MERN (MongoDB, Express, React, Node) stack provides an agile and cohesive ecosystem. Because JavaScript runs across the entire boundary, teams can easily share validation schemas, DTO structures, and utility libraries.

### Key Pillars
1. **Stateless Authentication**: Leveraging JSON Web Tokens (JWT) guarantees that the API layer can be horizontally scaled behind reverse proxies without needing shared session storage.
2. **Predictable State Management**: Using reactive context patterns ensures components stay decoupled while re-rendering only when relevant data mutations take place.
3. **Resilient Data Modeling**: Defining clean Mongoose schemas with pre-save hooks and automated indexing ensures data consistency and fast query execution.

Embracing these fundamentals is key to building maintainable software that stands the test of time.`,
    status: 'Published',
  },
  {
    title: 'The Future of Cloud Engineering in 2026 and Beyond',
    description: 'A deep dive into serverless workflows, edge computing, container orchestration, and multi-cloud strategies.',
    category: 'Business',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1000&auto=format&fit=crop&q=80',
    content: `Cloud infrastructure has evolved from simple virtual private servers into distributed, event-driven mesh networks.

### The Rise of Distributed Computing
Today's software platforms rely on low-latency regional nodes to serve static and dynamic content within milliseconds of the end user. This paradigm shift requires developers to architect applications with eventual consistency and asynchronous messaging in mind.

### Best Practices for Modern Deployments
- Containerize services with Docker for environmental parity across development and production.
- Automate CI/CD pipelines to run end-to-end integration test suites before any deployment.
- Implement comprehensive telemetry, logging, and error tracking to catch edge cases early.`,
    status: 'Published',
  },
  {
    title: 'Design Systems for High-Performance Web Applications',
    description: 'How standardized tokens, accessible component hierarchies, and atomic styling speed up development cycles.',
    category: 'Arts & Culture',
    image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1000&auto=format&fit=crop&q=80',
    content: `A unified design system bridges the gap between product designers and frontend engineers.

By declaring strict typography ramps, palette scales, and layout tokens with utility-first frameworks like Tailwind CSS, teams eliminate visual regressions and ensure accessibility standards across all screen sizes.`,
    status: 'Published',
  },
  {
    title: 'Draft: Internal Roadmap & CMS Feature Enhancements',
    description: 'Internal planning document outlining upcoming rich-text editor integrations and role-based permissions.',
    category: 'Other',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1000&auto=format&fit=crop&q=80',
    content: `Confidential draft document outlining planned features for subsequent sprint cycles. This content should remain hidden from public visitors until approved by the editorial team.`,
    status: 'Draft',
  },
];

async function seedContent() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const count = await Content.countDocuments();
    if (count > 0) {
      console.log(`ℹ️ Content collection already has ${count} records. Keeping existing data.`);
    } else {
      await Content.create(sampleArticles);
      console.log(`✅ Seeded ${sampleArticles.length} sample content articles (3 Published, 1 Draft)`);
    }
  } catch (error) {
    console.error('❌ Content seed error:', error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seedContent();

