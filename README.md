This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Shipping integrations

Romanian Easybox selection uses `SHIPO_API_KEY`. Hungarian Packeta and Z-BOX
selection uses the public widget API key from Packeta Client → User support:

```env
SHIPO_API_KEY=
PACKETA_API_KEY=
```

Use the Packeta API key here, never the API password. Add both variables to the
Vercel Production environment before deploying.

## Database-free admin

The admin UI is available at `/admin`. Authentication uses one server-side
password and a signed, HTTP-only session cookie; no user database is required.

Required environment variables:

```env
ADMIN_PASSWORD=use-a-long-unique-password
ADMIN_SESSION_SECRET=use-at-least-32-random-characters
```

Local development writes changes directly to `app/data/admin-content.json` and
`public/images/collection/`. On Vercel, the runtime filesystem is not durable,
so production persistence uses GitHub commits:

```env
ADMIN_GITHUB_TOKEN=a-fine-grained-token-with-contents-read-write
ADMIN_GITHUB_BRANCH=main
# Only required if Vercel cannot infer the connected repository:
GITHUB_REPOSITORY=owner/repository
```

The token should have access only to this repository and only the **Contents:
Read and write** permission. When the repository is connected to Vercel, each
admin save creates a commit and triggers the normal automatic deployment.
