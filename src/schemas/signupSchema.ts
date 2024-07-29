import {z} from "zod"

export const userValidation = z.string().min(2, "Username at least 2 character or more").max(20, "Username is not more than 20 characters").regex(/^[a-zA-Z0-9_]+$/, "Username cannot special characters")

export const signUpSchema = z.object({
    username: userValidation,
    email: z.string().email({message: "Invalid email address"}),
    password: z.string().min(6, {message: "password must be at least 6 characters "})
})