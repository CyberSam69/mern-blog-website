export const MOCK_BLOGS = [
  {
    id: 'post-1',
    title: 'Architecting Resilient Microservices with Event-Driven Architecture',
    slug: 'architecting-resilient-microservices-event-driven-architecture',
    excerpt: 'How modern engineering organizations decouple synchronous HTTP dependencies using distributed event streams, idempotency keys, and outbox patterns.',
    content: `
      <p class="lead">Microservice architectures often face hidden coupling when services rely on synchronous REST or gRPC cascades. In high-throughput distributed environments, a single degraded dependency can trigger cascading timeouts across the entire platform.</p>

      <h2>The Pitfalls of Synchronous Service Mesh Cascades</h2>
      <p>When Service A makes a synchronous RPC request to Service B, which in turn calls Service C, the availability profile of Service A degrades to the product of all downstream availabilities. If each service boasts 99.9% uptime, three cascaded calls reduce aggregate reliability to 99.7%.</p>
      
      <blockquote>
        "Coupling services via point-to-point synchronous HTTP creates distributed monoliths without any of the operational simplicity of a single binary."
      </blockquote>

      <h2>The Transactional Outbox Pattern</h2>
      <p>To safely emit events to Kafka or RabbitMQ while updating a relational database (PostgreSQL/MySQL) within a single ACID transaction, we implement the <strong>Transactional Outbox Pattern</strong>.</p>
      <p>Instead of dispatching an event directly over the network during an API request, the application records both the business entity mutation and an outbox event in the same atomic database transaction:</p>

      <pre><code>// Atomic Outbox Transaction Example
async function createOrder(db, orderData) {
  return await db.transaction(async (trx) => {
    // 1. Insert the order record
    const [order] = await trx('orders')
      .insert(orderData)
      .returning('*');

    // 2. Insert outbox message atomically
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

      <h2>Handling Network Partitions with Idempotency</h2>
      <p>In distributed systems, the network is inherently unreliable. Consumers must anticipate duplicate event deliveries. We enforce idempotency keys using Redis with short TTL locks, followed by a durable record in our events store.</p>

      <div class="article-callout note">
        <h4>Key Architectural Takeaway</h4>
        <p>Ensure consumer workers process events idempotently. By persisting processed message IDs, replay attacks and consumer reconnect re-deliveries result in safe, no-op executions.</p>
      </div>

      <h2>Performance Comparison Under Load</h2>
      <p>The table below summarizes benchmarks recorded during our chaos engineering experiments testing synchronous vs. event-driven order processing pipelines:</p>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Architecture Pattern</th>
              <th>P95 Latency (ms)</th>
              <th>P99 Latency (ms)</th>
              <th>Cascade Failure Resilience</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Synchronous REST RPC</td>
              <td>342 ms</td>
              <td>1,280 ms</td>
              <td>Fails on 1st downstream outage</td>
            </tr>
            <tr>
              <td>Transactional Outbox + Kafka</td>
              <td>42 ms</td>
              <td>68 ms</td>
              <td>100% resilient (durable queue)</td>
            </tr>
            <tr>
              <td>Direct Dual-Write (Anti-pattern)</td>
              <td>88 ms</td>
              <td>410 ms</td>
              <td>Data inconsistency on crash</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Conclusion</h2>
      <p>Decoupling business domains through event streams allows independent scalability, zero-downtime deployment, and resilience against intermittent downstream outages. As your engineering team expands, asynchronous patterns provide the clear bounded contexts necessary for organizational autonomy.</p>
    `,
    category: 'Software Development',
    categorySlug: 'software-development',
    tags: ['Architecture', 'Microservices', 'Distributed Systems', 'Kafka'],
    author: {
      name: 'Marcus Vance',
      role: 'Principal Systems Architect',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
    featuredImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1000&auto=format&fit=crop&q=80',
    publishedAt: '2026-11-10',
    readTime: '7 min read',
    isFeatured: true,
    isTrending: true,
    views: 4820,
  },
  {
    id: 'post-2',
    title: 'Zero Trust Architecture in Cloud Native Infrastructure: A Practical Guide',
    slug: 'zero-trust-architecture-cloud-native-infrastructure',
    excerpt: 'Moving beyond perimeter-based firewalls. Implementing mutual TLS (mTLS), SPIFFE/SPIRE identity attestation, and least-privilege RBAC in Kubernetes.',
    content: `
      <p class="lead">The traditional network perimeter is obsolete. Modern cloud native architectures require verifying every connection, service call, and user session before granting ephemeral access.</p>

      <h2>The Principle of Zero Trust</h2>
      <p>Zero Trust enforces continuous verification: <em>Never trust, always verify</em>. Inside Kubernetes clusters, pods should not communicate implicitly without cryptographically verifiable service identities.</p>

      <h2>Cryptographic Workload Attestation via SPIFFE</h2>
      <p>SPIFFE (Secure Production Identity Framework for Everyone) establishes open standards for authenticating workloads across cloud environments. SPIRE implements SPIFFE through a node-level daemon that validates cryptographic pod tokens before issuing short-lived X.509 certificates.</p>

      <pre><code>apiVersion: security.istio.io/v1beta1
kind: PeerAuthentication
metadata:
  name: default
  namespace: production
spec:
  mtls:
    mode: STRICT</code></pre>

      <h2>Role-Based Access Control (RBAC) Hardening</h2>
      <p>Kubernetes cluster roles must follow least-privilege scoping. Avoid wildcard verbs in ClusterRoles to prevent privilege escalation vulnerabilities.</p>
    `,
    category: 'Cybersecurity',
    categorySlug: 'cybersecurity',
    tags: ['Security', 'Zero Trust', 'Kubernetes', 'Cloud Security'],
    author: {
      name: 'Elena Rostova',
      role: 'Chief Information Security Officer',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    },
    featuredImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1000&auto=format&fit=crop&q=80',
    publishedAt: '2026-11-08',
    readTime: '6 min read',
    isFeatured: true,
    isTrending: true,
    views: 3950,
  },
  {
    id: 'post-3',
    title: 'Evaluating LLM Fine-Tuning vs. Retrieval-Augmented Generation (RAG)',
    slug: 'evaluating-llm-fine-tuning-vs-retrieval-augmented-generation',
    excerpt: 'An analytical benchmark of accuracy, operational cost, and maintenance overhead when choosing between RAG vector pipelines and domain fine-tuning.',
    content: `
      <p class="lead">Enterprise engineering teams face a critical architectural decision when building domain-specific AI applications: Should they adapt base models via fine-tuning, or construct a Retrieval-Augmented Generation (RAG) system?</p>

      <h2>Comparing Fundamental Mechanisms</h2>
      <p>Fine-tuning adjusts internal neural weights through backpropagation on a specialized corpus. RAG, conversely, retrieves factual grounding passages dynamically at inference time and injects them into the prompt window.</p>

      <h2>Cost Analysis Across Volume Tiers</h2>
      <p>Fine-tuning demands substantial upfront training compute and specialized hardware clusters. However, inference token payloads are compact. RAG incurs minimal initial training expense but consumes higher inference tokens per call due to prompt augmentation.</p>
    `,
    category: 'Artificial Intelligence & Machine Learning',
    categorySlug: 'artificial-intelligence-machine-learning',
    tags: ['AI', 'LLM', 'RAG', 'Machine Learning'],
    author: {
      name: 'Dr. Aris Thorne',
      role: 'Head of AI Research',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    },
    featuredImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&auto=format&fit=crop&q=80',
    publishedAt: '2026-11-06',
    readTime: '8 min read',
    isFeatured: false,
    isTrending: true,
    views: 5210,
  },
  {
    id: 'post-4',
    title: 'Optimizing Node.js Event Loop Throughput for High-Concurrency APIs',
    slug: 'optimizing-nodejs-event-loop-throughput-high-concurrency',
    excerpt: 'Detailed diagnostic guide for identifying CPU-bound bottlenecks, garbage collection pauses, and libuv thread pool starvation in production Node servers.',
    content: `
      <p class="lead">Node.js excels at I/O-intensive workloads, but unoptimized synchronous code can silently monopolize the single-threaded event loop, spiking API latencies across concurrent connections.</p>

      <h2>Monitoring Event Loop Lag</h2>
      <p>Measuring event loop delay with Node\'s perf_hooks API provides immediate indicators of CPU-bound operations stalling scheduled timer callbacks.</p>

      <pre><code>const { monitorEventLoopDelay } = require('perf_hooks');
const histogram = monitorEventLoopDelay({ resolution: 20 });
histogram.enable();

setInterval(() => {
  console.log('P99 Loop Delay:', histogram.percentile(99) / 1e6, 'ms');
  histogram.reset();
}, 5000);</code></pre>
    `,
    category: 'Web and Mobile App Development',
    categorySlug: 'web-and-mobile-app-development',
    tags: ['Node.js', 'Performance', 'Backend', 'JavaScript'],
    author: {
      name: 'Devon Patel',
      role: 'Staff Backend Engineer',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    },
    featuredImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1000&auto=format&fit=crop&q=80',
    publishedAt: '2026-11-04',
    readTime: '5 min read',
    isFeatured: false,
    isTrending: false,
    views: 2840,
  },
  {
    id: 'post-5',
    title: 'Kubernetes Multi-Cluster Management: Strategies for Global Resilience',
    slug: 'kubernetes-multi-cluster-management-strategies-global-resilience',
    excerpt: 'How global platform engineering teams orchestrate workloads across diverse cloud regions with GitOps, Cluster API, and global traffic directors.',
    content: `
      <p class="lead">Running a single massive Kubernetes cluster across availability zones is insufficient for organizations requiring disaster recovery across cloud regions or geographic data sovereignty.</p>

      <h2>GitOps at Multi-Cluster Scale</h2>
      <p>Leveraging declarative Git repositories as the single source of truth ensures synchronized configurations across hundreds of regional clusters.</p>
    `,
    category: 'Cloud Computing',
    categorySlug: 'cloud-computing',
    tags: ['Cloud', 'Kubernetes', 'DevOps', 'Infrastructure'],
    author: {
      name: 'Sarah Lindqvist',
      role: 'VP of Platform Engineering',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    },
    featuredImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1000&auto=format&fit=crop&q=80',
    publishedAt: '2026-11-01',
    readTime: '9 min read',
    isFeatured: false,
    isTrending: false,
    views: 3120,
  },
  {
    id: 'post-6',
    title: 'Next-Generation Web Standards: What HTTP/3 and WebAssembly Enable',
    slug: 'next-generation-web-standards-http3-webassembly',
    excerpt: 'Exploring the architectural possibilities of QUIC transport, multiplexed stream termination, and near-native client-side computing performance.',
    content: `
      <p class="lead">HTTP/3 solves the head-of-line blocking dilemma inherent to TCP by utilizing the UDP-based QUIC protocol. In parallel, WebAssembly allows compute-heavy engines to execute in browser threads with high memory efficiency.</p>
    `,
    category: 'Technology & Innovation',
    categorySlug: 'technology-and-innovation',
    tags: ['Web Standards', 'HTTP3', 'WebAssembly', 'Networking'],
    author: {
      name: 'Marcus Vance',
      role: 'Principal Systems Architect',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
    featuredImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1000&auto=format&fit=crop&q=80',
    publishedAt: '2026-10-28',
    readTime: '6 min read',
    isFeatured: false,
    isTrending: false,
    views: 2490,
  },
  {
    id: 'post-7',
    title: 'The Evolution of Developer Productivity Engineering in 2026',
    slug: 'evolution-developer-productivity-engineering-2026',
    excerpt: 'Analyzing metrics beyond DORA: how platform teams measure cognitive load, build caching efficacy, and feedback loop speed.',
    content: `
      <p class="lead">Developer Productivity Engineering (DPE) is no longer simply about CI build minutes. It has evolved into a scientific discipline measuring the entire feedback loop between code conception and staging verification.</p>
    `,
    category: 'Industry Insights',
    categorySlug: 'industry-insights',
    tags: ['Developer Productivity', 'Engineering Leadership', 'Culture'],
    author: {
      name: 'Sarah Lindqvist',
      role: 'VP of Platform Engineering',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    },
    featuredImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1000&auto=format&fit=crop&q=80',
    publishedAt: '2026-10-24',
    readTime: '5 min read',
    isFeatured: false,
    isTrending: false,
    views: 1870,
  },
];
