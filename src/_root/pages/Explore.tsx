import GridPostList from '@/components/shared/GridPostList';
import Loader from '@/components/shared/Loader';
import SearchResults from '@/components/shared/SearchResults';
import { Input } from '@/components/ui/input';
import useDebounce from '@/hooks/useDebounce';
import { useGetPosts, useSearchPosts } from '@/lib/react-query/queriesAndMutations';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

const Explore = () => {
  const { ref, inView } = useInView();
  const { data: posts, fetchNextPage, hasNextPage } = useGetPosts();


  const [searchValue, setSearchValue] = useState("");

  const debouncedValue = useDebounce(searchValue, 500);//wait 500 milisecnds until searchValue is recalled.
  const { data: searchedPosts, isFetching: isSearchFetching } = useSearchPosts(debouncedValue);


//useEffects have to be above all conditional renderings
  useEffect(() => {
    if (inView && !searchValue) fetchNextPage();
  },[inView,searchValue])



  if (!posts) {
    return (
    <div className='flex-center w-full h-full'>
        <Loader/>
    </div>
  )
}

  console.log(posts);
  const shouldShowSearchResults = searchValue !== "";
  const shouldShowPosts = !shouldShowSearchResults && posts.pages.every((item) => item.documents.length === 0);



  return (
    <div className="explore-container">
      <div className="explore-inner_container">
        <h2 className="h3-bold md:h2-bold w-full">Search Post</h2>
        <div className="flex gap-1 bg-dark-4 px-4 rounded-lg w-full">
          <img
            src="/assets/icons/search.svg"
            width={24}
            height={24}
            alt="search"
          />
          <Input
            type="text"
            placeholder="Search"
            className="explore-search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-between mt-16 mb-7 w-full max-w-5xl">
        <h3 className="body-bold md:h3-bold">Popular Today</h3>

        <div className='flex-center gap-3 bg-dark-3 px-4 py-2 rounded-xl cursor-pointer'>
          <p className='small-medium md:base-medium text-light-2'>All</p>
          <img
            src='/assets/icons/filter.svg'
            width={20}
            height={20}
            alt='filter'
          />
        </div>
      </div>

      <div className='flex flex-wrap gap-9 w-full max-w-5xl'>
        {shouldShowSearchResults ? (
          <SearchResults
            isSearchFetching={isSearchFetching}
            searchedPosts={searchedPosts}
          />
        ) : shouldShowPosts ? (
            <p className='mt-10 w-full text-center text-light-4'>End of posts</p>
          ) : posts.pages.map((item, index) => (
            <GridPostList key={`page-${index}`} posts={item.documents } />
          ))}
      </div> 

      
      
      {hasNextPage && !searchValue && (
        <div ref={ref} className='mt-10'>
          <Loader/>
        </div>
      )}
    </div>
  );
}

export default Explore
