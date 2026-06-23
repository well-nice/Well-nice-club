import Link from "next/link";

const queueLinks = [
  {
    title: "Review waitlist",
    description: "Approve, invite, or reject new applications.",
    href: "/admin/collections/waitlist",
    meta: "Admissions"
  },
  {
    title: "Answer Concierge",
    description: "Review member requests and finalise tasteful responses.",
    href: "/admin/collections/concierge-requests",
    meta: "Member service"
  },
  {
    title: "Approve recommendations",
    description: "Curate community submissions before they enter the library.",
    href: "/admin/collections/recommendations",
    meta: "Editorial"
  },
  {
    title: "Resolve reports",
    description: "Moderate flagged posts, comments, recommendations, or members.",
    href: "/admin/collections/reports",
    meta: "Moderation"
  }
];

const contentLinks = [
  { label: "Journal", href: "/admin/collections/journal" },
  { label: "Events", href: "/admin/collections/events" },
  { label: "Spaces", href: "/admin/collections/spaces" },
  { label: "Drops & benefits", href: "/admin/collections/drops" },
  { label: "Members", href: "/admin/collections/members" },
  { label: "Knowledge base", href: "/admin/collections/concierge-knowledge-base" }
];

export default function WellNiceDashboard() {
  return (
    <main style={{ padding: "3rem", maxWidth: 1180 }}>
      <p style={{ color: "#6b6b6b", fontSize: 12, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase" }}>
        Well Nice Club CMS
      </p>
      <h1 style={{ fontSize: 54, letterSpacing: "-0.06em", lineHeight: 0.95, margin: "1rem 0", maxWidth: 780 }}>
        A calmer back office for a quieter kind of community.
      </h1>
      <p style={{ color: "#5f5f5f", fontSize: 18, lineHeight: 1.6, maxWidth: 700 }}>
        Start with the operational queues, then move into editorial content, member records, events, and drops.
      </p>

      <section style={{ display: "grid", gap: 18, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", marginTop: 42 }}>
        {queueLinks.map((item) => (
          <Link
            href={item.href}
            key={item.href}
            style={{
              background: "#111",
              borderRadius: 24,
              color: "#fff",
              display: "block",
              minHeight: 190,
              padding: 24,
              textDecoration: "none"
            }}
          >
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase" }}>
              {item.meta}
            </p>
            <h2 style={{ fontSize: 26, letterSpacing: "-0.04em", marginTop: 26 }}>{item.title}</h2>
            <p style={{ color: "rgba(255,255,255,0.68)", lineHeight: 1.5 }}>{item.description}</p>
          </Link>
        ))}
      </section>

      <section style={{ background: "#f5f4f1", borderRadius: 24, marginTop: 24, padding: 24 }}>
        <h2 style={{ fontSize: 24, letterSpacing: "-0.04em", marginTop: 0 }}>Content shortcuts</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {contentLinks.map((item) => (
            <Link
              href={item.href}
              key={item.href}
              style={{
                background: "#fff",
                border: "1px solid #dedbd4",
                borderRadius: 999,
                color: "#111",
                padding: "0.75rem 1rem",
                textDecoration: "none"
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
