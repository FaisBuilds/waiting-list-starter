/**
 * WAITLIST CONFIG
 * -----------------------------------------------------------------------
 * This is the ONLY file you should need to edit when you drop this kit
 * into a new project. Everything else (waitlist.tsx) reads from here.
 *
 * To reuse across projects:
 *   1. Copy the whole `components/waitlist/` folder + `components/ui/`
 *      (skip ui/ if the target project already has shadcn button/input)
 *      + `lib/utils.ts` into the new repo.
 *   2. Edit the values below.
 *   3. Wire up `onSubmit` (see bottom of this file) to wherever you want
 *      emails to go — an API route, Supabase, Resend, a Google Sheet, etc.
 * -----------------------------------------------------------------------
 */

export const waitlistConfig = {
  // Eyebrow text above the headline
  eyebrow: "Now in early access",

  // Main headline. Use \n if you want a manual line break.
  headline: "Be first in line.",

  // Supporting subtext under the headline
  subheadline:
    "We're letting people in gradually. Drop your email and we'll send you an invite the moment it's your turn.",

  // Placeholder text in the email field
  placeholder: "you@example.com",

  // Button label (idle state)
  buttonLabel: "Join waitlist",

  // Button label while submitting
  buttonLoadingLabel: "Joining...",

  // Shown after a successful signup
  successHeadline: "You're on the list.",
  successSubtext: "We'll email you as soon as it's your turn.",

  // Optional: show a live count of people on the list ("1,204 people waiting")
  showCounter: true,
  counterLabel: (count: number) =>
    `${count.toLocaleString()} people already waiting`,

  // Accent color — any valid Tailwind color token or hex. Drives the button,
  // the focus ring, and the signature accent shapes in the hero.
  accentColor: "#6C5CE7",

  // Background style: "light" | "dark"
  theme: "dark" as "light" | "dark",
} as const;

/**
 * SUBMIT HANDLER
 * -----------------------------------------------------------------------
 * Called with the submitted email. Replace this with a real call for
 * each project. A few examples are left commented below.
 * Throw an error (or return false) to trigger the form's error state.
 * -----------------------------------------------------------------------
 */
export async function submitToWaitlist(email: string): Promise<void> {
  // --- Example: your own API route ---
  // const res = await fetch("/api/waitlist", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ email }),
  // });
  // if (!res.ok) throw new Error("Failed to join waitlist");

  // --- Example: Supabase ---
  // const { error } = await supabase.from("waitlist").insert({ email });
  // if (error) throw error;

  // --- Default fallback (no backend wired up yet): stores locally so the
  // demo is fully functional out of the box. Delete this once you wire
  // up a real handler above. ---
  await new Promise((r) => setTimeout(r, 600));
  const existing = JSON.parse(localStorage.getItem("waitlist_emails") || "[]");
  if (existing.includes(email)) return;
  localStorage.setItem("waitlist_emails", JSON.stringify([...existing, email]));
}

export function getLocalWaitlistCount(): number {
  if (typeof window === "undefined") return 0;
  const existing = JSON.parse(localStorage.getItem("waitlist_emails") || "[]");
  // Add a base offset so it doesn't look like "1 person waiting" on day one.
  // Tweak or remove this once real numbers come from your backend.
  return existing.length + 128;
}
