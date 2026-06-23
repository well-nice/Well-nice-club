import type { Access, CollectionConfig } from "payload";

const adminsOnly: Access = ({ req }) => Boolean(req.user);

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
  access: {
    read: adminsOnly,
    create: adminsOnly,
    update: adminsOnly,
    delete: adminsOnly
  },
  fields: [
    { name: "name", type: "text", required: true, admin: { placeholder: "Applicant name" } },
    { name: "email", type: "email", required: true, admin: { placeholder: "name@example.com" } },
    { name: "location", type: "text", required: true, admin: { placeholder: "London, Bristol, Glasgow..." } },
    { name: "instagram", type: "text", admin: { placeholder: "@handle" } },
    {
      name: "interests",
      type: "array",
      fields: [{ name: "interest", type: "text", required: true }],
      minRows: 1
    },
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

export const collections: CollectionConfig[] = [Admins, Waitlist];
