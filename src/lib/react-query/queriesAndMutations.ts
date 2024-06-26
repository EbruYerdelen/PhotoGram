//react-query is a library that helps with data managment.
//queries for fetching data,mutations for modifying the data
import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,

} from "@tanstack/react-query"
import { QUERY_KEYS } from "@/lib/react-query/queryKeys";
import { signInAccount, createUserAccount, signOutAccount, createPost } from "../appwrite/api"
import { INewPost, INewUser } from "@/types";

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


export const useSignOutAccount = () => {
  return useMutation({
    mutationFn: signOutAccount
  });
};
//The mutationFn property expects a function that will be executed when the mutation is triggered. It does not expect the result of a function call but rather the function itself.
// so reason signOutAccount is passed directly as mutationFn in the useSignOutAccount hook and not as signOutAccount() is due to how React Query's useMutation works like written above
//signOutAccount: This is a reference to the function itself.
//signOutAccount(): This is a call to the function which executes it immediately and returns the result of that execution.


export const useCreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (post: INewPost) => createPost(post),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
    },
  });
};