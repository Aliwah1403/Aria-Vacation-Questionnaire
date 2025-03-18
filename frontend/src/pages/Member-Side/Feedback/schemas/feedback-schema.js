import * as z from "zod";

export const feedbackSchema = z.object({
  answers: z.array(
    z.object({
      questionId: z.number(),
      answer: z.string().min(1, "Please provide an answer before continuing"),
    })
  ),
});
