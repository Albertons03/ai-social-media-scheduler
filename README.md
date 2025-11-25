# 🎬 AI Social Media Scheduler

> **AI-powered social media management platform** with intelligent content generation and multi-platform scheduling for TikTok, LinkedIn, and Twitter.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?logo=supabase)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4-orange?logo=openai)

---

## 🚀 Why I Built This

As a content creator managing multiple social media platforms, I was spending **10+ hours per week** manually creating and posting content across TikTok, LinkedIn, and Twitter. This tool automates that entire workflow.

## Features

### Core Features (MVP)
- **AI Post Generator** - Generate engaging captions and content using OpenAI GPT-4
- **Calendar Scheduler** - Schedule posts in advance with visual calendar interface
- **Multi-Platform Support**:
  - TikTok (OAuth + Upload)
  - LinkedIn Integration
  - Twitter/X Integration
- **Analytics Dashboard** - Track views, likes, engagement, and more
- **Mobile Responsive Design** - Works seamlessly on all devices

### TikTok-Specific Features
- Video file upload (MP4, MOV)
- Caption with hashtags
- Cover image selection
- Privacy settings (Public/Friends/Private)
- Comment/Duet/Stitch settings
- Schedule publish time
- AI-generated captions from video analysis (GPT-4 Vision)

## Tech Stack

### Frontend
- **Next.js 16** (App Router with Turbopack)
- **TypeScript 5.9** - Full type safety
- **Tailwind CSS v3** - Utility-first styling
- **shadcn/ui** - Beautiful, accessible components
- **Lucide React** - Modern icon library
- **Sonner** - Toast notifications

### Backend
- **Supabase** (Database + Auth + Storage)
- **Supabase Edge Functions** (AI + Scheduling)
- **Supabase Cron Jobs** (auto-publish)

### APIs
- **OpenAI GPT-4** (content generation)
- **TikTok Content Posting API**
- **LinkedIn API**
- **Twitter API v2**

### File Storage
- **Supabase Storage** (videos, images)

## Project Structure

```
ai-personal-tiktok-scheduler/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── signup/
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   ├── schedule/
│   │   ├── analytics/
│   │   └── settings/
│   ├── api/
│   │   ├── auth/
│   │   ├── posts/
│   │   ├── ai/
│   │   └── upload/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/
│   ├── layout/
│   ├── calendar/
│   └── post/
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── middleware.ts
│   ├── types/
│   │   └── database.types.ts
│   └── utils.ts
├── public/
├── middleware.ts
├── supabase-schema.sql
├── .env.local
├── .env.example
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## Getting Started

### Prerequisites
- Node.js 18+ installed
- A Supabase account
- OpenAI API key
- API credentials for TikTok, LinkedIn, and Twitter

### Installation

1. **Clone the repository** (or navigate to the project folder)
   ```bash
   cd ai-personal-tiktok-scheduler
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new Supabase project at [supabase.com](https://supabase.com)
   - Copy your project URL and anon key
   - Run the SQL schema in the Supabase SQL Editor:
     ```bash
     # Copy contents of supabase-schema.sql and run in Supabase SQL Editor
     ```

4. **Configure environment variables**
   - Copy `.env.example` to `.env.local`
   - Fill in your API keys and credentials:
     ```env
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
     SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
     OPENAI_API_KEY=your_openai_key
     # ... add other API keys
     ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   - Navigate to [http://localhost:3000](http://localhost:3000)

## Database Schema

The application uses the following main tables:

- **profiles** - User profile information (extends Supabase auth.users)
- **social_accounts** - Connected social media accounts
- **posts** - Scheduled and published posts
- **ai_generations** - AI content generation history
- **analytics_snapshots** - Historical analytics data

See `supabase-schema.sql` for the complete schema with Row Level Security (RLS) policies.

## Current Implementation Status

### ✅ Completed
- [x] Project setup and configuration
- [x] TypeScript + Next.js 14 with App Router
- [x] Tailwind CSS styling
- [x] Supabase integration (client, server, middleware)
- [x] Database schema and types
- [x] Authentication system (login, signup, signout)
- [x] Landing page
- [x] Basic dashboard page
- [x] Utility functions (date formatting, file handling)
- [x] Responsive design foundation

### ✅ Recently Completed (Week 2 - MVP)
- [x] AI content generator integration (OpenAI GPT-4)
- [x] Calendar scheduler component with visual interface
- [x] Post creation form with platform-specific settings
- [x] Toast notifications for user feedback
- [x] Loading states with spinners
- [x] Empty states with call-to-action
- [x] Responsive mobile design
- [x] File upload handling (media + thumbnails)

### 🚧 Planned Features (v1.1)
- [ ] TikTok OAuth and video upload
- [ ] LinkedIn API integration
- [ ] Twitter/X API integration
- [ ] Real-time analytics sync
- [ ] Scheduled post publishing (cron jobs)
- [ ] Bulk post scheduling

## API Integrations

### OpenAI GPT-4
Used for generating post captions, content ideas, and analyzing video content for automatic caption generation.

### TikTok API
- OAuth authentication
- Video upload
- Post publishing with metadata (caption, privacy, settings)
- Analytics retrieval

### LinkedIn API
- OAuth authentication
- Post creation
- Analytics tracking

### Twitter/X API v2
- OAuth authentication
- Tweet posting
- Media upload
- Analytics retrieval

## Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
npm run type-check # Run TypeScript type checking
```

### Code Style
- TypeScript for type safety
- ESLint for code quality
- Functional components with hooks
- Server components by default (Next.js 14)
- Client components only when needed

## Deployment

### Recommended: Vercel
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy

### Environment Variables for Production
Make sure to set all environment variables from `.env.example` in your production environment.

## Security

- Row Level Security (RLS) enabled on all Supabase tables
- Authentication handled by Supabase Auth
- API keys stored as environment variables
- HTTPS enforced in production
- OAuth flows for social media integrations

## Contributing

This is a personal project, but suggestions and improvements are welcome!

## License

MIT License

## 📊 Project Status

**Current Version:** v1.0 (MVP Complete)
**Demo Status:** Fully functional with AI content generation and scheduling
**Portfolio Ready:** ✅ Yes

### What's Working Right Now
- ✨ AI content generation with GPT-4
- 📅 Visual calendar scheduler
- 📝 Post creation with TikTok-specific settings
- 🔔 Professional toast notifications
- 💾 Database integration with Supabase
- 🔐 Authentication and user management

---

## 📧 Contact

For questions or collaboration opportunities, feel free to reach out!

**Project Link:** [GitHub Repository](#)
**Live Demo:** [Coming Soon](#)

---

<div align="center">

**Built with ❤️ using Next.js, Supabase, and OpenAI**

[⭐ Star this repo](#) if you find it helpful!

</div>
