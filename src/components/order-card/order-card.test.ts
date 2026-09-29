import { getOrderInfo } from './order-card';

describe('getOrderInfo', () => {
  it('builds order data from ingredients list', () => {
    const order = {
      _id: '1',
      status: 'done',
      name: 'Бургер',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
      number: 123,
      ingredients: ['bun-1', 'sauce-1', 'main-1']
    };

    const ingredients = [
      {
        _id: 'bun-1',
        name: 'Булка',
        type: 'bun',
        proteins: 1,
        fat: 1,
        carbohydrates: 2,
        calories: 10,
        price: 100,
        image: 'bun.png',
        image_large: 'bun-large.png',
        image_mobile: 'bun-mobile.png'
      },
      {
        _id: 'sauce-1',
        name: 'Соус',
        type: 'sauce',
        proteins: 2,
        fat: 3,
        carbohydrates: 4,
        calories: 20,
        price: 30,
        image: 'sauce.png',
        image_large: 'sauce-large.png',
        image_mobile: 'sauce-mobile.png'
      },
      {
        _id: 'main-1',
        name: 'Котлета',
        type: 'main',
        proteins: 5,
        fat: 6,
        carbohydrates: 7,
        calories: 40,
        price: 80,
        image: 'main.png',
        image_large: 'main-large.png',
        image_mobile: 'main-mobile.png'
      }
    ];

    const result = getOrderInfo(order, ingredients);

    expect(result).not.toBeNull();
    expect(result?.ingredientsInfo).toHaveLength(3);
    expect(result?.total).toBe(210);
    expect(result?.remains).toBe(0);
  });
});
