//react-query is a library that helps with data managment.
//queries for fetching data,mutations for modifying the data
import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,

} from "@tanstack/react-query"
import { createUserAccount } from "../appwrite/api"
import { INewUser } from "@/types"

export const useCreateUserAccountMutation = () => {
  return useMutation({
    mutationFn: (user: INewUser) => createUserAccount(user)
  })
}