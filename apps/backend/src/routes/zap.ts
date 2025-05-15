import { Router } from "express"
import { zapSchema } from "../types/index.js";
import { prisma } from "@repo/db";

const router = Router();


router.post("/", async (req, res) => {
    // @ts-ignore
    const id = req.id
    const body = req.body
    console.log("body : ", body)
    const parsedData = zapSchema.safeParse(body);

    console.log("✅ parsed data : ", parsedData.data)

    if (!parsedData.success) {
        res.json({ message: "invalid body structure" })
        return;
    }

    const zapId = await prisma.$transaction(async (tx) => {
        return await tx.zap.create({
            data: {
                name: parsedData.data.name,
                userId: parsedData.data.userId,
                trigger: {
                    create: {
                        metadata: parsedData.data.trigger.metadata,
                        triggerId: parsedData.data.trigger.triggerId
                    }
                },
                actions: {
                    create: parsedData.data.actions.map((x) => ({
                        metadata: x.metadata,
                        actionId: x.actionId
                    }))
                }
            }
        })
    })

    console.log(zapId);
    res.json({ zapId: zapId, message: "request succeed zap created" })
})

router.get("/:zapId", async (req, res) => {
    //@ts-ignore
    const id = req.id
    // TODO : take information from user use jwt
    const zapId = (req.params.zapId);
    console.log("zapid :", zapId)

    const zap = await prisma.zap.findFirst({
        where: {
            id: zapId,
            // userId: id,
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

    if (!zap) {
        res.json({ message: "no zaps found" })
        return;
    }
    res.json({ zap: zap })

})

export default router;