import React from 'react';
import { f7 } from 'framework7-react';

import { formmatPrice } from '@utils/index';
import { existedProductOnShoppingList, getShoppingList, IShoppingItem, saveShoppingList } from '@store';
import { useRecoilState } from 'recoil';
import { Like } from '@interfaces/like.interface';
import { likeListAtom } from '@atoms';
import { unlikeProductAPI } from '@api';
import { User } from '@interfaces/user.interface';
import { SetterOrUpdater } from 'recoil';

interface LikeListProps {
  currentUser: User;
  setShoppingList: SetterOrUpdater<IShoppingItem[]>;
}

const LikeList: React.FC<LikeListProps> = ({ currentUser, setShoppingList }) => {
  const [likeList, setLikeList] = useRecoilState<Like>(likeListAtom);

  const onDeleteClick = async (e, productId: string) => {
    setLikeList((prev) => ({
      ...prev,
      products: [...prev.products.filter((product) => product.id !== productId)],
    }));
    try {
      const { ok, error } = await unlikeProductAPI({ productId });
      if (!ok) {
        f7.dialog.alert(error);
      }
    } catch (error) {
      f7.dialog.alert(error?.response?.data || error?.message);
    }
  };

  const onAddProductToShoppingList = (e: any, data: IShoppingItem) => {
    const shoppingList = getShoppingList(currentUser.id);
    if (existedProductOnShoppingList(currentUser.id, data.id)) {
      f7.dialog.alert('이미 장바구니에 있습니다.');
    } else {
      f7.dialog.alert('장바구니에 담았습니다.');
      const shoppingItem: IShoppingItem = {
        id: data.id,
        name: data.name,
        price: data.price,
        imageUrl: data.imageUrl,
        orderCount: 1,
      };
      shoppingList.push({ ...shoppingItem });
      saveShoppingList(currentUser.id, shoppingList);
      setShoppingList([...shoppingList]);
    }
  };

  return (
    <>
      {likeList &&
        likeList.products.map((item) => (
          <div className="pb-2 border-b border-gray-400 mx-2 my-4" key={item.id}>
            <div className="flex min-w-full">
              <img src={item.images[0]} alt="" className="w-1/4 mr-4" />
              <div className="w-80 flex flex-col justify-between">
                <div className="flex mb-4">
                  <span className="font-bold truncate w-full">{item.name}</span>
                </div>
                <div className="mb-4">
                  <span className="font-bold text-lg">{formmatPrice(item.price)}</span>
                  <span>원</span>
                </div>
                <div className="flex items-center">
                  <button
                    className="w-20 font-medium border py-2 px-4 rounded-md border-gray-300"
                    onClick={(e) => onDeleteClick(e, item.id)}
                  >
                    삭제
                  </button>
                  <button
                    className={`w-1/2 py-2 px-3   rounded-md ml-2 ${
                      existedProductOnShoppingList(currentUser.id, item.id)
                        ? 'border border-gray-600 text-gray-600 pointer-events-none'
                        : 'border-2 border-blue-600 text-blue-600'
                    }`}
                    onClick={(e) =>
                      onAddProductToShoppingList(e, {
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        orderCount: 1,
                        imageUrl: item.images[0],
                      })
                    }
                    disabled={existedProductOnShoppingList(currentUser.id, item.id)}
                  >
                    장바구니 담기
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
    </>
  );
};

export default React.memo(LikeList);
