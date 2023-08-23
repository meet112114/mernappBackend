const express = require('express');
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const LoginAuth = require('../middleware/LoginAuth');
const cookieParser = require("cookie-parser");


const router = express.Router();
require('../DB/conn');
router.use(cookieParser());

const User = require('../models/userSchema');

router.get("/" , (req , res) => {
    res.send(`Welcome to my server by rouer`);
 });

router.post("/register", async (req , res) => {

  const { name , email , phone , work , password , cpassword } = req.body;

     if ( !name || !email || !phone || !work || !password || !cpassword ) {
        return  res.status(422).json({error : `plz fill all fields properly`});
     }   

     try{

         const userExist = await User.findOne({email:email});
     
         if(userExist){
            return  res.status(422).json({error : `email exists`});

         }else if (password != cpassword){

            return  res.status(422).json({error : `Password and confirm password should mach`});
         }else{

            const user = new User({ name , email , phone , work , password , cpassword}); 
            await  user.save();   
            res.status(201).json({ message : 'user regisered successfully'});
         }      
    
     }catch(err){

      console.log(err);
     }

})

router.post('/signin' , async (req , res) => { 
   
         try{

               const  {email , password} = req.body;

                  if (!email || !password){
                  return  res.status(422).json({error : `plz fill all fields properly`});
                     }   

                  const userLogin = await User.findOne({email:email});

                  // console.log(userLogin);

                  if(userLogin){

                     const isMatch = await bcrypt.compare(password, userLogin.password);
                     const token = await userLogin.generateAuthToken();
                     console.log(token);
                     res.cookie("jwtoken", token ,{
                        expires: new Date(Date.now() + 2589200000),
                        httpOnly:true
                     })

                     if(!isMatch){
                        res.status(400).json({error:" invalid credentials"});
                        }else{
                        res.json({message : "user login successfully"});
                        }

                  }else{

                     res.status(400).json({error:" invalid credentials"});
                     
                  }  
               
         }catch(err){
            console.log(err);
         }
         
});


router.get("/about" , LoginAuth , (req , res) => {
   console.log('Welcome to about');
   res.send(req.rootUser);
});

router.get('/getData' , LoginAuth , (req ,res) =>{
   console.log('Welcome to contact/home');
   res.send(req.rootUser);
});

router.post("/contact", LoginAuth , async (req , res) => {
   console.log(req.body);
   

   try{

      const { name , email , phone , message } = req.body;
      

      if ( !name || !email || !phone || !message ){
         console.log("error in contact form");
         return res.json({ error:"plzz filled the contact form"});
      }

      const userContact = await User.findOne({ _id : req.userID });

      if(userContact){

         const userMessage = await userContact.addMessage( name, email, phone, message);

         await userContact.save();

         res.status(201).json({message :"Message Sent"})
      }

   }catch(error){
      console.log(error);
   }
   
});


router.get("/logout" , (req , res) => {
   console.log('Welcome to logout');
   res.clearCookie('jwtoken' , {path:'/'} )
   res.status(200).send('user logout');
});


module.exports = router;       