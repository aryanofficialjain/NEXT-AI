"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useDebounceValue} from "usehooks-ts";
import { useToast } from "@/components/ui/use-toast";
import { ApiResponse } from "@/types/ApiResponse";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { signInSchema } from "@/schemas/signInSchema";
import { signIn } from "next-auth/react";

function Page() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    }
  });


  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
   const result =  await signIn('credentials', {
      redirect: false,
      identifier: data.identifier,
      password: data.password
    })

    if(result?.error){
      toast({
        title: "Login Failed",
        description: "Incorrect username or password",
        variant: 'destructive'
      })
    }

    if(result?.url){
      router.replace("/dashboard");
    }
  };



  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="text-center text-black ">
        <h1>Welcome Back Mystery Message</h1>
      </div>
      <FormProvider {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          
          <FormField
            control={form.control}
            name="identifier"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email/Username</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="example@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="********" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <button type="submit" disabled={isSubmitting} className="btn btn-primary">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait...
              </>
            ) : "Sign In"}
          </button>
        </form>
      </FormProvider>
      <div className="mt-4 text-center">
        <Link href="/sign-in">Don&rsquo;t have an account? Sign In</Link>
      </div>
    </div>
  );
}

export default Page;