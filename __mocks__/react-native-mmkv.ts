export const createMMKV = () => ({
  getString: jest.fn(),
  set: jest.fn(),
  delete: jest.fn(),
  remove: jest.fn(),
  contains: jest.fn(),
  clearAll: jest.fn(),
});
