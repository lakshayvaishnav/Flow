import { prisma } from "@repo/db"
import { Router } from "express"

const router = Router()

router.get("/:actionId/available", async (req, res) => {
    // find available actiosn according to the action selected

    const actionId = req.params.actionId;
    if (!actionId) {
        res.json({ message: "no action id provided" })
        return;
    }

    const availableActions = await prisma.availableAction.findMany({
        where: {
            actionId: actionId
        }
    })

    res.json({availableActions})

})
export default router;