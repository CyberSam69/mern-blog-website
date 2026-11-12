# FlyerTech — Enterprise Technology Blog Website (MERN Stack)

A professional, responsive Technology Blog Website and Content Management System (CMS) built with the **MERN Stack** (MongoDB, Express.js, React.js, Node.js).

FlyerTech delivers deep architectural perspectives, cloud-native guides, distributed systems blueprints, and engineering insights designed with a clean corporate aesthetic inspired by modern enterprise publications (such as Zoho Blog).

---

## 1. Project Specifications

| Attribute | Specification |
|---|---|
| **Brand Identity** | **FlyerTech** |
| **Brand Logo** | Minimalist geometric vector mark at `/flyertech-logo.svg` |
| **Frontend Framework** | React.js (v19) with Vite (v8) |
| **Language** | JavaScript (ESM + CommonJS) |
| **Styling** | Vanilla CSS with Design Tokens & CSS Custom Properties |
| **Backend Framework** | Node.js with Express.js |
| **Database** | MongoDB with Mongoose ODM (includes offline resilience) |
| **API Architecture** | RESTful JSON API with JWT authentication |
| **Target Viewports** | Mobile (360px+), Tablet (768px+), Desktop (1024px, 1280px+) |

---

## 2. Design System & Corporate Light Palette

In strict compliance with editorial guidelines, FlyerTech uses a light corporate theme throughout (zero dark mode):

- **Primary Background:** White (`#FFFFFF`)
- **Secondary Background:** Off-white (`#F7F8FA`)
- **Light Blue Accent:** `#EAF2FC` (used for category pills & hero tags)
- **Light Green Accent:** `#EAF5EF` (used for status badges & success banners)
- **Main Text:** Charcoal (`#263445`)
- **Secondary Text:** Grey (`#667085`)
- **Borders:** Light Grey (`#E5E7EB`)
- **Primary Brand Color:** Royal Blue (`#2563EB`)

---

## 3. Administrative CMS Credentials

The Admin Panel is pre-configured with the designated administrative account:

- **Admin Portal URL:** `http://localhost:5173/admin/login`
- **Admin User ID / Email:** `admin@softrateSAM.com`
- **Admin Password:** `admin@007`

---

## 4. Initial Core Categories

The system includes and supports the 7 core technology domains:

1. **Software Development** (`/blogs?category=software-development`)
2. **Artificial Intelligence & Machine Learning** (`/blogs?category=artificial-intelligence-machine-learning`)
3. **Web and Mobile App Development** (`/blogs?category=web-and-mobile-app-development`)
4. **Technology & Innovation** (`/blogs?category=technology-and-innovation`)
5. **Cybersecurity** (`/blogs?category=cybersecurity`)
6. **Cloud Computing** (`/blogs?category=cloud-computing`)
7. **Industry Insights** (`/blogs?category=industry-insights`)

---

## 5. System Architecture & Folder Layout

```
softrate blog website/
├── client/                          # React + Vite Frontend
│   ├── public/
│   │   ├── flyertech-logo.svg       # Custom brand vector logo
│   │   ├── robots.txt               # Search engine crawler directives
│   │   └── sitemap.xml              # Static XML sitemap
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/
│   │   │   │   ├── AdminLayout.jsx  # CMS sidebar, topbar, and user profile pill
│   │   │   │   └── AdminRoute.jsx   # Authentication route guard
│   │   │   ├── blog/
│   │   │   │   └── ArticleCard.jsx  # Reusable card (hero, default, horizontal, compact)
│   │   │   ├── common/
│   │   │   │   ├── Badge.jsx        # Pill badges for categories & status
│   │   │   │   ├── Button.jsx       # Button system (5 variants, 3 sizes)
│   │   │   │   ├── Icon.jsx         # Lightweight SVG icon system
│   │   │   │   ├── Pagination.jsx   # Accessible page navigation
│   │   │   │   ├── SearchBar.jsx    # Debounced live search component
│   │   │   │   └── SEO.jsx          # Dynamic metadata & JSON-LD BlogPosting schema
│   │   │   └── layout/
│   │   │       ├── Footer.jsx       # Corporate 4-column footer with newsletter
│   │   │       ├── Layout.jsx       # Main public page container
│   │   │       └── Navbar.jsx       # Sticky header, category dropdown, search toggle
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # JWT auth state, login, and localStorage session
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   │   ├── AdminAuthors.jsx # Manage practitioner authors
│   │   │   │   ├── AdminCategories.jsx # Manage categories & tag cloud
│   │   │   │   ├── AdminLogin.jsx   # CMS sign-in screen
│   │   │   │   ├── AdminPosts.jsx   # Filterable post management table
│   │   │   │   ├── Dashboard.jsx    # Analytics metrics & recent activity
│   │   │   │   └── PostEditor.jsx   # Rich article composer & editor
│   │   │   └── public/
│   │   │       ├── About.jsx        # Editorial profile & domain coverage
│   │   │       ├── BlogDetail.jsx   # Full article with TOC scrollspy & code copying
│   │   │       ├── BlogList.jsx     # Searchable, filterable, and paginated archive
│   │   │       └── Home.jsx         # Spotlight hero, featured cards, latest & trending
│   │   ├── styles/
│   │   │   ├── global.css           # Global typography & reset rules
│   │   │   └── variables.css        # Corporate color palette design tokens
│   │   └── utils/
│   │       ├── api.js               # Axios instance with auth interceptor
│   │       ├── blogService.js       # Central data layer with resilient offline fallback
│   │       ├── constants.js         # Navigation links, initial categories & company info
│   │       ├── mockBlogs.js         # Initial technical article seeds
│   │       └── useDebounce.js       # 350ms search debouncing hook
│   ├── index.html                   # GSC & Google Analytics hooks, theme meta
│   ├── package.json                 # Frontend dependencies
│   └── vite.config.js               # Vite config with backend proxy to :5000
│
├── server/                          # Node.js + Express.js Backend
│   ├── config/
│   │   └── db.js                    # Mongoose connection & resilience checker
│   ├── controllers/
│   │   ├── authController.js        # Admin login & session verification
│   │   ├── authorController.js      # Author profile management
│   │   ├── categoryController.js    # Category CRUD with article counts
│   │   ├── postController.js        # Post CRUD, view counter, search & pagination
│   │   └── tagController.js         # Tag CRUD
│   ├── middleware/
│   │   └── auth.js                  # JWT verification & role authorization
│   ├── models/
│   │   ├── Author.js                # Author profile schema
│   │   ├── Category.js              # Category schema
│   │   ├── Post.js                  # Article schema with full-text indexing & SEO
│   │   ├── Tag.js                   # Tag schema
│   │   └── User.js                  # Admin user schema with bcrypt hashing
│   ├── routes/
│   │   ├── auth.js                  # /api/auth endpoints
│   │   ├── authors.js               # /api/authors endpoints
│   │   ├── categories.js            # /api/categories endpoints
│   │   ├── posts.js                 # /api/posts endpoints
│   │   ├── sitemap.js               # /sitemap.xml dynamic generator
│   │   ├── tags.js                  # /api/tags endpoints
│   │   └── upload.js                # /api/upload multipart image handler
│   ├── services/
│   │   └── scheduler.js             # Background scheduled publication runner
│   ├── uploads/                     # Uploaded featured images
│   ├── seeder.js                    # Admin account & categories seed script
│   ├── index.js                     # Express server entry point
│   └── .env                         # Server environment configuration
│
└── package.json                     # Monorepo management scripts
```

---

## 6. Getting Started

### Prerequisites

- **Node.js:** v18+ (verified on v22.16.0)
- **npm:** v9+ (verified on v10.9.2)
- **MongoDB:** (Optional for local testing; the app includes built-in offline fallback data resilience)

### Installation

Clone the repository and install all dependencies in one command:

```bash
# Install root, client, and server dependencies
npm run install-all
```

Or install individually:

```bash
cd client && npm install
cd ../server && npm install
```

---

## 7. Running the Application

### Concurrent Development Mode (Recommended)

From the project root:

```bash
npm run dev
```

This concurrently starts:
- **Express API Server:** `http://localhost:5000`
- **React + Vite Frontend:** `http://localhost:5173`

### Individual Services

```bash
# Start frontend only
npm run client

# Start backend only
npm run server
```

---

## 8. REST API Reference

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/health` | Public | System health check & database status |
| `POST` | `/api/auth/login` | Public | Admin login (returns signed JWT) |
| `GET` | `/api/auth/me` | Protected | Current authenticated administrator |
| `GET` | `/api/posts` | Public | Published posts with search, category & pagination |
| `GET` | `/api/posts/:slug` | Public | Article detail, increments views, returns related posts |
| `GET` | `/api/posts/admin/all` | Protected | Admin data table with draft/scheduled status filtering |
| `POST` | `/api/posts` | Protected | Create new article |
| `PUT` | `/api/posts/:id` | Protected | Update existing article |
| `DELETE`| `/api/posts/:id` | Protected | Delete article |
| `GET` | `/api/categories` | Public | All categories with live post counts |
| `POST` | `/api/categories` | Protected | Create new category |
| `PUT` | `/api/categories/:id`| Protected | Update category |
| `DELETE`| `/api/categories/:id`| Protected | Delete category (checks article usage) |
| `GET` | `/api/authors` | Public | List technical contributors |
| `POST` | `/api/authors` | Protected | Add technical contributor |
| `POST` | `/api/upload` | Protected | Multipart image upload via Multer |
| `GET` | `/sitemap.xml` | Public | Dynamic XML sitemap generator |
| `GET` | `/robots.txt` | Public | Search crawler directives |

---

## 9. Milestones Completion Audit

- [x] **Milestone 1 — Development Environment:** React+Vite, Express, Git repository, `.vscode` standards, and project folder architecture.
- [x] **Milestone 2 — Frontend Foundation:** Corporate light design tokens, Navbar with dropdown and mobile drawer, Footer with newsletter, Button, Badge, SearchBar, and Pagination components.
- [x] **Milestone 3 — Public Blog Pages:** Home, Blog Listing with 7 category pills, Blog Detail with Table of Contents and social sharing, 4-variant ArticleCard, and seed mock data.
- [x] **Milestone 4 — Backend Foundation:** Node.js/Express, Mongoose schemas (User, Category, Tag, Author, Post), JWT auth middleware, REST routes, seed script with `admin@softrateSAM.com` / `admin@007`.
- [x] **Milestone 5 — Blog Management:** Central data service layer (`blogService.js`), offline/online fallback, dynamic public page hydration, draft/published/scheduled lifecycle enforcement.
- [x] **Milestone 6 — Admin Panel (CMS):** AuthContext, AdminRoute, Admin Login screen, Dashboard with metrics and activity tables, Post Management table, Post Editor with formatting toolbar, Categories & Tags manager, Authors manager.
- [x] **Milestone 7 — Advanced Features:** Active TOC ScrollSpy, reading progress bar, one-click code copy button, 350ms debounced live search, Web Share API, and background scheduled publication runner.
- [x] **Milestone 8 — SEO and Security:** Dynamic `<SEO>` component, Open Graph & Twitter Cards, Schema.org JSON-LD `BlogPosting` structured data, `sitemap.xml`, `robots.txt`, and Google Analytics / Search Console hooks.
- [x] **Milestone 9 — Testing and Final Delivery:** Zero-error production build verification, whitelabel branding audit (0 AI tool names), concurrent dev runner scripts, and complete documentation.

---

## 10. License

ISC License — FlyerTech Editorial.
