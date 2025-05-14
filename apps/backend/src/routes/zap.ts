import { Router } from "express"
import { zapSchema } from "../types/index.js";
import { prisma } from "@repo/db";

const router = Router();


router.post("/", async (req, res) => {
    // @ts-ignore
    const id = req.id
    const body = req.body

    const parsedData = zapSchema.safeParse(body).data;

    console.log("✅ parsed data : ", parsedData)

    if (!parsedData) {
        res.json({ message: "invalid body structure" })
        return;
    }

    const zapId = await prisma.$transaction(async (tx) => {
        return await tx.zap.create({
            data: {
                name: parsedData.name,
                userId: parsedData.userId,
                actions: {
                    create: parsedData.actions.map((x) => ({
                        name: x.name,

                        availableActions: {
                            create: x.availableActions.map((y) => ({
                                name: y.name,
                            }))
                        }
                    }))
                }
            }
        })
    })

    console.log(zapId);
    res.json({message: "request succeed zap created"})
})

export default router;