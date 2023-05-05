import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import styles from "../Styles/StudentDashboard.module.css";
import Collapsible from "react-collapsible";
import MCPanel from "./MCPanel";
import Auth from "./Auth";

const TAList = ["eric3058@connect.hku.hk"];

function StudentDashboard() {
  const [questions, setQuestions] = useState([]);
  const [mcQuestions, setMCQuestions] = useState([]);
  const [category, setCategory] = useState(
    "PRINT STATEMENTS AND INPUT STATEMENTS"
  );
  const [curUser, setCurUser] = useState(
    localStorage.getItem("loginEmail")
      ? localStorage.getItem("loginEmail")
      : null
  );
  const navigate = useNavigate();

  useEffect(() => {
    console.log(curUser);
  });

  // get all coding questions
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
  // get all MC questions
  useEffect(() => {
    let ignore = false;
    async function getMCQuestions() {
      // need new API here
      const res = await fetch("http://localhost:9000/mc");
      let data;
      try {
        data = await res.json();
      } catch (err) {
        console.log(err);
        return;
      }
      console.log(data);
      if (!ignore) setMCQuestions(data);
    }
    getMCQuestions();
    return () => {
      ignore = true;
    };
  }, []);
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            margin: "5px",
          }}
        >
          <Link to="/" style={{ textDecoration: "none" }}>
            <div className={styles.logo}>Python Learning</div>
          </Link>
          <Auth />
        </div>
      </div>
      <div className={styles.body}>
        <div className={styles.question}>
          {[...new Set(questions.map((q) => q.topic))].map((topic) => (
            <div key={topic}>
              <Collapsible trigger={topic}>
                <Button
                  className={styles.button}
                  onClick={() => {
                    setCategory(topic);
                  }}
                  variant="contained"
                >
                  Multiple Choice
                </Button>
                {questions
                  .filter((q) => q.topic === topic)
                  .map((q, index) => (
                    <Button
                      key={index.toString()}
                      variant="text"
                      onClick={() => {
                        navigate("/questions/" + q._id);
                      }}
                      className={styles.button}
                    >
                      {q.title}
                    </Button>
                  ))}
              </Collapsible>
            </div>
          ))}
          {TAList.includes(curUser) && (
            <Button
              className={styles.button}
              onClick={() => {
                navigate("/TAInput");
              }}
            >
              To TA Input
            </Button>
          )}
        </div>

        <div className={styles.main}>
          <MCPanel
            mcQuestions={mcQuestions.filter((q) => q.topic === category)}
          />
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
