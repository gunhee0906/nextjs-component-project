import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthApiSlice } from "../api/auth/authSlice";

export interface UserState {
  email: string;
  name: string;
}

const initialState: UserState = {
  email: "",
  name: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  // 임의의 API 통신이 발생했을 경우 , 콜백함수 지정 영역
  extraReducers: (builder) => {
    builder
      // 임의의 Api 통신이 성공했을 경우 , 실행
      // 유저 정보를 호출하는 API 통신이 성공했을 경우 -> Store 에 유저정보 저장
      .addMatcher(
        AuthApiSlice.endpoints.fetchAuth.matchFulfilled,
        (state, action: PayloadAction<any>) => {
          state.email = action.payload.email;
          state.name = action.payload.name;
        }
      );
  },
});

export default userSlice.reducer;
