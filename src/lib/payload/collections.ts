import type { CollectionConfig, Field } from "payload";

const groups = {
  operations: "1. Operations",
  members: "2. Members",
  community: "3. Community",
  editorial: "4. Editorial",
  concierge: "5. Concierge",
  commerce: "6. Drops & Benefits",
  system: "9. System"
} as const;

const statusOptions = {
  waitlist: [
    { label: "New application", value: "new" },
    { label: "Approved", value: "approved" },
    { label: "Invited", value: "invited" },
    { label: "Joined", value: "joined" },
    { label: "Rejected", value: "rejected" }
  ],
  membership: [
    { label: "Pending payment", value: "pending" },
    { label: "Active", value: "active" },
    { label: "Past due", value: "past_due" },
    { label: "Cancelled", value: "cancelled" },
    { label: "Expired", value: "expired" },
    { label: "Banned", value: "banned" }
  ],
  post: [
    { label: "Draft", value: "draft" },
    { label: "Published", value: "published" },
    { label: "Hidden from members", value: "hidden" },
    { label: "Deleted", value: "deleted" }
  ],
  visibility: [
    { label: "Public", value: "public" },
    { label: "Members only", value: "members" },
    { label: "Private", value: "private" }
  ],
  concierge: [
    { label: "New request", value: "new" },
    { label: "AI drafted", value: "ai_drafted" },
    { label: "Needs review", value: "needs_review" },
    { label: "Answered", value: "answered" },
    { label: "Published to library", value: "published" },
    { label: "Archived", value: "archived" }
  ]
};

const slugField: Field = {
  name: "slug",
  type: "text",
  required: true,
  unique: true,
  admin: {
    description: "Lowercase URL slug, for example south-london-studio-visit.",
    placeholder: "lowercase-url-slug"
  }
};

const tagsField: Field = {
  name: "tags",
  type: "array",
  admin: {
    description: "Short internal tags for filtering, search, and future Concierge knowledge."
  },
  fields: [{ name: "tag", type: "text", required: true }]
};

const interestsField = (required = false): Field => ({
  name: "interests",
  type: "array",
  admin: {
    description: "Member interests such as Food, Home, Style, Travel, Family, Culture, Music, Objects, Creativity."
  },
  fields: [{ name: "interest", type: "text", required }],
  minRows: required ? 1 : undefined
});

export const Admins: CollectionConfig = {
  slug: "admins",
  auth: true,
  labels: {
    singular: "Admin user",
    plural: "Admin users"
  },
  admin: {
    defaultColumns: ["email", "name", "role", "updatedAt"],
    description: "People who can access and operate the Well Nice CMS.",
    group: groups.system,
    useAsTitle: "email"
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      admin: { placeholder: "Jane Smith" }
    },
    {
      name: "role",
      type: "select",
      defaultValue: "admin",
      options: [
        { label: "Moderator", value: "moderator" },
        { label: "Editor", value: "editor" },
        { label: "Admin", value: "admin" }
      ],
      required: true,
      admin: {
        description: "Controls what this person should be trusted to manage operationally."
      }
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
    description: "Review people who have asked to join before they are invited to pay.",
    group: groups.operations,
    listSearchableFields: ["name", "email", "location", "instagram", "reason"],
    useAsTitle: "email"
  },
  fields: [
    { name: "name", type: "text", required: true, admin: { placeholder: "Applicant name" } },
    { name: "email", type: "email", required: true, admin: { placeholder: "name@example.com" } },
    { name: "location", type: "text", required: true, admin: { placeholder: "London, Bristol, Glasgow..." } },
    { name: "instagram", type: "text", admin: { placeholder: "@handle" } },
    interestsField(true),
    {
      name: "reason",
      type: "textarea",
      required: true,
      admin: {
        description: "The applicant's answer to why they want to join.",
        rows: 6
      }
    },
    {
      name: "status",
      type: "select",
      defaultValue: "new",
      options: statusOptions.waitlist,
      required: true,
      admin: {
        description: "Use Approved when they are a good fit; Invited once you have sent the membership invite."
      }
    }
  ]
};

export const Members: CollectionConfig = {
  slug: "members",
  labels: {
    singular: "Member",
    plural: "Members"
  },
  admin: {
    defaultColumns: ["name", "email", "membershipStatus", "plan", "location", "onboardingComplete"],
    description: "Paid member records synced from Clerk and Stripe.",
    group: groups.members,
    listSearchableFields: ["name", "email", "location", "bio"],
    useAsTitle: "email"
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Profile",
          fields: [
            { name: "email", type: "email", required: true },
            { name: "name", type: "text", required: true },
            { name: "avatar", type: "upload", relationTo: "media" },
            { name: "location", type: "text" },
            { name: "bio", type: "textarea", admin: { rows: 5 } },
            interestsField(),
            {
              name: "directoryVisible",
              type: "checkbox",
              defaultValue: false,
              admin: { description: "Members choose whether they appear in the public member directory." }
            }
          ]
        },
        {
          label: "Membership",
          fields: [
            {
              name: "membershipStatus",
              type: "select",
              defaultValue: "pending",
              options: statusOptions.membership,
              admin: { description: "Access to the app is granted only when this is Active and the member is onboarded." }
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
            { name: "banned", type: "checkbox", defaultValue: false }
          ]
        },
        {
          label: "System IDs",
          fields: [
            {
              name: "clerkUserId",
              type: "text",
              required: true,
              unique: true,
              admin: { description: "Synced from Clerk. Avoid editing manually unless repairing an account." }
            },
            { name: "stripeCustomerId", type: "text", admin: { readOnly: true } },
            { name: "stripeSubscriptionId", type: "text", admin: { readOnly: true } },
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
              ]
            }
          ]
        }
      ]
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
    description: "Shared image and file library for journal, spaces, recommendations, events, and drops.",
    group: groups.system,
    useAsTitle: "filename"
  },
  fields: [
    {
      name: "alt",
      type: "text",
      admin: {
        description: "Describe the image for accessibility and editorial context.",
        placeholder: "Ceramic bowls on a kitchen table"
      }
    }
  ]
};

export const Spaces: CollectionConfig = {
  slug: "spaces",
  labels: {
    singular: "Space",
    plural: "Spaces"
  },
  admin: {
    defaultColumns: ["title", "visibility", "order", "updatedAt"],
    description: "The member rooms that structure the community experience.",
    group: groups.community,
    listSearchableFields: ["title", "description"],
    useAsTitle: "title"
  },
  fields: [
    { name: "title", type: "text", required: true, admin: { placeholder: "Food & Drink" } },
    slugField,
    {
      name: "description",
      type: "textarea",
      required: true,
      admin: { description: "Short member-facing description shown on the Spaces index.", rows: 4 }
    },
    { name: "coverImage", type: "upload", relationTo: "media" },
    {
      name: "visibility",
      type: "select",
      defaultValue: "members",
      options: statusOptions.visibility,
      admin: { description: "Most spaces should be Members only." }
    },
    { name: "order", type: "number", defaultValue: 0, admin: { description: "Lower numbers appear first." } }
  ]
};

export const Posts: CollectionConfig = {
  slug: "posts",
  labels: {
    singular: "Community post",
    plural: "Community posts"
  },
  admin: {
    defaultColumns: ["title", "space", "author", "status", "featured", "pinned", "updatedAt"],
    description: "Member posts and editorially featured community discussions.",
    group: groups.community,
    listSearchableFields: ["title", "body"],
    useAsTitle: "title"
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Post",
          fields: [
            { name: "title", type: "text", required: true },
            { name: "body", type: "textarea", required: true, admin: { rows: 10 } },
            { name: "author", type: "relationship", relationTo: "members", required: true },
            { name: "space", type: "relationship", relationTo: "spaces", required: true },
            { name: "images", type: "array", fields: [{ name: "image", type: "upload", relationTo: "media" }] }
          ]
        },
        {
          label: "Moderation",
          fields: [
            {
              name: "status",
              type: "select",
              defaultValue: "published",
              options: statusOptions.post,
              admin: { description: "Hide instead of deleting when possible, so moderation history is preserved." }
            },
            { name: "featured", type: "checkbox", defaultValue: false },
            { name: "pinned", type: "checkbox", defaultValue: false },
            { name: "commentsLocked", type: "checkbox", defaultValue: false }
          ]
        },
        {
          label: "Engagement",
          fields: [
            { name: "likes", type: "relationship", relationTo: "members", hasMany: true, admin: { readOnly: true } },
            { name: "savedBy", type: "relationship", relationTo: "members", hasMany: true, admin: { readOnly: true } }
          ]
        }
      ]
    }
  ]
};

export const Comments: CollectionConfig = {
  slug: "comments",
  labels: {
    singular: "Comment",
    plural: "Comments"
  },
  admin: {
    defaultColumns: ["post", "author", "status", "updatedAt"],
    description: "Nested member comments with basic moderation controls.",
    group: groups.community,
    useAsTitle: "body"
  },
  fields: [
    { name: "body", type: "textarea", required: true, admin: { rows: 5 } },
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
  labels: {
    singular: "Journal entry",
    plural: "Journal"
  },
  admin: {
    defaultColumns: ["title", "category", "visibility", "publishedAt", "updatedAt"],
    description: "Editorial articles, guides, interviews, playlists, city guides, and member stories.",
    group: groups.editorial,
    listSearchableFields: ["title", "excerpt", "body"],
    useAsTitle: "title"
  },
  fields: [
    { name: "title", type: "text", required: true, admin: { placeholder: "A city guide to Margate without the obvious bits" } },
    slugField,
    { name: "excerpt", type: "textarea", required: true, admin: { description: "Short standfirst shown in lists.", rows: 3 } },
    { name: "heroImage", type: "upload", relationTo: "media" },
    { name: "body", type: "textarea", required: true, admin: { rows: 14 } },
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
    tagsField,
    { name: "visibility", type: "select", defaultValue: "members", options: statusOptions.visibility.slice(0, 2) },
    { name: "publishedAt", type: "date", admin: { description: "Leave empty while drafting." } }
  ]
};

export const Events: CollectionConfig = {
  slug: "events",
  labels: {
    singular: "Event",
    plural: "Events"
  },
  admin: {
    defaultColumns: ["title", "date", "location", "status", "visibility"],
    description: "Meetups, walks, talks, studio visits, online sessions, and product launches.",
    group: groups.editorial,
    listSearchableFields: ["title", "location", "description"],
    useAsTitle: "title"
  },
  fields: [
    { name: "title", type: "text", required: true },
    slugField,
    { name: "date", type: "date", required: true },
    { name: "location", type: "text", required: true },
    { name: "description", type: "textarea", required: true, admin: { rows: 8 } },
    { name: "capacity", type: "number", admin: { description: "Leave blank for uncapped or online events." } },
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
    { name: "visibility", type: "select", defaultValue: "members", options: statusOptions.visibility.slice(0, 2) }
  ]
};

export const Recommendations: CollectionConfig = {
  slug: "recommendations",
  labels: {
    singular: "Recommendation",
    plural: "Recommendations"
  },
  admin: {
    defaultColumns: ["title", "category", "location", "approved", "submittedBy", "updatedAt"],
    description: "Curated places, products, books, music, objects, culture, and independent brands.",
    group: groups.editorial,
    listSearchableFields: ["title", "category", "location", "description"],
    useAsTitle: "title"
  },
  fields: [
    { name: "title", type: "text", required: true },
    slugField,
    {
      name: "category",
      type: "select",
      required: true,
      options: [
        { label: "Coffee", value: "coffee" },
        { label: "Restaurants", value: "restaurants" },
        { label: "Hotels", value: "hotels" },
        { label: "Books", value: "books" },
        { label: "Music", value: "music" },
        { label: "Objects", value: "objects" },
        { label: "Home", value: "home" },
        { label: "Kids", value: "kids" },
        { label: "Culture", value: "culture" },
        { label: "Independent brands", value: "independent-brands" }
      ]
    },
    { name: "location", type: "text", admin: { placeholder: "London, online, Margate..." } },
    { name: "description", type: "textarea", required: true, admin: { rows: 7 } },
    { name: "image", type: "upload", relationTo: "media" },
    { name: "link", type: "text", admin: { placeholder: "https://..." } },
    { name: "submittedBy", type: "relationship", relationTo: "members" },
    {
      name: "approved",
      type: "checkbox",
      defaultValue: false,
      admin: { description: "Only approved recommendations should appear in the member library." }
    },
    tagsField
  ]
};

export const ConciergeRequests: CollectionConfig = {
  slug: "concierge-requests",
  labels: {
    singular: "Concierge request",
    plural: "Concierge requests"
  },
  admin: {
    defaultColumns: ["member", "category", "location", "status", "reviewStatus", "updatedAt"],
    description: "Member requests that need AI drafting and human review before sending.",
    group: groups.operations,
    listSearchableFields: ["request", "category", "location", "budget", "finalResponse"],
    useAsTitle: "request"
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Request",
          fields: [
            { name: "member", type: "relationship", relationTo: "members", required: true },
            { name: "request", type: "textarea", required: true, admin: { rows: 8 } },
            { name: "category", type: "text", admin: { placeholder: "Travel, gifts, food, family..." } },
            { name: "location", type: "text" },
            { name: "budget", type: "text" }
          ]
        },
        {
          label: "Response",
          fields: [
            {
              name: "status",
              type: "select",
              defaultValue: "new",
              options: statusOptions.concierge
            },
            {
              name: "reviewStatus",
              type: "select",
              options: [
                { label: "Not started", value: "not_started" },
                { label: "In review", value: "in_review" },
                { label: "Approved", value: "approved" },
                { label: "Rejected", value: "rejected" }
              ]
            },
            { name: "aiDraftResponse", type: "textarea", admin: { rows: 10 } },
            { name: "finalResponse", type: "textarea", admin: { rows: 10 } },
            { name: "sourceRecommendations", type: "relationship", relationTo: "recommendations", hasMany: true },
            { name: "publishedToLibrary", type: "checkbox", defaultValue: false }
          ]
        }
      ]
    }
  ]
};

export const ConciergeKnowledgeBase: CollectionConfig = {
  slug: "concierge-knowledge-base",
  labels: {
    singular: "Concierge knowledge item",
    plural: "Concierge knowledge base"
  },
  admin: {
    defaultColumns: ["title", "category", "location", "sourceType", "approved", "updatedAt"],
    description: "Approved knowledge that helps the Concierge sound selective, local, and Well Nice.",
    group: groups.concierge,
    listSearchableFields: ["title", "category", "location", "description", "whyItsWellNice"],
    useAsTitle: "title"
  },
  fields: [
    { name: "title", type: "text", required: true },
    slugField,
    { name: "category", type: "text", required: true },
    { name: "location", type: "text" },
    { name: "description", type: "textarea", required: true, admin: { rows: 7 } },
    {
      name: "whyItsWellNice",
      type: "textarea",
      required: true,
      admin: { description: "Explain why this belongs in the Well Nice universe.", rows: 5 }
    },
    tagsField,
    { name: "image", type: "upload", relationTo: "media" },
    {
      name: "sourceType",
      type: "select",
      options: [
        { label: "Editorial", value: "editorial" },
        { label: "Community", value: "community" },
        { label: "Concierge", value: "concierge" },
        { label: "Partner", value: "partner" },
        { label: "Manual", value: "manual" }
      ]
    },
    { name: "approved", type: "checkbox", defaultValue: false }
  ]
};

export const Drops: CollectionConfig = {
  slug: "drops",
  labels: {
    singular: "Drop / benefit",
    plural: "Drops & benefits"
  },
  admin: {
    defaultColumns: ["title", "visibility", "discountCode", "startDate", "endDate"],
    description: "Early access, discount codes, partner offers, hidden products, and limited releases.",
    group: groups.commerce,
    listSearchableFields: ["title", "description", "discountCode"],
    useAsTitle: "title"
  },
  fields: [
    { name: "title", type: "text", required: true },
    { name: "description", type: "textarea", required: true, admin: { rows: 7 } },
    { name: "image", type: "upload", relationTo: "media" },
    { name: "ctaUrl", type: "text", admin: { placeholder: "https://..." } },
    { name: "discountCode", type: "text", admin: { placeholder: "WELLNICE15" } },
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
  labels: {
    singular: "Moderation report",
    plural: "Moderation reports"
  },
  admin: {
    defaultColumns: ["contentType", "contentId", "reporter", "status", "updatedAt"],
    description: "Reports from members that need moderator review.",
    group: groups.operations,
    useAsTitle: "reason"
  },
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
    { name: "reason", type: "textarea", required: true, admin: { rows: 6 } },
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
