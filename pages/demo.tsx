import { AnimatePresence, motion } from "framer-motion";
import { RadioGroup } from "@headlessui/react";
import { v4 as uuid } from "uuid";
import Link from "next/link";
import { useRef, useState, useEffect, useCallback } from "react";
// import Webcam from "react-webcam";
// import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

const questions = [
  {
    id: 1,
    name: "Puzzles",
    description: "Answers puzzles",
    difficulty: "Easy",
  },
  {
    id: 2,
    name: "Math",
    description: "Answer math questions based on your grade",
    difficulty: "Medium",
  },
];

const topics = [
  {
    id: "algebra",
    name: "Algebra",
    description: "questions related to algebra",
    level: "L5",
  },
  {
    id: "geometry",
    name: "Geometry",
    description: "Geometry and shapes",
    level: "L7",
  },
];

// const ffmpeg = createFFmpeg({
//   // corePath: `http://localhost:3000/ffmpeg/dist/ffmpeg-core.js`,
//   // I've included a default import above (and files in the public directory), but you can also use a CDN like this:
//   corePath: "https://unpkg.com/@ffmpeg/core@0.11.0/dist/ffmpeg-core.js",
//   log: true,
// });

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function DemoPage() {
  const [selected, setSelected] = useState(questions[0]);
  const [selectedTopic, setselectedTopic] = useState(
    topics[0]
  );
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  // const webcamRef = useRef<Webcam | null>(null);
  // const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [capturing, setCapturing] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [seconds, setSeconds] = useState(150);
  const [videoEnded, setVideoEnded] = useState(false);
  const [recordingPermission, setRecordingPermission] = useState(true);
  const [cameraLoaded, setCameraLoaded] = useState(false);
  const vidRef = useRef<HTMLVideoElement>(null);
  const [isSubmitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState("Processing");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isDesktop, setIsDesktop] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const [thisanswer, setAnswer] = useState("");
  const [isSending, setIsSending] = useState(false)
  const [generatedFeedback, setGeneratedFeedback] = useState("");
  const [generatedQuestion, setGeneratedQuestion] = useState("");
  

  useEffect(() => {
    setIsDesktop(window.innerWidth >= 768);
  }, []);


  const sendRequest = useCallback(() => {

    if (isSending) return

    setIsSending(true)
    setAnswerSubmitted(true)
    // setAnswer("")
    console.log("setting answer submit")
    
    // console.log(answer);
    if (thisanswer) {
      // setAnswer(answer)
      answerQuestion();
    }

    if (answerSubmitted) {
      console.log("answer.....")
      console.log(thisanswer)
      // answerQuestion
    } 
    setIsSending(false)
    // setAnswerSubmitted(false)
  }, [isSending, answerSubmitted, setAnswer]);

  const xsendRequest = useCallback(() => {

    if (isSending) return

    setIsSending(true)
    setAnswerSubmitted(true)
    // setAnswer("")
    console.log("setting answer submit")
    
    // console.log(answer);
    if (thisanswer) {
      // setAnswer(answer)
      answerQuestion();
    }

    if (answerSubmitted) {
      console.log("answer.....")
      console.log(thisanswer)
      // answerQuestion
    } 
    setIsSending(false)
    // setAnswerSubmitted(false)
  }, [isSending, answerSubmitted, setAnswer]);


  const generateQuestion = async () => {
      let prompt = "Generate a 5th grade " + selected.name + " question related to " + selectedTopic.name
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
        }),
      });
      if (!response.ok) {

        // throw new Error(response);
        throw ({'message': response})
      }

      // This data is a ReadableStream
      const data = response.body;
    
      if (!data) {
        return;
      }
      const reader = data.getReader();
      const decoder = new TextDecoder();
      let done = false;
      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value); 
        // setGeneratedFeedback((prev: any) => prev + chunkValue);
        if (chunkValue !== '') {
          setGeneratedQuestion(chunkValue);
        }
      }
    }

  const answerQuestion = async () => {

    // var question = "there are 10 bells for $5 each, how many bells can you buy"
    var question  = null
    if (generatedQuestion) {     
      question = generatedQuestion
    }

    const prompt = `Please give feedback on the following question: ${question} given the following answer: ${
      thisanswer
    // }`
    }. ${
      selected.name === "Behavioral"
        ? "Please also give feedback on the candidate's communication skills. Make sure their response is structured (perhaps using the STAR or PAR frameworks)."
        : " Please explain the answer with steps"
    }`;

    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
      }),
    });
    if (!response.ok) {

      // throw new Error(response);
      throw ({'message': response})
    }

    // This data is a ReadableStream
    const data = response.body;
  
    if (!data) {
      return;
    }
    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;
    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value); 
      // setGeneratedFeedback((prev: any) => prev + chunkValue);
      if (chunkValue !== '') {
        setGeneratedFeedback(chunkValue);
      }
    }

  }

  return (
    <AnimatePresence>
      {step === 3 ? (
        <div className="w-full min-h-screen flex flex-col px-4 pt-2 pb-8 md:px-8 md:py-2 bg-[#FCFCFC] relative overflow-x-hidden">

                    <div className="h-full w-full items-center flex flex-col mt-[10vh]">
                <div className="w-full flex flex-col max-w-[1080px] mx-auto justify-center">
                  <h2 className="text-2xl font-semibold text-left text-[#1D2B3A] mb-2">
                    {selected.name === "Calculus"
                      ? "Calculus question"
                      : selectedTopic.name === "Algebra"
                      ? "Algebra question"
                      : selectedTopic.name === "Geometry"
                      ? "Question 1"
                      : "Question 2"}
                  </h2>
                  <span className="text-[14px] leading-[20px] text-[#1a2b3b] font-normal mb-4">
                    {generatedQuestion && (
                      <div className="mt-8 rounded-xl border bg-white p-4 shadow-md transition hover:bg-gray-100">
                        {generatedQuestion}
                    </div>
                    )}

                  </span>
                  <textarea id="answer" name="answer" rows={4} className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Write your answer..." onChange={(e) => setAnswer(e.target.value)}></textarea>


                  <div>
                      <button
                        onClick={sendRequest}
                        className="mt-8 justify-end group rounded-full px-4 py-2 text-[13px] font-semibold transition-all flex items-center justify-center bg-[#1E2B3A] text-white hover:[linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)), #0D2247] no-underline flex gap-x-2  active:scale-95 scale-100 duration-75"
                        style={{
                          boxShadow:
                            "0px 1px 4px rgba(13, 34, 71, 0.17), inset 0px 0px 0px 1px #061530, inset 0px 0px 0px 2px rgba(255, 255, 255, 0.1)",
                        }}
                      >
                        <span> Submit Answer </span>
                        <svg
                          className="w-5 h-5"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M13.75 6.75L19.25 12L13.75 17.25"
                            stroke="#FFF"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M19 12H4.75"
                            stroke="#FFF"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                  {generatedFeedback && (
                  <div className="mt-8 rounded-xl border bg-white p-4 shadow-md transition hover:bg-gray-100">
                    {generatedFeedback}
                  </div>
              )}
                </div>

                <div className="w-full flex flex-col max-w-[1080px] mx-auto justify-center">
              
                  <div className="flex flex-row space-x-4 mt-8 justify-end">
                    <button
                      onClick={() => setStep(1)}
                      className="group max-w-[200px] rounded-full px-4 py-2 text-[13px] font-semibold transition-all flex items-center justify-center bg-[#f5f7f9] text-[#1E2B3A] no-underline active:scale-95 scale-100 duration-75"
                      style={{
                        boxShadow: "0 1px 1px #0c192714, 0 1px 3px #0c192724",
                      }}
                    >
                      Restart
                    </button>
                  </div>
                </div>

            </div>
      
        </div>
      ) : (
        <div className="flex flex-col md:flex-row w-full md:overflow-hidden">
          <div className="w-full min-h-[60vh] md:w-1/2 md:h-screen flex flex-col px-4 pt-2 pb-8 md:px-0 md:py-2 bg-[#FCFCFC] justify-center">
            <div className="h-full w-full items-center justify-center flex flex-col">
              {step === 1 ? (
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -40 }}
                  key="step-1"
                  transition={{
                    duration: 0.95,
                    ease: [0.165, 0.84, 0.44, 1],
                  }}
                  className="max-w-lg mx-auto px-4 lg:px-0"
                >
                  <h2 className="text-4xl font-bold text-[#1E2B3A]">
                    Select a question type
                  </h2>
                  <p className="text-[14px] leading-[20px] text-[#1a2b3b] font-normal my-4">
                    There are 100s of questions to challenge you. Choose a type to get started.
                  </p>
                  <div>
                    <RadioGroup value={selected} onChange={setSelected}>
                      <RadioGroup.Label className="sr-only">
                        Server size
                      </RadioGroup.Label>
                      <div className="space-y-4">
                        {questions.map((question) => (
                          <RadioGroup.Option
                            key={question.name}
                            value={question}
                            className={({ checked, active }) =>
                              classNames(
                                checked
                                  ? "border-transparent"
                                  : "border-gray-300",
                                active
                                  ? "border-blue-500 ring-2 ring-blue-200"
                                  : "",
                                "relative cursor-pointer rounded-lg border bg-white px-6 py-4 shadow-sm focus:outline-none flex justify-between"
                              )
                            }
                          >
                            {({ active, checked }) => (
                              <>
                                <span className="flex items-center">
                                  <span className="flex flex-col text-sm">
                                    <RadioGroup.Label
                                      as="span"
                                      className="font-medium text-gray-900"
                                    >
                                      {question.name}
                                    </RadioGroup.Label>
                                    <RadioGroup.Description
                                      as="span"
                                      className="text-gray-500"
                                    >
                                      <span className="block">
                                        {question.description}
                                      </span>
                                    </RadioGroup.Description>
                                  </span>
                                </span>
                                <RadioGroup.Description
                                  as="span"
                                  className="flex text-sm ml-4 mt-0 flex-col text-right items-center justify-center"
                                >
                                  <span className=" text-gray-500">
                                    {question.difficulty === "Easy" ? (
                                      <svg
                                        className="h-full w-[16px]"
                                        viewBox="0 0 22 25"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <rect
                                          y="13.1309"
                                          width="6"
                                          height="11"
                                          rx="1"
                                          fill="#4E7BBA"
                                        />
                                        <rect
                                          x="8"
                                          y="8.13086"
                                          width="6"
                                          height="16"
                                          rx="1"
                                          fill="#E1E1E1"
                                        />
                                        <rect
                                          x="16"
                                          y="0.130859"
                                          width="6"
                                          height="24"
                                          rx="1"
                                          fill="#E1E1E1"
                                        />
                                      </svg>
                                    ) : (
                                      <svg
                                        className="h-full w-[16px]"
                                        viewBox="0 0 22 25"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <rect
                                          y="13.1309"
                                          width="6"
                                          height="11"
                                          rx="1"
                                          fill="#4E7BBA"
                                        />
                                        <rect
                                          x="8"
                                          y="8.13086"
                                          width="6"
                                          height="16"
                                          rx="1"
                                          fill="#4E7BBA"
                                        />
                                        <rect
                                          x="16"
                                          y="0.130859"
                                          width="6"
                                          height="24"
                                          rx="1"
                                          fill="#E1E1E1"
                                        />
                                      </svg>
                                    )}
                                  </span>
                                  <span className="font-medium text-gray-900">
                                    {question.difficulty}
                                  </span>
                                </RadioGroup.Description>
                                <span
                                  className={classNames(
                                    active ? "border" : "border-2",
                                    checked
                                      ? "border-blue-500"
                                      : "border-transparent",
                                    "pointer-events-none absolute -inset-px rounded-lg"
                                  )}
                                  aria-hidden="true"
                                />
                              </>
                            )}
                          </RadioGroup.Option>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>
                  <div className="flex gap-[15px] justify-end mt-8">
                    <div>
                      <Link
                        href="/"
                        className="group rounded-full px-4 py-2 text-[13px] font-semibold transition-all flex items-center justify-center bg-[#f5f7f9] text-[#1E2B3A] no-underline active:scale-95 scale-100 duration-75"
                        style={{
                          boxShadow: "0 1px 1px #0c192714, 0 1px 3px #0c192724",
                        }}
                      >
                        Back to home
                      </Link>
                    </div>
                    <div>
                      <button
                        onClick={() => {
                          setStep(2);
                        }}
                        className="group rounded-full px-4 py-2 text-[13px] font-semibold transition-all flex items-center justify-center bg-[#1E2B3A] text-white hover:[linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)), #0D2247] no-underline flex gap-x-2  active:scale-95 scale-100 duration-75"
                        style={{
                          boxShadow:
                            "0px 1px 4px rgba(13, 34, 71, 0.17), inset 0px 0px 0px 1px #061530, inset 0px 0px 0px 2px rgba(255, 255, 255, 0.1)",
                        }}
                      >
                        <span> Continue </span>
                        <svg
                          className="w-5 h-5"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M13.75 6.75L19.25 12L13.75 17.25"
                            stroke="#FFF"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M19 12H4.75"
                            stroke="#FFF"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : step === 2 ? (
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -40 }}
                  key="step-2"
                  transition={{
                    duration: 0.95,
                    ease: [0.165, 0.84, 0.44, 1],
                  }}
                  className="max-w-lg mx-auto px-4 lg:px-0"
                >
                  <h2 className="text-4xl font-bold text-[#1E2B3A]">
                    Select a topic
                  </h2>
                  <p className="text-[14px] leading-[20px] text-[#1a2b3b] font-normal my-4">
                    Choose a topic that you would like to test on
                  </p>
                  <div>
                    <RadioGroup
                      value={selectedTopic}
                      onChange={setselectedTopic}
                    >
                      <RadioGroup.Label className="sr-only">
                        Server size
                      </RadioGroup.Label>
                      <div className="space-y-4">
                        {topics.map((topic) => (
                          <RadioGroup.Option
                            key={topic.name}
                            value={topic}
                            className={({ checked, active }) =>
                              classNames(
                                checked
                                  ? "border-transparent"
                                  : "border-gray-300",
                                active
                                  ? "border-blue-500 ring-2 ring-blue-200"
                                  : "",
                                "relative cursor-pointer rounded-lg border bg-white px-6 py-4 shadow-sm focus:outline-none flex justify-between"
                              )
                            }
                          >
                            {({ active, checked }) => (
                              <>
                                <span className="flex items-center">
                                  <span className="flex flex-col text-sm">
                                    <RadioGroup.Label
                                      as="span"
                                      className="font-medium text-gray-900"
                                    >
                                      {topic.name}
                                    </RadioGroup.Label>
                                    <RadioGroup.Description
                                      as="span"
                                      className="text-gray-500"
                                    >
                                      <span className="block">
                                        {topic.description}
                                      </span>
                                    </RadioGroup.Description>
                                  </span>
                                </span>
                                <RadioGroup.Description
                                  as="span"
                                  className="flex text-sm ml-4 mt-0 flex-col text-right items-center justify-center"
                                >
                                  
                              
                                </RadioGroup.Description>
                                <span
                                  className={classNames(
                                    active ? "border" : "border-2",
                                    checked
                                      ? "border-blue-500"
                                      : "border-transparent",
                                    "pointer-events-none absolute -inset-px rounded-lg"
                                  )}
                                  aria-hidden="true"
                                />
                              </>
                            )}
                          </RadioGroup.Option>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>
                  <div className="flex gap-[15px] justify-end mt-8">
                    <div>
                      <button
                        onClick={() => setStep(1)}
                        className="group rounded-full px-4 py-2 text-[13px] font-semibold transition-all flex items-center justify-center bg-[#f5f7f9] text-[#1E2B3A] no-underline active:scale-95 scale-100 duration-75"
                        style={{
                          boxShadow: "0 1px 1px #0c192714, 0 1px 3px #0c192724",
                        }}
                      >
                        Previous step
                      </button>
                    </div>
                    <div>
                      <button
                        onClick={() => {
                          setStep(3);
                          generateQuestion();
                        }}
                        className="group rounded-full px-4 py-2 text-[13px] font-semibold transition-all flex items-center justify-center bg-[#1E2B3A] text-white hover:[linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)), #0D2247] no-underline flex gap-x-2  active:scale-95 scale-100 duration-75"
                        style={{
                          boxShadow:
                            "0px 1px 4px rgba(13, 34, 71, 0.17), inset 0px 0px 0px 1px #061530, inset 0px 0px 0px 2px rgba(255, 255, 255, 0.1)",
                        }}
                      >
                        <span> Continue </span>
                        <svg
                          className="w-5 h-5"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M13.75 6.75L19.25 12L13.75 17.25"
                            stroke="#FFF"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M19 12H4.75"
                            stroke="#FFF"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <p>Step 3</p>
              )}
            </div>
          </div>
          <div className="w-full h-[40vh] md:w-1/2 md:h-screen bg-[#F1F2F4] relative overflow-hidden">
            <svg
              id="texture"
              style={{ filter: "contrast(120%) brightness(120%)" }}
              className="fixed z-[1] w-full h-full opacity-[35%]"
            >
              <filter id="noise" data-v-1d260e0e="">
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency=".8"
                  numOctaves="4"
                  stitchTiles="stitch"
                  data-v-1d260e0e=""
                ></feTurbulence>
                <feColorMatrix
                  type="saturate"
                  values="0"
                  data-v-1d260e0e=""
                ></feColorMatrix>
              </filter>
              <rect
                width="100%"
                height="100%"
                filter="url(#noise)"
                data-v-1d260e0e=""
              ></rect>
            </svg>
            <figure
              className="absolute md:top-1/2 ml-[-380px] md:ml-[0px] md:-mt-[240px] left-1/2 grid transform scale-[0.5] sm:scale-[0.6] md:scale-[130%] w-[760px] h-[540px] bg-[#f5f7f9] text-[9px] origin-[50%_15%] md:origin-[50%_25%] rounded-[15px] overflow-hidden p-2 z-20"
              style={{
                grid: "100%/repeat(1,calc(5px * 28)) 1fr",
                boxShadow:
                  "0 192px 136px rgba(26,43,59,.23),0 70px 50px rgba(26,43,59,.16),0 34px 24px rgba(26,43,59,.13),0 17px 12px rgba(26,43,59,.1),0 7px 5px rgba(26,43,59,.07), 0 50px 100px -20px rgb(50 50 93 / 25%), 0 30px 60px -30px rgb(0 0 0 / 30%), inset 0 -2px 6px 0 rgb(10 37 64 / 35%)",
              }}
            >
              <div className="z-20 absolute h-full w-full bg-transparent cursor-default"></div>
              <div
                className="bg-white flex flex-col text-[#1a2b3b] p-[18px] rounded-lg relative"
                style={{ boxShadow: "inset -1px 0 0 #fff" }}
              >
                <ul className="mb-auto list-none">
                  <li className="list-none flex items-center">
                    <p className="text-[12px] font-extrabold text-[#1E293B]">
                      Quest
                    </p>
                  </li>
                  <li className="mt-4 list-none flex items-center rounded-[9px] text-gray-900 py-[2px]">
                    <svg
                      className="h-4 w-4 text-gray-700"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      {" "}
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M4.75 6.75C4.75 5.64543 5.64543 4.75 6.75 4.75H17.25C18.3546 4.75 19.25 5.64543 19.25 6.75V17.25C19.25 18.3546 18.3546 19.25 17.25 19.25H6.75C5.64543 19.25 4.75 18.3546 4.75 17.25V6.75Z"
                      ></path>{" "}
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M9.75 8.75V19"
                      ></path>{" "}
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M5 8.25H19"
                      ></path>{" "}
                    </svg>
                    <p className="ml-[3px] mr-[6px]">Home</p>
                  </li>
                  <li className="mt-1 list-none flex items-center rounded-[9px] text-gray-900 py-[4px]">
                    <svg
                      fill="none"
                      viewBox="0 0 24 24"
                      className="h-4 w-4 text-gray-700"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M4.75 6.75C4.75 5.64543 5.64543 4.75 6.75 4.75H17.25C18.3546 4.75 19.25 5.64543 19.25 6.75V17.25C19.25 18.3546 18.3546 19.25 17.25 19.25H6.75C5.64543 19.25 4.75 18.3546 4.75 17.25V6.75Z"
                      ></path>
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M15.25 12L9.75 8.75V15.25L15.25 12Z"
                      ></path>
                    </svg>
                    <p className="ml-[3px] mr-[6px]">Questions Vault</p>
                    <div className="ml-auto text-[#121217] transform">
                      <svg
                        width="24"
                        height="24"
                        fill="none"
                        viewBox="0 0 24 24"
                        className="w-3 h-3 stroke-current fill-transparent rotate-180 transform"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M15.25 10.75L12 14.25L8.75 10.75"
                        ></path>
                      </svg>
                    </div>
                  </li>
                  <li className="mt-1 list-none flex items-center rounded-[3px] relative bg-white text-gray-600 w-full m-0 cursor-pointer hover:bg-[#F7F7F8] focus:outline-none py-[4px]">
                    <div className="bg-[#e8e8ed] pointer-events-none absolute left-[7px] z-10 top-1/2 h-[3px] w-[3px] rounded-full transform -translate-y-1/2"></div>
                    <div className="text-gray-600 truncate pr-4 pl-[18px]">
                      All Questions
                    </div>
                    <div className="absolute w-[1px] bg-[#e8e8ed] left-[8px] top-[9px] bottom-0"></div>
                  </li>
                  <li className="list-none flex items-center rounded-[3px] relative bg-white text-gray-600 w-full m-0 cursor-pointer hover:bg-[#F7F7F8] focus:outline-none py-[4px]">
                    <div className="bg-[#e8e8ed] pointer-events-none absolute left-[7px] z-10 top-1/2 h-[3px] w-[3px] rounded-full transform -translate-y-1/2"></div>
                    <div className="text-gray-600 truncate pr-4 pl-[18px]">
                      Completed
                    </div>
                    <div className="absolute w-[1px] bg-[#e8e8ed] left-[8px] top-0 bottom-0"></div>
                  </li>
                  <li className="list-none flex items-center rounded-[3px] relative bg-gray-100 text-gray-600 w-full m-0 cursor-pointer hover:bg-[#F7F7F8] focus:outline-none py-[4px]">
                    <div className="bg-blue-600 pointer-events-none absolute left-[7px] z-10 top-1/2 h-[3px] w-[3px] rounded-full transform -translate-y-1/2"></div>
                    <div className="text-blue-600 truncate pr-4 pl-[18px]">
                      Question Bank
                    </div>
                    <div className="absolute w-[1px] bg-[#e8e8ed] left-[8px] top-0 bottom-[9px]"></div>
                  </li>
                  <li className="mt-1 list-none flex items-center rounded-[9px] text-gray-900 py-[4px]">
                    <svg
                      className="h-4 w-4 text-gray-700"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M4.75 6.75C4.75 5.64543 5.64543 4.75 6.75 4.75H17.25C18.3546 4.75 19.25 5.64543 19.25 6.75V17.25C19.25 18.3546 18.3546 19.25 17.25 19.25H6.75C5.64543 19.25 4.75 18.3546 4.75 17.25V6.75Z"
                      ></path>
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M19 12L5 12"
                      ></path>
                    </svg>
                    <p className="ml-[3px] mr-[6px]">My Questions</p>
                  </li>
                  <li className="mt-1 list-none flex items-center rounded-[9px] text-gray-900 py-[4px]">
                    <svg
                      className="h-4 w-4 text-gray-700"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M19.25 5.75C19.25 5.19772 18.8023 4.75 18.25 4.75H14C12.8954 4.75 12 5.64543 12 6.75V19.25L12.8284 18.4216C13.5786 17.6714 14.596 17.25 15.6569 17.25H18.25C18.8023 17.25 19.25 16.8023 19.25 16.25V5.75Z"
                      ></path>
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M4.75 5.75C4.75 5.19772 5.19772 4.75 5.75 4.75H10C11.1046 4.75 12 5.64543 12 6.75V19.25L11.1716 18.4216C10.4214 17.6714 9.40401 17.25 8.34315 17.25H5.75C5.19772 17.25 4.75 16.8023 4.75 16.25V5.75Z"
                      ></path>
                    </svg>
                    <p className="ml-[3px] mr-[6px]">Resources</p>
                  </li>
                  <li className="mt-1 list-none flex items-center rounded-[9px] text-gray-900 py-[4px]">
                    <svg
                      className="h-4 w-4 text-gray-700"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M13.1191 5.61336C13.0508 5.11856 12.6279 4.75 12.1285 4.75H11.8715C11.3721 4.75 10.9492 5.11856 10.8809 5.61336L10.7938 6.24511C10.7382 6.64815 10.4403 6.96897 10.0622 7.11922C10.006 7.14156 9.95021 7.16484 9.89497 7.18905C9.52217 7.3524 9.08438 7.3384 8.75876 7.09419L8.45119 6.86351C8.05307 6.56492 7.49597 6.60451 7.14408 6.9564L6.95641 7.14408C6.60452 7.49597 6.56492 8.05306 6.86351 8.45118L7.09419 8.75876C7.33841 9.08437 7.3524 9.52216 7.18905 9.89497C7.16484 9.95021 7.14156 10.006 7.11922 10.0622C6.96897 10.4403 6.64815 10.7382 6.24511 10.7938L5.61336 10.8809C5.11856 10.9492 4.75 11.372 4.75 11.8715V12.1285C4.75 12.6279 5.11856 13.0508 5.61336 13.1191L6.24511 13.2062C6.64815 13.2618 6.96897 13.5597 7.11922 13.9378C7.14156 13.994 7.16484 14.0498 7.18905 14.105C7.3524 14.4778 7.3384 14.9156 7.09419 15.2412L6.86351 15.5488C6.56492 15.9469 6.60451 16.504 6.9564 16.8559L7.14408 17.0436C7.49597 17.3955 8.05306 17.4351 8.45118 17.1365L8.75876 16.9058C9.08437 16.6616 9.52216 16.6476 9.89496 16.811C9.95021 16.8352 10.006 16.8584 10.0622 16.8808C10.4403 17.031 10.7382 17.3519 10.7938 17.7549L10.8809 18.3866C10.9492 18.8814 11.3721 19.25 11.8715 19.25H12.1285C12.6279 19.25 13.0508 18.8814 13.1191 18.3866L13.2062 17.7549C13.2618 17.3519 13.5597 17.031 13.9378 16.8808C13.994 16.8584 14.0498 16.8352 14.105 16.8109C14.4778 16.6476 14.9156 16.6616 15.2412 16.9058L15.5488 17.1365C15.9469 17.4351 16.504 17.3955 16.8559 17.0436L17.0436 16.8559C17.3955 16.504 17.4351 15.9469 17.1365 15.5488L16.9058 15.2412C16.6616 14.9156 16.6476 14.4778 16.811 14.105C16.8352 14.0498 16.8584 13.994 16.8808 13.9378C17.031 13.5597 17.3519 13.2618 17.7549 13.2062L18.3866 13.1191C18.8814 13.0508 19.25 12.6279 19.25 12.1285V11.8715C19.25 11.3721 18.8814 10.9492 18.3866 10.8809L17.7549 10.7938C17.3519 10.7382 17.031 10.4403 16.8808 10.0622C16.8584 10.006 16.8352 9.95021 16.8109 9.89496C16.6476 9.52216 16.6616 9.08437 16.9058 8.75875L17.1365 8.4512C17.4351 8.05308 17.3955 7.49599 17.0436 7.1441L16.8559 6.95642C16.504 6.60453 15.9469 6.56494 15.5488 6.86353L15.2412 7.09419C14.9156 7.33841 14.4778 7.3524 14.105 7.18905C14.0498 7.16484 13.994 7.14156 13.9378 7.11922C13.5597 6.96897 13.2618 6.64815 13.2062 6.24511L13.1191 5.61336Z"
                      ></path>
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M13.25 12C13.25 12.6904 12.6904 13.25 12 13.25C11.3096 13.25 10.75 12.6904 10.75 12C10.75 11.3096 11.3096 10.75 12 10.75C12.6904 10.75 13.25 11.3096 13.25 12Z"
                      ></path>
                    </svg>
                    <p className="ml-[3px] mr-[6px]">Settings</p>
                  </li>
                </ul>
                <ul className="flex flex-col mb-[10px]">
                  <hr className="border-[#e8e8ed] w-full" />
                  <li className="mt-1 list-none flex items-center rounded-[9px] text-gray-900 py-[2px]">
                    <div className="h-4 w-4 bg-[#898FA9] rounded-full flex-shrink-0 text-white inline-flex items-center justify-center text-[7px] leading-[6px] pl-[0.5px]">
                      R
                    </div>
                    <p className="ml-[4px] mr-[6px] flex-shrink-0">
                      Richard Monroe
                    </p>
                    <div className="ml-auto">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M13 12C13 12.5523 12.5523 13 12 13C11.4477 13 11 12.5523 11 12C11 11.4477 11.4477 11 12 11C12.5523 11 13 11.4477 13 12Z"
                        ></path>
                        <path
                          fill="currentColor"
                          d="M9 12C9 12.5523 8.55228 13 8 13C7.44772 13 7 12.5523 7 12C7 11.4477 7.44772 11 8 11C8.55228 11 9 11.4477 9 12Z"
                        ></path>
                        <path
                          fill="currentColor"
                          d="M17 12C17 12.5523 16.5523 13 16 13C15.4477 13 15 12.5523 15 12C15 11.4477 15.4477 11 16 11C16.5523 11 17 11.4477 17 12Z"
                        ></path>
                      </svg>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="bg-white text-[#667380] p-[18px] flex flex-col">
                {step === 1 ? (
                  <div>
                    <motion.span
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                      key={selected.id}
                      className="text-[#1a2b3b] text-[14px] leading-[18px] font-semibold absolute"
                    >
                      {selected.name} Questions
                    </motion.span>

                    <ul className="mt-[28px] flex">
                      <li className="list-none max-w-[400px]">
                        Browse all the questions. 
                      </li>
                    </ul>
                  </div>
                ) : (
                  <div>
                    <motion.span
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                      key={selected.id}
                      className="text-[#1a2b3b] text-[14px] leading-[18px] font-semibold absolute"
                    >
                      {selected.name === "Calculus"
                        ? "Calculus question"
                        : selectedTopic.name === "Algebra"
                        ? "Algebra question"
                        : selectedTopic.name === "Geometry"
                        ? "Geometry question"
                        : "Shapes question"}
                    </motion.span>

                    <ul className="mt-[28px] flex">
                      {selected.name === "Calculus" ? (
                        <li className="list-none max-w-[400px]">
                          Answer this calculus question
                        </li>
                      ) : (
                        <li className="list-none max-w-[400px]">
                          answer the other questions
                        </li>
                      )}
                    </ul>
                  </div>
                )}
                
                {step === 1 && (
                  <ul className="mt-[12px] flex items-center space-x-[2px]">
                    <svg
                      className="w-4 h-4 text-[#1a2b3b]"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M19.25 19.25L15.5 15.5M4.75 11C4.75 7.54822 7.54822 4.75 11 4.75C14.4518 4.75 17.25 7.54822 17.25 11C17.25 14.4518 14.4518 17.25 11 17.25C7.54822 17.25 4.75 14.4518 4.75 11Z"
                      ></path>
                    </svg>

                    <p>Search</p>
                  </ul>
                )}
                {step === 1 &&
                  (selected.name === "Calculus" ? (
                    <motion.ul
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                      key={selected.id}
                      className="mt-3 grid grid-cols-3 xl:grid-cols-3 gap-2"
                    >
                      <li className="list-none relative flex items-stretch text-left">
                        <div className="group relative w-full">
                          <div className="relative mb-2 flex h-full max-h-[200px] w-full cursor-pointer items-start justify-between rounded-lg p-2 font-medium transition duration-100">
                            <div className="absolute inset-0 rounded-lg ring-1 ring-inset ring-zinc-900/[7.5%] group-hover:ring-zinc-900/10"></div>
                            <div className="relative flex h-full flex-col overflow-hidden">
                              <div className="flex items-center text-left text-[#1a2b3b]">
                                <p>Why this company?</p>
                              </div>
                              <p className="text-wrap grow font-normal text-[7px]">
                                Why do you want to work for Google?
                              </p>
                              <div className="flex flex-row space-x-1">
                                <p className="inline-flex items-center justify-center truncate rounded-full border-[0.5px] border-gray-300 px-[3px] text-[7px] font-normal hover:bg-gray-50">
                                  Product Management
                                </p>
                                <p className="inline-flex items-center justify-center truncate rounded-full border-[0.5px] border-[#D0E7DC] bg-[#F3FAF1] px-[3px] text-[7px] font-normal hover:bg-[#edf8ea]">
                                  <span className="mr-1 flex items-center text-emerald-600">
                                    <svg
                                      className="h-2 w-2"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M4.75 12C4.75 7.99594 7.99594 4.75 12 4.75C16.0041 4.75 19.25 7.99594 19.25 12C19.25 16.0041 16.0041 19.25 12 19.25C7.99594 19.25 4.75 16.0041 4.75 12Z"
                                        fill="#459A5F"
                                        stroke="#459A5F"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      ></path>
                                      <path
                                        d="M9.75 12.75L10.1837 13.6744C10.5275 14.407 11.5536 14.4492 11.9564 13.7473L14.25 9.75"
                                        stroke="#F4FAF4"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      ></path>
                                    </svg>
                                  </span>
                                  Completed
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                      <li className="list-none relative flex items-stretch text-left">
                        <div className="group relative w-full">
                          <div className="relative mb-2 flex h-full max-h-[200px] w-full cursor-pointer items-start justify-between rounded-lg p-2 font-medium transition duration-100">
                            <div className="absolute inset-0 rounded-lg ring-1 ring-inset ring-zinc-900/[7.5%] group-hover:ring-zinc-900/10"></div>
                            <div className="relative flex h-full flex-col overflow-hidden">
                              <div className="flex items-center text-left text-[#1a2b3b]">
                                <p>What are you most proud of?</p>
                              </div>
                              <p className="text-wrap grow font-normal text-[7px]">
                                Tell me about the thing you are most proud of.
                                Why is it so important to you?
                              </p>
                              <div className="flex flex-row space-x-1">
                                <p className="inline-flex items-center justify-center truncate rounded-full border-[0.5px] border-gray-300 px-[3px] text-[7px] font-normal hover:bg-gray-50">
                                  General
                                </p>
                                <p className="inline-flex items-center justify-center truncate rounded-full border-[0.5px] border-[#D0E7DC] bg-[#F3FAF1] px-[3px] text-[7px] font-normal hover:bg-[#edf8ea]">
                                  <span className="mr-1 flex items-center text-emerald-600">
                                    <svg
                                      className="h-2 w-2"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M4.75 12C4.75 7.99594 7.99594 4.75 12 4.75C16.0041 4.75 19.25 7.99594 19.25 12C19.25 16.0041 16.0041 19.25 12 19.25C7.99594 19.25 4.75 16.0041 4.75 12Z"
                                        fill="#459A5F"
                                        stroke="#459A5F"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      ></path>
                                      <path
                                        d="M9.75 12.75L10.1837 13.6744C10.5275 14.407 11.5536 14.4492 11.9564 13.7473L14.25 9.75"
                                        stroke="#F4FAF4"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      ></path>
                                    </svg>
                                  </span>
                                  Completed
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                      <li className="list-none relative flex items-stretch text-left">
                        <div className="group relative w-full">
                          <div className="relative mb-2 flex h-full max-h-[200px] w-full cursor-pointer items-start justify-between rounded-lg p-2 font-medium transition duration-100">
                            <div className="absolute inset-0 rounded-lg ring-1 ring-inset ring-zinc-900/[7.5%] group-hover:ring-zinc-900/10"></div>
                            <div className="relative flex h-full flex-col overflow-hidden">
                              <div className="flex items-center text-left text-[#1a2b3b]">
                                <p>Tell me about yourself</p>
                              </div>
                              <p className="text-wrap grow font-normal text-[7px]">
                                Walk me through your resume, projects, and
                                anything you feel is relevant to your story.
                              </p>
                              <div className="flex flex-row space-x-1">
                                <p className="inline-flex items-center justify-center truncate rounded-full border-[0.5px] border-gray-300 px-[3px] text-[7px] font-normal hover:bg-gray-50">
                                  Product Management
                                </p>
                                <p className="inline-flex items-center justify-center truncate rounded-full border-[0.5px] border-[#D0E7DC] bg-[#F3FAF1] px-[3px] text-[7px] font-normal hover:bg-[#edf8ea]">
                                  <span className="mr-1 flex items-center text-emerald-600">
                                    <svg
                                      className="h-2 w-2"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M4.75 12C4.75 7.99594 7.99594 4.75 12 4.75C16.0041 4.75 19.25 7.99594 19.25 12C19.25 16.0041 16.0041 19.25 12 19.25C7.99594 19.25 4.75 16.0041 4.75 12Z"
                                        fill="#459A5F"
                                        stroke="#459A5F"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      ></path>
                                      <path
                                        d="M9.75 12.75L10.1837 13.6744C10.5275 14.407 11.5536 14.4492 11.9564 13.7473L14.25 9.75"
                                        stroke="#F4FAF4"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      ></path>
                                    </svg>
                                  </span>
                                  Completed
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                      <li className="list-none relative flex items-stretch text-left">
                        <div className="group relative w-full">
                          <div className="relative mb-2 flex h-full max-h-[200px] w-full cursor-pointer items-start justify-between rounded-lg p-2 font-medium transition duration-100">
                            <div className="absolute inset-0 rounded-lg ring-1 ring-inset ring-zinc-900/[7.5%] group-hover:ring-zinc-900/10"></div>
                            <div className="relative flex h-full flex-col overflow-hidden">
                              <div className="flex items-center text-left text-[#1a2b3b]">
                                <p>What are your strengths?</p>
                              </div>
                              <p className="text-wrap grow font-normal text-[7px]">
                                Tell me about your strengths and why you would
                                make a strong candidate.
                              </p>
                              <div className="flex flex-row space-x-1">
                                <p className="inline-flex items-center justify-center truncate rounded-full border-[0.5px] border-gray-300 px-[3px] text-[7px] font-normal hover:bg-gray-50">
                                  Software Engineering
                                </p>
                                <p className="inline-flex items-center justify-center truncate rounded-full border-[0.5px] border-[#D0E7DC] bg-[#F3FAF1] px-[3px] text-[7px] font-normal hover:bg-[#edf8ea]">
                                  <span className="mr-1 flex items-center text-emerald-600">
                                    <svg
                                      className="h-2 w-2"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M4.75 12C4.75 7.99594 7.99594 4.75 12 4.75C16.0041 4.75 19.25 7.99594 19.25 12C19.25 16.0041 16.0041 19.25 12 19.25C7.99594 19.25 4.75 16.0041 4.75 12Z"
                                        fill="#459A5F"
                                        stroke="#459A5F"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      ></path>
                                      <path
                                        d="M9.75 12.75L10.1837 13.6744C10.5275 14.407 11.5536 14.4492 11.9564 13.7473L14.25 9.75"
                                        stroke="#F4FAF4"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      ></path>
                                    </svg>
                                  </span>
                                  Completed
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                      <li className="list-none relative flex items-stretch text-left">
                        <div className="group relative w-full">
                          <div className="relative mb-2 flex h-full max-h-[200px] w-full cursor-pointer items-start justify-between rounded-lg p-2 font-medium transition duration-100">
                            <div className="absolute inset-0 rounded-lg ring-1 ring-inset ring-zinc-900/[7.5%] group-hover:ring-zinc-900/10"></div>
                            <div className="relative flex h-full flex-col overflow-hidden">
                              <div className="flex items-center text-left text-[#1a2b3b]">
                                <p>What are your weaknesses?</p>
                              </div>
                              <p className="text-wrap grow font-normal text-[7px]">
                                Tell me about your weaknesses, and how that has
                                impacted your previous work.
                              </p>
                              <div className="flex flex-row space-x-1">
                                <p className="inline-flex items-center justify-center truncate rounded-full border-[0.5px] border-gray-300 px-[3px] text-[7px] font-normal hover:bg-gray-50">
                                  Product Management
                                </p>
                                <p className="inline-flex items-center justify-center truncate rounded-full border-[0.5px] border-[#D0E7DC] bg-[#F3FAF1] px-[3px] text-[7px] font-normal hover:bg-[#edf8ea]">
                                  <span className="mr-1 flex items-center text-emerald-600">
                                    <svg
                                      className="h-2 w-2"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M4.75 12C4.75 7.99594 7.99594 4.75 12 4.75C16.0041 4.75 19.25 7.99594 19.25 12C19.25 16.0041 16.0041 19.25 12 19.25C7.99594 19.25 4.75 16.0041 4.75 12Z"
                                        fill="#459A5F"
                                        stroke="#459A5F"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      ></path>
                                      <path
                                        d="M9.75 12.75L10.1837 13.6744C10.5275 14.407 11.5536 14.4492 11.9564 13.7473L14.25 9.75"
                                        stroke="#F4FAF4"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      ></path>
                                    </svg>
                                  </span>
                                  Completed
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    </motion.ul>
                  ) : (
                    <motion.ul
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                      key={selected.id}
                      className="mt-3 grid grid-cols-3 xl:grid-cols-3 gap-2"
                    >
                      <li className="list-none relative flex items-stretch text-left">
                        <div className="group relative w-full">
                          <div className="relative mb-2 flex h-full max-h-[200px] w-full cursor-pointer items-start justify-between rounded-lg p-2 font-medium transition duration-100">
                            <div className="absolute inset-0 rounded-lg ring-1 ring-inset ring-zinc-900/[7.5%] group-hover:ring-zinc-900/10"></div>
                            <div className="relative flex h-full flex-col overflow-hidden">
                              <div className="flex items-center text-left text-[#1a2b3b]">
                                <p>Solve this puzzle</p>
                              </div>
                              <p className="text-wrap grow font-normal text-[7px]">
                                I there are 3 pins in the bag....
                              </p>
                              <div className="flex flex-row space-x-1">
                                <p className="inline-flex items-center justify-center truncate rounded-full border-[0.5px] border-gray-300 px-[3px] text-[7px] font-normal hover:bg-gray-50">
                                  Algebra
                                </p>
                                <p className="inline-flex items-center justify-center truncate rounded-full border-[0.5px] border-[#D0E7DC] bg-[#F3FAF1] px-[3px] text-[7px] font-normal hover:bg-[#edf8ea]">
                                  <span className="mr-1 flex items-center text-emerald-600">
                                    <svg
                                      className="h-2 w-2"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M4.75 12C4.75 7.99594 7.99594 4.75 12 4.75C16.0041 4.75 19.25 7.99594 19.25 12C19.25 16.0041 16.0041 19.25 12 19.25C7.99594 19.25 4.75 16.0041 4.75 12Z"
                                        fill="#459A5F"
                                        stroke="#459A5F"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      ></path>
                                      <path
                                        d="M9.75 12.75L10.1837 13.6744C10.5275 14.407 11.5536 14.4492 11.9564 13.7473L14.25 9.75"
                                        stroke="#F4FAF4"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      ></path>
                                    </svg>
                                  </span>
                                  Completed
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                      <li className="list-none relative flex items-stretch text-left">
                        <div className="group relative w-full">
                          <div className="relative mb-2 flex h-full max-h-[200px] w-full cursor-pointer items-start justify-between rounded-lg p-2 font-medium transition duration-100">
                            <div className="absolute inset-0 rounded-lg ring-1 ring-inset ring-zinc-900/[7.5%] group-hover:ring-zinc-900/10"></div>
                            <div className="relative flex h-full flex-col overflow-hidden">
                              <div className="flex items-center text-left text-[#1a2b3b]">
                                <p>Uber product expansion</p>
                              </div>
                              <p className="text-wrap grow font-normal text-[7px]">
                                Uber is looking to expand its product line and
                                wants your take on how...
                              </p>
                              <div className="flex flex-row space-x-1">
                                <p className="inline-flex items-center justify-center truncate rounded-full border-[0.5px] border-gray-300 px-[3px] text-[7px] font-normal hover:bg-gray-50">
                                  Product Management
                                </p>
                                <p className="inline-flex items-center justify-center truncate rounded-full border-[0.5px] border-[#D0E7DC] bg-[#F3FAF1] px-[3px] text-[7px] font-normal hover:bg-[#edf8ea]">
                                  <span className="mr-1 flex items-center text-emerald-600">
                                    <svg
                                      className="h-2 w-2"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M4.75 12C4.75 7.99594 7.99594 4.75 12 4.75C16.0041 4.75 19.25 7.99594 19.25 12C19.25 16.0041 16.0041 19.25 12 19.25C7.99594 19.25 4.75 16.0041 4.75 12Z"
                                        fill="#459A5F"
                                        stroke="#459A5F"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      ></path>
                                      <path
                                        d="M9.75 12.75L10.1837 13.6744C10.5275 14.407 11.5536 14.4492 11.9564 13.7473L14.25 9.75"
                                        stroke="#F4FAF4"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      ></path>
                                    </svg>
                                  </span>
                                  Completed
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                      <li className="list-none relative flex items-stretch text-left">
                        <div className="group relative w-full">
                          <div className="relative mb-2 flex h-full max-h-[200px] w-full cursor-pointer items-start justify-between rounded-lg p-2 font-medium transition duration-100">
                            <div className="absolute inset-0 rounded-lg ring-1 ring-inset ring-zinc-900/[7.5%] group-hover:ring-zinc-900/10"></div>
                            <div className="relative flex h-full flex-col overflow-hidden">
                              <div className="flex items-center text-left text-[#1a2b3b]">
                                <p>Weighing an Airplane</p>
                              </div>
                              <p className="text-wrap grow font-normal text-[7px]">
                                How would you weigh a plane without a scale?
                              </p>
                              <div className="flex flex-row space-x-1">
                                <p className="inline-flex items-center justify-center truncate rounded-full border-[0.5px] border-gray-300 px-[3px] text-[7px] font-normal hover:bg-gray-50">
                                  Brainteaser
                                </p>
                                <p className="inline-flex items-center justify-center truncate rounded-full border-[0.5px] border-[#D0E7DC] bg-[#F3FAF1] px-[3px] text-[7px] font-normal hover:bg-[#edf8ea]">
                                  <span className="mr-1 flex items-center text-emerald-600">
                                    <svg
                                      className="h-2 w-2"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M4.75 12C4.75 7.99594 7.99594 4.75 12 4.75C16.0041 4.75 19.25 7.99594 19.25 12C19.25 16.0041 16.0041 19.25 12 19.25C7.99594 19.25 4.75 16.0041 4.75 12Z"
                                        fill="#459A5F"
                                        stroke="#459A5F"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      ></path>
                                      <path
                                        d="M9.75 12.75L10.1837 13.6744C10.5275 14.407 11.5536 14.4492 11.9564 13.7473L14.25 9.75"
                                        stroke="#F4FAF4"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      ></path>
                                    </svg>
                                  </span>
                                  Completed
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                      <li className="list-none relative flex items-stretch text-left">
                        <div className="group relative w-full">
                          <div className="relative mb-2 flex h-full max-h-[200px] w-full cursor-pointer items-start justify-between rounded-lg p-2 font-medium transition duration-100">
                            <div className="absolute inset-0 rounded-lg ring-1 ring-inset ring-zinc-900/[7.5%] group-hover:ring-zinc-900/10"></div>
                            <div className="relative flex h-full flex-col overflow-hidden">
                              <div className="flex items-center text-left text-[#1a2b3b]">
                                <p>Solve this math problem</p>
                              </div>
                              <p className="text-wrap grow font-normal text-[7px]">
                                With 20 Passengers got into train...
                              </p>
                              <div className="flex flex-row space-x-1">
                                <p className="inline-flex items-center justify-center truncate rounded-full border-[0.5px] border-gray-300 px-[3px] text-[7px] font-normal hover:bg-gray-50">
                                  Geometry
                                </p>
                                <p className="inline-flex items-center justify-center truncate rounded-full border-[0.5px] border-[#D0E7DC] bg-[#F3FAF1] px-[3px] text-[7px] font-normal hover:bg-[#edf8ea]">
                                  <span className="mr-1 flex items-center text-emerald-600">
                                    <svg
                                      className="h-2 w-2"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M4.75 12C4.75 7.99594 7.99594 4.75 12 4.75C16.0041 4.75 19.25 7.99594 19.25 12C19.25 16.0041 16.0041 19.25 12 19.25C7.99594 19.25 4.75 16.0041 4.75 12Z"
                                        fill="#459A5F"
                                        stroke="#459A5F"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      ></path>
                                      <path
                                        d="M9.75 12.75L10.1837 13.6744C10.5275 14.407 11.5536 14.4492 11.9564 13.7473L14.25 9.75"
                                        stroke="#F4FAF4"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      ></path>
                                    </svg>
                                  </span>
                                  Completed
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    </motion.ul>
                  ))}
                {step === 1 && (
                  <div className="space-y-2 md:space-y-5 mt-auto">
                    <nav
                      className="flex items-center justify-between border-t border-gray-200 bg-white px-1 py-[2px] mb-[10px]"
                      aria-label="Pagination"
                    >
                      <div className="hidden sm:block">
                        <p className=" text-[#1a2b3b]">
                          Showing <span className="font-medium">1</span> to{" "}
                          <span className="font-medium">9</span> of{" "}
                          <span className="font-medium">500</span> results
                        </p>
                      </div>
                      <div className="flex flex-1 justify-between sm:justify-end">
                        <button className="relative inline-flex cursor-auto items-center rounded border border-gray-300 bg-white px-[4px] py-[2px]  font-medium text-[#1a2b3b] hover:bg-gray-50 disabled:opacity-50">
                          Previous
                        </button>
                        <button className="relative ml-3 inline-flex items-center rounded border border-gray-300 bg-white px-[4px] py-[2px]  font-medium text-[#1a2b3b] hover:bg-gray-50">
                          Next
                        </button>
                      </div>
                    </nav>
                  </div>
                )}
              </div>
            </figure>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
