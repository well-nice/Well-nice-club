import type { Access, CollectionConfig, Field } from "payload";

const adminsOnly: Access = ({ req }) => Boolean(req.user);

const protectedAccess = {
  read: adminsOnly,
  create: adminsOnly,
  update: adminsOnly,
  delete: adminsOnly
};

const slugField: Field = {
  name: "slug",
  type: "text",
  required: true,
  unique: true
};

const interestsField = (required = false): Field => ({
  name: "interests",
  type: "array",
  fields: [{ name: "interest", type: "text", required: true }],
  minRows: required ? 1 : undefined
});

const tagsField: Field = {
  name: "tags",
  type: "array",
  fields: [{ name: "tag", type: "text", required: true }]
};

export const Admins: CollectionConfig = {
  slug: "admins",
  auth: true,
  labels: {
    singular: "Admin user",
    plural: "Admin users"
  },
  admin: {
    defaultColumns: ["email", "name", "role", "updatedAt"],
    useAsTitle: "email"
  },
  fields: [
    { name: "name", type: "text", required: true },
    {
      name: "role",
      type: "select",
      defaultValue: "admin",
      options: [
        { label: "Moderator", value: "moderator" },
        { label: "Editor", value: "editor" },
        { label: "Admin", value: "admin" }
      ],
      required: true
    }
  ]
};

export const Waitlist: CollectionConfig = {
  slug: "waitlist",
  labels: {
    singular: "Waitlist application",
    plural: "Waitlist"
  },
  admin: {
    defaultColumns: ["name", "email", "location", "status", "createdAt"],
    listSearchableFields: ["name", "email", "location", "instagram", "reason"],
    useAsTitle: "email"
  },
  access: protectedAccess,
  fields: [
    { name: "name", type: "text", required: true },
    { name: "email", type: "email", required: true },
    { name: "location", type: "text", required: true },
    { name: "instagram", type: "text" },
    interestsField(true),
    { name: "reason", type: "textarea", required: true },
    {
      name: "status",
      type: "select",
      defaultValue: "new",
      options: [
        { label: "New", value: "new" },
        { label: "Approved", value: "approved" },
        { label: "Invited", value: "invited" },
        { label: "Joined", value: "joined" },
        { label: "Rejected", value: "rejected" }
      ],
      required: true
    }
  ]
};

export const Media: CollectionConfig = {
  slug: "media",
  upload: true,
  labels: {
    singular: "Image / file",
    plural: "Images & files"
  },
  admin: {
    defaultColumns: ["filename", "alt", "updatedAt"],
    useAsTitle: "filename"
  },
  access: protectedAccess,
  fields: [{ name: "alt", type: "text" }]
};

export const Members: CollectionConfig = {
  slug: "members",
  labels: {
    singular: "Member",
    plural: "Members"
  },
  admin: {
    defaultColumns: ["name", "email", "membershipStatus", "plan", "location", "onboardingComplete"],
    listSearchableFields: ["name", "email", "location", "bio"],
    useAsTitle: "email"
  },
  access: protectedAccess,
  fields: [
    { name: "email", type: "email", required: true },
    { name: "name", type: "text", required: true },
    { name: "avatar", type: "upload", relationTo: "media" },
    { name: "location", type: "text" },
    { name: "bio", type: "textarea" },
    interestsField(),
    { name: "directoryVisible", type: "checkbox", defaultValue: false },
    {
      name: "membershipStatus",
      type: "select",
      defaultValue: "pending",
      options: [
        { label: "Pending payment", value: "pending" },
        { label: "Active", value: "active" },
        { label: "Past due", value: "past_due" },
        { label: "Cancelled", value: "cancelled" },
        { label: "Expired", value: "expired" },
        { label: "Banned", value: "banned" }
      ],
      required: true
    },
    {
      name: "plan",
      type: "select",
      options: [
        { label: "Founding member", value: "founding" },
        { label: "Monthly", value: "monthly" },
        { label: "Annual", value: "annual" }
      ]
    },
    { name: "onboardingComplete", type: "checkbox", defaultValue: false },
    { name: "banned", type: "checkbox", defaultValue: false },
    { name: "clerkUserId", type: "text", required: true, unique: true },
    { name: "stripeCustomerId", type: "text" },
    { name: "stripeSubscriptionId", type: "text" },
    {
      name: "role",
      type: "select",
      defaultValue: "member",
      options: [
        { label: "Guest", value: "guest" },
        { label: "Member", value: "member" },
        { label: "Moderator", value: "moderator" },
        { label: "Editor", value: "editor" },
        { label: "Admin", value: "admin" }
      ],
      required: true
    }
  ]
};

export const Spaces: CollectionConfig = {
  slug: "spaces",
  labels: { singular: "Space", plural: "Spaces" },
  admin: {
    defaultColumns: ["title", "visibility", "order", "updatedAt"],
    listSearchableFields: ["title", "description"],
    useAsTitle: "title"
  },
  access: protectedAccess,
  fields: [
    { name: "title", type: "text", required: true },
    slugField,
    { name: "description", type: "textarea", required: true },
    { name: "coverImage", type: "upload", relationTo: "media" },
    {
      name: "visibility",
      type: "select",
      defaultValue: "members",
      options: [
        { label: "Public", value: "public" },
        { label: "Members only", value: "members" },
        { label: "Private", value: "private" }
      ]
    },
    { name: "order", type: "number", defaultValue: 0 }
  ]
};

export const Posts: CollectionConfig = {
  slug: "posts",
  labels: { singular: "Community post", plural: "Community posts" },
  admin: {
    defaultColumns: ["title", "space", "author", "status", "featured", "pinned", "updatedAt"],
    listSearchableFields: ["title", "body"],
    useAsTitle: "title"
  },
  access: protectedAccess,
  fields: [
    { name: "title", type: "text", required: true },
    { name: "body", type: "richText", required: true },
    { name: "author", type: "relationship", relationTo: "members", required: true },
    { name: "space", type: "relationship", relationTo: "spaces", required: true },
    { name: "images", type: "array", fields: [{ name: "image", type: "upload", relationTo: "media" }] },
    {
      name: "status",
      type: "select",
      defaultValue: "published",
      options: [
        { label: "Draft", value: "draft" },
        { label: "Published", value: "published" },
        { label: "Hidden", value: "hidden" },
        { label: "Deleted", value: "deleted" }
      ]
    },
    { name: "featured", type: "checkbox", defaultValue: false },
    { name: "pinned", type: "checkbox", defaultValue: false },
    { name: "commentsLocked", type: "checkbox", defaultValue: false },
    { name: "likes", type: "relationship", relationTo: "members", hasMany: true },
    { name: "savedBy", type: "relationship", relationTo: "members", hasMany: true }
  ]
};

export const Comments: CollectionConfig = {
  slug: "comments",
  labels: { singular: "Comment", plural: "Comments" },
  admin: {
    defaultColumns: ["post", "author", "status", "updatedAt"],
    useAsTitle: "body"
  },
  access: protectedAccess,
  fields: [
    { name: "body", type: "textarea", required: true },
    { name: "author", type: "relationship", relationTo: "members", required: true },
    { name: "post", type: "relationship", relationTo: "posts", required: true },
    { name: "parent", type: "relationship", relationTo: "comments" },
    {
      name: "status",
      type: "select",
      defaultValue: "visible",
      options: [
        { label: "Visible", value: "visible" },
        { label: "Hidden", value: "hidden" },
        { label: "Deleted", value: "deleted" }
      ]
    }
  ]
};

export const Journal: CollectionConfig = {
  slug: "journal",
  labels: { singular: "Journal post", plural: "Journal" },
  admin: {
    defaultColumns: ["title", "category", "publishedAt", "updatedAt"],
    listSearchableFields: ["title", "excerpt", "metaTitle", "metaDescription"],
    useAsTitle: "title"
  },
  access: protectedAccess,
  fields: [
    { name: "title", type: "text", required: true },
    slugField,
    { name: "excerpt", type: "textarea", required: true },
    {
      name: "category",
      type: "select",
      options: [
        { label: "Article", value: "article" },
        { label: "Interview", value: "interview" },
        { label: "Guide", value: "guide" },
        { label: "Playlist", value: "playlist" },
        { label: "City guide", value: "city-guide" },
        { label: "Member story", value: "member-story" }
      ],
      required: true
    },
    { name: "body", type: "richText", required: true },
    { name: "heroImage", type: "upload", relationTo: "media" },
    {
      name: "visibility",
      type: "select",
      defaultValue: "members",
      options: [
        { label: "Public", value: "public" },
        { label: "Members only", value: "members" }
      ]
    },
    { name: "publishedAt", type: "date" },
    { name: "metaTitle", type: "text" },
    { name: "metaDescription", type: "textarea" },
    tagsField
  ]
};

export const Events: CollectionConfig = {
  slug: "events",
  labels: { singular: "Event", plural: "Events" },
  admin: {
    defaultColumns: ["title", "date", "location", "status", "visibility"],
    listSearchableFields: ["title", "location", "description"],
    useAsTitle: "title"
  },
  access: protectedAccess,
  fields: [
    { name: "title", type: "text", required: true },
    slugField,
    { name: "date", type: "date", required: true },
    { name: "location", type: "text", required: true },
    { name: "description", type: "textarea", required: true },
    { name: "capacity", type: "number" },
    { name: "attendees", type: "relationship", relationTo: "members", hasMany: true },
    {
      name: "status",
      type: "select",
      defaultValue: "scheduled",
      options: [
        { label: "Draft", value: "draft" },
        { label: "Scheduled", value: "scheduled" },
        { label: "Sold out", value: "sold-out" },
        { label: "Cancelled", value: "cancelled" }
      ]
    },
    {
      name: "visibility",
      type: "select",
      defaultValue: "members",
      options: [
        { label: "Public", value: "public" },
        { label: "Members only", value: "members" }
      ]
    }
  ]
};

export const Recommendations: CollectionConfig = {
  slug: "recommendations",
  labels: { singular: "Recommendation", plural: "Recommendations" },
  admin: {
    defaultColumns: ["title", "category", "location", "approved", "submittedBy", "updatedAt"],
    listSearchableFields: ["title", "category", "location", "description"],
    useAsTitle: "title"
  },
  access: protectedAccess,
  fields: [
    { name: "title", type: "text", required: true },
    slugField,
    { name: "category", type: "text", required: true },
    { name: "location", type: "text" },
    { name: "description", type: "textarea", required: true },
    { name: "image", type: "upload", relationTo: "media" },
    { name: "link", type: "text" },
    { name: "submittedBy", type: "relationship", relationTo: "members" },
    { name: "approved", type: "checkbox", defaultValue: false },
    tagsField
  ]
};

export const ConciergeRequests: CollectionConfig = {
  slug: "concierge-requests",
  labels: { singular: "Concierge request", plural: "Concierge requests" },
  admin: {
    defaultColumns: ["member", "category", "location", "status", "reviewStatus", "updatedAt"],
    listSearchableFields: ["request", "category", "location", "budget", "finalResponse"],
    useAsTitle: "request"
  },
  access: protectedAccess,
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
      options: [
        { label: "New", value: "new" },
        { label: "AI drafted", value: "ai_drafted" },
        { label: "Needs review", value: "needs_review" },
        { label: "Answered", value: "answered" },
        { label: "Published", value: "published" },
        { label: "Archived", value: "archived" }
      ]
    },
    {
      name: "reviewStatus",
      type: "select",
      defaultValue: "not_started",
      options: [
        { label: "Not started", value: "not_started" },
        { label: "In review", value: "in_review" },
        { label: "Approved", value: "approved" },
        { label: "Rejected", value: "rejected" }
      ]
    },
    { name: "aiDraftResponse", type: "textarea" },
    { name: "finalResponse", type: "textarea" },
    { name: "sourceRecommendations", type: "relationship", relationTo: "recommendations", hasMany: true },
    { name: "publishedToLibrary", type: "checkbox", defaultValue: false }
  ]
};

export const ConciergeKnowledgeBase: CollectionConfig = {
  slug: "concierge-knowledge-base",
  labels: { singular: "Concierge knowledge item", plural: "Concierge knowledge base" },
  admin: {
    defaultColumns: ["title", "category", "location", "sourceType", "approved", "updatedAt"],
    listSearchableFields: ["title", "category", "location", "description", "whyItsWellNice"],
    useAsTitle: "title"
  },
  access: protectedAccess,
  fields: [
    { name: "title", type: "text", required: true },
    slugField,
    { name: "category", type: "text", required: true },
    { name: "location", type: "text" },
    { name: "description", type: "textarea", required: true },
    { name: "whyItsWellNice", type: "textarea", required: true },
    tagsField,
    { name: "image", type: "upload", relationTo: "media" },
    { name: "sourceType", type: "text" },
    { name: "approved", type: "checkbox", defaultValue: false }
  ]
};

export const Drops: CollectionConfig = {
  slug: "drops",
  labels: { singular: "Drop / benefit", plural: "Drops & benefits" },
  admin: {
    defaultColumns: ["title", "visibility", "discountCode", "startDate", "endDate"],
    listSearchableFields: ["title", "description", "discountCode"],
    useAsTitle: "title"
  },
  access: protectedAccess,
  fields: [
    { name: "title", type: "text", required: true },
    { name: "description", type: "textarea", required: true },
    { name: "image", type: "upload", relationTo: "media" },
    { name: "ctaUrl", type: "text" },
    { name: "discountCode", type: "text" },
    {
      name: "visibility",
      type: "select",
      defaultValue: "members",
      options: [
        { label: "All members", value: "members" },
        { label: "Founding members", value: "founding" },
        { label: "Hidden", value: "hidden" }
      ]
    },
    { name: "startDate", type: "date" },
    { name: "endDate", type: "date" }
  ]
};

export const Reports: CollectionConfig = {
  slug: "reports",
  labels: { singular: "Moderation report", plural: "Moderation reports" },
  admin: {
    defaultColumns: ["contentType", "contentId", "reporter", "status", "updatedAt"],
    useAsTitle: "reason"
  },
  access: protectedAccess,
  fields: [
    { name: "reporter", type: "relationship", relationTo: "members", required: true },
    {
      name: "contentType",
      type: "select",
      options: [
        { label: "Post", value: "post" },
        { label: "Comment", value: "comment" },
        { label: "Recommendation", value: "recommendation" },
        { label: "Member", value: "member" }
      ],
      required: true
    },
    { name: "contentId", type: "text", required: true },
    { name: "reason", type: "textarea", required: true },
    {
      name: "status",
      type: "select",
      defaultValue: "new",
      options: [
        { label: "New", value: "new" },
        { label: "Reviewing", value: "reviewing" },
        { label: "Resolved", value: "resolved" },
        { label: "Dismissed", value: "dismissed" }
      ]
    }
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
