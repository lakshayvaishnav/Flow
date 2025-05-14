import express from "express"
import { prisma } from "@repo/db"

const app = express()

app.post("/hooks/catch/:userId/:zapId", async (req, res) => {
    const userId = req.params.userId
    const zapId = req.params.zapId;
    const body = req.body;


    // create zaprun and zaprunoutbox
    await prisma.$transaction(async tx => {
        const zapRun = await tx.zapRun.create({
            data: {
                zapId: zapId,
                metadata: body
            }
        })
        const zapRunOutbox = await tx.zapRunOutbox.create({
            data: {
                zapRunId: zapRun.id
            }
        })
    })
})

app.listen(3002, () => {
    console.log("hooks backend running at 3002")
})