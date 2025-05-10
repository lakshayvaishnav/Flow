import express, { Router } from "express"

const router = Router();

router.get("/", (req, res) => {
    res.json({ message: "working fine" })
})

export default router;