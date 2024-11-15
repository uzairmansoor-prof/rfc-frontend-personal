export interface QuestionsAnswersI {
  question: string;
  answer: string;
  customPrompt?: string;
  markReviewed: boolean;
  markCompleted: boolean;
  sheetName: string;
  project: string;

  answerScore: number;
  scoreContext: any;
}

export type QuestionAnswerPayloadI = Record<string, QuestionsAnswersI[]>;
