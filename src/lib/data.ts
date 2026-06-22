import {
  BookOpen,
  CalendarDays,
  Gem,
  Home,
  MessageCircle,
  Newspaper,
  Search,
  Sparkles,
  Store,
  Users
} from "lucide-react";

export const membershipPlans = [
  {
    id: "founding",
    name: "Founding Member",
    price: "£60",
    cadence: "per year",
    description: "A limited early membership for the first circle of Well Nice.",
    stripeEnv: "STRIPE_PRICE_FOUNDING",
    features: ["Annual access", "Founding member badge", "Early event invites", "Concierge beta access"]
  },
  {
    id: "monthly",
    name: "Monthly",
    price: "£8",
    cadence: "per month",
    description: "Flexible access to the club, events, spaces, and recommendations.",
    stripeEnv: "STRIPE_PRICE_MONTHLY",
    features: ["Full member app", "Journal and spaces", "RSVP to events", "Submit recommendations"]
  },
  {
    id: "annual",
    name: "Annual",
    price: "£80",
    cadence: "per year",
    description: "The full Well Nice Club experience with a calmer annual renewal.",
    stripeEnv: "STRIPE_PRICE_ANNUAL",
    features: ["Best value", "Member benefits", "Drops and partner offers", "Directory access"]
  }
] as const;

export const publicPrinciples = [
  "Clarity, not complexity.",
  "A members' club for people who care about how things are made.",
  "Editorial, calm, human, curated, and quietly exclusive."
];

export const desktopNav = [
  { href: "/app", label: "Home", icon: Home },
  { href: "/app/journal", label: "Journal", icon: Newspaper },
  { href: "/app/spaces", label: "Spaces", icon: MessageCircle },
  { href: "/app/recommendations", label: "Recommendations", icon: Store },
  { href: "/app/concierge", label: "Concierge", icon: Sparkles },
  { href: "/app/events", label: "Events", icon: CalendarDays },
  { href: "/app/members", label: "Members", icon: Users },
  { href: "/app/drops", label: "Drops", icon: Gem },
  { href: "/app/account", label: "Account", icon: Search }
];

export const mobileNav = desktopNav.filter((item) =>
  ["Home", "Spaces", "Events", "Concierge", "Account"].includes(item.label)
);

export const spaces = [
  {
    title: "Start Here",
    slug: "start-here",
    description: "Introductions, house notes, and the rhythm of the club.",
    meta: "Pinned guide · 312 members"
  },
  {
    title: "Recommendations",
    slug: "recommendations",
    description: "Member finds worth crossing town for.",
    meta: "41 new saves this week"
  },
  {
    title: "Food & Drink",
    slug: "food-drink",
    description: "Restaurants, coffee, kitchens, markets, and things to open later.",
    meta: "18 posts today"
  },
  {
    title: "Home",
    slug: "home",
    description: "Spaces, objects, furniture, rituals, and repairs.",
    meta: "Curated by editors"
  },
  {
    title: "Style",
    slug: "style",
    description: "Clothes with feeling, useful pieces, and independent makers.",
    meta: "7 brand notes"
  },
  {
    title: "Travel",
    slug: "travel",
    description: "Small hotels, slower weekends, city guides, and family escapes.",
    meta: "3 new city notes"
  },
  {
    title: "Family",
    slug: "family",
    description: "Good days out, better objects, and ideas for small people.",
    meta: "Member led"
  },
  {
    title: "Creativity",
    slug: "creativity",
    description: "Studios, process, books, music, and things that move the needle.",
    meta: "Weekly prompt"
  },
  {
    title: "Events",
    slug: "events",
    description: "Meetups, walks, talks, launches, and online sessions.",
    meta: "Next: Sunday walk"
  },
  {
    title: "Drops",
    slug: "drops",
    description: "Early access, hidden products, discount codes, and limited releases.",
    meta: "Members only"
  }
];

export const feedCards = [
  {
    label: "Featured article",
    title: "The quiet pleasure of buying fewer, better things",
    body: "A short editorial note on objects that earn their place at home.",
    cta: "Read in Journal"
  },
  {
    label: "Recommendation",
    title: "A tiny coffee bar near the station",
    body: "Good ceramics, better filters, and a bench that catches the morning sun.",
    cta: "Save"
  },
  {
    label: "Community",
    title: "What is the best small hotel for a first night away with a baby?",
    body: "Members are sharing gentle, practical answers with actual sleep in mind.",
    cta: "Comment"
  }
];

export const upcomingEvents = [
  {
    title: "South London studio visit",
    type: "Studio Visit",
    date: "Thursday 16 July",
    location: "Peckham",
    capacity: "18 places"
  },
  {
    title: "Sunday morning design walk",
    type: "Walk",
    date: "Sunday 26 July",
    location: "Clerkenwell",
    capacity: "24 places"
  },
  {
    title: "How things are made",
    type: "Online Session",
    date: "Wednesday 5 August",
    location: "Online",
    capacity: "Members only"
  }
];

export const recommendations = [
  {
    title: "Low Intervention Coffee",
    category: "Coffee",
    location: "Bristol",
    description: "A careful roaster with handwritten tasting notes and no theatre."
  },
  {
    title: "The Linen Shelf",
    category: "Home",
    location: "Online",
    description: "Plain bedding, beautiful weight, made by a family mill in Portugal."
  },
  {
    title: "Small Hours",
    category: "Books",
    location: "Manchester",
    description: "A bookshop that understands travel, food, and children without becoming twee."
  }
];

export const journalEntries = [
  {
    title: "A city guide to Margate without the obvious bits",
    category: "City Guide",
    excerpt: "Where to eat, swim, browse, and sit when the front is too loud."
  },
  {
    title: "Objects with patience",
    category: "Guide",
    excerpt: "Six independent makers producing useful things with uncommon restraint."
  },
  {
    title: "Member story: A florist on rhythm",
    category: "Member Story",
    excerpt: "On markets, early starts, and what makes a room feel alive."
  }
];

export const members = [
  {
    name: "Mara Ellis",
    location: "London",
    bio: "Interiors stylist, very good at finding old lamps.",
    interests: ["Home", "Objects", "Food"]
  },
  {
    name: "Sam Okoro",
    location: "Bristol",
    bio: "Runs a small record label and a slower newsletter.",
    interests: ["Music", "Culture", "Travel"]
  },
  {
    name: "Iris Ford",
    location: "Glasgow",
    bio: "Architect, parent, collector of small practical chairs.",
    interests: ["Family", "Creativity", "Style"]
  }
];

export const drops = [
  {
    title: "Hidden run: hand-thrown breakfast bowls",
    description: "A members-only ceramic edition from an independent potter in Devon.",
    code: "WELLNICE15"
  },
  {
    title: "Early access: cotton chore jacket",
    description: "A small batch from a London maker before the public release.",
    code: "EARLYNICE"
  }
];

export const sectionContent = {
  spaces: {
    eyebrow: "Spaces",
    title: "Rooms with a reason to exist.",
    description: "A Mighty-style structure translated into a quieter editorial club experience.",
    items: spaces
  },
  journal: {
    eyebrow: "Journal",
    title: "Editorial notes for people with taste and a life.",
    description: "Articles, interviews, guides, playlists, city guides, and member stories managed through Payload.",
    items: journalEntries
  },
  recommendations: {
    eyebrow: "Recommendations",
    title: "The good stuff, filtered.",
    description: "Coffee, restaurants, hotels, books, music, objects, kids, culture, and independent brands.",
    items: recommendations
  },
  events: {
    eyebrow: "Events",
    title: "Meet in real life, gently.",
    description: "Meetups, walks, talks, studio visits, online sessions, and product launches.",
    items: upcomingEvents
  },
  members: {
    eyebrow: "Members",
    title: "A directory people choose to be in.",
    description: "Searchable opt-in profiles with location, interests, social links, and a sense of personality.",
    items: members
  },
  drops: {
    eyebrow: "Drops",
    title: "Early access without the noise.",
    description: "Limited releases, hidden products, partner offers, and discount codes for members.",
    items: drops
  },
  account: {
    eyebrow: "Account",
    title: "Membership, profile, and billing.",
    description: "Edit profile details, visibility, interests, membership status, and Stripe Customer Portal access.",
    items: [
      { title: "Membership status", description: "Active once confirmed by Stripe webhook." },
      { title: "Directory visibility", description: "Opt in when you are ready to be found by other members." },
      { title: "Billing portal", description: "Manage renewals, cards, cancellations, and invoices through Stripe." }
    ]
  },
  concierge: {
    eyebrow: "Concierge",
    title: "A Well Nice tastemaker, not support chat.",
    description:
      "Human-assisted AI for selective recommendations across places, products, travel, food, design, gifts, family activities, and creative inspiration.",
    items: [
      { title: "Ask for a slower weekend in Bath", description: "One hotel, two lunches, one shop, and a walk." },
      { title: "Find a thoughtful housewarming gift", description: "Independent, useful, and under £80." },
      { title: "Plan a family afternoon near London Fields", description: "Food, a playground, and somewhere calm if it rains." }
    ]
  }
} as const;

export type SectionKey = keyof typeof sectionContent;
