import { configureStore } from '@reduxjs/toolkit';
import reducer from './Reducer';

const store = configureStore({
  reducer,
  devTools: import.meta.env.DEV,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

