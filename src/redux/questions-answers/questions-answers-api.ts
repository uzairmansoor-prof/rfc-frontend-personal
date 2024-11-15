import { apiSlice } from "..";
import { QuestionAnswerPayloadI } from "./questions-answers-types";
const baseUrl = `/questions-answers`;

const questionAnswerApi = apiSlice
  .injectEndpoints({
    endpoints: (builder) => ({
      questionAnswerListing: builder.query<QuestionAnswerPayloadI, string>({
        providesTags: [{ type: "QuestionsAnswers", id: "questionAnswers" }],
        query: (params) => ({
          url: `${baseUrl}/${params}`,
          method: "Get",
        }),
      }),
      addQuestionAnswer: builder.mutation<
        QuestionAnswerPayloadI,
        QuestionAnswerPayloadI
      >({
        query: (body) => ({
          url: `${baseUrl}`,
          method: "Post",
          body,
        }),
        invalidatesTags: (response) =>
          response?._id
            ? [{ type: "QuestionsAnswers", id: "questionAnswer" }]
            : [],
      }),
      updateQuestionAnswer: builder.mutation<
        any,
        { payload: QuestionAnswerPayloadI; projectId: string }
      >({
        query: (body) => ({
          url: `${baseUrl}/${body.projectId}`,
          method: "Put",
          body: body.payload,
        }),
        invalidatesTags: (response) =>
          response?.ok
            ? [{ type: "QuestionsAnswers", id: "questionAnswer" }]
            : [],
      }),
    }),
  })

  .enhanceEndpoints({
    addTagTypes: ["QuestionsAnswers"],
  });

export const {
  useAddQuestionAnswerMutation,
  useUpdateQuestionAnswerMutation,
  useLazyQuestionAnswerListingQuery,
  useQuestionAnswerListingQuery,
} = questionAnswerApi;
