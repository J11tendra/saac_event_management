# SAAC Event Management System

A Next.js application for managing FLAME University's Student Activities Advisory Committee (SAAC) events.

## Features

- **Google OAuth Authentication** - Restricted to @flame.edu.in emails
- **Event Creation** - Create events with multiple date preferences
- **Budget Requests** - Submit budget requests with event proposals
- **Event Status Tracking** - View approval status and accepted dates
- **Club Management** - Automatic club profile creation on first sign-in

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth with Google OAuth
- **UI:** shadcn/ui components with Tailwind CSS
- **Language:** TypeScript

## Setup Instructions

### 1. Prerequisites

- Node.js 18+ and pnpm installed
- A Supabase project with the schema deployed
- Google OAuth configured in Supabase

### 2. Environment Variables

Create a `.env.local` file in the root directory with your Supabase credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**To get these values:**

1. Go to your Supabase project dashboard
2. Navigate to Settings > API
3. Copy the Project URL and anon/public key

### 3. Configure Google OAuth in Supabase

1. Go to your Supabase project dashboard
2. Navigate to Authentication > Providers
3. Enable Google provider
4. Add your Google OAuth credentials (Client ID and Secret)
5. Add the following redirect URLs:
   - `http://localhost:3000/auth/callback` (development)
   - `https://your-production-domain.com/auth/callback` (production)

### 4. Install Dependencies

```bash
pnpm install
```

### 5. Run the Development Server

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## Database Schema

The application uses the following main tables:

- `club` - Club information and credentials
- `event` - Event details and approval status
- `event_date_preference` - Proposed event dates and times
- `budget_request` - Budget requests for events

Refer to `db/schema.sql` for the complete schema.

## Project Structure

```
app/
├── auth/
│   ├── callback/       # OAuth callback handler
│   ├── error/          # Authentication error page
│   └── signout/        # Sign out route
├── events/
│   ├── page.tsx        # Events list (server component)
│   └── events-client.tsx # Event creation and viewing (client component)
├── layout.tsx          # Root layout
└── page.tsx            # Home/login page

lib/
├── supabase/
│   ├── client.ts       # Browser Supabase client
│   └── server.ts       # Server Supabase client
└── utils.ts            # Utility functions

middleware.ts           # Auth middleware for protected routes
```

## Features Explained

### Authentication Flow

1. User clicks "Sign in with Google" on the home page
2. Google OAuth redirects to `/auth/callback`
3. Email domain is validated (@flame.edu.in only)
4. Club profile is created/verified in the database
5. User is redirected to `/events`

### Event Creation

1. Click "Create New Event" button
2. Fill in event details:
   - Event name and description
   - Up to 3 date preferences with times
   - Optional budget request with amount and purpose
3. Event is created with "pending" approval status
4. SAAC admins can review and approve/reject events

### Event Status

Events show their current status:

- **Pending** (Yellow) - Awaiting SAAC review
- **Approved** (Green) - Event approved by SAAC
- **Rejected** (Red) - Event not approved

Approved events display:

- The accepted date preference (highlighted in green)
- Approved budget amount (if applicable)

## Security Features

- Email domain restriction to @flame.edu.in
- Protected routes with middleware
- Row Level Security (RLS) in Supabase (recommended)
- Automatic session refresh

## Next Steps

To extend this application:

1. Add an admin dashboard for SAAC members
2. Implement event review and approval workflow
3. Add collaborator management for multi-club events
4. Create reimbursement submission flow
5. Add email notifications for status changes

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
