import { prisma } from "@repo/db"

const createDemoUser = async () => {
    prisma.user.create({
        data: {
            email: "thelakshayvaishnav@gmail.com",
            name: "the greatest mf",
            password: "1234",
        }
    })
}