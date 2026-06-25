import nextEnv from "@next/env";
import { getPayload } from "payload";
import { plainTextToLexical } from "../src/lib/payload/format.ts";

const { loadEnvConfig } = nextEnv;

loadEnvConfig(process.cwd());

type CollectionSlug =
  | "concierge-knowledge-base"
  | "drops"
  | "events"
  | "journal"
  | "recommendations"
  | "spaces";

const spaces = [
  ["Start Here", "start-here", "Introductions, house notes, and the rhythm of the club.", 10],
  ["Recommendations", "recommendations", "Member finds worth crossing town for.", 20],
  ["Food & Drink", "food-drink", "Restaurants, coffee, kitchens, markets, and things to open later.", 30],
  ["Home", "home", "Spaces, objects, furniture, rituals, and repairs.", 40],
  ["Style", "style", "Clothes with feeling, useful pieces, and independent makers.", 50],
  ["Travel", "travel", "Small hotels, slower weekends, city guides, and family escapes.", 60],
  ["Family", "family", "Good days out, better objects, and ideas for small people.", 70],
  ["Creativity", "creativity", "Studios, process, books, music, and things that move the needle.", 80],
  ["Events", "events", "Meetups, walks, talks, launches, and online sessions.", 90],
  ["Drops", "drops", "Early access, hidden products, discount codes, and limited releases.", 100]
] as const;

const journal = [
  {
    title: "A city guide to Margate without the obvious bits",
    slug: "margate-without-the-obvious-bits",
    excerpt: "Where to eat, swim, browse, and sit when the front is too loud.",
    category: "city-guide",
    body: "A quieter guide to Margate for members who want good food, a considered shop, and somewhere to pause."
  },
  {
    title: "Objects with patience",
    slug: "objects-with-patience",
    excerpt: "Independent makers producing useful things with uncommon restraint.",
    category: "guide",
    body: "A short editorial note on buying fewer, better things and giving useful objects time to earn their place."
  }
];

const events = [
  {
    title: "South London studio visit",
    slug: "south-london-studio-visit",
    date: "2026-07-16T18:30:00.000Z",
    location: "Peckham",
    description: "A small evening studio visit with an independent maker.",
    capacity: 18
  },
  {
    title: "Sunday morning design walk",
    slug: "sunday-morning-design-walk",
    date: "2026-07-26T10:00:00.000Z",
    location: "Clerkenwell",
    description: "A gentle walk through useful spaces, quiet details, and good coffee.",
    capacity: 24
  }
];

const recommendations = [
  {
    title: "Low Intervention Coffee",
    slug: "low-intervention-coffee",
    category: "coffee",
    location: "Bristol",
    description: "A careful roaster with handwritten tasting notes and no theatre.",
    tags: ["coffee", "independent"]
  },
  {
    title: "The Linen Shelf",
    slug: "the-linen-shelf",
    category: "home",
    location: "Online",
    description: "Plain bedding, beautiful weight, made by a family mill in Portugal.",
    tags: ["home", "objects"]
  }
];

const knowledge = [
  {
    title: "Small, thoughtful hotels",
    slug: "small-thoughtful-hotels",
    category: "travel",
    location: "UK",
    description: "Hotels with good breakfast, kind lighting, and no performance of luxury.",
    whyItsWellNice: "Quietly useful, human, independent-leaning, and practical for real weekends.",
    tags: ["travel", "hotels"]
  },
  {
    title: "Housewarming gifts under eighty pounds",
    slug: "housewarming-gifts-under-eighty",
    category: "gifts",
    location: "Online",
    description: "Useful ceramics, linens, pantry things, and small objects that do not feel generic.",
    whyItsWellNice: "Selective, beautiful, and useful rather than novelty-led.",
    tags: ["gifts", "objects"]
  }
];

const drops = [
  {
    title: "Hidden run: hand-thrown breakfast bowls",
    description: "A members-only ceramic edition from an independent potter in Devon.",
    discountCode: "WELLNICE15"
  },
  {
    title: "Early access: cotton chore jacket",
    description: "A small batch from a London maker before the public release.",
    discountCode: "EARLYNICE"
  }
];

const toTags = (tags: string[]) => tags.map((tag) => ({ tag }));

async function upsertBySlug(payload: Awaited<ReturnType<typeof getPayload>>, collection: CollectionSlug, slug: string, data: Record<string, unknown>) {
  const existing = await payload.find({
    collection,
    limit: 1,
    overrideAccess: true,
    where: { slug: { equals: slug } }
  });

  if (existing.docs[0]) {
    await payload.update({ collection, id: existing.docs[0].id, data, overrideAccess: true });
    return "updated";
  }

  await payload.create({ collection, data, overrideAccess: true });
  return "created";
}

async function upsertDrop(payload: Awaited<ReturnType<typeof getPayload>>, title: string, data: Record<string, unknown>) {
  const existing = await payload.find({
    collection: "drops",
    limit: 1,
    overrideAccess: true,
    where: { title: { equals: title } }
  });

  if (existing.docs[0]) {
    await payload.update({ collection: "drops", id: existing.docs[0].id, data, overrideAccess: true });
    return "updated";
  }

  await payload.create({ collection: "drops", data, overrideAccess: true });
  return "created";
}

async function cleanupVerificationData(payload: Awaited<ReturnType<typeof getPayload>>) {
  const waitlist = await payload.find({
    collection: "waitlist",
    limit: 100,
    overrideAccess: true,
    where: { email: { contains: "verify-" } }
  });

  for (const doc of waitlist.docs) {
    await payload.delete({ collection: "waitlist", id: doc.id, overrideAccess: true });
  }

  const members = await payload.find({
    collection: "members",
    limit: 100,
    overrideAccess: true,
    where: { clerkUserId: { contains: "verify_" } }
  });

  for (const doc of members.docs) {
    await payload.delete({ collection: "members", id: doc.id, overrideAccess: true });
  }

  console.log(`Cleaned verification records: waitlist=${waitlist.docs.length}, members=${members.docs.length}`);
}

async function seed() {
  const { default: configPromise } = await import("../payload.config.ts");
  const payload = await getPayload({ config: configPromise });

  await cleanupVerificationData(payload);

  for (const [title, slug, description, order] of spaces) {
    const action = await upsertBySlug(payload, "spaces", slug, {
      title,
      slug,
      description,
      order,
      visibility: "members"
    });
    console.log(`${action} space: ${title}`);
  }

  for (const entry of journal) {
    const action = await upsertBySlug(payload, "journal", entry.slug, {
      ...entry,
      body: plainTextToLexical(entry.body),
      visibility: "members",
      publishedAt: new Date().toISOString()
    });
    console.log(`${action} journal: ${entry.title}`);
  }

  for (const event of events) {
    const action = await upsertBySlug(payload, "events", event.slug, {
      ...event,
      status: "scheduled",
      visibility: "members"
    });
    console.log(`${action} event: ${event.title}`);
  }

  for (const recommendation of recommendations) {
    const action = await upsertBySlug(payload, "recommendations", recommendation.slug, {
      ...recommendation,
      approved: true,
      tags: toTags(recommendation.tags)
    });
    console.log(`${action} recommendation: ${recommendation.title}`);
  }

  for (const item of knowledge) {
    const action = await upsertBySlug(payload, "concierge-knowledge-base", item.slug, {
      ...item,
      approved: true,
      sourceType: "manual",
      tags: toTags(item.tags)
    });
    console.log(`${action} knowledge: ${item.title}`);
  }

  for (const drop of drops) {
    const action = await upsertDrop(payload, drop.title, {
      ...drop,
      visibility: "members",
      startDate: new Date().toISOString()
    });
    console.log(`${action} drop: ${drop.title}`);
  }

  await payload.db.destroy?.();
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
