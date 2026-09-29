import { useMemo } from 'react';
import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import type { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useSelector, useDispatch } from '../../services/store';
import { postOrder, clearOrderData } from '../../services/slices/orderSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { bun, constructorIngredients } = useSelector(
    (state) => state.burgerConstructor
  );
  const { orderData, orderRequest } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.user);

  const constructorItems = {
    bun,
    ingredients: constructorIngredients
  };

  const onOrderClick = () => {
    if (!bun || orderRequest) return;
    if (!user) {
      navigate('/login');
      return;
    }

    const ingredientIds = [
      bun._id,
      ...constructorIngredients.map((item) => item._id),
      bun._id
    ];
    dispatch(postOrder(ingredientIds));
  };

  const closeOrderModal = () => {
    dispatch(clearOrderData());
  };

  const price = useMemo(
    () =>
      (bun ? bun.price * 2 : 0) +
      constructorIngredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [bun, constructorIngredients]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};