# Waitlist Kit

A drop-in waitlist page built with Next.js, shadcn/ui, Tailwind, GSAP, and
Phosphor Icons. Reuse it across every project — copy the folder once, edit
one config file per project.

## What's inside

```
components/
  waitlist/
    waitlist.tsx          ← the component, don't edit per-project
    waitlist-config.ts     ← EDIT THIS per project (copy + text + colors + submit logic)
  ui/
    button.tsx              ← shadcn-style primitives (skip if your project already has them)
    input.tsx
lib/
  utils.ts                  ← cn() helper (skip if you already have one)
app/
  page.tsx                  ← example usage
  globals.css                ← minimal CSS vars the ui components need
```

## One-time setup in a new project

```bash
pnpm add gsap @phosphor-icons/react clsx tailwind-merge
```

If the project doesn't already have shadcn/Tailwind set up:

```bash
pnpm dlx shadcn@latest init
```

## Reusing this as a GitHub template

This repo is meant to be marked as a **GitHub template repository**
(Settings → Template repository). Then, for every new waitlist:

```bash
gh repo create <new-project>-waitlist --template <your-username>/waitlist-kit --clone
cd <new-project>-waitlist
pnpm install
```

Or without the GitHub CLI: click **"Use this template"** on the repo page,
clone the new repo, then `pnpm install`.

## Editing per project

1. Open `components/waitlist/waitlist-config.ts` and edit the headline,
   copy, accent color, and theme.
2. Wire `submitToWaitlist()` in that same file to wherever emails should
   go — an API route, Supabase, Resend, Airtable, whatever the project
   uses. It ships with a `localStorage` fallback so it works immediately
   without a backend.
3. Drop `<Waitlist />` into a page (already done in `app/page.tsx`):

```tsx
import { Waitlist } from "@/components/waitlist/waitlist";

export default function Page() {
  return <Waitlist />;
}
```

That's it — no edits to `waitlist.tsx` itself should be needed between
projects. If a specific page needs a one-off tweak, pass a `config` prop
instead of touching the shared file:

```tsx
<Waitlist config={{ headline: "Something new.", accentColor: "#22C55E" }} />
```

Then deploy:

```bash
pnpm dlx vercel deploy --prod
```

Full loop per project: **clone → edit config → deploy.**

## Notes

- `theme: "dark" | "light"` in the config switches the whole page.
- `accentColor` drives the button, focus ring, and ambient glow — any hex
  works.
- Set `showCounter: false` in the config to hide the "N people waiting"
  line.
- Email validation is a simple regex client-side check; add server-side
  validation in your real submit handler.
