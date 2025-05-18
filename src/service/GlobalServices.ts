import { Coach, CoachingOptions } from "@/utils/consts/Options";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.NEXT_PUBLIC_OPEN_ROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3000",
    "X-Title": "My App",
  },
  dangerouslyAllowBrowser: true,
});

export const AIModel = async (
  topic: string,
  CoachingOption: Coach | null,
  msg: string
) => {
  const option = CoachingOptions.find(
    (coach) => coach.name === CoachingOption?.name
  );

  const prompt = option?.prompt.replace("{user_topic}", topic);
  const completion = await openai.chat.completions.create({
    model: "meta-llama/llama-3.3-8b-instruct:free",
    messages: [
      { role: "assistant", content: prompt },
      { role: "user", content: msg },
    ],
  });
  return completion.choices[0].message;
};
