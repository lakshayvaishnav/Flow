import express from "express"

const app = express();


app.get("/", (req,res)=> {
    res.send("heelo world")
})

app.listen(3000,() => {
    console.log("app running on 3000")
})