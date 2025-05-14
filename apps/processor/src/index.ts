// processor db se utha ke kafka queus m bhejega
import { Kafka } from "kafkajs"
import { prisma } from "@repo/db"
const TOPIC_NAME = "zap-events"

// take 10 rows from zapRuns
// give it to kafka queus
// now delete those 10 rows from zaprunoutbox

const kafka = new Kafka({
    clientId: "outbox-processor",
    brokers: ["localhost:9092"] // replace with your kafka broker addresses
})


async function main() {
    const producer = kafka.producer();
    while (1) {
        const pendingRows = await prisma.zapRunOutbox.findMany({
            where: {},
            take: 10
        })
        console.log("pending rows : ", pendingRows)
        await producer.send({
            topic: TOPIC_NAME,
            messages: pendingRows.map((x) => ({
                value: JSON.stringify({ zapRunId: x.zapRunId, stage: 0 })
            }))
        })

        await prisma.zapRunOutbox.deleteMany({
            where: {
                id: {
                    in: pendingRows.map((x) => x.id)
                }
            }
        })
        await new Promise(r => setTimeout(r, 3000))
    }
}

main();