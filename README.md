# Recovery Client

A Next.js frontend application for a recovery center website, built to connect with a Django backend API.

## Features

- **Public Website**: Informational pages about recovery programs and services
- **Program Pages**: Detailed information about PHP with Housing, IOP, and Vocational Rehabilitation programs
- **About Section**: Our Story, Team, Partners, and Mission & Housing information
- **Respite Housing**: Information about immediate support services
- **Contact Form**: Integrated contact form connected to Django backend
- **Newsletter Signup**: Newsletter subscription functionality
- **Responsive Design**: Mobile-friendly Bootstrap-based design

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file in the root directory with your environment variables:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Backend API

This frontend connects to a Django backend API. Make sure your Django backend is running and accessible at the URL specified in `NEXT_PUBLIC_API_URL`.

The API client is configured in `src/api/client.js` and expects endpoints like:
- `/api/programs/` - Get all programs
- `/api/testimonials/` - Get testimonials
- `/api/contact/` - Submit contact form
- `/api/newsletter/` - Subscribe to newsletter

## Project Structure

- `src/app/` - Next.js app router pages
- `src/components/` - React components
- `src/api/` - API client utilities
- `src/utils/` - Utility functions and context providers
- `src/styles/` - Global styles

## Pages

- `/` - Homepage with hero section and program highlights
- `/about/our-story` - Our Story page
- `/about/our-team` - Our Team page
- `/about/partners` - Partners page
- `/about/mission-housing` - Mission & Housing page
- `/programs/php-housing` - PHP with Housing program
- `/programs/iop` - Intensive Outpatient Program
- `/programs/vocational` - Vocational Rehabilitation program
- `/respite-housing` - Respite Housing information
- `/contact` - Contact page with form
- `/get-involved` - Get Involved page with newsletter signup

## Technologies

- Next.js 14 (App Router)
- React 18
- React Bootstrap
- Bootstrap 5
- Firebase (for authentication, if needed)
