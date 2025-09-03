import user from "../models/use.js";


export const getuser = async(req,res) =>
{

    try {
        const users =await user.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({message :error.message});
    }
};


export const newuser = async(req,res)=>
{
try{
    const{name,email} = req.body;
    const User =new user({name,email});
    await User.save();
    res.status(201).json(user);
}catch(error)
{
    res.status(500).json({message :error.message});
}

}
