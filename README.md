# Unhireable Website

The official website for Unhireable - Neural Career System.

## 🚀 Deployment

This website is deployed on Vercel. The deployment is automatic when you push to the `main` branch.

### Manual Deployment

1. Make sure you're logged into Vercel:
   ```bash
   npx vercel login
   ```

2. Deploy to production:
   ```bash
   npx vercel --prod
   ```

### Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🛠️ Tech Stack

- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Radix UI** - UI components

## 📁 Project Structure

```
src/
  app/              # Next.js App Router pages
  components/       # React components
  lib/              # Utilities
  types/            # TypeScript types
```

## 🌐 Environment Variables

No environment variables required for the website (static site).

## 📝 License

Copyright © 2024 Unhireable. All rights reserved.
