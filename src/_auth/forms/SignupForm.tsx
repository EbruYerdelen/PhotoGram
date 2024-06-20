
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import React from 'react'
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { SignupValidation } from "@/lib/validation";
import { z } from "zod";
import Loader from "@/components/shared/Loader";
import { Link } from "react-router-dom";
import { createUserAccount } from "@/lib/appwrite/api";
import { useCreateUserAccountMutation } from "@/lib/react-query/queriesAndMutations";



const SignupForm = () => {
  const { toast } = useToast();
  //when you call right side as the hook,it gives mutateAsync func and we rename it as createUserAccount.Sımılarly for isLoading.
  //here createUserAccount is just a rename,aim of givin this name is,mutateAsync is actually the createUserAccount Func since we defined the mutation like that by using React Query.
  //So instead of using createUserAccount func itself from appwrite,use this rename.
  const { mutateAsync: createUserAccount, isLoading: isCreatingUser } = useCreateUserAccountMutation();

  // 1. Define your form.
  const form = useForm<z.infer<typeof SignupValidation>>({
    resolver: zodResolver(SignupValidation),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof SignupValidation>) {
    //This is the handle submit function for our sign up button.We'll create a new user with this handle submit func.
    const newUser = await createUserAccount(values);

    if (!newUser) {
      return toast({
        title: "  Sign up failed.Please try again",
      });
      //return means,exiting the func.If we don't have a new user,so if false,exit the func.But instead,to get a warning that smth went wrong in authentication,use toaster comp by shadcn
    }

    //const session = await signInAccount()
  }

  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col mt-7">
        <img className="mt-1" src="/assets/images/logo.svg" alt="logo" />

        <h2 className="h3-bold md:h2-bold pt-0 sm:pt-2">
          Create a new account
        </h2>
        <p className="text-light-3 small-medium md:base-regular mt-0">
          To use PhotoSnapram,please enter your details.
        </p>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5 w-full mt-1"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" className="shad-input" {...field} />
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
                  <Input type="password" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="shad-button_primary">
            {isCreatingUser ? (
              <div className="flex-center gap-2">
                <Loader /> Loading...
              </div>
            ) : (
              "Sign up"
            )}
          </Button>
          <p className="text-small-regular text-light-2 text-center ">
            Already have an account?
            <Link
              to="/sign-in"
              className="text-primary-500 text-small-semibold ml-1"
            >
              Log in
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
}

export default SignupForm
