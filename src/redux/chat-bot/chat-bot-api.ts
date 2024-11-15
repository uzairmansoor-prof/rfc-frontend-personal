import { apiSlice } from "..";

const baseUrl = `chat-messages`;

const chatBotApi = apiSlice
  .enhanceEndpoints({
    addTagTypes: ["ChatBot"],
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      chatBotConversation: builder.mutation<
        any,
        { body: any; currentText: string }
      >({
        query: ({ body, currentText }) => ({
          url: `${baseUrl}/?query=${currentText}`,
          method: "POST",
          body,
        }),
        invalidatesTags: [{ type: "ChatBot", id: "chatBot" }],
      }),
    }),
  });

export const { useChatBotConversationMutation } = chatBotApi;
