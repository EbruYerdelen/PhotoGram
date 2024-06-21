//react-query is a library that helps with data managment.
//queries for fetching data,mutations for modifying the data
import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,

} from "@tanstack/react-query"
import { signInAccount, createUserAccount } from "../appwrite/api"
import { INewUser } from "@/types";

/* 
useCreateUserAccountMutation is a custom React hook.
for useMutation, this hook comes from React Query and is used to handle mutations (e.g., creating, updating, deleting data).
It returns an object with properties and methods to manage the mutation state and behavior.
For mutationFn,
the mutationFn is the function that will be called when the mutation is triggered.
It takes a parameter user of type INewUser and calls createUserAccount(user).
createUserAccount is the function that sends a request to create a user account.
*/
export const useCreateUserAccount = () => {
  return useMutation({
    mutationFn: (user: INewUser) => createUserAccount(user)
  })
}
export const useSignInAccount = () => {
  return useMutation({
    mutationFn: (user: {
      email: string,
      password: string,
    }) =>signInAccount(user)
  });
};