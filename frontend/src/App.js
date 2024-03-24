import SearchBar from "./components/home/SearchBar";
import LogInForm from "./components/authentication/LogInForm";
import SignUpForm from "./components/authentication/SignUpForm";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Profile from "./components/profile/Profile";
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SearchBar />}></Route>
          <Route path="/login" element={<LogInForm />}></Route>
          <Route path="/signup" element={<SignUpForm />}></Route>
          <Route path="/profile" element={<Profile />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
