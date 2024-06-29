//react-query is a library that helps with data managment.
//queries for fetching data,mutations for modifying the data
import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,

} from "@tanstack/react-query"
import { QUERY_KEYS } from "@/lib/react-query/queryKeys";
import { signInAccount, createUserAccount, signOutAccount, createPost, getRecentPosts, likePost, savePost, deleteSavedPost, getCurrentUser, getPostById, updatePost, deletePost } from "../appwrite/api"
import { INewPost, INewUser, IUpdatePost, IUpdateUser } from "@/types";

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


export const useGetRecentPosts = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
    queryFn: getRecentPosts,
  });
};



type ILikePost = {
  postId: string,
  likesArray: string[],
}

type ISavePost = {
  postId: string;
  userId: string;
};



export const useLikePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, likesArray }: ILikePost) => likePost(postId, likesArray),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey:[QUERY_KEYS.GET_POST_BY_ID,data?.$id]
      });

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      });

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
    }
  })
}

/*
here for 2nd invalidation of query,we invalidate the query cache with the specific query key QUERY_KEYS.GET_RECENT_POSTS="getRecentPosts" so that
when we reload the homepage(cause we reload homepage leads we have to call the getRecentPost func to fetch the recent post data since cache is deleted)
we fetch the api again with updated(mutated) post data which is liked version of the post,and we can see the liked filled.

similar process happens when we enter the post details since we invalidated query cache with query key QUERY_KEYS.GET_POST_BY_ID="getPostById" and when we click post details,since cache no longer
exists, getPostById func fetches the api again but including the updated version of post which is liked now.(we mutated the existing post with useMutation hook from react query)
*/

/*
This onSuccess callback is executed when the mutation succeeds.
data represents the result of the likePost function, which should be the updated post.
queryClient.invalidateQueries is called to invalidate the cache for the specific query key, ensuring that the data is refetched. This keeps the UI in sync with the latest data.
 */



//another custom hook for mutation of saved posts
export const useSavePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, userId }: ISavePost) => savePost({ postId, userId }),
    onSuccess: () => {

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      });

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
    },
  });
};




export const useDeleteSavedPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (savedRecordId:string) => deleteSavedPost(savedRecordId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      });

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
    },
  });
};




// ============================================================
// USER QUERIES
// ============================================================

export const useGetCurrentUser = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_CURRENT_USER],
    queryFn: getCurrentUser,
  });
};

/*
export const useGetUsers = (limit?: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USERS],
    queryFn: () => getUsers(limit),
  });
};

export const useGetUserById = (userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_BY_ID, userId],
    queryFn: () => getUserById(userId),
    enabled: !!userId,
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (user: IUpdateUser) => updateUser(user),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_BY_ID, data?.$id],
      });
    },
  });
};

*/



export const useGetPostById = (postId:string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
    queryFn: () => getPostById(postId),
    enabled: !!postId
  });
}
/*
enabled is true default.
The enabled option controls whether the query should automatically run. When enabled is set to true, the query will run as soon as the component mounts or when the dependencies change. When enabled is set to false, the query will not run until it is manually enabled.
*/



export const useUpdatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (post: IUpdatePost) => updatePost(post),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id],
      });
    }
  });
};



export const useDeletePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({postId , imageId} : {postId:string , imageId:string}) => deletePost({postId,imageId}),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
    },
  });
  //here queryKey is set as above since in case we delete a post,we need to be able to refetch all post in homepage to show all posts without deleted one
};



