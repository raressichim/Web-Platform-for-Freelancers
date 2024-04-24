import HomePage from "./components/home/HomePage";
import LogInForm from "./components/authentication/LogInForm";
import SignUpForm from "./components/authentication/SignUpForm";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Profile from "./components/profile/Profile";
import BecomeSeller from "./components/profile/BecomeSeller";
import UserProfile from "./components/profile/UserProfile";
import SellerDashboard from "./components/sellerCommands/SellerBoard";
import YourGigs from "./components/sellerCommands/YourGigs";
import SellerProfile from "./components/profile/SellerProfile";
import GigDetails from "./components/Gig/GigDetails";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LogInForm />} />
          <Route path="/signup" element={<SignUpForm />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/becomeSeller" element={<BecomeSeller />} />
          <Route path="/userProfile" element={<UserProfile />} />
          <Route path="/sellerBoard" element={<SellerDashboard />} />
          <Route path="/yourGigs" element={<YourGigs />}></Route>
          <Route path="/sellerProfile/:sellerId" element={<SellerProfile />} />
          <Route path="/gig/:gigId" element={<GigDetails />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
