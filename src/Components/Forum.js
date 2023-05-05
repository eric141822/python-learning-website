import React, { useState, useEffect } from "react";
import styles from "../Styles/Forum.module.scss";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import CreatePost from "./CreatePost";

import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

const contentStyle = { borderRadius: 10 };

const Forum = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [questionTitle, setQuestionTitle] = useState("");
  // query all posts by question_id
  useEffect(() => {
    let ignore = false;
    async function getPosts() {
      const res = await fetch("http://localhost:9000/posts");
      let data;
      try {
        data = await res.json();
      } catch (err) {
        console.log(err);
        return;
      }
      console.log(data);
      if (!ignore) {
        data = data.filter((d) => d.question_id === params.id);
        setPosts(data);
      }
    }
    async function getQuestion() {
      const res = await fetch(`http://localhost:9000/questions/${params.id}`);
      const data = await res.json();
      console.log(data);
      if (!ignore) {
        setQuestionTitle(data.title);
      }
    }
    getPosts();
    getQuestion();

    return () => {
      ignore = true;
    };
  }, [params.id]);

  return (
    <div className={styles.content}>
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
              navigate(`/questions/${params.id}`);
            }}
          >
            Back to Question
          </Button>
        </div>
      </div>
      {/* Create Post Button */}

      <div className={styles.fullWrapper}>
        <div>
          <Popup
            className={styles.post_popup}
            trigger={
              <Button variant="text" className={styles.button}>
                Create Post
              </Button>
            }
            modal
            {...{ contentStyle }}
          >
            {(close) => (
              <div className={styles.modal}>
                <CreatePost close={close} />
              </div>
            )}
          </Popup>
        </div>
        {/* question title */}
        <div>
          <h2 className={styles.h2}>{questionTitle}</h2>
        </div>
        {/* posts */}
        <div className={styles.posts}>
          {posts.length > 0 ? (
            posts.map((post) => (
              <div key={post._id} className={styles.post}>
                {/* title ans user */}
                <div>
                  <Link
                    to={`view/${post._id}`}
                    style={{ textDecoration: "none" }}
                  >
                    <h3>{post.title}</h3>
                  </Link>
                </div>
                <div>Posted By: {post.user}</div>
              </div>
            ))
          ) : (
            <div>No posts found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Forum;
