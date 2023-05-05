import React, { useState } from "react";
import styles from "../Styles/CreatePost.module.scss";
import { Button } from "@mui/material";
import { useParams } from "react-router-dom";

const CreatePost = ({ close }) => {
  const params = useParams();
  const [title, setTitle] = useState("");
  const [user, setUser] = useState(
    localStorage.getItem("loginName")
      ? localStorage.getItem("loginName")
      : "Anonymous"
  );
  const [description, setDescription] = useState("");
  const onClear = () => {
    setTitle("");
    setDescription("");
  };
  const handleSubmit = () => {
    let isValid = true;
    if (description === "") {
      isValid = false;
      alert("Description is empty.");
    } else if (user === "") {
      isValid = false;
      alert("User is empty.");
    } else if (title === "") {
      isValid = false;
      alert("Title is empty.");
    }
    if (isValid) {
      let options = {
        method: "POST",
        body: JSON.stringify({
          user: user,
          title: title,
          description: description,
          question_id: params.id,
        }),
        headers: {
          "Content-type": "application/json",
        },
      };
      fetch(`http://localhost:9000/insert/posts`, options)
        .then((res) => {
          console.log(res);
          //   window.location.reload();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  return (
    <div>
      {/* Post title */}
      <div>
        <h2 className={styles.h2}>Title</h2>
        <input
          className={styles.input}
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
          type="text"
          placeholder="Enter the title..."
          name="title"
        />
      </div>
      {/* user name */}
      <div>
        <h2 className={styles.h2}>User Name</h2>
        <input
          className={styles.input}
          value={user}
          disabled={true}
          type="text"
          placeholder="Enter the user name..."
          name="user"
        />
      </div>
      {/* post description */}
      <div>
        <h2 className={styles.h2}>Description</h2>
        <textarea
          className={styles.textarea}
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
          }}
          name="description"
          placeholder="Enter description..."
        ></textarea>
      </div>
      <div className={styles.buttons}>
        <Button
          type="button"
          style={{ borderRadius: 50, marginRight: 5 }}
          variant="contained"
          color="primary"
          onClick={() => {
            onClear();
          }}
        >
          Clear
        </Button>
        <Button
          type="button"
          style={{ borderRadius: 50 }}
          variant="contained"
          color="primary"
          onClick={() => {
            handleSubmit();
            close();
            window.location.reload();
          }}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default CreatePost;
