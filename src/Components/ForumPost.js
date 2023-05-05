import React, { useState, useEffect } from "react";
import styles from "../Styles/ForumPost.module.scss";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
const contentStyle = { borderRadius: 10 };

const ForumPost = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [post, setPost] = useState();
  const [user, setUser] = useState(
    localStorage.getItem("loginName")
      ? localStorage.getItem("loginName")
      : "Anonymous"
  );
  const [comment, setComment] = useState("");
  useEffect(() => {
    let ignore = false;
    async function getPost() {
      console.log(params.post_id);
      const res = await fetch(`http://localhost:9000/posts/${params.post_id}`);
      let data;
      try {
        data = await res.json();
      } catch (err) {
        console.log(err);
        return;
      }
      console.log(data);
      if (!ignore) setPost(data);
    }
    getPost();
    return () => {
      ignore = true;
    };
  }, [params.post_id]);
  const handleComment = () => {
    let isValid = true;
    if (comment === "") {
      isValid = false;
      alert("Comment is empty.");
    } else if (user === "") {
      isValid = false;
      alert("User is empty.");
    }
    if (isValid) {
      let options = {
        method: "PUT",
        body: JSON.stringify({
          user: user,
          comment: comment,
        }),
        headers: {
          "Content-type": "application/json",
        },
      };
      fetch(`http://localhost:9000/insert/posts/${params.post_id}`, options)
        .then((res) => {
          console.log(res);
          window.location.reload();
        })
        .catch((err) => {
          console.log(err);
        });
    }
    return isValid;
  };
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
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Button
              className={styles.navButton}
              variant="contained"
              onClick={() => {
                navigate(`/questions/${params.id}`);
              }}
            >
              Back to Question
            </Button>
            <Button
              className={styles.navButton}
              variant="contained"
              onClick={() => {
                navigate(`/questions/forum/${params.id}`);
              }}
            >
              Back to Discussion
            </Button>
          </div>
        </div>
      </div>
      <div>
        <Popup
          className={styles.post_popup}
          trigger={
            <Button variant="text" className={styles.button}>
              Create Comment
            </Button>
          }
          modal
          {...{ contentStyle }}
        >
          {(close) => (
            <div className={styles.modal}>
              <div>
                <div>
                  <h2 className={styles.h2}>User Name</h2>
                  <input
                    className={styles.input}
                    type="text"
                    placeholder="Enter the user name..."
                    name="user"
                    value={user}
                    disabled={true}
                  />
                </div>
                {/* comment */}
                <div>
                  <h2 className={styles.h2}>Comment</h2>
                  <textarea
                    className={styles.textarea}
                    name="comment"
                    placeholder="Enter comment..."
                    value={comment}
                    onChange={(e) => {
                      setComment(e.target.value);
                    }}
                  ></textarea>
                </div>
                <div className={styles.buttons}>
                  <Button
                    type="button"
                    style={{ borderRadius: 50, marginRight: 5 }}
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      setUser("");
                      setComment("");
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
                      handleComment();
                    }}
                  >
                    Create
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Popup>
      </div>

      <div>
        {post && (
          <div className={styles.mainWrapper}>
            <div className={styles.mainPost}>
              <div className={styles.postHeader}>
                <div>
                  <h2>{post.title}</h2>
                </div>
                <div>
                  <span>Posted by: {post.user}</span>
                </div>
              </div>
              <div className={styles.postDesc}>
                <p>{post.description}</p>
              </div>
            </div>
            <div>
              <h3>Comments:</h3>
            </div>
            <div className={styles.comments}>
              {post.comments.length > 0 ? (
                post.comments.map((c) => (
                  <div key={c.user} className={styles.comment}>
                    <div className={styles.commentUser}>
                      <span>{c.user}</span>
                    </div>
                    <div className={styles.commentDesc}>
                      <p>{c.comment}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div>No comemnts found.</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForumPost;
