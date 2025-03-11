import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: {
    // 在这里添加你的reducers
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;