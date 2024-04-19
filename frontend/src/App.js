import SearchBar from "./components/home/SearchBar";
import LogInForm from "./components/authentication/LogInForm";
import SignUpForm from "./components/authentication/SignUpForm";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Profile from "./components/profile/Profile";
import BecomeSeller from "./components/profile/BecomeSeller";
import UserProfile from "./components/profile/UserProfile";
import SellerDashboard from "./components/sellerCommands/SellerBoard";
import YourGigs from "./components/sellerCommands/YourGigs";
import SellerProfile from "./components/profile/SellerProfile";
import GigDetailsPage from "./components/Gig/GigDetails";

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
          <Route path="/yourGigs" element={<YourGigs />}></Route>
          <Route path="/gigDetails/:id" element={GigDetailsPage}></Route>
          <Route path="/sellerProfile" element={<SellerProfile />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
