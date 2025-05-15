import express from "express"
import userRouter from "./routes/user.js"
import zapRouter from "./routes/zap.js"
import actionRouter from "./routes/action.js"
import triggerRouter from "./routes/trigger.js"
import cors from "cors"

const app = express();
app.use(express.json())
app.use(cors())


app.use("/api/v1/user", userRouter);
app.use("/api/v1/zap", zapRouter)
app.use("/api/v1/action", actionRouter)
app.use("/api/v1/trigger",triggerRouter)

app.listen(3000, () => {
    console.log("server running on 3000")
})