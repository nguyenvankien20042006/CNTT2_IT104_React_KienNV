import { Route, Routes } from "react-router-dom";
import PostList from "./pages/posts/PostList";
import PostDetail from "./pages/posts/PostDetail";
import FormPost from "./pages/posts/FormPost";

export default function App() {
  return (
    <div>
      <Routes>
        <Route path="/post-list" element={<PostList />} />
        <Route path="/post-detail/:id" element={<PostDetail />} />
        <Route path="/create-post" element={<FormPost />} />
      </Routes>
    </div>
  );
}
