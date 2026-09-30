import ingredientsReducer, { fetchIngredients } from '../ingredientsSlice';
const mockIngredients = [
  {
    _id: '1',
    name: 'Булка',
    type: 'bun',
    proteins: 10,
    fat: 5,
    carbohydrates: 20,
    calories: 100,
    price: 50,
    image: 'image.jpg',
    image_large: 'image_large.jpg',
    image_mobile: 'image_mobile.jpg',
  },
];

describe('ingredientsSlice', () => {
  const initialState = {
    ingredients: [],
    loading: false,
    error: null,
  };

  it('должен вернуть начальное состояние при UNKNOWN action', () => {
    const state = ingredientsReducer(undefined, { type: 'UNKNOWN' });
    expect(state).toEqual(initialState);
  });

  it('должен обработать fetchIngredients.pending', () => {
    const state = ingredientsReducer(initialState, {
      type: fetchIngredients.pending.type,
    });
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('должен обработать fetchIngredients.fulfilled', () => {
    const state = ingredientsReducer(initialState, {
      type: fetchIngredients.fulfilled.type,
      payload: mockIngredients,
    });
    expect(state.loading).toBe(false);
    expect(state.ingredients).toEqual(mockIngredients);
  });

  it('должен обработать fetchIngredients.rejected', () => {
    const state = ingredientsReducer(initialState, {
      type: fetchIngredients.rejected.type,
      error: { message: 'Ошибка загрузки' },
    });
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Ошибка загрузки');
  });
});
