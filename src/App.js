import TAQuestionInput from "./Components/TAQuestionInput";
import StudentDashboard from "./Components/StudentDashboard";
import Playground from "./Components/Playground";
import Forum from "./Components/Forum";
import ForumPost from "./Components/ForumPost";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Helmet } from "react-helmet";

function App() {
  return (
    <div>
      <Helmet>
        <title>Python Learning</title>
      </Helmet>
      <Router>
        <Routes>
          <Route path="/questions/:id" element={<Playground />} />
          <Route path="/questions/forum/:id" element={<Forum />}></Route>
          <Route
            path="/questions/forum/:id/view/:post_id"
            element={<ForumPost />}
          />
          <Route path="/TAInput" element={<TAQuestionInput />} />
          <Route index element={<StudentDashboard />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
