import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import CoverPage from "./pages/CoverPage";
import AllTasks from "./pages/AllTasks";
import NewTask from "./pages/NewTask";
import EditPage from "./pages/EditPage";
import ErrorPage from "./pages/Error";
import Layout from "./layout/Layout";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<CoverPage />} />
          <Route path="/alltasks" element={<AllTasks />} />
          <Route path="/newtask" element={<NewTask />} />
          <Route path="/edit/:id" element={<EditPage />} />
        </Route>
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
