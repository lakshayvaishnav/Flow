import z from "zod"

export const zapSchema = z.object({
    name: z.string(),
    userId: z.number(),
    trigger: z.object({
        metadata: z.object({}),
        triggerId: z.string()
    }),
    actions: z.array(z.object({
        metadata: z.object({}),
        actionId: z.string()
    }))
})

