import {
  createApi,
  FetchArgs,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:4000/api/auth",
  credentials: "include",
});

const getCookie = (name: string) => {
  if (typeof document === "undefined") return null; // SSR 방지
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) return parts.pop()?.split(";").shift() ?? null;
  return null;
};

const baseQueryWithAuth: typeof baseQuery = async (
  args: string | FetchArgs,
  api: any,
  extraOptions: any
) => {
  const token = getCookie("minitoken");

  let modifiedArgs = args;

  // args가 string일 수도 있음 → 객체 형태로 변환
  if (typeof args === "string") {
    modifiedArgs = { url: args, headers: {} };
  }

  // Authorization 헤더 추가
  if (typeof modifiedArgs === "object") {
    modifiedArgs.headers = {
      ...modifiedArgs.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  const result = await baseQuery(modifiedArgs, api, extraOptions);
  return result;
};

export const AuthApiSlice = createApi({
  reducerPath: "AuthApiSlice",
  baseQuery: baseQueryWithAuth,
  endpoints: (builder) => ({
    // 유저 조회
    fetchAuth: builder.query<void, void>({
      query: () => "/me",
    }),

    // 유저 로그인
    fetchLogin: builder.mutation({
      query: (body: { email: string; password: string }) => ({
        method: "post",
        url: "/login",
        body,
      }),
    }),

    // 유저 로그아웃
    fetchLogout: builder.mutation({
      query: () => ({
        method: "post",
        url: "/logout",
      }),
    }),
  }),
});

export const {
  useFetchAuthQuery,
  useFetchLoginMutation,
  useLazyFetchAuthQuery,
  useFetchLogoutMutation,
} = AuthApiSlice;
