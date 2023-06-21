import "./App.css";
import { Route, Routes } from "react-router-dom";
import DashBoard from "./pages/dashboard/dashboard";
import LandingPage from "./pages/landing_page/landing_page";
import ReDirectPage from "./pages/redirect/redirect";
import PrivateRoute from "./general/private_route/private_route";
import HomePage from "./pages/home/home";
import SearchPage from "./pages/search/search";
import ProfilePage from "./pages/profile/profile";
import LoginPage from "./pages/login/login";
import SignUpPage from "./pages/signup/signup";
import PublicRoute from "./general/public_route/public_route";
import LogOutPage from "./pages/logout/logout";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route element={<PrivateRoute />}>
          <Route exact path="/" element={<HomePage />} />
          <Route exact path="/search" element={<SearchPage />} />
          <Route exact path="/profile" element={<ProfilePage />} />
          <Route path="/analyse/*" element={<DashBoard />} />
          <Route path="/logout" element={<LogOutPage />} />
        </Route>
        <Route element={<PublicRoute />}>
          <Route exact path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/landingPage" element={<LandingPage />} />
        </Route>
        <Route path="*" element={<ReDirectPage />} />
      </Routes>
    </div>
  );
}

export default App;
