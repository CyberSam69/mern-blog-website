const User = require('./models/User');
const Category = require('./models/Category');
const Tag = require('./models/Tag');
const Author = require('./models/Author');
const Post = require('./models/Post');
const slugify = require('slugify');

const INITIAL_CATEGORIES = [
  { name: 'Software Development', description: 'Architectural patterns, microservices, system design, and clean code principles.' },
  { name: 'Artificial Intelligence & Machine Learning', description: 'Neural models, LLM deployment, RAG vector pipelines, and ML engineering.' },
  { name: 'Web and Mobile App Development', description: 'Modern web architectures, event loops, reactive UI, and cross-platform apps.' },
  { name: 'Technology & Innovation', description: 'Emerging technology breakthroughs, next-gen protocols, and distributed consensus.' },
  { name: 'Cybersecurity', description: 'Zero Trust architecture, workload attestation, RBAC, and cloud-native security.' },
  { name: 'Cloud Computing', description: 'Kubernetes orchestration, multi-cluster management, serverless, and cloud infrastructure.' },
  { name: 'Industry Insights', description: 'Developer productivity engineering, software metrics, and tech leadership strategy.' },
];

const INITIAL_AUTHORS = [
  {
    name: 'Marcus Vance',
    email: 'marcus.vance@flyertech.com',
    role: 'Principal Systems Architect',
    bio: 'Over 15 years architecting high-throughput distributed systems and event-driven data pipelines.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    socialLinks: { twitter: 'https://twitter.com', linkedin: 'https://linkedin.com' },
  },
  {
    name: 'Elena Rostova',
    email: 'elena.rostova@flyertech.com',
    role: 'Chief Information Security Officer',
    bio: 'Cybersecurity researcher specializing in Zero Trust cloud workloads, cryptographic attestation, and threat modeling.',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    socialLinks: { twitter: 'https://twitter.com', linkedin: 'https://linkedin.com' },
  },
  {
    name: 'Dr. Aris Thorne',
    email: 'aris.thorne@flyertech.com',
    role: 'Head of AI Research',
    bio: 'Directing enterprise neural systems research with an emphasis on RAG vector pipelines and fine-tuned domain models.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    socialLinks: { twitter: 'https://twitter.com', linkedin: 'https://linkedin.com' },
  },
  {
    name: 'Devon Patel',
    email: 'devon.patel@flyertech.com',
    role: 'Staff Backend Engineer',
    bio: 'Specializing in Node.js event-loop performance tuning, high-concurrency REST APIs, and database indexing.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    socialLinks: { twitter: 'https://twitter.com', linkedin: 'https://linkedin.com' },
  },
  {
    name: 'Sarah Lindqvist',
    email: 'sarah.lindqvist@flyertech.com',
    role: 'VP of Platform Engineering',
    bio: 'Leading global cloud platform infrastructure, multi-cluster Kubernetes fleets, and developer productivity tooling.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    socialLinks: { twitter: 'https://twitter.com', linkedin: 'https://linkedin.com' },
  },
];

const INITIAL_POSTS = [
  {
    title: 'Architecting Resilient Microservices with Event-Driven Architecture',
    excerpt: 'How modern engineering organizations decouple synchronous HTTP dependencies using distributed event streams, idempotency keys, and outbox patterns.',
    content: `
      <p class="lead">Microservice architectures often face hidden coupling when services rely on synchronous REST or gRPC cascades. In high-throughput distributed environments, a single degraded dependency can trigger cascading timeouts across the entire platform.</p>
      <h2>The Pitfalls of Synchronous Service Mesh Cascades</h2>
      <p>When Service A makes a synchronous RPC request to Service B, which in turn calls Service C, the availability profile of Service A degrades to the product of all downstream availabilities. If each service boasts 99.9% uptime, three cascaded calls reduce aggregate reliability to 99.7%.</p>
      <blockquote>"Coupling services via point-to-point synchronous HTTP creates distributed monoliths without any of the operational simplicity of a single binary."</blockquote>
      <h2>The Transactional Outbox Pattern</h2>
      <p>To safely emit events to Kafka or RabbitMQ while updating a relational database within a single ACID transaction, we implement the Transactional Outbox Pattern.</p>
      <pre><code>async function createOrder(db, orderData) {
  return await db.transaction(async (trx) => {
    const [order] = await trx('orders').insert(orderData).returning('*');
    await trx('outbox_events').insert({
      aggregate_type: 'ORDER',
      aggregate_id: order.id,
      event_type: 'ORDER_CREATED',
      payload: JSON.stringify(order),
      created_at: new Date()
    });
    return order;
  });
}</code></pre>
      <h2>Conclusion</h2>
      <p>Decoupling business domains through event streams allows independent scalability and zero-downtime deployment.</p>
    `,
    categoryName: 'Software Development',
    authorName: 'Marcus Vance',
    featuredImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1000&auto=format&fit=crop&q=80',
    readTime: '7 min read',
    isFeatured: true,
    isTrending: true,
    views: 4820,
    tags: ['Architecture', 'Microservices', 'Kafka'],
  },
  {
    title: 'Zero Trust Architecture in Cloud Native Infrastructure: A Practical Guide',
    excerpt: 'Moving beyond perimeter-based firewalls. Implementing mutual TLS (mTLS), SPIFFE/SPIRE identity attestation, and least-privilege RBAC in Kubernetes.',
    content: `
      <p class="lead">The traditional network perimeter is obsolete. Modern cloud native architectures require verifying every connection, service call, and user session before granting ephemeral access.</p>
      <h2>The Principle of Zero Trust</h2>
      <p>Zero Trust enforces continuous verification: Never trust, always verify. Inside Kubernetes clusters, pods should not communicate implicitly without cryptographically verifiable service identities.</p>
      <h2>Cryptographic Workload Attestation via SPIFFE</h2>
      <p>SPIFFE establishes open standards for authenticating workloads across cloud environments.</p>
    `,
    categoryName: 'Cybersecurity',
    authorName: 'Elena Rostova',
    featuredImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1000&auto=format&fit=crop&q=80',
    readTime: '6 min read',
    isFeatured: true,
    isTrending: true,
    views: 3950,
    tags: ['Security', 'Zero Trust', 'Kubernetes'],
  },
  {
    title: 'Evaluating LLM Fine-Tuning vs. Retrieval-Augmented Generation (RAG)',
    excerpt: 'An analytical benchmark of accuracy, operational cost, and maintenance overhead when choosing between RAG vector pipelines and domain fine-tuning.',
    content: `
      <p class="lead">Enterprise engineering teams face a critical architectural decision when building domain-specific AI applications: Should they adapt base models via fine-tuning, or construct a Retrieval-Augmented Generation (RAG) system?</p>
      <h2>Comparing Fundamental Mechanisms</h2>
      <p>Fine-tuning adjusts internal neural weights through backpropagation on a specialized corpus. RAG, conversely, retrieves factual grounding passages dynamically at inference time.</p>
    `,
    categoryName: 'Artificial Intelligence & Machine Learning',
    authorName: 'Dr. Aris Thorne',
    featuredImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&auto=format&fit=crop&q=80',
    readTime: '8 min read',
    isFeatured: false,
    isTrending: true,
    views: 5210,
    tags: ['AI', 'LLM', 'RAG'],
  },
  {
    title: 'Optimizing Node.js Event Loop Throughput for High-Concurrency APIs',
    excerpt: 'Detailed diagnostic guide for identifying CPU-bound bottlenecks, garbage collection pauses, and libuv thread pool starvation in production Node servers.',
    content: `
      <p class="lead">Node.js excels at I/O-intensive workloads, but unoptimized synchronous code can silently monopolize the single-threaded event loop, spiking API latencies across concurrent connections.</p>
      <h2>Monitoring Event Loop Lag</h2>
      <p>Measuring event loop delay with Node\'s perf_hooks API provides immediate indicators of CPU-bound operations.</p>
    `,
    categoryName: 'Web and Mobile App Development',
    authorName: 'Devon Patel',
    featuredImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1000&auto=format&fit=crop&q=80',
    readTime: '5 min read',
    isFeatured: false,
    isTrending: false,
    views: 2840,
    tags: ['Node.js', 'Performance', 'Backend'],
  },
  {
    title: 'Kubernetes Multi-Cluster Management: Strategies for Global Resilience',
    excerpt: 'How global platform engineering teams orchestrate workloads across diverse cloud regions with GitOps, Cluster API, and global traffic directors.',
    content: `
      <p class="lead">Running a single massive Kubernetes cluster across availability zones is insufficient for organizations requiring disaster recovery across cloud regions or geographic data sovereignty.</p>
      <h2>GitOps at Multi-Cluster Scale</h2>
      <p>Leveraging declarative Git repositories as the single source of truth ensures synchronized configurations across hundreds of regional clusters.</p>
    `,
    categoryName: 'Cloud Computing',
    authorName: 'Sarah Lindqvist',
    featuredImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1000&auto=format&fit=crop&q=80',
    readTime: '9 min read',
    isFeatured: false,
    isTrending: false,
    views: 3120,
    tags: ['Cloud', 'Kubernetes', 'DevOps'],
  },
  {
    title: 'Next-Generation Web Standards: What HTTP/3 and WebAssembly Enable',
    excerpt: 'Exploring the architectural possibilities of QUIC transport, multiplexed stream termination, and near-native client-side computing performance.',
    content: `
      <p class="lead">HTTP/3 solves the head-of-line blocking dilemma inherent to TCP by utilizing the UDP-based QUIC protocol.</p>
    `,
    categoryName: 'Technology & Innovation',
    authorName: 'Marcus Vance',
    featuredImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1000&auto=format&fit=crop&q=80',
    readTime: '6 min read',
    isFeatured: false,
    isTrending: false,
    views: 2490,
    tags: ['Web Standards', 'HTTP3'],
  },
  {
    title: 'The Evolution of Developer Productivity Engineering in 2026',
    excerpt: 'Analyzing metrics beyond DORA: how platform teams measure cognitive load, build caching efficacy, and feedback loop speed.',
    content: `
      <p class="lead">Developer Productivity Engineering (DPE) is no longer simply about CI build minutes. It has evolved into a scientific discipline measuring the entire feedback loop between code conception and staging verification.</p>
    `,
    categoryName: 'Industry Insights',
    authorName: 'Sarah Lindqvist',
    featuredImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1000&auto=format&fit=crop&q=80',
    readTime: '5 min read',
    isFeatured: false,
    isTrending: false,
    views: 1870,
    tags: ['Developer Productivity', 'Engineering Leadership'],
  },
];

const seedAll = async () => {
  try {
    console.log('[Seeder] Checking and initializing database seeds...');

    // 1. Seed Required Admin Account: admin@softrateSAM.com / admin@007
    const adminEmail = 'admin@softratesam.com';
    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      admin = await User.create({
        name: 'FlyerTech Administrator',
        email: adminEmail,
        password: 'admin@007',
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      });
      console.log(`[Seeder] Created Admin Account: ${adminEmail}`);
    } else {
      console.log(`[Seeder] Admin Account already present: ${adminEmail}`);
    }

    // 2. Seed Initial Categories
    const categoryMap = {};
    for (const cat of INITIAL_CATEGORIES) {
      const slug = slugify(cat.name, { lower: true, strict: true });
      let category = await Category.findOne({ slug });
      if (!category) {
        category = await Category.create({
          name: cat.name,
          slug,
          description: cat.description,
        });
        console.log(`[Seeder] Created Category: ${cat.name}`);
      }
      categoryMap[cat.name] = category._id;
    }

    // 3. Seed Initial Authors
    const authorMap = {};
    for (const auth of INITIAL_AUTHORS) {
      let author = await Author.findOne({ email: auth.email });
      if (!author) {
        author = await Author.create(auth);
        console.log(`[Seeder] Created Author: ${auth.name}`);
      }
      authorMap[auth.name] = author._id;
    }

    // 4. Seed Initial Tags
    const tagMap = {};
    for (const postData of INITIAL_POSTS) {
      for (const tagName of postData.tags) {
        const slug = slugify(tagName, { lower: true, strict: true });
        let tag = await Tag.findOne({ slug });
        if (!tag) {
          tag = await Tag.create({ name: tagName, slug });
        }
        tagMap[tagName] = tag._id;
      }
    }

    // 5. Seed Initial Posts
    for (const p of INITIAL_POSTS) {
      const slug = slugify(p.title, { lower: true, strict: true });
      const existing = await Post.findOne({ slug });
      if (!existing) {
        const catId = categoryMap[p.categoryName];
        const authId = authorMap[p.authorName];
        const tagIds = p.tags.map((t) => tagMap[t]).filter(Boolean);

        await Post.create({
          title: p.title,
          slug,
          excerpt: p.excerpt,
          content: p.content,
          featuredImage: p.featuredImage,
          category: catId,
          author: authId,
          tags: tagIds,
          status: 'published',
          publishedAt: new Date(),
          readTime: p.readTime,
          isFeatured: p.isFeatured,
          isTrending: p.isTrending,
          views: p.views,
          seo: {
            metaTitle: p.title,
            metaDescription: p.excerpt,
            keywords: p.tags,
          },
        });
        console.log(`[Seeder] Created Post: ${p.title}`);
      }
    }

    console.log('[Seeder] All initial data seeded successfully.');
  } catch (error) {
    console.error('[Seeder] Error seeding database:', error.message);
  }
};

module.exports = { seedAll };

// If executed directly from command line: node seeder.js
if (require.main === module) {
  require('dotenv').config();
  const mongoose = require('mongoose');
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/flyertech-blog';
  mongoose.connect(uri).then(async () => {
    await seedAll();
    process.exit(0);
  }).catch((err) => {
    console.error('Failed to connect for manual seeding:', err.message);
    process.exit(1);
  });
}
