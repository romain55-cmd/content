// Mock implementation of entities
const mockEntity = {
  filter: async () => {
    console.log('[Mock API] filter called');
    return Promise.resolve([]);
  },
  list: async () => {
    console.log('[Mock API] list called');
    return Promise.resolve([]);
  },
  update: async (id, data) => {
    console.log(`[Mock API] update called for id ${id} with data`, data);
    return Promise.resolve({});
  },
  create: async (data) => {
    console.log('[Mock API] create called with data', data);
    return Promise.resolve(data);
  },
};

export const UserProfile = mockEntity;
export const Content = mockEntity;
export const ContentIdea = mockEntity;

// Mock auth object
export const User = {
  me: async () => {
    console.log('[Mock API] auth.get called');
    return Promise.resolve({
      email: 'mock.user@example.com',
      name: 'Mock User',
      // Add other user properties needed by the app
    });
  }
};