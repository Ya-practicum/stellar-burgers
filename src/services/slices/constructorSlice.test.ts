import constructorReducer, {
  addIngredient,
  clearConstructor,
  moveIngredient,
  removeIngredient,
} from './constructorSlice';

import type { TConstructorIngredient, TIngredient } from '../../utils/types';

const bun: TIngredient = {
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

const filling: TIngredient = {
  ...bun,
  _id: 'main-1',
  name: 'Биокотлета из марсианской Магнолии',
  type: 'main',
};

const makeConstructorIngredient = (
  ingredient: TIngredient,
  id: string
): TConstructorIngredient => ({ ...ingredient, id });

describe('редьюсер конструктора бургера', () => {
  it('возвращает начальное состояние для неизвестного действия', () => {
    expect(constructorReducer(undefined, { type: 'UNKNOWN' })).toEqual({
      bun: null,
      constructorIngredients: [],
    });
  });

  it('добавляет булку и заменяет текущую булку', () => {
    const firstBun = makeConstructorIngredient(bun, 'bun-instance-1');
    const secondBun = makeConstructorIngredient(bun, 'bun-instance-2');
    const stateWithBun = constructorReducer(undefined, {
      ...addIngredient(bun),
      payload: firstBun,
    });

    expect(
      constructorReducer(stateWithBun, {
        ...addIngredient(bun),
        payload: secondBun,
      })
    ).toEqual({ bun: secondBun, constructorIngredients: [] });
  });

  it('добавляет начинку в ингредиенты конструктора', () => {
    const fillingInstance = makeConstructorIngredient(filling, 'filling-1');

    expect(
      constructorReducer(undefined, {
        ...addIngredient(filling),
        payload: fillingInstance,
      })
    ).toEqual({ bun: null, constructorIngredients: [fillingInstance] });
  });

  it('удаляет ингредиент с указанным идентификатором', () => {
    const first = makeConstructorIngredient(filling, 'filling-1');
    const second = makeConstructorIngredient(filling, 'filling-2');
    const state = { bun: null, constructorIngredients: [first, second] };

    expect(constructorReducer(state, removeIngredient('filling-1'))).toEqual({
      bun: null,
      constructorIngredients: [second],
    });
  });

  it('перемещает ингредиент на указанную позицию', () => {
    const first = makeConstructorIngredient(filling, 'filling-1');
    const second = makeConstructorIngredient(filling, 'filling-2');
    const state = { bun: null, constructorIngredients: [first, second] };

    expect(constructorReducer(state, moveIngredient({ index: 0, step: 1 }))).toEqual({
      bun: null,
      constructorIngredients: [second, first],
    });
  });

  it('не перемещает ингредиент за пределы списка конструктора', () => {
    const onlyIngredient = makeConstructorIngredient(filling, 'filling-1');
    const state = { bun: null, constructorIngredients: [onlyIngredient] };

    expect(constructorReducer(state, moveIngredient({ index: 0, step: -1 }))).toEqual(
      state
    );
  });

  it('очищает булку и все ингредиенты конструктора', () => {
    const state = {
      bun: makeConstructorIngredient(bun, 'bun-instance'),
      constructorIngredients: [makeConstructorIngredient(filling, 'filling-1')],
    };

    expect(constructorReducer(state, clearConstructor())).toEqual({
      bun: null,
      constructorIngredients: [],
    });
  });
});
