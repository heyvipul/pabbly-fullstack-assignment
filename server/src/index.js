const express = require("express")
const app = express();
const cors = require("cors");
const AuthRouter = require("./auth/authentication")
const TaskRouter = require("./router/Task")
const main  = require("./config/mongoose");
const verifyToken = require("./middleware/authmiddleware")
require("dotenv").config();
const PORT = process.env.PORT || 8000


app.use(express.json())
app.use(cors({
    origin:"*",
    credentials : true
}))
main()


app.get("/",(req,res) => {
    res.send("server running base endpoint!")
})

app.use("/user",AuthRouter);
app.use("/task",verifyToken,TaskRouter)



app.listen(PORT,()=>{
    console.log(`server running on http://localhost:${PORT}/`);
})