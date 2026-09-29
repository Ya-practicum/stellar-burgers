import { useEffect, useMemo } from 'react';
import type { FC } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';
import type { TIngredient } from '@utils-types';
import { OrderInfoUI } from '../ui/order-info';
import { Preloader } from '../ui/preloader';
import { fetchOrderByNumber } from '../../services/slices/feedSlice';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const dispatch = useDispatch();

  const { orders, userOrders, selectedOrder } = useSelector(
    (state) => state.feed
  );
  const { ingredients } = useSelector((state) => state.ingredients);

  useEffect(() => {
    if (number) {
      dispatch(fetchOrderByNumber(Number(number)));
    }
  }, [dispatch, number]);

  const orderData = useMemo(() => {
    if (selectedOrder && selectedOrder.number === Number(number)) {
      return selectedOrder;
    }
    return (
      orders.find((item) => item.number === Number(number)) ||
      userOrders.find((item) => item.number === Number(number)) ||
      null
    );
  }, [number, selectedOrder, orders, userOrders]);

  const ingredientsInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return {};

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    return orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item: string) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }
        return acc;
      },
      {}
    );
  }, [orderData, ingredients]);

  const total = useMemo(
    () =>
      Object.values(ingredientsInfo).reduce(
        (acc, item) => acc + item.price * item.count,
        0
      ),
    [ingredientsInfo]
  );

  if (!orderData) {
    return <Preloader />;
  }

  return (
    <OrderInfoUI
      orderInfo={{
        ...orderData,
        ingredientsInfo,
        date: new Date(orderData.createdAt),
        total
      }}
    />
  );
};