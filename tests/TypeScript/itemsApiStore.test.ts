import { setupServer } from 'msw/node';
import { rest } from 'msw';
import { renderHook } from '@testing-library/react-hooks';
import {
  useFindAllItemsQuery,
  useFindItemByIdQuery,
  useFindItemsByUserQuery,
  useFindItemByUserQuery,
  useCreateItemMutation,
  useUpdateItemMutation,
  useDeleteItemMutation,
} from './itemsApi'; // Adjust the import path as necessary
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { itemsApi } from './itemsApi'; // Adjust the import path as necessary

// Mock server setup
const server = setupServer(
  rest.get('http://localhost:3000/api/v1/items', (req, res, ctx) => {
    return res(ctx.json([{ _id: '1', name: 'Item 1' }]));
  }),
  rest.get('http://localhost:3000/api/v1/items/:itemId', (req, res, ctx) => {
    const { itemId } = req.params;
    if (itemId === '1') {
      return res(ctx.json({ _id: '1', name: 'Item 1' }));
    } else {
      return res(ctx.status(404));
    }
  }),
  rest.post('http://localhost:3000/api/v1/items', (req, res, ctx) => {
    return res(ctx.status(201), ctx.json({ _id: '2', ...req.body }));
  }),
  rest.post('http://localhost:3000/api/v1/items/:itemId', (req, res, ctx) => {
    const { itemId } = req.params;
    if (itemId === '1') {
      return res(ctx.json({ _id: '1', ...req.body }));
    } else {
      return res(ctx.status(404));
    }
  }),
  rest.delete('http://localhost:3000/api/v1/items/:itemId', (req, res, ctx) => {
    const { itemId } = req.params;
    if (itemId === '1') {
      return res(ctx.json('Item deleted'));
    } else {
      return res(ctx.status(404));
    }
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const store = configureStore({
  reducer: {
    [itemsApi.reducerPath]: itemsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(itemsApi.middleware),
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <Provider store={store}>{children}</Provider>
);

describe('itemsApi', () => {
  test('useFindAllItemsQuery - should fetch all items successfully', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useFindAllItemsQuery(), { wrapper });

    await waitForNextUpdate();

    expect(result.current.data).toEqual([{ _id: '1', name: 'Item 1' }]);
    expect(result.current.isError).toBeFalsy();
  });

  test('useFindItemByIdQuery - should fetch item by ID successfully', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useFindItemByIdQuery('1'), { wrapper });

    await waitForNextUpdate();

    expect(result.current.data).toEqual({ _id: '1', name: 'Item 1' });
    expect(result.current.isError).toBeFalsy();
  });

  test('useFindItemByIdQuery - should handle item not found', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useFindItemByIdQuery('999'), { wrapper });

    await waitForNextUpdate();

    expect(result.current.error).toBeDefined();
  });

  test('useCreateItemMutation - should create a new item successfully', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useCreateItemMutation(), { wrapper });

    const [createItem] = result.current;

    createItem({ name: 'New Item' });

    await waitForNextUpdate();

    expect(result.current[1].data).toEqual({ _id: '2', name: 'New Item' });
  });

  test('useUpdateItemMutation - should update an existing item successfully', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useUpdateItemMutation(), { wrapper });

    const [updateItem] = result.current;

    updateItem({ itemId: '1', body: { name: 'Updated Item' } });

    await waitForNextUpdate();

    expect(result.current[1].data).toEqual({ _id: '1', name: 'Updated Item' });
  });

  test('useDeleteItemMutation - should delete an item successfully', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useDeleteItemMutation(), { wrapper });

    const [deleteItem] = result.current;

    deleteItem('1');

    await waitForNextUpdate();

    expect(result.current[1].data).toEqual('Item deleted');
  });

  test('useDeleteItemMutation - should handle item not found for deletion', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useDeleteItemMutation(), { wrapper });

    const [deleteItem] = result.current;

    deleteItem('999');

    await waitForNextUpdate();

    expect(result.current[1].error).toBeDefined();
  });
});