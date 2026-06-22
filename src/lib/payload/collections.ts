import type { CollectionConfig } from "payload";

export const Admins: CollectionConfig = {
  slug: "admins",
  auth: true,
  admin: { useAsTitle: "email" },
  fields: [
    { name: "name", type: "text", required: true },
    { name: "role", type: "select", defaultValue: "admin", options: ["moderator", "editor", "admin"], required: true }
  ]
};

export const Waitlist: CollectionConfig = {
  slug: "waitlist",
  admin: { useAsTitle: "email" },
  fields: [
    { name: "name", type: "text", required: true },
    { name: "email", type: "email", required: true },
    { name: "location", type: "text", required: true },
    { name: "instagram", type: "text" },
    { name: "interests", type: "array", fields: [{ name: "interest", type: "text", required: true }] },
    { name: "reason", type: "textarea", required: true },
    {
      name: "status",
      type: "select",
      defaultValue: "new",
      options: ["new", "approved", "invited", "joined", "rejected"],
      required: true
    }
  ]
};

export const Members: CollectionConfig = {
  slug: "members",
  admin: { useAsTitle: "email" },
  fields: [
    { name: "clerkUserId", type: "text", required: true, unique: true },
    { name: "email", type: "email", required: true },
    { name: "name", type: "text", required: true },
    { name: "avatar", type: "upload", relationTo: "media" },
    { name: "role", type: "select", defaultValue: "member", options: ["guest", "member", "moderator", "editor", "admin"] },
    {
      name: "membershipStatus",
      type: "select",
      defaultValue: "pending",
      options: ["pending", "active", "past_due", "cancelled", "expired", "banned"]
    },
    { name: "stripeCustomerId", type: "text" },
    { name: "stripeSubscriptionId", type: "text" },
    { name: "plan", type: "select", options: ["founding", "monthly", "annual"] },
    { name: "location", type: "text" },
    { name: "bio", type: "textarea" },
    { name: "interests", type: "array", fields: [{ name: "interest", type: "text" }] },
    { name: "directoryVisible", type: "checkbox", defaultValue: false },
    { name: "onboardingComplete", type: "checkbox", defaultValue: false },
    { name: "banned", type: "checkbox", defaultValue: false }
  ]
};

export const Media: CollectionConfig = {
  slug: "media",
  upload: true,
  fields: [{ name: "alt", type: "text" }]
};

export const Spaces: CollectionConfig = {
  slug: "spaces",
  admin: { useAsTitle: "title" },
  fields: [
    { name: "title", type: "text", required: true },
    { name: "slug", type: "text", required: true, unique: true },
    { name: "description", type: "textarea", required: true },
    { name: "coverImage", type: "upload", relationTo: "media" },
    { name: "visibility", type: "select", defaultValue: "members", options: ["public", "members", "private"] },
    { name: "order", type: "number", defaultValue: 0 }
  ]
};

export const Posts: CollectionConfig = {
  slug: "posts",
  admin: { useAsTitle: "title" },
  fields: [
    { name: "title", type: "text", required: true },
    { name: "body", type: "textarea", required: true },
    { name: "author", type: "relationship", relationTo: "members", required: true },
    { name: "space", type: "relationship", relationTo: "spaces", required: true },
    { name: "images", type: "array", fields: [{ name: "image", type: "upload", relationTo: "media" }] },
    { name: "likes", type: "relationship", relationTo: "members", hasMany: true },
    { name: "savedBy", type: "relationship", relationTo: "members", hasMany: true },
    { name: "featured", type: "checkbox", defaultValue: false },
    { name: "pinned", type: "checkbox", defaultValue: false },
    { name: "commentsLocked", type: "checkbox", defaultValue: false },
    { name: "status", type: "select", defaultValue: "published", options: ["draft", "published", "hidden", "deleted"] }
  ]
};

export const Comments: CollectionConfig = {
  slug: "comments",
  fields: [
    { name: "body", type: "textarea", required: true },
    { name: "author", type: "relationship", relationTo: "members", required: true },
    { name: "post", type: "relationship", relationTo: "posts", required: true },
    { name: "parent", type: "relationship", relationTo: "comments" },
    { name: "status", type: "select", defaultValue: "visible", options: ["visible", "hidden", "deleted"] }
  ]
};

export const Journal: CollectionConfig = {
  slug: "journal",
  admin: { useAsTitle: "title" },
  fields: [
    { name: "title", type: "text", required: true },
    { name: "slug", type: "text", required: true, unique: true },
    { name: "excerpt", type: "textarea", required: true },
    { name: "heroImage", type: "upload", relationTo: "media" },
    { name: "body", type: "textarea", required: true },
    {
      name: "category",
      type: "select",
      options: ["article", "interview", "guide", "playlist", "city-guide", "member-story"],
      required: true
    },
    { name: "tags", type: "array", fields: [{ name: "tag", type: "text" }] },
    { name: "visibility", type: "select", defaultValue: "members", options: ["public", "members"] },
    { name: "publishedAt", type: "date" }
  ]
};

export const Events: CollectionConfig = {
  slug: "events",
  admin: { useAsTitle: "title" },
  fields: [
    { name: "title", type: "text", required: true },
    { name: "slug", type: "text", required: true, unique: true },
    { name: "date", type: "date", required: true },
    { name: "location", type: "text", required: true },
    { name: "description", type: "textarea", required: true },
    { name: "capacity", type: "number" },
    { name: "attendees", type: "relationship", relationTo: "members", hasMany: true },
    { name: "status", type: "select", defaultValue: "scheduled", options: ["draft", "scheduled", "sold-out", "cancelled"] },
    { name: "visibility", type: "select", defaultValue: "members", options: ["public", "members"] }
  ]
};

export const Recommendations: CollectionConfig = {
  slug: "recommendations",
  admin: { useAsTitle: "title" },
  fields: [
    { name: "title", type: "text", required: true },
    { name: "slug", type: "text", required: true, unique: true },
    { name: "category", type: "text", required: true },
    { name: "location", type: "text" },
    { name: "description", type: "textarea", required: true },
    { name: "image", type: "upload", relationTo: "media" },
    { name: "link", type: "text" },
    { name: "submittedBy", type: "relationship", relationTo: "members" },
    { name: "approved", type: "checkbox", defaultValue: false },
    { name: "tags", type: "array", fields: [{ name: "tag", type: "text" }] }
  ]
};

export const ConciergeRequests: CollectionConfig = {
  slug: "concierge-requests",
  admin: { useAsTitle: "request" },
  fields: [
    { name: "member", type: "relationship", relationTo: "members", required: true },
    { name: "request", type: "textarea", required: true },
    { name: "category", type: "text" },
    { name: "location", type: "text" },
    { name: "budget", type: "text" },
    {
      name: "status",
      type: "select",
      defaultValue: "new",
      options: ["new", "ai_drafted", "needs_review", "answered", "published", "archived"]
    },
    { name: "aiDraftResponse", type: "textarea" },
    { name: "finalResponse", type: "textarea" },
    { name: "reviewStatus", type: "select", options: ["not_started", "in_review", "approved", "rejected"] },
    { name: "sourceRecommendations", type: "relationship", relationTo: "recommendations", hasMany: true },
    { name: "publishedToLibrary", type: "checkbox", defaultValue: false }
  ]
};

export const ConciergeKnowledgeBase: CollectionConfig = {
  slug: "concierge-knowledge-base",
  admin: { useAsTitle: "title" },
  fields: [
    { name: "title", type: "text", required: true },
    { name: "slug", type: "text", required: true, unique: true },
    { name: "category", type: "text", required: true },
    { name: "location", type: "text" },
    { name: "description", type: "textarea", required: true },
    { name: "whyItsWellNice", type: "textarea", required: true },
    { name: "tags", type: "array", fields: [{ name: "tag", type: "text" }] },
    { name: "image", type: "upload", relationTo: "media" },
    { name: "sourceType", type: "select", options: ["editorial", "community", "concierge", "partner", "manual"] },
    { name: "approved", type: "checkbox", defaultValue: false }
  ]
};

export const Drops: CollectionConfig = {
  slug: "drops",
  admin: { useAsTitle: "title" },
  fields: [
    { name: "title", type: "text", required: true },
    { name: "description", type: "textarea", required: true },
    { name: "image", type: "upload", relationTo: "media" },
    { name: "ctaUrl", type: "text" },
    { name: "discountCode", type: "text" },
    { name: "visibility", type: "select", defaultValue: "members", options: ["members", "founding", "hidden"] },
    { name: "startDate", type: "date" },
    { name: "endDate", type: "date" }
  ]
};

export const Reports: CollectionConfig = {
  slug: "reports",
  fields: [
    { name: "reporter", type: "relationship", relationTo: "members", required: true },
    { name: "contentType", type: "select", options: ["post", "comment", "recommendation", "member"], required: true },
    { name: "contentId", type: "text", required: true },
    { name: "reason", type: "textarea", required: true },
    { name: "status", type: "select", defaultValue: "new", options: ["new", "reviewing", "resolved", "dismissed"] }
  ]
};

export const collections: CollectionConfig[] = [
  Admins,
  Media,
  Waitlist,
  Members,
  Spaces,
  Posts,
  Comments,
  Journal,
  Events,
  Recommendations,
  ConciergeRequests,
  ConciergeKnowledgeBase,
  Drops,
  Reports
];
