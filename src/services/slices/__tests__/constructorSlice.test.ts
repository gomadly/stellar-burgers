import constructorReducer, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  resetConstructor,
  orderBurger,
} from '../constructorSlice';

jest.mock('uuid', () => ({
  v4: () => 'mocked-uuid',
}));

const mockIngredient = {
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
};

describe('constructorSlice', () => {
  const initialState = {
    bun: null,
    ingredients: [],
    orderRequest: false,
    orderModalData: null,
  };

  it('должен вернуть начальное состояние при UNKNOWN action', () => {
    const state = constructorReducer(undefined, { type: 'UNKNOWN' });
    expect(state).toEqual(initialState);
  });

  it('должен добавить ингредиент типа bun (через prepare с uuid)', () => {
    const state = constructorReducer(initialState, addIngredient(mockIngredient));
    expect(state.bun).not.toBeNull();
    expect(state.bun?.name).toBe('Булка');
    expect(state.bun?.id).toBe('mocked-uuid');
  });

  it('должен добавить ингредиент в массив ingredients', () => {
    const mainIngredient = { ...mockIngredient, type: 'main', _id: '2' };
    const state = constructorReducer(initialState, addIngredient(mainIngredient));
    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0].name).toBe('Булка');
    expect(state.ingredients[0].id).toBe('mocked-uuid');
  });

  it('должен удалить ингредиент по id', () => {
    const stateWithIngredient = {
      ...initialState,
      ingredients: [{ ...mockIngredient, id: 'test-id' }],
    };
    const state = constructorReducer(stateWithIngredient, removeIngredient('test-id'));
    expect(state.ingredients).toHaveLength(0);
  });

  it('должен переместить ингредиент вверх', () => {
    const ing1 = { ...mockIngredient, id: '1' };
    const ing2 = { ...mockIngredient, id: '2', _id: '2' };
    const stateWithIngredients = {
      ...initialState,
      ingredients: [ing1, ing2],
    };
    const state = constructorReducer(
      stateWithIngredients,
      moveIngredient({ index: 1, direction: 'up' })
    );
    expect(state.ingredients[0].id).toBe('2');
    expect(state.ingredients[1].id).toBe('1');
  });

  it('должен переместить ингредиент вниз', () => {
    const ing1 = { ...mockIngredient, id: '1' };
    const ing2 = { ...mockIngredient, id: '2', _id: '2' };
    const stateWithIngredients = {
      ...initialState,
      ingredients: [ing1, ing2],
    };
    const state = constructorReducer(
      stateWithIngredients,
      moveIngredient({ index: 0, direction: 'down' })
    );
    expect(state.ingredients[0].id).toBe('2');
    expect(state.ingredients[1].id).toBe('1');
  });

  it('должен сбросить конструктор', () => {
    const stateWithBun = {
      ...initialState,
      bun: { ...mockIngredient, id: 'bun-id' },
      ingredients: [{ ...mockIngredient, id: 'ing-id' }],
    };
    const state = constructorReducer(stateWithBun, resetConstructor());
    expect(state.bun).toBeNull();
    expect(state.ingredients).toHaveLength(0);
  });

  it('должен обработать orderBurger.pending', () => {
    const state = constructorReducer(initialState, {
      type: orderBurger.pending.type,
    });
    expect(state.orderRequest).toBe(true);
  });

  it('должен обработать orderBurger.fulfilled', () => {
    const mockOrder = {
      _id: 'order1',
      number: 123,
      name: 'Order',
      status: 'done',
      createdAt: '',
      updatedAt: '',
      ingredients: [],
    };
    const stateWithRequest = { ...initialState, orderRequest: true };
    const state = constructorReducer(stateWithRequest, {
      type: orderBurger.fulfilled.type,
      payload: mockOrder,
    });
    expect(state.orderRequest).toBe(false);
    expect(state.orderModalData).toEqual(mockOrder);
    expect(state.bun).toBeNull();
    expect(state.ingredients).toHaveLength(0);
  });

  it('должен обработать orderBurger.rejected', () => {
    const stateWithRequest = { ...initialState, orderRequest: true };
    const state = constructorReducer(stateWithRequest, {
      type: orderBurger.rejected.type,
    });
    expect(state.orderRequest).toBe(false);
  });
});
