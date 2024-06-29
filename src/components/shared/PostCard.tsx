import { useUserContext } from "@/context/AuthContext"
import { multiFormatDateString } from "@/lib/utils"
import { Models } from "appwrite"
import { Link } from "react-router-dom"
import PostStats from "./PostStats"


type PostCardProps = {
  post:Models.Document
}


const PostCard = ({ post }: PostCardProps) => {
  const { user } = useUserContext();

  if (!post.creator) return;


  return (
    <div className="post-card">
      <div className="flex-between">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${post.creator.$id}`}>
            <img
              src={
                post?.creator?.imageUrl ||
                "/assets/icons/profile-placeholder.svg"
              }
              alt="creator"
              className="rounded-full w-12 lg:h-12"
            />
          </Link>
          <div className="flex flex-col">
            <p className="base-medium lg:body-bold text-light-1">
              {post.creator.name}
            </p>
            <div className="flex-center gap-2 text-light-3">
              <p className="subtle-semibold lg:small-regular">
                {multiFormatDateString(post.$createdAt)}
              </p>
              -
              <p className="subtle-semibold lg:small-regular">
                {post.location}
              </p>
            </div>
          </div>
        </div>
        <Link to={`/update-post/${post.$id}`}
          className={user.id !== post.creator.$id ? "hidden" : ""}
        >
          <img
            src="/assets/icons/edit.svg"
            alt="edit"
            width={20}
            height={20}
          />
        </Link>
      </div>
      <Link to={`/posts/${post.$id}`}>
        <div className="small-medium lg:base-medium py-5">
          <p>{post.caption}</p>
          <ul className="flex gap-1 mt-2">
            {post.tags.map((tag:string)=>(
            <li key={tag} className="text-light-3">
              #{tag}
            </li>
            ))}
          </ul>
        </div>

        <img
          src={post.imageUrl || "/assets/icons/profile-placeholder.svg"}
          className="post-card_img"
          alt="post-image"
        />
      </Link>
      <PostStats post={post} userId={user.id} />
    </div>
  );
}

export default PostCard

/* above in <Link to={`/update-post/${post.$id}`} className={..}>
ıf we pass className={`${user.id !== post.creator.$id && "hidden"}`}
instead it will give no error of typescripting expecting string or undefined because
in this case, the entire expression is wrapped in a template literal. Here’s why it works:

The template literal ${} always results in a string.
If user.id !== post.creator.$id is true, the result is "hidden".
If user.id !== post.creator.$id is false, the result is an empty string "".
Since the template literal always evaluates to a string, TypeScript sees the result as a string, which is compatible with the className prop.
BUT IF WE PASS,
{user.id !== post.creator.$id && "hidden"}
we will see that typescript saying className prop cannot be assigned to false(boolean) or "hidden" since it expects  string or undefined.
Because here,we will get true or false itself directly as booleans from user.id !== post.creator.$id. 
Best option could be ternary operator.
        
        
*/