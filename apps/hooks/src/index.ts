import express from "express"
import { prisma } from "@repo/db"

const app = express()
app.use(express.json())

app.post("/hooks/catch/:userId/:zapId", async (req, res) => {
    const userId = req.params.userId
    const zapId = req.params.zapId;
    const body = req.body;

    console.log("zap id ", zapId)
    console.log("body : ", body)

    // create zaprun and zaprunoutbox
    const zapRunOutboxId = await prisma.$transaction(async tx => {
        const zapRun = await tx.zapRun.create({
            data: {
                zapId: zapId,
                metadata: body
            }
        })
        console.log("zap run created : ", zapRun)
        const zapRunOutbox = await tx.zapRunOutbox.create({
            data: {
                zapRunId: zapRun.id
            }
        })

        console.log("zaprunoutbox created : ", zapRunOutbox)
        return zapRunOutbox.id
    })

    res.json({"zap run outbox id ":zapRunOutboxId})
})

app.listen(3002, () => {
    console.log("hooks backend running at 3002")
})