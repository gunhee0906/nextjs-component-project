import { configureStore } from "@reduxjs/toolkit";
import { AuthApiSlice } from "./api/auth/authSlice";
import userSlice from "./store/userStore";

export const store = configureStore({
  reducer: {
    user: userSlice,
    [AuthApiSlice.reducerPath]: AuthApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(AuthApiSlice.middleware),
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
