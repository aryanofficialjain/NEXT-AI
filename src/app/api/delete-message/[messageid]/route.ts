import dbConnect from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import { NextRequest } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";
import UserModel from "@/models/User";
import { log } from "console";


export async function DELETE(request:NextRequest, {params}: {params: {messageid: string}}) {
    await dbConnect();
    const messageId = params.messageid;
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;
    
    if(!session || !session.user){
        return Response.json({
            success: false,
            message: "Not Authenticated"
        },{status: 404} )
    }

    try {
       const updatedresult =  await UserModel.updateOne({_id: user._id}, {messages: {_id: messageId}});
       if(updatedresult.modifiedCount === 0){
        return Response.json({
            success: true,
            message: "Message not found or already deleted"
        }, {status: 404})
       }

    } catch (error) {
        console.log("error while deleting message", error)
        return Response.json({
            success: false,
            message: "Error in deleting Message"
        }, {status: 404})
    }

}