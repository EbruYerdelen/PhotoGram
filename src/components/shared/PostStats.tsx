import { useDeleteSavedPost, useGetCurrentUser, useLikePost, useSavePost } from "@/lib/react-query/queriesAndMutations";
import { checkIsLiked } from "@/lib/utils";
import { Models } from "appwrite"
import React, { useEffect, useState } from "react";
import Loader from "./Loader";

type PostStatsProps = {
  post: Models.Document,
  userId:string,
}


const PostStats = ({ post, userId }: PostStatsProps) => {
  const likesList = post.likes.map((user: Models.Document) => user.$id);

  const [likes, setLikes] = useState(likesList);
  const [isSaved, setIsSaved] = useState(false);

  const { mutate: likePost } = useLikePost();
  const { mutate: savePost, isPending: isSavingPost } = useSavePost();
  const { mutate: deleteSavedPost, isPending: isDeletingSaved } =
    useDeleteSavedPost();

  const { data: currentUser } = useGetCurrentUser();

  
  
  const savedPostRecord = currentUser?.save.find(
    (record: Models.Document) => record.post.$id === post.$id
  );//here savedPostRecord goes undefined all the time and currentUser has empty array even when we click save icon



  useEffect(() => {
    setIsSaved(savedPostRecord ? true : false);
  }, [currentUser]);



  const handleLikePost = (e: React.MouseEvent) => {
    //stopPropagation will allow you to only click the event related place,for ex ur not gonna enter post details (like logo is on the area of post detail section) when u click on like icon
    e.stopPropagation();

    let newLikes = [...likes];

    const hasLiked = newLikes.includes(userId);
    //hasLiked: A boolean value that is true if the userId is found in the newLikes array, indicating that the user has already liked the post, and false otherwise.

    if (hasLiked) {
      newLikes = newLikes.filter((id) => id !== userId);
      //This creates a new array that includes all IDs from newLikes except userId.
      //filter: An array method that creates a new array with all elements that pass the test implemented by the provided function.
      //(id) => id !== userId: The test function returns true for all IDs that are not equal to userId, effectively removing userId from the array.
    } else {
      newLikes.push(userId);
    }

    setLikes(newLikes);
    likePost({ postId: post.$id, likesArray: newLikes });
  };




  const handleSavePost = (e: React.MouseEvent) => {
    e.stopPropagation();

    //console.log("Saved Post Record:", savedPostRecord);

    if (savedPostRecord) {
      setIsSaved(false);
      deleteSavedPost(savedPostRecord.$id);
    } else {
      savePost({ postId: post.$id, userId });
      setIsSaved(true);
    }
    console.log(currentUser);
  };



  return (
    <div className="flex justify-between items-center z-20">
      <div className="flex gap-2 mr-5">
        <img
          src={
            checkIsLiked(likes, userId)
              ? "/assets/icons/liked.svg"
              : "/assets/icons/like.svg"
          }
          alt="like"
          width={20}
          height={20}
          onClick={handleLikePost}
          className="cursor-pointer"
        />
        <p className="small-medium lg:base-medium">{likes.length}</p>
      </div>

      <div className="flex gap-2 ">
        {isSavingPost || isDeletingSaved ? (
          <Loader />
        ) : (
          <img
            src={isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"}
            alt="like"
            width={20}
            height={20}
            onClick={handleSavePost}
            className="cursor-pointer"
          />
        )}
      </div>
    </div>
  );
}
export default PostStats



/* 
  const savedPostRecord = currentUser?.save.find(
    (record: Models.Document) => record.post.$id === post.$id
  );

The .find() method searches the array for the first element that satisfies the provided testing function.
The function (record: Models.Document) => record.$id === post.$id is the testing function used by .find():
Each item in the save array is passed to the function one by one.
Condition , record.$id === post.$id checks if the .$id of the current record matches the .$id of the post.
If the condition is true, .find() returns the current record. If no match is found, .find() returns undefined.
  */