import express, { Router } from "express"
import { prisma } from "@repo/db"
const router = Router();

type User = {
    id: number,
    name: string,
    email: string,
    password: string
}



router.get("/sign/:id", (req, res) => {
    const id = req.params.id
    res.json({ message: "hii bro", id: id })
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
        where: { email: body.email }
    });

    if (!user) {
         res.status(404).json({ message: "User not found" });
         return;
    }

    if (user.password === body.password) { // Always use === for comparison
         res.json({ message: "User signed in successfully" });
         return;
    }

     res.status(401).json({ message: "Invalid credentials" });
});

export default router;