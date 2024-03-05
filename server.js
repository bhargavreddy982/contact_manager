//lets create a basic express server
//mongo password bhargavreddyg20
//admin
console.log("hi world");

const express=require("express");
const errorHandler = require("./middleware/errorHandler");
const connectDb = require("./config/dbConnection");
const dotenv=require("dotenv").config();

const app=express();


const port=process.env.PORT || 5000;
connectDb();

//body parser middleware
app.use(express.json());

app.use("/api/contacts",require("./routes/contactRoutes"));//middlewares
app.use("/api/users",require("./routes/userRoutes"))//authentication routes
app.use(errorHandler);
app.listen(port,()=>{
    console.log(`server running on port ${port}`); //call back funciton
})
