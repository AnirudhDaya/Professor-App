import { z } from "zod"

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const taskSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: z.string(),
  label: z.string(),
  priority: z.string(),
  teamMembers: z.array(z.string()), // Add this line
  abstract: z.string().optional(), // Add this line
  researchPapers: z.array(z.string()).optional(), // Add this line
  reports: z.array(z.string()).optional(), // Add this line
})

export type Task = z.infer<typeof taskSchema>