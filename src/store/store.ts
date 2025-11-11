import { configureStore } from "@reduxjs/toolkit";
import { AuthApiSlice } from "./api/auth/authSlice";

export const store = configureStore({
  reducer: {
    [AuthApiSlice.reducerPath]: AuthApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(AuthApiSlice.middleware),
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
