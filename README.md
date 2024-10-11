# Scheduling Audio Transcriptions with QStash

<p>
  <a href="#introduction"><strong>Introduction</strong></a> ·
  <a href="#one-click-deploy"><strong>One-click Deploy</strong></a> ·
  <a href="#tech-stack--features"><strong>Tech Stack + Features</strong></a> ·
  <a href="#author"><strong>Author</strong></a>
</p>

## Introduction

In this repository, you will find the code for a scheduled audio transcription system, built using Upstash QStash for task scheduling and Fireworks AI for transcription. You will also learn techniques for secure file uploads to Cloudflare R2, user authentication with Clerk, and data storage with Upstash Redis.

## Demo

<video src="https://github.com/upstash/transcriber/raw/refs/heads/master/demo.mp4" controls></video>

## One-click Deploy

You can deploy this template to Vercel with the button below:

[![](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/upstash/transcriber&env=FIREWORKS_API_KEY,AWS_KEY_ID,AWS_REGION_NAME,AWS_S3_BUCKET_NAME,AWS_SECRET_ACCESS_KEY,CLOUDFLARE_R2_ACCOUNT_ID,NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,CLERK_SECRET_KEY)

## Tech Stack + Features

### Frameworks

- [Next.js](https://nextjs.org/) – React framework for building performant apps with the best developer experience.
- [Clerk](https://clerk.dev/) – Clerk is a complete suite of embeddable UIs, flexible APIs, and admin dashboards to authenticate and manage your users.

### Platforms

- [Vercel](https://vercel.com/) – Easily preview & deploy changes with git.
- [Upstash](https://upstash.com) - Serverless database platform. You are going to use Upstash Vector for storing vector embeddings and metadata, and Upstash Redis for storing per user chat history.
- [Fireworks](https://fireworks.ai/) - A generative AI inference platform to run and customize models with speed and production-readiness.

### UI

- [Tailwind CSS](https://tailwindcss.com/) – Utility-first CSS framework for rapid UI development.
- [Radix](https://www.radix-ui.com/) – Primitives like modal, popover, etc. to build a stellar user experience.
- [Lucide](https://lucide.dev/) – Beautifully simple, pixel-perfect icons.
- [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) – Optimize custom fonts and remove external network requests for improved performance.

### Code Quality

- [TypeScript](https://www.typescriptlang.org/) – Static type checker for end-to-end typesafety
- [Prettier](https://prettier.io/) – Opinionated code formatter for consistent code style

## Author

- Rishi Raj Jain ([@rishi_raj_jain_](https://twitter.com/rishi_raj_jain_))
