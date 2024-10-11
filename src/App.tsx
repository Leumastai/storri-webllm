// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vitejs.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.tsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App

import { useState, useEffect } from 'react';
import { ChatCompletionMessage, CreateMLCEngine, InitProgressReport, MLCEngine } from '@mlc-ai/web-llm'; // Import WebLLM engine
function App() {
  const [engine, setEngine] = useState<MLCEngine | null>(null); // Store WebLLM engine
  const [progress, setProgress] = useState<string | null>(""); // Track initialization progress
  const [inferenceResult, setInferenceResult] = useState<string>(""); // Store inference result
  // Initialize WebLLM engine when the component mounts
  useEffect(() => {
    const initializeWebLLM = async () => {
      const initProgressCallback = (initProgress : InitProgressReport) => {
        console.log(initProgress);
        setProgress(`${initProgress.progress * 100}%`);
      };
      try {
        const modelEngine = await CreateMLCEngine("TinyLlama-1.1B-Chat-v0.4-q4f16_1-MLC", { initProgressCallback });
        setEngine(modelEngine); // Store engine in state
        console.log('WebLLM initialized successfully');
      } catch (error) {
        console.error('Error initializing WebLLM:', error);
      }
    };
    initializeWebLLM(); // Call the function to initialize WebLLM
  }, []); // Empty dependency array ensures this runs once on mount
  // Function to run model inference using the WebLLM engine
  const runModelInference = async (inputText : string) => {
    if (!engine) {
      console.error('Engine is not initialized yet!');
      return;
    }
    try {
      const result = await engine.chat.completions.create({
        messages: [{role: 'system', content: "You are a Helpful Assistant"}, { role: 'user', content: inputText }],
      });
      // setInferenceResult(result.choices[0].message);
      console.log('Inference result:', result.choices[0].message);
    } catch (error) {
      console.error('Error running model inference:', error);
    }
  };
  return (
    <div>
      <h1>LLM Component</h1>
      <p>Model Initialization Progress: {progress}%</p>
      {engine ? (
        <div>
          <h3>WebLLM is ready!</h3>
          <button onClick={() => runModelInference('Hello, WebLLM!')}>
            Run Inference
          </button>
          <p>Inference Result: {inferenceResult}</p>
        </div>
      ) : (
        <p>Initializing WebLLM, please wait...</p>
      )}
    </div>
  );
};

export default App