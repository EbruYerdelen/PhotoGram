import Loader from '@/components/shared/Loader';
import PostCard from '@/components/shared/PostCard';
import { useGetPosts, useGetRecentPosts } from '@/lib/react-query/queriesAndMutations';
import { Models } from 'appwrite';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';


const Home = () => {
const { ref, inView } = useInView();
const { data: infPosts, fetchNextPage, hasNextPage } = useGetPosts();

  const { data: posts, isPending: isPostLoading } = useGetRecentPosts()
  
  useEffect(() => {
    if (inView && hasNextPage) {
      console.log("Fetching next page...");
      fetchNextPage();
    } 
    
  },[inView]);

  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
          <h2 className="h3-bold md:h2-bold w-full text-left">Home Feed</h2>
          {isPostLoading && !posts ? (
            <Loader />
          ) : (
            <ul className="flex flex-col flex-1 gap-9 w-full">
              {infPosts
                ? infPosts.pages.map((page) =>
                    page.documents.map((post: Models.Document) => (
                      <PostCard post={post} key={post.$id} />
                    ))
                  )
                : posts?.documents.map((post: Models.Document) => (
                    <PostCard post={post} key={post.$id} />
                  ))}
            </ul>
          )}
        </div>

        {hasNextPage && (
          <div ref={ref} className="mt-10">
            <Loader />
          </div>
        )}
      </div>
    </div>
  );
}

export default Home

/*

{posts?.documents.map((post: Models.Document) => (
  <PostCard post={post} key={post.caption} />
))}
*/