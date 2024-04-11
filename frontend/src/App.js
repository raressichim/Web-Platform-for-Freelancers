import SearchBar from "./components/home/SearchBar";
import LogInForm from "./components/authentication/LogInForm";
import SignUpForm from "./components/authentication/SignUpForm";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Profile from "./components/profile/Profile";
import BecomeSeller from "./components/profile/BecomeSeller";
import UserProfile from "./components/profile/UserProfile";
import SellerDashboard from "./components/sellerBoard/SellerBoard";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SearchBar />}></Route>
          <Route path="/login" element={<LogInForm />}></Route>
          <Route path="/signup" element={<SignUpForm />}></Route>
          <Route path="/profile" element={<Profile />}></Route>
          <Route path="/becomeSeller" element={<BecomeSeller />}></Route>
          <Route path="/userProfile" element={<UserProfile />}></Route>
          <Route path="/sellerBoard" element={<SellerDashboard />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
