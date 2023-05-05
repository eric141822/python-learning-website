import React, { useState, useEffect } from "react";
import MCQuestion from "./MCQuestion";

const MCPanel = ({ mcQuestions }) => {
  const [score, setScore] = useState(0);
  useEffect(() => {
    setScore(0);
  }, [mcQuestions]);
  return (
    <div>
      <div
        style={{
          position: "absolute",
          top: 96,
          right: 10,
          borderRadius: 5,
          borderStyle: "solid",
          padding: 5,
        }}
      >
        <span style={{ fontWeight: "bold", fontSize: 30 }}>
          {score} / {mcQuestions.length}
        </span>
      </div>
      {mcQuestions.map((q, index) => (
        <MCQuestion
          key={index.toString()}
          q={q}
          index={index}
          score={score}
          setScore={setScore}
        />
      ))}
    </div>
  );
};

export default MCPanel;
