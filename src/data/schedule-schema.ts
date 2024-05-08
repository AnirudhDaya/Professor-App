import { z } from "zod"

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const scheduleSchema = z.object({
  id: z.string(),
  date:  z.string(),
  title: z.string(),
  guide: z.string(),
  teamMembers: z.array(z.string()),
  time: z.string(),
  label: z.string(),
  priority: z.string(),
})

export type schedule = z.infer<typeof scheduleSchema>