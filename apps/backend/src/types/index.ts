import z from "zod"

export const zapSchema = z.object({
    name: z.string(),
    userId: z.number(),
    actions: z.array(z.object({
        name: z.string(),
        availableActions: z.array(z.object({
            name: z.string()
        }))
    }))
})

