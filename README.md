# FolioSpace

A modern, full-stack CV management application built with Next.js 14, Prisma v6, MongoDB, and custom JWT authentication. Create, manage, and export multiple professional CVs with ease.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 19, TypeScript
- **Backend**: Next.js API Routes, custom JWT authentication
- **Database**: MongoDB with Prisma v6
- **Authentication**: Custom JWT with HttpOnly cookies
- **Styling**: Tailwind CSS 4, shadcn/ui components
- **PDF Export**: PDFKit
- **Password Hashing**: bcryptjs

## Features

- ✅ User authentication with custom JWT (no NextAuth)
- ✅ Multiple CVs per user
- ✅ Full CRUD operations for CVs
- ✅ Server-side PDF export with professional formatting
- ✅ Responsive dashboard with CV management
- ✅ Rich CV editor with multiple sections
- ✅ CV preview before export
- ✅ Duplicate CV functionality
- ✅ Beautiful landing page
- ✅ Vercel-ready deployment

## Project Structure

\`\`\`
foliospace/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── signup/route.ts
│   │   │   ├── login/route.ts
│   │   │   ├── me/route.ts
│   │   │   └── logout/route.ts
│   │   └── cvs/
│   │       ├── route.ts (GET/POST)
│   │       └── [id]/
│   │           ├── route.ts (GET/PUT/DELETE)
│   │           └── export/route.ts
│   ├── login/page.tsx
│   ├── signup/page.tsx
│   ├── dashboard/page.tsx
│   ├── cv/[id]/
│   │   ├── edit/page.tsx
│   │   └── preview/page.tsx
│   ├── layout.tsx
│   ├── page.tsx (landing)
│   └── globals.css
├── components/
│   ├── cv-editor/
│   │   ├── personal-info-section.tsx
│   │   ├── experience-section.tsx
│   │   ├── education-section.tsx
│   │   ├── skills-section.tsx
│   │   └── projects-section.tsx
│   ├── ui/ (shadcn components)
│   ├── auth-form.tsx
│   ├── cv-card.tsx
│   ├── cv-preview.tsx
│   ├── dashboard-header.tsx
│   ├── navbar.tsx
│   └── footer.tsx
├── hooks/
│   └── useAuth.ts
├── lib/
│   ├── prisma.ts
│   ├── jwt.ts
│   ├── auth.ts
│   ├── auth-middleware.ts
│   ├── types.ts
│   └── utils.ts
├── prisma/
│   └── schema.prisma
├── scripts/
│   └── seed.js
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
\`\`\`

## Getting Started

### Prerequisites

- Node.js 18+ or 20+
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

### Installation

1. **Clone the repository** (or download the files)

\`\`\`bash
git clone <repo-url>
cd foliospace
\`\`\`

2. **Install dependencies**

\`\`\`bash
npm install
\`\`\`

3. **Set up environment variables**

Create a `.env.local` file from `.env.example`:

\`\`\`bash
cp .env.example .env.local
\`\`\`

Update the values:

\`\`\`env
# MongoDB Connection String
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/foliospace"

# JWT Secret (generate a strong random key)
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRY="7d"

# Auth Cookie
AUTH_COOKIE_NAME="token"

# Vercel URL (for development)
VERCEL_URL="http://localhost:3000"
\`\`\`

### Database Setup

1. **Generate Prisma Client**

\`\`\`bash
npm run prisma:generate
\`\`\`

2. **Push schema to MongoDB**

\`\`\`bash
npm run prisma:push
\`\`\`

3. **Seed demo data (optional)**

\`\`\`bash
npm run seed
\`\`\`

This creates a demo user and sample CVs:
- **Email**: demo@example.com
- **Password**: demo123456

### Running Locally

\`\`\`bash
npm run dev
\`\`\`

Visit `http://localhost:3000` in your browser.

## Authentication Flow

1. **Signup**: User provides name, email, and password (min 8 chars)
2. **Password Hashing**: Password is hashed with bcryptjs (10 salt rounds)
3. **JWT Creation**: Upon successful signup/login, a JWT is signed with the secret
4. **Cookie Storage**: JWT is stored in an HttpOnly, Secure, SameSite cookie
5. **API Protection**: All protected routes verify the JWT via `getAuthUser()` middleware
6. **Token Expiry**: Default 7 days; configure via `JWT_EXPIRY`

## Deployment to Vercel

### Prerequisites

- GitHub repository with your FolioSpace code
- Vercel account
- MongoDB Atlas connection string

### Steps

1. **Push to GitHub**

\`\`\`bash
git add .
git commit -m "Initial FolioSpace commit"
git push origin main
\`\`\`

2. **Connect to Vercel**

- Go to [vercel.com](https://vercel.com)
- Click "New Project"
- Select your GitHub repository
- Click "Import"

3. **Configure Environment Variables**

In the Vercel dashboard, go to **Settings** → **Environment Variables** and add:

\`\`\`
DATABASE_URL: your-mongodb-connection-string
JWT_SECRET: your-production-jwt-secret (strong random key)
JWT_EXPIRY: 7d
AUTH_COOKIE_NAME: token
\`\`\`

4. **Deploy**

Click "Deploy" and wait for the build to complete. Vercel will automatically:
- Install dependencies
- Run `prisma generate`
- Build the Next.js app
- Start the server

### Production Checklist

- ✅ Strong `JWT_SECRET` (use a random key generator)
- ✅ MongoDB connection string with authentication
- ✅ CORS configured if needed
- ✅ HTTPS enforced (Vercel does this automatically)
- ✅ Environment variables set in Vercel dashboard
- ✅ Monitor Vercel logs for errors

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Create a new user account |
| POST | `/api/auth/login` | Sign in with email/password |
| GET | `/api/auth/me` | Get current user (protected) |
| POST | `/api/auth/logout` | Clear auth cookie |

### CVs

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cvs` | List all user CVs (protected) |
| POST | `/api/cvs` | Create a new CV (protected) |
| GET | `/api/cvs/[id]` | Get a specific CV (protected) |
| PUT | `/api/cvs/[id]` | Update a CV (protected) |
| DELETE | `/api/cvs/[id]` | Delete a CV (protected) |
| GET | `/api/cvs/[id]/export` | Download CV as PDF (protected) |

### Request/Response Examples

**POST /api/auth/signup**

\`\`\`json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
\`\`\`

Response:
\`\`\`json
{
  "userId": "507f1f77bcf86cd799439011",
  "email": "john@example.com"
}
\`\`\`

**POST /api/cvs**

\`\`\`json
{
  "title": "Software Engineer"
}
\`\`\`

**PUT /api/cvs/[id]**

\`\`\`json
{
  "personalInfo": {
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "+1 (555) 123-4567",
    "location": "San Francisco, CA",
    "summary": "Experienced software engineer..."
  },
  "experiences": [
    {
      "id": "1",
      "company": "TechCorp",
      "position": "Senior Engineer",
      "startDate": "2020-01",
      "endDate": "2024-01",
      "current": false,
      "description": "Led frontend development..."
    }
  ]
}
\`\`\`

## Customization

### Colors & Theme

Edit `app/globals.css` to customize the color scheme:

\`\`\`css
:root {
  --primary: oklch(0.28 0.1 260); /* Navy Blue */
  --accent: oklch(0.58 0.15 150); /* Emerald */
  /* ... other colors ... */
}
\`\`\`

### Components

All UI components are from shadcn/ui and can be customized in `components/ui/`.

### Fonts

Update fonts in `app/layout.tsx`:

\`\`\`tsx
import { Geist, Geist_Mono } from 'next/font/google'

const geist = Geist({ subsets: ["latin"] })
\`\`\`

## Security Considerations

- **Passwords**: Hashed with bcryptjs (10 salt rounds)
- **JWT**: Signed with a strong secret, expires after configured time
- **Cookies**: HttpOnly, Secure, SameSite=Lax to prevent CSRF
- **Ownership**: All CV operations verify user ownership
- **Input Validation**: Email, password, and CV data validated on API routes
- **Environment Variables**: Sensitive data stored in `.env.local` (git-ignored)

## Troubleshooting

### Database Connection Issues

- Verify `DATABASE_URL` is correct in `.env.local`
- Check MongoDB Atlas IP whitelist (allow 0.0.0.0/0 for development)
- Ensure MongoDB cluster is running

### Login/Signup Errors

- Clear browser cookies and try again
- Check `JWT_SECRET` is set and consistent
- Verify email is not already registered (signup)

### PDF Export Issues

- Ensure PDFKit is installed: `npm install pdfkit`
- Check that cv data has personalInfo with fullName

### Deployment Issues

- Check Vercel logs: `vercel logs`
- Verify all environment variables are set in Vercel dashboard
- Test locally before deploying: `npm run build && npm run start`

## Contributing

To extend FolioSpace:

1. Add new CV sections in `lib/types.ts`
2. Create editor components in `components/cv-editor/`
3. Update PDF export logic in `/api/cvs/[id]/export/route.ts`
4. Update Prisma schema if adding database fields

## License

MIT License - feel free to use this project for personal or commercial use.

## Support

For issues or questions:
- Open an issue on GitHub
- Check existing docs and FAQs
- Review the code comments in key files

---

Built with Next.js, Prisma, and MongoDB. Designed for professionals managing multiple CVs.
# foliospacev3
