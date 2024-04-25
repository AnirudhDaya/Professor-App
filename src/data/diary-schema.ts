import { z } from "zod"

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const diarySchema = z.object({
  id: z.string(),
  date:  z.string(),
  remarks: z.string(),
  label: z.string(),
  status: z.string(),
  priority: z.string(),
  diary: z.string().optional(), // Add this line
})

export type Diary = z.infer<typeof diarySchema>