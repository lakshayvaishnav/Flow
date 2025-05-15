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
                trigger: {
                    create: {
                        metadata: parsedData.tirgger.metadata,
                        triggerId: parsedData.tirgger.triggerId
                    }
                },
                actions: {
                    create: parsedData.actions.map((x) => ({
                        metadata: x.metadata,
                        actionId: x.actionId
                    }))
                }
            }
        })
    })

    console.log(zapId);
    res.json({ message: "request succeed zap created" })
})

router.get("/:zapId", async (req, res) => {
    //@ts-ignore
    const id = req.id
    // TODO : take information from user use jwt
    const zapId = (req.params.zapId);

    try {
        const zap = await prisma.zap.findFirst({
            where: {
                id: zapId,
                userId: id,
            },
            include: {
                actions: {
                    include: {
                        type: true
                    }
                },
                trigger: {
                    include: {
                        type: true
                    }
                }
                ,
            },

        })
    } catch (error) {
        res.json({ message: "zaps not found" })
    }

})

export default router;