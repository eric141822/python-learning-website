import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

import styles from "../Styles/Playground.module.css";
import "codemirror/keymap/sublime";
import "codemirror/theme/monokai.css";

import * as tf from "@tensorflow/tfjs";
import { getTokenisedWord } from "../Utils/utils";
const MODEL_URL = "http://localhost:8080/model.json";

export default function Playground() {
  const [input, setInput] = useState(localStorage.getItem("input") || ``);
  const [text, setText] = useState(null);
  const [userInput, setUserInput] = useState(``);
  const [questionDescription, setQuestionDescription] = useState("");
  const [questionTitle, setQuestionTitle] = useState("");
  const params = useParams();
  const [testcases, setTestcases] = useState([]);
  const [tc, setTc] = useState([]);
  const [prediction, setPrediction] = useState("");
  const [isSubmit, setIsSubmit] = useState(false);
  const navigate = useNavigate();

  async function loadModel(input) {
    const model = await tf.loadLayersModel(MODEL_URL);

    let text = input;
    text = text.replace(/[\".,\/#!$%\^&\*;:{}=\-_`~()]/g, " "); // replace puncuations
    text = text.split("\n"); // split by break line
    const pre_parse = []; // trim and split each line by space
    for (let line of text) {
      pre_parse.push.apply(pre_parse, line.trim().split(" "));
    }
    console.log(pre_parse);
    const parse = pre_parse.map((t) => getTokenisedWord(t)); // tokenize
    console.log(parse);
    model.predict(tf.tensor1d(parse)).print();
    const tensor = model.predict(tf.tensor1d(parse));
    const value = tensor.dataSync().filter((v) => v !== 0);
    const sum = value.reduce((partialSum, num) => partialSum + num, 0);
    const result = sum / value.length;
    console.log("result = ", result);
    if (result < 0.5) {
      console.log("Bad");
      setPrediction(
        "Your coding practice is likely to be: Bad. Perhaps there're ways to improve it."
      );
    } else {
      console.log("Good");
      setPrediction("Your coding practice is likely to be: Good. Great work!");
    }
    setIsSubmit(false);
  }

  useEffect(() => {
    let ignore = false;
    async function getQuestion() {
      const res = await fetch(`http://localhost:9000/questions/${params.id}`);
      const data = await res.json();
      console.log(data);
      if (!ignore) {
        setQuestionDescription(
          data.question
            .split("\n")
            .map((str, idx) => <p key={`desc_${idx}`}>{str}</p>)
        );
        setQuestionTitle(data.title);
        setTestcases(data.testcases);
      }
    }
    getQuestion();
    return () => {
      ignore = true;
    };
  }, []);
  const grade = async (e) => {
    e.preventDefault();
    setText("");
    setIsSubmit(!isSubmit);
    setTc([]);
    setPrediction("");
    // setIsPassed(true);

    for (var i = 0; i < testcases.length; i++) {
      const response = await fetch(
        "https://judge0-ce.p.rapidapi.com/submissions",
        {
          method: "POST",
          headers: {
            "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
            "x-rapidapi-key":
              "a7a5da9ddfmsh5b936179f8fcd6ap13b5f1jsnb3f2835bd320",
            "content-type": "application/json",
            accept: "application/json",
          },
          body: JSON.stringify({
            source_code: input,
            stdin: testcases[i].input,
            language_id: 71,
          }),
        }
      );
      const jsonResponse = await response.json();
      let jsonGetSolution = {
        status: { description: "Queue" },
        stderr: null,
        compile_output: null,
      };
      while (
        jsonGetSolution.status.description !== "Accepted" &&
        jsonGetSolution.stderr == null &&
        jsonGetSolution.compile_output == null
      ) {
        if (jsonResponse.token) {
          let url = `https://judge0-ce.p.rapidapi.com/submissions/${jsonResponse.token}?base64_encoded=true`;
          const getSolution = await fetch(url, {
            method: "GET",
            headers: {
              "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
              "x-rapidapi-key":
                "a7a5da9ddfmsh5b936179f8fcd6ap13b5f1jsnb3f2835bd320",
              "content-type": "application/json",
            },
          });
          jsonGetSolution = await getSolution.json();
          console.log(jsonGetSolution);
        }
      }

      if (jsonGetSolution.stdout) {
        const output = window.atob(jsonGetSolution.stdout);
        if (output === testcases[i].output) {
          const textContent = "Testcase" + (i + 1).toString() + ": Correct\n\n";
          setTc((tc) => [...tc, textContent]);
        } else {
          let textContent = "Testcase" + (i + 1).toString() + ": Incorrect\n";

          if (!testcases[i].isHidden) {
            textContent +=
              "The expected output is: " + testcases[i].output + "\n";
          }
          setTc((tc) => [...tc, textContent]);
        }
      } else if (jsonGetSolution.stderr) {
        const error = window.atob(jsonGetSolution.stderr);
        setText(<>Error :{error}</>);
      } else {
        const compilation_error = window.atob(jsonGetSolution.compile_output);
        setText(<>Error :{compilation_error}`</>);
      }
    }
    await loadModel(input);
  };

  const run = async (e) => {
    e.preventDefault();

    setText(<></>);
    const response = await fetch(
      "https://judge0-ce.p.rapidapi.com/submissions",
      {
        method: "POST",
        headers: {
          "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
          "x-rapidapi-key":
            "a7a5da9ddfmsh5b936179f8fcd6ap13b5f1jsnb3f2835bd320",
          "content-type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({
          source_code: input,
          stdin: userInput,
          language_id: 71,
        }),
      }
    );

    setText(
      <>
        {text}
        <br />
        <>Submission Created ...</>
      </>
    );
    const jsonResponse = await response.json();
    let jsonGetSolution = {
      status: { description: "Queue" },
      stderr: null,
      compile_output: null,
    };
    while (
      jsonGetSolution.status.description !== "Accepted" &&
      jsonGetSolution.stderr == null &&
      jsonGetSolution.compile_output == null
    ) {
      setText(
        <>
          status : {jsonGetSolution.status.description}
          <br />
        </>
      );

      if (jsonResponse.token) {
        let url = `https://judge0-ce.p.rapidapi.com/submissions/${jsonResponse.token}?base64_encoded=true`;
        const getSolution = await fetch(url, {
          method: "GET",
          headers: {
            "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
            "x-rapidapi-key":
              "a7a5da9ddfmsh5b936179f8fcd6ap13b5f1jsnb3f2835bd320",
            "content-type": "application/json",
          },
        });
        jsonGetSolution = await getSolution.json();
      }
    }

    if (jsonGetSolution.stdout) {
      const output = window.atob(jsonGetSolution.stdout);
      setText(<></>);
      setText(
        <>
          {output}
          <br />
          Execution Time : {jsonGetSolution.time} Secs
          <br />
          Memory used : {jsonGetSolution.memory} bytes
          <br />
        </>
      );
    } else if (jsonGetSolution.stderr) {
      const error = window.atob(jsonGetSolution.stderr);
      setText(<></>);
      setText(
        <>
          {text}
          <br />
          Error :{error}
        </>
      );
    } else {
      const compilation_error = window.atob(jsonGetSolution.compile_output);
      setText(<></>);
      setText(
        <>
          {text}
          <br />
          Error :{compilation_error}`
        </>
      );
    }
  };
  return (
    <div>
      <div className={styles.header}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Link to="/" style={{ textDecoration: "none" }}>
            <div className={styles.logo}>Python Learning</div>
          </Link>
          <Button
            className={styles.navButton}
            variant="contained"
            onClick={() => {
              navigate(`/questions/forum/${params.id}`);
            }}
          >
            Discussion
          </Button>
        </div>
      </div>
      <div id={styles.Body}>
        <div id={styles.Question}>
          <div id={styles.QuestionTitle}>{questionTitle}</div>
          <div id={styles.QuestionDescription}>{questionDescription}</div>
          <div id={styles.GradeDescription}>
            Grades:
            <div className={styles.testcases}>
              {tc.map((t, idx) => {
                if (t.includes("Incorrect")) {
                  return (
                    <div
                      key={"tc" + idx.toString()}
                      className={styles.incorrect}
                    >
                      {t}
                    </div>
                  );
                } else {
                  return (
                    <div key={"tc" + idx.toString()} className={styles.correct}>
                      {t}
                    </div>
                  );
                }
              })}
            </div>
          </div>
        </div>
        <div id={styles.Main}>
          <div id={styles.Playground}>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className={styles.textarea}
              options={{
                mode: "python",
                matchBrackets: true,
                tabSize: 2,
              }}
            />
          </div>
          <div id={styles.Console}>
            <div id={styles.ConsoleInput}>
              Input
              <br />
              <input
                className={styles.ConsoleBox}
                type="text"
                onChange={(e) => setUserInput(e.target.value)}
              />
            </div>
            <div id={styles.ConsoleOutput}>
              Output
              <br />
              <div className={styles.ConsoleBox} id="result">
                {text}
              </div>
            </div>
            <div className={styles.ModelPrediction}>{prediction}</div>
            <div>
              <Button id={styles.Submit} disabled={isSubmit} onClick={grade}>
                Submit
              </Button>
              <Button id={styles.Run} onClick={run}>
                Run
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
