import React, { useEffect, useState } from 'react';
import { API_URL, getCategories } from '@api';
import { Link, SkeletonBlock, SkeletonText } from 'framework7-react';
// import { useQuery } from 'react-query';
import { Category } from '@constants';

// const categoriesSkeletonPlaceholder = (size) => new Array(size).fill({});

const Categories = () => {
  // const { data: categories, isLoading, isError, isFetching } = useQuery<Category[], Error>(
  //   'categories',
  //   getCategories({ q: { s: ['title asc'] } }),
  //   { placeholderData: categoriesSkeletonPlaceholder(16) },
  // );

  // if (isError) {
  //   return (
  //     <div className="h-32 flex items-center justify-center">
  //       <span className="text-gray-400">서버에 문제가 발생 했습니다. </span>
  //     </div>
  //   );
  // }
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    (async () => {
      const { ok, error, categories } = await getCategories();
      if (ok) {
        setCategories(categories);
      }
    })();
  }, []);

  return (
    <div className="mt-2 grid grid-cols-4 gap-2 p-2">
      {categories.map((category: Category, i) => (
        <div key={category.id}>
          {categories.length ? (
            <Link
              href={`/items?category_id=${category.id}`}
              className="bg-white h-20 flex flex-col items-center justify-center"
              key={category.id}
            >
              <img src={category.coverImg} alt="#" className="w-14 h-14 rounded-lg shadow-sm" />
              <span className="text-gray-500 mt-1">{category.name}</span>
            </Link>
          ) : (
            <Link href="#" className="bg-white h-20 flex flex-col items-center justify-center" key={i}>
              {/* <SkeletonBlock slot="media" className="w-14 h-14 rounded-lg shadow-sm" effect="fade" /> */}
              <span className="text-gray-500 mt-1">{/* <SkeletonText>---</SkeletonText> */}</span>
            </Link>
          )}
        </div>
      ))}
    </div>
  );
};

export default React.memo(Categories);
