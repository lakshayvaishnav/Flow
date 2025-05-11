import express, { Router } from "express"
import { prisma } from "@repo/db"
const router = Router();

type User = {
    id: number,
    name: string,
    email: string,
    password: string
}

router.get("/sign", (req, res) => {
    res.json({ message: "hii bro" })
})

router.post("/signup", async (req, res) => {
    const body: User = req.body
    const user = await prisma.user.findFirst({
        where: {
            email: body.email
        }
    })
    if (user) {
        res.json({ message: "user existed already try signinig in" })
    }

    if (!user) {
        const result = await prisma.user.create({
            data: {
                email: body.email,
                name: body.name,
                password: body.password
            }
        })
        res.json({ message: "user created successfull" })
        console.log(result)
    }
})

router.post("/signin", async (req, res) => {
    const body: User = req.body;
    const user = await prisma.user.findFirst({
        where: {
            email: body.email
        }
    })

    if (user?.name == body.name && user.password == body.password && user.email == body.email) {
        res.json({ message: "user signedin successfully" })
    }

    res.json({ message: "invalid credentials" })
})

export default router;