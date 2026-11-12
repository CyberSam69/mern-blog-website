# FlyerTech Blog

A professional technology blog website built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

## Project Structure

```
flyertech-blog/
├── client/          # React + Vite frontend
│   ├── public/      # Static assets
│   └── src/
│       ├── assets/        # Images, icons
│       ├── components/    # Reusable components
│       │   ├── admin/     # Admin-specific components
│       │   ├── blog/      # Blog-specific components
│       │   ├── common/    # Shared components
│       │   └── layout/    # Header, Footer, Sidebar
│       ├── context/       # React context providers
│       ├── pages/         # Page components
│       │   ├── admin/     # Admin panel pages
│       │   └── public/    # Public-facing pages
│       ├── styles/        # Global CSS and variables
│       └── utils/         # Utility functions and API client
├── server/          # Node.js + Express backend
│   ├── config/      # Database and app configuration
│   ├── controllers/ # Route handlers
│   ├── middleware/   # Auth, validation middleware
│   ├── models/      # Mongoose models
│   ├── routes/      # API route definitions
│   └── uploads/     # Uploaded images
└── README.md
```

## Tech Stack

- **Frontend:** React.js with Vite
- **Styling:** CSS with CSS Variables
- **Backend:** Node.js + Express.js
- **Database:** MongoDB with Mongoose
- **API:** RESTful API

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (local or Atlas)

### Installation

1. Clone the repository
2. Install frontend dependencies:
   ```bash
   cd client && npm install
   ```
3. Install backend dependencies:
   ```bash
   cd server && npm install
   ```
4. Create `server/.env` with your MongoDB URI
5. Start development servers:
   - Frontend: `cd client && npm run dev`
   - Backend: `cd server && npm run dev`

## License

ISC
