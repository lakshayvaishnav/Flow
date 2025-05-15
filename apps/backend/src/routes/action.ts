import { prisma } from "@repo/db"
import { Router } from "express"

const router = Router()

router.get("/available", async (req, res) => {
    // find available actiosn according to the action selected


    const availableActions = await prisma.availableAction.findMany({})

    res.json({ availableActions })

})
export default router;