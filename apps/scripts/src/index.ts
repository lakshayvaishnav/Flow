import { prisma } from "@repo/db"

async function createuser() {
    const res = await prisma.user.create({
        data: {
            email: "vaishnavlakshay23",
            name: "don",
            password: "123455",
        }
    })
    console.log("✅ ", res)
}

async function createZapWithAction() {
    const user = await prisma.user.findFirst({
        where: {
            email: "vaishnavlakshay23"
        }
    })
    const res = await prisma.zap.create({
        data: {
            name: "Zap 1",
            userId: user?.id,
            actions: {
                create: [{
                    name: "Email",
                    availableActions: {
                        create: [
                            { name: "send email", },
                            { name: "bulk email" },
                            { name: "draft email" }]
                    }
                }]
            }
        },
        include: {
            actions: {
                include: {
                    availableActions: true
                }
            }
        }
    })
    console.log("creted zap ", JSON.stringify(res, null, 2))

}

async function deleteData() {
    const res = await prisma.user.deleteMany();
    const res2 = await prisma.action.deleteMany();
    const res3 = await prisma.zap.deleteMany();
    console.log("✅", res)
    console.log("✅", res2)
}

async function main() {
    // await deleteData()
    await createuser();
    await createZapWithAction();
}

main()