
const bcrypt=require("bcrypt");
const asyncHandler=require("express-async-handler");
const User=require("../models/userModel");
const jwt=require("jsonwebtoken");
//.@desc register a user
//@route GET /api/users/register
//@access  public
const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      res.status(400);
      throw new Error("All fields are mandatory!");
    }
    const userAvailable = await User.findOne({ email });
    if (userAvailable) {
      res.status(400);
      throw new Error("User already registered!");
    }
  
    //Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed Password: ", hashedPassword);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });
  
    console.log(`User created ${user}`);
    if (user) {
      res.status(201).json({ _id: user.id, email: user.email });
    } else {
      res.status(400);
      throw new Error("User data is not valid");
    }
   
  });

//.@desc register a user
//@route GET /api/users/login
//@access  public
const loginUser= asyncHandler (async (req,res)=>{

    const{email,password}=req.body;

    if(!email|| !password){
        res.status(400);
        throw new Error("all fields are mandatory");
    }


    const user =await User.findOne({email});

    //compare password with hashed password

    if(user && (await bcrypt.compare(password,user.password)) ){
        //we need to provide acess token
const accessToken= jwt.sign({
    //payload in token
    user:{
        username:user.username,
        email:user.email,
        id:user.id
    },
},
process.env.ACCESS_TOKEN_SECRET,
{expiresIn:"15m"}
);
        res.status(200).json({accessToken})
    } else{
        res.status(401)
        throw new Error("password or email is not valid");
    }




     
   

} );

//.@desc current user info a user
//@route GET /api/users/current
//@access  private 
//client has to pass the access token so that only authneticated user can have this end point
const currentUser= asyncHandler (async (req,res)=>{
  res.json(req.user);
    res.json({message:"current  user"});

} );

module.exports={registerUser,loginUser,currentUser}