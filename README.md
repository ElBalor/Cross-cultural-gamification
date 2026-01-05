# Cross-Cultural Fitness Gamification Research Survey

A Next.js survey application for collecting research data on cross-cultural gamification in health and fitness adoption.

## Research Objectives

- **(i)** To identify key gamification features that influence sustained user participation across diverse cultural settings.
- **(ii)** To design a scalable gamified fitness tool that is tailored to the Nigerian context and adaptable to multicultural environments.
- **(iii)** To implement the designed tool.
- **(iv)** To evaluate the impact of the developed tool on user motivation, engagement, and physical activity levels.

## Features

- ✅ **Survey Form**: Comprehensive 4-section survey (Demographics, Gamification Features, Cultural Context, Motivation & Engagement)
- ✅ **Interview Questions**: In-depth qualitative questions for deeper insights
- ✅ **Database Integration**: Vercel Postgres for storing responses
- ✅ **Server Actions**: Secure form submission using Next.js Server Actions
- ✅ **Responsive Design**: Beautiful UI with Tailwind CSS
- ✅ **Form Validation**: Client-side validation with error messages

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Vercel Postgres
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Vercel account with Postgres database set up

### Installation

1. Clone the repository and install dependencies:
```bash
npm install
```

2. Set up your Vercel Postgres database:
   - Go to your Vercel dashboard
   - Navigate to Storage -> Create Database -> Postgres
   - Copy the connection string and environment variables

3. Create a `.env.local` file in the root directory:
```bash
cp .env.local.example .env.local
```

4. Add your Vercel Postgres credentials to `.env.local`:
```env
POSTGRES_URL=your_postgres_url_here
POSTGRES_PRISMA_URL=your_postgres_prisma_url_here
POSTGRES_URL_NON_POOLING=your_postgres_url_non_pooling_here
POSTGRES_USER=your_postgres_user_here
POSTGRES_HOST=your_postgres_host_here
POSTGRES_PASSWORD=your_postgres_password_here
POSTGRES_DATABASE=your_postgres_database_here
```

5. Initialize the database tables (run once):
```bash
# You may need to create a script to initialize the database
# The tables will be created automatically on first use, or you can run:
# CREATE TABLE statements from lib/db.ts
```

### Development

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Database Setup

The application will automatically create the following tables:
- `survey_responses` - Stores survey form responses
- `interview_responses` - Stores interview question responses

Tables are created automatically when you first run the app, or you can manually run the SQL from `lib/db.ts`.

## Project Structure

```
├── app/
│   ├── actions.ts          # Server actions for form submission
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   ├── globals.css         # Global styles
│   ├── survey/
│   │   ├── page.tsx        # Survey form page
│   │   └── success/        # Survey success page
│   └── interview/
│       ├── page.tsx        # Interview questions page
│       └── success/        # Interview success page
├── lib/
│   └── db.ts               # Database functions
├── types/
│   └── survey.ts           # TypeScript types
└── package.json
```

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add your environment variables in Vercel dashboard
4. Deploy!

The database tables will be created automatically on first use.

## Survey Structure

- **Section A**: Demographics (Age, Gender, Country, Activity Frequency)
- **Section B**: Gamification Features Rating (1-5 scale)
- **Section C**: Cultural & Nigerian Context
- **Section D**: Motivation & Engagement Scales (1-5 scale)
- **Interview**: 11 in-depth qualitative questions

## License

This project is created for research purposes.






