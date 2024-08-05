import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      { status: 401 }
    );
  }

  const userId = new mongoose.Types.ObjectId(user?._id);
  try {
    const user = await UserModel.aggregate([
      { $match: { id: userId } },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);

    if (!user || user.length === 0) {
      return Response.json(
        {
          success: false,
          message: "User Not Found",
        },
        { status: 401 }
      );
    }

    return Response.json(
      {
        success: true,
        message: user[0].messages,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.log("Error while geting Messages from USer", error);

    return Response.json(
        {
          success: false,
          message: "Error while geting messages from User",
        },
        { status: 200 }
      );
  }
}
