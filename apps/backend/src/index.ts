import express from "express"
import userRouter from "./routes/user.js"
import zapRouter from "./routes/zap.js"
const app = express();
app.use(express.json())


app.use("/api/v1/user", userRouter);
app.use("/api/v1/zap", zapRouter)

app.listen(3000, () => {
    console.log("server running on 3000")
})