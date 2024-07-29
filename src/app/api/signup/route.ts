import dbConnect from "@/lib/dbConnect";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

import bcrypt from "bcryptjs";
import UserModel from "@/models/User";

export async function POST(request: Request) {
  await dbConnect();

  const { username, password, email } = await request.json();

  const existingUserVerifiedByUsername = UserModel.findOne({
    username,
    isVerified: true,
  });

  try {
    const { username, password, email } = await request.json();

    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    })

    if(existingUserVerifiedByUsername){
      return Response.json({
        success: false,
        message: "Username is already taken",
      }, {status: 400})
    }

    const existingUserByEmail = await UserModel.findOne({email});

    const verifyCode = String(Math.floor(100000 + Math.random() * 900000));

    if(existingUserByEmail){
      if(existingUserByEmail.isVerified){
        return Response.json({
          success: false,
          message: "User already exists with this email",

        }, {status: 400})
      }
      else{
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);

        await existingUserByEmail.save();
      }
    }
    else{
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser =  new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessage:true,
        messages: []
      })

      await newUser.save()
    }

  const emailResponse = await sendVerificationEmail(
    email,
    username,
    verifyCode,
  )

  if(!emailResponse.success){
    return Response.json({
      success: false,
      message: emailResponse.message,


    }, {status: 500});
  }

  return Response.json({
    success: true,
    message: "User registered succesfully . please verify the user",

  }, {status: 201})

  } catch (error) {
    console.log("Error while regiter a user", error);
    return Response.json(
      {
        success: false,
        message: "Error in registrer user",
      },
      {
        status: 500,
      }
    );
  }
}
