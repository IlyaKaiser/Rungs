# Rungs

**A smarter way to manage strength training.**

Rungs is a strength training platform designed to connect coaches and athletes through structured workout programs, training logs, and progress tracking.

Instead of relying on spreadsheets, scattered messages, and manual tracking, Rungs gives coaches a centralized way to manage their clients' training and gives athletes a clear picture of their progress.

🔗 **Live Demo:** https://rungs-six.vercel.app

---

## Overview

Managing multiple athletes shouldn't mean juggling spreadsheets, messages, and workout plans.

Rungs streamlines the coaching workflow by bringing training programs, workout logging, and performance analytics into one place. Coaches can build and manage programs, while athletes can follow their workouts, record their performance, and track their progress over time.

The goal is simple: make training more organized, measurable, and consistent.

## Features

- **Training Program Management** — Create, organize, and manage structured workout programs for clients.
- **Client Management** — Keep client information and training plans organized in one place.
- **Workout Logging** — Record exercises, sets, repetitions, and weights directly during training.
- **Progress Tracking** — Monitor performance and training trends over time.
- **Training Analytics** — Visualize workout consistency, training volume, and performance metrics.
- **Coach & Client Workflows** — Separate experiences designed around the needs of coaches and athletes.
- **Responsive Design** — Accessible across desktop and mobile devices.

## Tech Stack

- **Framework:** Next.js
- **Language:** JavaScript
- **Styling:** Tailwind CSS, Motion
- **Backend & Database:** Supabase
- **Authentication:** Supabase Auth
- **Deployment:** Vercel

## Getting Started

### Prerequisites

- Node.js
- npm
- A Supabase project

### Installation

Clone the repository:

```bash
git clone https://github.com/IlyaKaiser/Rungs.git
```

Navigate to the project directory:

```bash
cd rungs
```

Install dependencies:

```bash
npm install
```

### Environment Variables

Create a `.env.local` file in the root directory and configure the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SITE_URL=
```

Add your Supabase project credentials to the corresponding variables.

### Run Locally

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Goals

Rungs aims to make strength coaching more efficient without sacrificing the quality of the coaching experience.

By combining structured programming, consistent workout logging, and meaningful performance data, Rungs helps coaches spend less time managing information and more time coaching.

## Author

**Ilya Jafari**

Frontend Developer

---

Built with care for the people who put in the work.
