import PostForm from "@/components/forms/PostForm";
import Loader from "@/components/shared/Loader";
import { useGetPostById } from "@/lib/react-query/queriesAndMutations";
import { useParams } from "react-router-dom";

const EditPost = () => {
  const { id } = useParams();
  /*
    What useParams Does
Extracts URL Parameters: When you define a route with parameters, such as /posts/:id, useParams allows you to access the value of id from the URL.
Provides Parameters as an Object: The hook returns an object where the keys are the names of the parameters defined in your route, and the values are the corresponding segments from the URL.
  */
  
  const { data: post, isPending } = useGetPostById(id || "");
  
  
  if (isPending) return <Loader />
  

  return (
    <div className=" flex flex-1">
      <div className="common-container">
        <div className="max-w-5xl flex-start gap-3 justify-start w-full">
          <img
            src="/assets/icons/add-post.svg"
            width={30}
            height={30}
            alt="add"
          />
          <h2 className="h3-bold md:h2-bold text-left w-full">Edit Post</h2>
        </div>
        <PostForm action="Update" post={post}/>
      </div>
    </div>
  );
};

export default EditPost;
