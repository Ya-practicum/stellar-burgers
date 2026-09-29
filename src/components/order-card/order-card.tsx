import { OrderCardUI } from '@ui';
import { memo, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import { useSelector } from '../../services/store';
import type { OrderCardProps } from './type';
import type { TIngredient, TOrder } from '@utils-types';

export const maxIngredients = 6;

export const getOrderInfo = (order: TOrder, ingredients: TIngredient[]) => {
  if (!ingredients.length) return null;

  const ingredientsInfo = order.ingredients.reduce(
    (acc: TIngredient[], item: string) => {
      const ingredient = ingredients.find((ing) => ing._id === item);
      if (ingredient) return [...acc, ingredient];
      return acc;
    },
    []
  );

  if (!ingredientsInfo.length) return null;

  const total = ingredientsInfo.reduce((acc, item) => acc + item.price, 0);

  const ingredientsToShow = ingredientsInfo.slice(0, maxIngredients);

  const remains =
    ingredientsInfo.length > maxIngredients
      ? ingredientsInfo.length - maxIngredients
      : 0;

  const date = new Date(order.createdAt);

  return {
    ...order,
    ingredientsInfo,
    ingredientsToShow,
    remains,
    total,
    date,
  };
};

export const OrderCard = memo(function OrderCard({
  order,
}: OrderCardProps): React.JSX.Element | null {
  const location = useLocation();
  const { ingredients } = useSelector((state) => state.ingredients);

  const orderInfo = useMemo(
    () => getOrderInfo(order, ingredients),
    [order, ingredients]
  );

  if (!orderInfo) return null;

  return (
    <OrderCardUI
      orderInfo={orderInfo}
      maxIngredients={maxIngredients}
      locationState={{ background: location }}
    />
  );
});
