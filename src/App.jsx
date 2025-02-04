import { Route, Routes } from "react-router-dom";
import "./App.css";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { useMode, ColorModeContext } from "./theme/theme";
import HomePage from "./pages/HomePage/HomePage";
import SignupPage from "./pages/SignupPage/SignupPage";
import ErrorPage from "./pages/ErrorPage";
import StripeSignupPage from "./pages/StripeSignUpPage/StripeSignupPage";
import LoginPage from "./pages/Login/LoginPage";
import { LogoutPage } from "./pages/Logout/LogoutPage";
import SignupMember from "./pages/SignUpMemberPage/SignUpMemberPage";
import { ProtectedRoute } from "./components/PrivateRoute";
import { Dashboard } from "./pages/Dashboard/Dashboard";
import { Blockers } from "./components/Blockers";
import PaymentStatus from "./pages/PaymentStatus/PaymentStatus";
import SignUpUser from "./pages/Signup User/SignupUser";
import CheckYourEmail from "./pages/ForgotPassword/CheckYourEmail";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import PasswordReset from "./pages/ForgotPassword/PasswordReset";
import SetANewPassword from "./pages/ForgotPassword/SetANewPassword";
import SuccessfulPage from "./pages/ForgotPassword/SuccessfulPage";
import StripePage from "./pages/StripePage";
import { LoginV2 } from "./pages/Login/LoginV2";

import React from "react";

function App() {
  // const { status } = useContext(AuthContext);
  const [theme, colorMode] = useMode();

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="App">
          <div className="content-container">
            <Routes>
              <Route path="/test" element={<LoginV2 />} />
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/logout" element={<LogoutPage />} />
              <Route path="stripeOnboarding" element={<StripeSignupPage />} />
              <Route
                path="/paymentSuccess/:contractId"
                element={<PaymentStatus success={true} />}
              />
              <Route
                path="/paymentFail/:contractId"
                element={<PaymentStatus success={false} />}
              />
              <Route path="/ForgotPassword" element={<ForgotPassword />} />
              <Route path="/CheckYourEmail" element={<CheckYourEmail />} />
              <Route path="/PasswordReset" element={<PasswordReset />} />
              <Route path="/SetANewPassword" element={<SetANewPassword />} />
              <Route path="/SuccessfulPage" element={<SuccessfulPage />} />
              <Route
                path="/member/stripe"
                element={
                  <ProtectedRoute>
                    <StripePage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/paymentSuccess/:contractId"
                element={<PaymentStatus success={true} />}
              />
              <Route
                path="/paymentFail/:contractId"
                element={<PaymentStatus success={false} />}
              />
              <Route
                path="/dashboard"
                element={
                  <>
                    <Blockers />
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  </>
                }
              />
              <Route path="member/signup" element={<SignupMember />} />
              <Route path="user/signup" element={<SignUpUser />} />
              <Route
                path="/signup"
                element={
                  <ProtectedRoute>
                    <SignupPage />
                  </ProtectedRoute>
                }
              />
              {/* Error Page Route */}
              <Route path="*" element={<ErrorPage />} />
            </Routes>
          </div>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
