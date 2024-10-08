import HomePage from "./components/home/HomePage";
import LogInForm from "./components/authentication/LogInForm";
import SignUpForm from "./components/authentication/SignUpForm";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Profile from "./components/profile/Profile";
import BecomeSeller from "./components/profile/BecomeSeller";
import UserProfile from "./components/profile/UserProfile";
import GigForm from "./components/Gig/GigForm";
import YourGigs from "./components/Gig/YourGigs";
import SellerProfile from "./components/profile/SellerProfile";
import GigDetails from "./components/Gig/GigDetails";
import GigUpdateView from "./components/Gig/GigUpdateView";
import SearchResult from "./components/search/SearchResult";
import SellerBoard from "./components/home/SellerBoard";
import ProductsBoard from "./components/home/Products";
import PaymentForm from "./components/payment/Payment";

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
          <Route path="/addGig" element={<GigForm />} />
          <Route path="/sellerBoard" element={<SellerBoard />} />
          <Route path="/yourGigs" element={<YourGigs />}></Route>
          <Route path="/sellerProfile/:sellerId" element={<SellerProfile />} />
          <Route path="/gig/:gigId" element={<GigDetails />} />
          <Route path="gigUpdate/:gigId" element={<GigUpdateView />} />
          <Route path="searchResults" element={<SearchResult />} />
          <Route path="myProducts" element={<ProductsBoard />} />
          <Route path="pay" element={<PaymentForm />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
