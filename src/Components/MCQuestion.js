import React, { useState, useEffect } from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Button from "@mui/material/Button";
const MCQuestion = ({ q, index, score, setScore }) => {
  const [value, setValue] = useState(0);
  const [isDisable, setIsDisable] = useState(false);
  const handleRadioChange = (event) => {
    setValue(+event.target.value);
  };
  useEffect(() => {
    setValue(0);
    setIsDisable(false);
  }, [q]);
  const handleSubmit = (e) => {
    e.preventDefault();

    if (value === q.answer) {
      console.log("correct!");
      setScore(score + 1);
      setIsDisable(true);
    } else {
      console.log("wrong");
    }
  };
  return (
    <div
      style={{
        marginLeft: 10,
        marginTop: 30,
        marginBottom: 30,
      }}
    >
      <form onSubmit={handleSubmit}>
        <FormControl component="fieldset">
          <FormLabel
            sx={{ fontSize: 20, fontWeight: "bold" }}
            component="legend"
            color="primary"
          >
            <div style={{ whiteSpace: "pre-wrap" }}>
              {index + 1}. {q.description}
            </div>
          </FormLabel>
          <RadioGroup
            name={"radio-buttons-group" + index}
            value={value}
            onChange={handleRadioChange}
          >
            {q.choices.map((c, c_index) => (
              <FormControlLabel
                key={"q" + index + "c" + c_index}
                disabled={isDisable ? true : false}
                value={c_index}
                control={<Radio />}
                label={c}
              />
            ))}
          </RadioGroup>
          <Button
            type="submit"
            disabled={isDisable ? true : false}
            variant="contained"
            style={{ width: 160 }}
          >
            Submit Answer
          </Button>
        </FormControl>
      </form>
    </div>
  );
};

export default MCQuestion;
