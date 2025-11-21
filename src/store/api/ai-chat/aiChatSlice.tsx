import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:4000/api/ai-chat",
  credentials: "include",
});

export const AiChatApiSlice = createApi({
  reducerPath: "AiChatApiSlice",
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    // 채팅 세션 생성
    fetchNewAiChat: builder.mutation({
      query: (body: { title: string }) => ({
        method: "post",
        url: "/new-session",
        body,
      }),
    }),

    // 채팅 히스토리 목록 가져오기
    fetchAiChatHistoryList: builder.query<{ history: ChatHistory[] }, void>({
      query: () => ({
        method: "get",
        url: `/get-ai-chat-hisotry-list`,
      }),
    }),

    // 채팅 내용 가져오기
    fetchAiChatContent: builder.query({
      query: (params: { conversation: any }) => ({
        method: "get",
        url: `/get-ai-chat-content?conversation=${params.conversation}`,
      }),
    }),
  }),
});

export const {
  useFetchNewAiChatMutation,
  useFetchAiChatHistoryListQuery,
  useFetchAiChatContentQuery,
} = AiChatApiSlice;
