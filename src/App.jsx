import React from "react";
import { Route, Routes } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";

import "./App.css";

import { useMode, ColorModeContext } from "./theme/theme";

import HomePage from "./pages/HomePage/HomePage";
import AboutUs from "./pages/HomePage/AboutUs";
import ErrorPage from "./pages/ErrorPage";
import StripeSignupPage from "./pages/StripeSignUpPage/StripeSignupPage";
import LoginPage from "./pages/Login/LoginPage";
import { LogoutPage } from "./pages/Logout/LogoutPage";
import SignupMember from "./pages/SignUpMemberPage/SignUpMemberPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import PaymentStatus from "./pages/PaymentStatus/PaymentStatus";
import SignUpUser from "./pages/Signup User/SignupUser";
import { LoginV2 } from "./pages/Login/LoginV2";
import UserSignupCallback from "./pages/UserSignupCallback/UserSignupCallback";
import SignUpCallback from "./pages/SignUpCallback/SignUpCallback";
import LoginSSOCallback from "./pages/LoginSSOCallback/LoginSSOCallback";
import DashboardRouter from "./routes/DashboardRouter";
import MemberRoutes from "./routes/MemberRoutes";
import UserRoutes from "./routes/UserRoutes";
import MySociety from "./pages/Dashboard/Discover";

function App() {
  const [theme, colorMode] = useMode();

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />

        <div className="App">
          <div className="content-container">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/test" element={<LoginV2 />} />
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/login/sso-callback"
                element={<LoginSSOCallback />}
              />
              <Route path="/logout" element={<LogoutPage />} />
              <Route path="/stripeOnboarding" element={<StripeSignupPage />} />
              <Route
                path="/paymentSuccess/:contractId"
                element={<PaymentStatus success />}
              />
              <Route
                path="/paymentFail/:contractId"
                element={<PaymentStatus success={false} />}
              />
              <Route path="/member/signup" element={<SignupMember />} />
              <Route path="/user/signup" element={<SignUpUser />} />
              <Route
                path="/user/signup/callback"
                element={<UserSignupCallback />}
              />
              <Route path="/mysociety" element={<MySociety />} />

              {/* Shared protected dashboard route */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute requireRole={["member", "client"]}>
                    <DashboardRouter />
                  </ProtectedRoute>
                }
              />

              {/* Protected member routes */}
              <Route
                path="/member/*"
                element={
                  <ProtectedRoute requireRole="member">
                    <MemberRoutes />
                  </ProtectedRoute>
                }
              />

              {/* Protected client routes */}
              <Route
                path="/user/*"
                element={
                  <ProtectedRoute requireRole="client">
                    <UserRoutes />
                  </ProtectedRoute>
                }
              />

              {/* Fallback route */}
              <Route path="*" element={<ErrorPage />} />
            </Routes>
          </div>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
