import { Conversation, ExpertName } from "@/types";
import { Coach, CoachingOptions } from "@/utils/consts/Options";
import { PollyClient, SynthesizeSpeechCommand } from "@aws-sdk/client-polly";
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
  lastTwoMsg: Conversation[]
) => {
  const option = CoachingOptions.find(
    (coach) => coach.name === CoachingOption?.name
  );

  const prompt = option?.prompt.replace("{user_topic}", topic);
  const completion = await openai.chat.completions.create({
    model: "meta-llama/llama-3.3-8b-instruct:free",
    messages: [{ role: "assistant", content: prompt }, ...lastTwoMsg],
  });
  return completion.choices[0].message;
};

export const GenerateFeedbackAndNotes = async (
  CoachingOption: string,
  conversation: Conversation[]
) => {
  const option = CoachingOptions.find((coach) => coach.name === CoachingOption);

  const prompt = option?.summeryPrompt;
  debugger;
  const completion = await openai.chat.completions.create({
    model: "meta-llama/llama-3.3-8b-instruct:free",
    messages: [...conversation, { role: "assistant", content: prompt }],
  });
  return completion.choices[0].message;
};

export const convertTextToSpeech = async (
  text: string,
  expertName: ExpertName
) => {
  const pollyClient = new PollyClient({
    region: "eu-north-1",
    credentials: {
      accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY!,
      secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_TOKEN!,
    },
  });

  const command = new SynthesizeSpeechCommand({
    Text: text,
    OutputFormat: "mp3",
    VoiceId: expertName,
  });
  try {
    const { AudioStream } = await pollyClient.send(command);
    const audioArrayBuffer = await AudioStream?.transformToByteArray()!;
    const audioBlob = new Blob([audioArrayBuffer], { type: "mp3" });
    const audioUrl = URL.createObjectURL(audioBlob);
    return audioUrl;
  } catch (e) {
    console.log(e);
  }
};
