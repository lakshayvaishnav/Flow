import { prisma } from "@repo/db"
import {Router} from"express"

const router = Router()

router.get("/available", async(req,res)=> {
        const availableTriggers = await prisma.availableTrigger.findMany({})
        res.json({
            availableTriggers
        })
})
