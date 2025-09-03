import mongoose from "mongoose";

const connectDb = async()=>//db connect hower jonno time lagbe tokhon jeno kaj theme na thake tai async

{
try{
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Mongodb connected");
}catch(error)
{
console.error("not connected",error);
process.exit(1);
}

}


export default connectDb;