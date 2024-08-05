import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    const {username, code} = await request.json();
    const decodedUsername =  decodeURIComponent(username)

    const user = await UserModel.findOne({username: decodedUsername});

    if(!user){
        return Response.json(
            {
              success: false,
              message: "Error checking username",
            },
            { status: 500 }
          );
    }


    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if(isCodeValid && isCodeNotExpired){
        user.isVerified = true;
        await user.save();

        return NextResponse.json({
            success: true,
            message: "Account Verified Succesfully"
        }, {status: 200})
    }else if (!isCodeNotExpired){

        return NextResponse.json({
            success: false,
            message: "Verification code is expired please signup again to get a new code "
        }, {status: 2404})
    }else {
        return NextResponse.json({
            success: false,
            message: "Incorrect Verification Code"
        }, {status: 404})
    }



  } catch (error: any) {
    console.error("Error checking usernanme");
    return Response.json(
      {
        success: false,
        message: "Error checking username",
      },
      { status: 500 }
    );
  }
}
