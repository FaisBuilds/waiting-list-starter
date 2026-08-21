import { Waitlist } from "@/components/waitlist/waitlist";

// Basic usage — everything comes from waitlist-config.ts
export default function Page() {
  return <Waitlist />;

  // Or override just for this page, without touching the config file:
  // return (
  //   <Waitlist
  //     config={{
  //       headline: "Something new is coming.",
  //       accentColor: "#22C55E",
  //       theme: "light",
  //     }}
  //   />
  // );
}
