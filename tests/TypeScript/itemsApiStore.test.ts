```typescript
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
  useDeleteItemMutation
} from './itemsApi';

const server = setupServer(
  rest.get('http://localhost:3000/api/v1/items', (req, res, ctx) => {
    return res(ctx.json([{ _id: '1', name: 'Item 1' }, { _id: '2', name: 'Item 2' }]));
  }),
  rest.get('http://localhost:3000/api/v1/items/:itemId', (req, res, ctx) => {
    const { itemId } = req.params;
    if (itemId === '1') {
      return res(ctx.json({ _id: '1', name: 'Item 1' }));
    } else {
      return res(ctx.status(404));
    }
  }),
  rest.get('http://localhost:3000/api/v1/users/:userId/items', (req, res, ctx) => {
    const { userId } = req.params;
    if (userId === 'user1') {
      return res(ctx.json([{ _id: '1', name: 'User 1 Item 1' }]));
    } else {
      return res(ctx.status(404));
    }
  }),
  rest.get('http://localhost:3000/api/v1/users/:userId/items/:itemId', (req, res, ctx) => {
    const { userId, itemId } = req.params;
    if (userId === 'user1' && itemId === '1') {
      return res(ctx.json({ _id: '1', name: 'User 1 Item 1' }));
    } else {
      return res(ctx.status(404));
    }
  }),
  rest.post('http://localhost:3000/api/v1/items', (req, res, ctx) => {
    return res(ctx.json({ _id: '3', name: 'New Item' }));
  }),
  rest.post('http://localhost:3000/api/v1/items/:itemId', (req, res, ctx) => {
    const { itemId } = req.params;
    if (itemId === '1') {
      return res(ctx.json({ _id: '1', name: 'Updated Item 1' }));
    } else {
      return res(ctx.status(404));
    }
  }),
  rest.delete('http://localhost:3000/api/v1/items/:itemId', (req, res, ctx) => {
    const { itemId } = req.params;
    if (itemId === '1') {
      return res(ctx.json('Deleted'));
    } else {
      return res(ctx.status(404));
    }
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('itemsApi', () => {
  it('should fetch all items successfully', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useFindAllItemsQuery());
    await waitForNextUpdate();
    expect(result.current.data).toEqual([{ _id: '1', name: 'Item 1' }, { _id: '2', name: 'Item 2' }]);
  });

  it('should handle error when fetching all items', async () => {
    server.use(
      rest.get('http://localhost:3000/api/v1/items', (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );
    const { result, waitForNextUpdate } = renderHook(() => useFindAllItemsQuery());
    await waitForNextUpdate();
    expect(result.current.error).toBeDefined();
  });

  it('should fetch item by id successfully', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useFindItemByIdQuery('1'));
    await waitForNextUpdate();
    expect(result.current.data).toEqual({ _id: '1', name: 'Item 1' });
  });

  it('should return error when item by id not found', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useFindItemByIdQuery('999'));
    await waitForNextUpdate();
    expect(result.current.error).toBeDefined();
  });

  it('should fetch items by user successfully', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useFindItemsByUserQuery('user1'));
    await waitForNextUpdate();
    expect(result.current.data).toEqual([{ _id: '1', name: 'User 1 Item 1' }]);
  });

  it('should return error when user items not found', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useFindItemsByUserQuery('user999'));
    await waitForNextUpdate();
    expect(result.current.error).toBeDefined();
  });

  it('should fetch item by user and item id successfully', async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useFindItemByUserQuery({ userId: 'user1', itemId: '1' })
    );
    await waitForNextUpdate();
    expect(result.current.data).toEqual({ _id: '1', name: 'User 1 Item 1' });
  });

  it('should return error when user item by id not found', async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useFindItemByUserQuery({ userId: 'user1', itemId: '999' })
    );
    await waitForNextUpdate();
    expect(result.current.error).toBeDefined();
  });

  it('should create a new item successfully', async () => {
    const { result, waitFor } = renderHook(() => useCreateItemMutation());
    const [createItem, { data, error }] = result.current;
    createItem({ name: 'New Item' });

    await waitFor(() => data !== undefined || error !== undefined);
    expect(data).toEqual({ _id: '3', name: 'New Item' });
  });

  it('should update an item successfully', async () => {
    const { result, waitFor } = renderHook(() => useUpdateItemMutation());
    const [updateItem, { data, error }] = result.current;
    updateItem({ itemId: '1', body: { name: 'Updated Item 1' } });

    await waitFor(() => data !== undefined || error !== undefined);
    expect(data).toEqual({ _id: '1', name: 'Updated Item 1' });
  });

  it('should return error when updating a non-existent item', async () => {
    const { result, waitFor } =