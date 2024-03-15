import SearchBar from "./components/SearchBar";
import LogInForm from "./components/LogInForm";
import SignUpForm from "./components/SignUpForm";
import { BrowserRouter, Routes, Route } from "react-router-dom";
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SearchBar />}></Route>
          <Route path="/login" element={<LogInForm />}></Route>
          <Route path="/signup" element={<SignUpForm />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
