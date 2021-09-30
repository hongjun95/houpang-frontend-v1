import React, { useEffect, useState } from 'react';

import { getCategories } from '@api';
import { Link } from 'framework7-react';
import { Category } from '@interfaces/category.interface';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    (async () => {
      const { ok, categories } = await getCategories();
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
              href={`/products?categoryId=${category.id}`}
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
