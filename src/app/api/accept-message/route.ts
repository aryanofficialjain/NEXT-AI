import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { User } from "next-auth";

export async function POST(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Error verifying user",
      },
      { status: 400 }
    );
  }

  const userId = user._id;
  const { acceptMessage } = await request.json();

  try {
    const updateduser = await UserModel.findByIdAndUpdate({
        userId,
        isAcceptingMessage: acceptMessage,
    }, {new :true})

    if(!updateduser){
        return Response.json(
            {
              success: false,
              message: "User not found",
            },
            { status: 401 }
          );
    }

    return Response.json(
        {
          success: true,
          message: "Message Acceptance User updated Succesfully",
          updateduser,
        },
        { status: 401 }, 
      );



  } catch (error: any) {
    console.log("falied to update user status to accept message");
    return Response.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      { status: 401 }
    );
  }
}

export async function GET(request: Request){
    await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Error verifying user",
      },
      { status: 400 }
    );
  }

  const userId = user._id;


  try {
    const foundUser = await UserModel.findById(userId);
  
    if(!foundUser){
      return Response.json(
          {
            success: false,
            message: "User not found",
          },
          { status: 401 }
        );
  }
  
  return Response.json(
      {
        success: true,
        isAcceptingMessage: foundUser.isAcceptingMessage,
      },
      { status: 200 }
    );
  
  
  } catch (error:any) {
    console.log("failed to update user status to accept message");
    return Response.json({
        success: false,
        message: "Error in getting message acceptance status",
        
    }, {status: 400})
    
  }

    
  

}

