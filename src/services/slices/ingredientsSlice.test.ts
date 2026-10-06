import ingredientsReducer, { fetchIngredients } from './ingredientsSlice';

import type { TIngredient } from '../../utils/types';

const ingredient: TIngredient = {
  _id: 'bun-1',
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: 'bun.png',
  image_large: 'bun-large.png',
  image_mobile: 'bun-mobile.png',
};

describe('редьюсер ингредиентов', () => {
  it('возвращает начальное состояние для неизвестного действия', () => {
    expect(ingredientsReducer(undefined, { type: 'UNKNOWN' })).toEqual({
      ingredients: [],
      loading: false,
      error: null,
    });
  });

  it('включает загрузку и очищает предыдущую ошибку при начале запроса', () => {
    const previousState = {
      ingredients: [ingredient],
      loading: false,
      error: 'Previous error',
    };

    expect(
      ingredientsReducer(previousState, fetchIngredients.pending('request-1'))
    ).toEqual({
      ingredients: [ingredient],
      loading: true,
      error: null,
    });
  });

  it('сохраняет полученные ингредиенты при успешной загрузке', () => {
    expect(
      ingredientsReducer(
        undefined,
        fetchIngredients.fulfilled([ingredient], 'request-1')
      )
    ).toEqual({
      ingredients: [ingredient],
      loading: false,
      error: null,
    });
  });

  it('сохраняет ошибку при неудачной загрузке', () => {
    expect(
      ingredientsReducer(
        undefined,
        fetchIngredients.rejected(new Error('Network error'), 'request-1')
      )
    ).toEqual({
      ingredients: [],
      loading: false,
      error: 'Network error',
    });
  });
});
