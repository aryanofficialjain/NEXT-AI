import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { Message } from "@/models/User";
import { NextRequest } from "next/server";

export async function POST(request:NextRequest){

    await dbConnect();

    const {username, content} = await request.json();

    try {
        const user = await UserModel.findOne({username});
        if(!user){
            return Response.json(
                {
                  success: false,
                  message: "User not Found",
                },
                { status: 404 }
              );
        }

        if(!user.isAcceptingMessage){
            return Response.json(
                {
                  success: false,
                  message: "User is not Accepting the Messages",
                },
                { status: 403 }
              );
        }

        const newMessage = {content, createdAt: new Date()};
        user.messages.push(newMessage as Message);

        await user.save();


        return Response.json(
            {
              success: true,
              message: "message send succesfully",
            },
            { status: 200 }
          );


    } catch (error) {
        console.log("error while sending the Message", error)
        return Response.json(
            {
              success: false,
              message: "Error while sending Message ",
            },
            { status: 400 }
          );
    }
}