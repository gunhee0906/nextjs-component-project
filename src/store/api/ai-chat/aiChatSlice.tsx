import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:4000/api/ai-chat",
  credentials: "include",
});

export const AiChatApiSlice = createApi({
  reducerPath: "AiChatApiSlice",
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    // 채팅 세션 생성
    fetchNewAiChat: builder.mutation({
      query: (body: { content: string }) => ({
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
    fetchAiChatContent: builder.query<any, any>({
      query: (params: { conversation: any }) => ({
        method: "get",
        url: `/get-ai-chat-content?conversation=${params.conversation}`,
      }),
    }),

    // 채팅 세션 삭제
    fetchDeleteAiChat: builder.mutation({
      query: (body: { conversation: string }) => ({
        method: "post",
        url: "/del-ai-chat-session",
        body,
      }),
    }),
  }),
});

export const {
  useFetchNewAiChatMutation,
  useFetchAiChatHistoryListQuery,
  useLazyFetchAiChatHistoryListQuery,
  useFetchAiChatContentQuery,
  useLazyFetchAiChatContentQuery,
  useFetchDeleteAiChatMutation,
} = AiChatApiSlice;
