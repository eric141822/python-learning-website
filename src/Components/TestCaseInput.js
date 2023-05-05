import React from "react";
import PropTypes from "prop-types";
import styles from "../Styles/TestCaseInput.module.css";
import { IconButton } from "@material-ui/core";
import { Delete } from "@material-ui/icons";
const TestCaseInput = ({
  index,
  id,
  remove,
  inputOnChange,
  outputOnChange,
  inputValue,
  outputValue,
  isHidden,
}) => {
  const onDelete = () => {
    remove(id);
  };
  return (
    <div>
      <h4>#{index + 1}</h4>
      <input
        type="text"
        name={isHidden ? "input_hidden" : "input"}
        className={styles.input}
        placeholder="Enter input..."
        value={inputValue}
        onChange={(event) => {
          inputOnChange(id, event.target.value);
        }}
      ></input>
      <input
        type="text"
        name={isHidden ? "output_hidden" : "output"}
        className={styles.input}
        placeholder="Enter output..."
        value={outputValue}
        onChange={(event) => {
          outputOnChange(id, event.target.value);
        }}
      ></input>
      <IconButton onClick={onDelete}>
        <Delete />
      </IconButton>
    </div>
  );
};

TestCaseInput.propTypes = {
  id: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
  inputOnChange: PropTypes.func.isRequired,
  outputOnChange: PropTypes.func.isRequired,
  remove: PropTypes.func.isRequired,
  inputValue: PropTypes.string,
  outputValue: PropTypes.string,
};

export default TestCaseInput;
