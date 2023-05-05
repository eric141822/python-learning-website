import React from "react";
import styles from "../Styles/TAQuestionInput.module.css";
import { useState, useEffect } from "react";
import Rating from "@material-ui/lab/Rating";
import { IconButton, Button } from "@material-ui/core";
import { Button as MUIButton } from "@mui/material";

import { AddCircle } from "@material-ui/icons";
import TestCaseInput from "./TestCaseInput";
import { Link, useNavigate } from "react-router-dom";
import Collapsible from "react-collapsible";

const TAList = ["eric3058@connect.hku.hk"];

const TAQuestionInput = (props) => {
  const [sampleTestCases, setSampleTestCases] = useState([]);
  const [hiddenTestCases, setHiddenTestCases] = useState([]);
  const [type, setType] = useState("CODE");
  const [curUser, setCurUser] = useState(
    localStorage.getItem("loginEmail")
      ? localStorage.getItem("loginEmail")
      : null
  );

  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    let ignore = false;
    async function getQuestions() {
      const res = await fetch("http://localhost:9000/questions");
      let data;
      try {
        data = await res.json();
      } catch (err) {
        console.log(err);
        return;
      }
      console.log(data);
      if (!ignore) setQuestions(data);
    }
    getQuestions();
    return () => {
      ignore = true;
    };
  }, []);
  const onChangeType = (event) => {
    setType(event.target.value);
  };
  const handleMCQSubmit = (event) => {
    event.preventDefault();
    let isValid = true;
    if (!TAList.includes(curUser)) {
      isValid = false;
      alert("You are not authorized.");
    } else if (event.target.description.value === "") {
      isValid = false;
      alert("Description is empty.");
    }
    if (isValid) {
      event.target.submit();
    }
    return isValid;
  };
  const handleCodeSubmit = (event) => {
    event.preventDefault();
    let isValid = true;
    if (!TAList.includes(curUser)) {
      isValid = false;
      alert("You are not authorized.");
    }
    if (isValid) {
      event.target.submit();
    }
  };

  const onAddHiddenCase = () => {
    setHiddenTestCases([
      ...hiddenTestCases,
      { id: Math.floor(Math.random() * 1000000), output: "", input: "" },
    ]);
  };
  const onAddSampleCase = () => {
    setSampleTestCases([
      ...sampleTestCases,
      { id: Math.floor(Math.random() * 1000000), output: "", input: "" },
    ]);
  };
  const onDeleteSampleCase = (id) => {
    setSampleTestCases((prevSamples) =>
      prevSamples.filter((item) => item.id !== id)
    );
  };
  const onDeleteHiddenCase = (id) => {
    setHiddenTestCases((prevHidden) =>
      prevHidden.filter((item) => item.id !== id)
    );
  };
  const handleSampleOnChangeInput = (id, val) => {
    setSampleTestCases(
      sampleTestCases.map((item) =>
        item.id === id ? { ...item, input: val } : item
      )
    );
  };
  const handleSampleOnChangeOutput = (id, val) => {
    setSampleTestCases(
      sampleTestCases.map((item) =>
        item.id === id ? { ...item, output: val } : item
      )
    );
  };
  const handleHiddenOnChangeInput = (id, val) => {
    setHiddenTestCases(
      hiddenTestCases.map((item) =>
        item.id === id ? { ...item, input: val } : item
      )
    );
  };
  const handleHiddenOnChangeOutput = (id, val) => {
    setHiddenTestCases(
      hiddenTestCases.map((item) =>
        item.id === id ? { ...item, output: val } : item
      )
    );
  };

  //   useEffect(() => {
  //     console.log(type);
  //   }, [type]);

  return (
    <div className={styles.Container}>
      <div className={styles.header}>
        <Link to="/" style={{ textDecoration: "none" }}>
          <div className={styles.logo}>Python Learning</div>
        </Link>
      </div>
      <div id={styles.Body}>
        <div id={styles.Question}>
          {[...new Set(questions.map((q) => q.topic))].map((topic) => (
            <div key={topic}>
              <Collapsible trigger={topic}>
                {questions
                  .filter((q) => q.topic === topic)
                  .map((q, index) => (
                    <MUIButton
                      key={index.toString()}
                      variant="text"
                      onClick={() => {
                        navigate("/questions/" + q._id);
                      }}
                      className={styles.button}
                    >
                      {q.title}
                    </MUIButton>
                  ))}
              </Collapsible>
            </div>
          ))}
        </div>
        <div id={styles.Main}>
          <select
            className={styles.select}
            onChange={onChangeType}
            value={type}
            name="type"
            id="type"
          >
            <option value="CODE">Code Questions</option>
            <option value="MC">Multiple-Choice</option>
          </select>
          {type === "CODE" ? (
            <form
              action="http://localhost:9000/insert"
              method="POST"
              onSubmit={handleCodeSubmit}
            >
              <div className={styles.title}>
                <h2 className={styles.h2}>Question title</h2>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="Enter the question title..."
                  name="title"
                />
              </div>
              <div className={styles.category}>
                <h2 className={styles.h2}>Question Category</h2>
                <input
                  className={styles.input}
                  name="category"
                  placeholder="Enter category..."
                />
              </div>
              <div className={styles.category}>
                <h2 className={styles.h2}>Question Topic</h2>
                <select className={styles.select} name="topic" id="topic">
                  <option value="PRINT STATEMENTS AND INPUT STATEMENTS">
                    PRINT STATEMENTS AND INPUT STATEMENTS
                  </option>
                  <option value="IF-ELSE">IF-ELSE</option>
                  <option value="FOR-WHILE LOOPS">FOR-WHILE LOOPS</option>
                  <option value="LIST, DICTIONARY, TUPLE, SETS">
                    LIST, DICTIONARY, TUPLE, SETS
                  </option>
                  <option value="FUNCTIONS">FUNCTIONS</option>
                  <option value="STRINGS">STRINGS</option>
                  <option value="ALGORITHMS">ALGORITHMS</option>
                  <option value="RECURSION">RECURSION</option>

                  <option value="FILE-I/O">FILE-I/O</option>
                </select>
              </div>
              <div className={styles.description}>
                <h2 className={styles.h2}>Question Description</h2>
                <textarea
                  className={styles.textarea}
                  name="question"
                  placeholder="Enter description..."
                ></textarea>
              </div>
              <div className={styles.difficulty}>
                <h2 className={styles.h2}>
                  Difficulty:
                  <Rating name="difficulty" defaultValue={2} size="large" />
                </h2>
              </div>
              <div className={styles.link}>
                <h2 className={styles.h2}>Question Link</h2>
                <input
                  className={styles.input}
                  name="link"
                  placeholder="Enter link..."
                />
              </div>
              <div className={styles.samples}>
                <div className={styles["test-case-header"]}>
                  <h2>Sample Testcases</h2>

                  <IconButton onClick={onAddSampleCase}>
                    <AddCircle />
                  </IconButton>
                </div>

                {sampleTestCases.length > 0 && (
                  <div className={styles["test-cases"]}>
                    {sampleTestCases?.map((item, index) => {
                      return (
                        <TestCaseInput
                          index={index}
                          id={item.id}
                          remove={onDeleteSampleCase}
                          inputOnChange={handleSampleOnChangeInput}
                          outputOnChange={handleSampleOnChangeOutput}
                          inputValue={item.input}
                          outputValue={item.output}
                          isHidden={false}
                        />
                      );
                    })}
                  </div>
                )}
              </div>

              <br />
              <div className={styles.hidden}>
                <div className={styles["test-case-header"]}>
                  <h2>Hidden Testcases</h2>

                  <IconButton onClick={onAddHiddenCase}>
                    <AddCircle />
                  </IconButton>
                </div>

                {hiddenTestCases.length > 0 && (
                  <div className={styles["test-cases"]}>
                    {hiddenTestCases?.map((item, index) => {
                      return (
                        <TestCaseInput
                          index={index}
                          id={item.id}
                          remove={onDeleteHiddenCase}
                          inputOnChange={handleHiddenOnChangeInput}
                          outputOnChange={handleHiddenOnChangeOutput}
                          inputValue={item.input}
                          outputValue={item.output}
                          isHidden={true}
                        />
                      );
                    })}
                  </div>
                )}
              </div>

              <br />
              <div className={styles.buttons}>
                <Button
                  type="submit"
                  style={{ borderRadius: 50 }}
                  variant="contained"
                  color="primary"
                >
                  Submit
                </Button>
              </div>
            </form>
          ) : (
            <form
              action="http://localhost:9000/insert/mc"
              method="POST"
              onSubmit={handleMCQSubmit}
            >
              <div className={styles.category}>
                <h2 className={styles.h2}>Question Topic</h2>
                <select className={styles.select} name="topic" id="topic">
                  <option value="PRINT STATEMENTS AND INPUT STATEMENTS">
                    PRINT STATEMENTS AND INPUT STATEMENTS
                  </option>
                  <option value="IF-ELSE">IF-ELSE</option>
                  <option value="FOR-WHILE LOOPS">FOR-WHILE LOOPS</option>
                  <option value="LIST, DICTIONARY, TUPLE, SETS">
                    LIST, DICTIONARY, TUPLE, SETS
                  </option>
                  <option value="FUNCTIONS">FUNCTIONS</option>
                  <option value="STRINGS">STRINGS</option>
                  <option value="ALGORITHMS">ALGORITHMS</option>
                  <option value="RECURSION">RECURSION</option>

                  <option value="FILE-I/O">FILE-I/O</option>
                </select>
              </div>
              <div className={styles.description}>
                <h2 className={styles.h2}>Question Description</h2>
                <textarea
                  className={styles.textarea}
                  name="description"
                  placeholder="Enter description..."
                ></textarea>
              </div>
              <div>
                <h2 className={styles.h2}>Choices</h2>
                <input
                  className={styles.input}
                  name="choices"
                  id="choices"
                  placeholder="Enter choice A..."
                />
                <br />
                <input
                  className={styles.input}
                  name="choices"
                  id="choices"
                  placeholder="Enter choice B..."
                />
                <br />
                <input
                  className={styles.input}
                  name="choices"
                  id="choices"
                  placeholder="Enter choice C..."
                />
                <br />
                <input
                  className={styles.input}
                  name="choices"
                  id="choices"
                  placeholder="Enter choice D..."
                />
                <br />
                <input
                  className={styles.input}
                  name="choices"
                  id="choices"
                  placeholder="Enter choice E..."
                />
                <h2 className={styles.h2}>Correct Answer</h2>
                <select className={styles.select} name="answer" id="answer">
                  <option value="0">A</option>
                  <option value="1">B</option>
                  <option value="2">C</option>
                  <option value="3">D</option>
                  <option value="4">E</option>
                </select>
              </div>

              <div className={styles.buttons}>
                <Button
                  type="submit"
                  style={{ borderRadius: 50 }}
                  variant="contained"
                  color="primary"
                >
                  Submit
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
TAQuestionInput.propTypes = {};

export default TAQuestionInput;
