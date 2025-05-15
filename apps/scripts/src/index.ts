// scrip to seed some dummy data inside databse postgres
// updating the scripts for new db
import { prisma } from "@repo/db"

async function deleteData() {
    const res = await prisma.user.deleteMany();
    const res2 = await prisma.action.deleteMany();
    const res3 = await prisma.zap.deleteMany();
    console.log("✅", res)
    console.log("✅", res2)
}

async function main() {
    const user = await prisma.user.create({
        data: {
            email: "thelakshayvaishnav@gmail.com",
            name: "lakshay",
            password: "1234"
        }
    })
    console.log(user)

    // ----------------------------------------------
    // seed multiple triggers
    const availableTriggers = await Promise.all([
        prisma.availableTrigger.create({
            data: {
                name: 'GitHub Issue Created',
                image: 'https://example.com/github-trigger.png'
            }
        }),
        prisma.availableTrigger.create({
            data: {
                name: 'New Form Submission',
                image: 'https://example.com/form-trigger.png'
            }
        }),
        prisma.availableTrigger.create({
            data: {
                name: 'New Slack Message',
                image: 'https://example.com/slack-trigger.png'
            }
        })
    ])

    // -----------------------------------------------
    // Seed multiple AvailableActions
    const availableActions = await Promise.all([
        prisma.availableAction.create({
            data: {
                name: 'Send Email',
                image: 'https://example.com/email-action.png'
            }
        }),
        prisma.availableAction.create({
            data: {
                name: 'Post to Slack',
                image: 'https://example.com/slack-action.png'
            }
        }),
        prisma.availableAction.create({
            data: {
                name: 'Create Notion Page',
                image: 'https://example.com/notion-action.png'
            }
        })
    ])

    //---------------------------------------------------
    // creating zap
    const zap = await prisma.zap.create({
        data: {
            name: "zap-1",
            userId: user.id,
            trigger: {
                create: {
                    metadata: { repo: "dummy data" },
                    triggerId: availableTriggers[0].id
                }
            },
            actions: {
                create: [
                    {
                        actionId: availableActions[0].id,
                        metadata: { mailto: "lakshayvaishnavog" },

                    }
                ]
            }
        }
    })
    console.log("zap : ", zap)
    // ----------------------------------------------------
    // now the outbox pattern part
    const zapRun = await prisma.zapRun.create({
        data: {
            zapId: zap.id,
            metadata: {
                event: "issue created"
            },

        }
    })

    console.log("zaprun : ", zapRun)

    const zapRunOutbox = await prisma.zapRunOutbox.create({
        data: {
            zapRunId: zapRun.id
        }
    })

    console.log("zaprunoutbox : ", zapRunOutbox)
}

main()