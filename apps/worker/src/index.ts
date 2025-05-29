import { Kafka } from "kafkajs"
const TOPIC_NAME = "zap-events"
import { prisma } from "@repo/db"

/*
this worker will act as a consumer and 
picks the tasks from the queues...

and perform actions on the basis of what kind of data it is
-- zaprunid 
*/

const kafka = new Kafka({
    clientId: "oubox-worker",
    brokers: ["localhost:9092"]
})

async function main() {
    const consumer = kafka.consumer({ groupId: "main-worker-1" });
    await consumer.connect();

    await consumer.subscribe({ topic: TOPIC_NAME, fromBeginning: true })

    await consumer.run({
        autoCommit: false,
        eachMessage: async ({ topic, partition, message }) => {
            console.log({
                partition,
                offset: message.offset,
                value: message.value?.toString(),
            })
            if (!message.value?.toString()) {
                return;
            }

            // @ts-ignore
            const data = JSON.parse(message.value)
            const zapRunId = data.zapRunId;

            console.log("zap run id is : ", zapRunId)
            // find the zaprun using id 
            const zapRun = await prisma.zapRun.findFirst({
                where: {
                    id: zapRunId
                }
                ,
                include: {
                    zap: {
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
                        }
                    }
                }
            })

            console.log("✅ zap run details is here : ", zapRun)

        }
    })
}


main()