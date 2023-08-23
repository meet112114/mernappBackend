const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = express();

dotenv.config({path:"./config.env"});

require('./DB/conn.js');
// const User = require('./models/userSchema.js')

app.use(express.json());


app.use(require('./rouer/auh.js'));

const PORT = process.env.PORT;




// app.get("/about" , (req , res) => {
//    res.send(`Welcome to about`);
// });

// app.get("/contact" , (req , res) => {
//    res.send(`Welcome to contact`);
// });

app.get("/signin" , (req , res) => {
   res.send(`Welcome to signin`);
});

app.get("/signup" , (req , res) => {
   res.send(`Welcome to signup`);
});

app.listen(PORT, ()=>{
   console.log(`server is running at port number ${PORT} `)
});