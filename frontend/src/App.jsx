import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";

import AuthContextProvider from "./context/AuthContextProvider";
import { AuthContext } from "./context/AuthContext"

// pages & components
import Navbar from "./components/Navbar";
import Home from "./pages/HomePage";
import AddJobPage from "./pages/AddJobPage";
import JobPage from "./pages/JobPage";
import EditJobPage from "./pages/EditJobPage";
import NotFoundPage from "./pages/NotFoundPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

const App = () => {
  const { isAuthenticated } = useContext(AuthContext)

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/jobs/:id" element={<JobPage />} />
            {isAuthenticated && <Route path="/add-job" element={<AddJobPage />} />}
            {isAuthenticated && <Route path="/edit-job/:id" element={<EditJobPage />} />}
            {!isAuthenticated && <Route path="/signup" element={<Signup />} />}
            {!isAuthenticated && <Route path="/login" element={<Login />} />}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div >
  );
};

export default App;
