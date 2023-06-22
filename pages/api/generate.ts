// const { Configuration, OpenAIApi } = require("openai");

// const configuration = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// const openai = new OpenAIApi(configuration);

// export default async (req:any, res:any) => {


//     // const { prompt } = (await req.json()) as {
//     //     prompt?: string;
//     //   };
// console.log(req.body)
// const prompt = req.body.prompt;

//  if (!prompt) {
//     res.status(400).send("No prompt in the request");
//     // return new Response("No prompt in the request", {status: 400})
//   }


//   if (req.body.prompt !== undefined) {
//     const completion = await openai.createChatCompletion({
//         model: "gpt-3.5-turbo",
//         messages: [
//           { role: "system", content: "You are a elementary school teacher. You are to only provide feedback on the student's answer. If it is not relevant and does not answer the question, make sure to say that. Do not be overly verbose and focus on the student's response. Be sure to provide a prefix word if the answer is correct or incorrect" },
//           { role: "user", content: `${req.body.prompt}` }
//         ],
//         max_tokens: 50,
//         n: 1,
//         stop: null,
//         temperature: 1,
//       });
//     console.log(completion.data.choices[0].message.content)
//     // res.status(200).json({ text: `${completion.data.choices[0].text}` });
//     res.status(200).send(`${completion.data.choices[0].message.content}`);

//   } else {
//     res.status(400).json({ text: "No prompt provided." });
//   }
// };


import { OpenAIStream, OpenAIStreamPayload } from "@/utils/OpenAIStream";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing env var from OpenAI");
}

export const config = {
  runtime: "edge",
};

const handler = async (req: Request): Promise<Response> => {
  const { prompt } = (await req.json()) as {
    prompt?: string;
  };

  if (!prompt) {
    return new Response("No prompt in the request", { status: 400 });
  }

  const payload: OpenAIStreamPayload = {
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "You are a elementary school teacher. You are to only provide feedback on the student's answer. If it is not relevant and does not answer the question, make sure to say that. Do not be overly verbose and focus on the student's response. Be sure to provide a prefix word if the answer is correct or incorrect",
      },
      { role: "user", content: prompt },
    ],
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 450,
    stream: true,
    n: 1,
  };

  const stream = await OpenAIStream(payload);
  return new Response(stream);
};

export default handler;