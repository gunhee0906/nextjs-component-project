import { configureStore } from "@reduxjs/toolkit";
import { AuthApiSlice } from "./api/auth/authSlice";
import userSlice from "./store/userStore";
import { AiChatApiSlice } from "./api/ai-chat/aiChatSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    [AuthApiSlice.reducerPath]: AuthApiSlice.reducer,
    [AiChatApiSlice.reducerPath]: AiChatApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      AuthApiSlice.middleware,
      AiChatApiSlice.middleware
    ),
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
