import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderBurgerApi } from '../../utils/burger-api';
import type { TOrder } from '../../utils/types';
import { clearConstructor } from './constructorSlice';

export const postOrder = createAsyncThunk(
  'order/postOrder',
  async (ingredientIds: string[], { dispatch }) => {
    const data = await orderBurgerApi(ingredientIds);
    dispatch(clearConstructor());
    return data.order;
  }
);

interface IOrderState {
  orderData: TOrder | null;
  orderRequest: boolean;
  orderFailed: boolean;
  error: string | null;
}

const initialState: IOrderState = {
  orderData: null,
  orderRequest: false,
  orderFailed: false,
  error: null
};

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrderData: (state) => {
      state.orderData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(postOrder.pending, (state) => {
        state.orderRequest = true;
        state.orderFailed = false;
        state.error = null;
      })
      .addCase(postOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderData = action.payload;
      })
      .addCase(postOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.orderFailed = true;
        state.error = action.error.message || 'Ошибка оформления заказа';
      });
  }
});

export const { clearOrderData } = orderSlice.actions;
export default orderSlice.reducer;