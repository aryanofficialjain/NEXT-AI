import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { z } from "zod";
import { userValidation } from "@/schemas/signupSchema";
import { NextRequest, NextResponse } from "next/server";

const userQuerySchema = z.object({
  username: userValidation,
});

export async function GET(request: NextRequest) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);

    const queryParam = searchParams.get("username");

    // validate with zod

    const result = userQuerySchema.safeParse(queryParam);
    console.log(result);

    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            usernameErrors?.length > 0
              ? usernameErrors.join(", ")
              : "Invalid query parameters",
        },
        { status: 400 }
      );
    }

    const { username } = result.data;

    const existingVerifiedUser = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Username is already taken",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Username is Unique",
    });
  } catch (error: any) {
    console.error("Error checking username", error);

    return NextResponse.json(
      {
        succes: false,
        message: "Error checking username",
      },
      {
        status: 500,
      }
    );
  }
}
