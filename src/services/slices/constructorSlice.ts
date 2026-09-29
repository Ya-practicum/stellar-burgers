import { createSlice, nanoid } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { TConstructorIngredient, TIngredient } from '../../utils/types';

interface IConstructorState {
  bun: TConstructorIngredient | null;
  constructorIngredients: TConstructorIngredient[];
}

const initialState: IConstructorState = {
  bun: null,
  constructorIngredients: []
};

export const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.bun = action.payload;
        } else {
          state.constructorIngredients.push(action.payload);
        }
      },
      prepare: (ingredient: TIngredient) => {
        const id = nanoid();
        return { payload: { ...ingredient, id } };
      }
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.constructorIngredients = state.constructorIngredients.filter(
        (item) => item.id !== action.payload
      );
    },
    moveIngredient: (
      state,
      action: PayloadAction<{ index: number; step: number }>
    ) => {
      const { index, step } = action.payload;
      const targetIndex = index + step;
      if (
        targetIndex < 0 ||
        targetIndex >= state.constructorIngredients.length
      ) {
        return;
      }
      const item = state.constructorIngredients[index];
      state.constructorIngredients.splice(index, 1);
      state.constructorIngredients.splice(targetIndex, 0, item);
    },
    clearConstructor: (state) => {
      state.bun = null;
      state.constructorIngredients = [];
    }
  }
});

export const {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} = constructorSlice.actions;

export default constructorSlice.reducer;