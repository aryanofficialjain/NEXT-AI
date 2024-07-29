import Credentials, {
  CredentialsProvider,
} from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        await dbConnect();

        try {
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier },
            ],
          });

          if (!user) {
            throw new Error("No User found with this email or username ");
          }

          if (!user.isVerified) {
            throw new Error("Please verify our account before login ");
          }
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if(isPasswordCorrect){
            return user
          } else {
            throw new Error ("Incorrect Password")
          }
        } catch (error: any) {
          throw new Error(error);
        }
      },
    }),
  ],
  callbacks:{
    
  },
  pages:{
    signIn: '/signin',
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXT_AUTH_SECRET,
};
