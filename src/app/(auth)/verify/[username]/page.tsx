"use client";

import { useToast } from '@/components/ui/use-toast';
import { verifySchema } from '@/schemas/verifySchema';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import * as z from "zod";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage, Input } from '@/components/ui/form';

const Page = () => {
  const router = useRouter();
  const params = useParams<{ username: string }>();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      const response = await axios.post("/api/verify-code", {
        username: params.username,
        code: data.code,
      });

      toast({
        title: 'Success',
        description: response.data.message,
      });

      router.replace("/sign-in");
    } catch (error) {
      console.log("Error in verifying the code", error);
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message;

      toast({
        title: "Verification failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-100'>
      <div className="text-center text-black">
        <h1>Verify Account</h1>
      </div>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Verification Code</FormLabel>
                <FormControl>
                  <Input placeholder="Enter verification code" {...field} />
                </FormControl>
                <FormDescription>
                  Please enter the verification code sent to your email.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <button type="submit" className="btn btn-primary">
            Verify
          </button>
        </form>
      </FormProvider>
    </div>
  );
}

export default Page;