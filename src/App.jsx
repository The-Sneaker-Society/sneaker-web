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
import PaymentStatus from "./pages/PaymentStatus/PaymentStatus";
import SignUpUser from "./pages/Signup User/SignupUser";
import { LoginV2 } from "./pages/Login/LoginV2";
import React from "react";
import UserSignupPage from "./pages/SignupPage/UserSIgnupPage";
import StripeSubsriptionPage from "./pages/StripeSubsriptionPage";
import Dashboard from "./pages/Dashboard/Dashboard";
import UpdateProfilePage from "./pages/UpdateProfilePage/UpdateProfilePage";
import { ContractPage } from "./pages/ContractsPage/Contracts";
import { ChatDashboard } from "./pages/Chats/ChatDashboard";
import { ContractReviewPage } from "./pages/ContractsPage/ContractReviewPage";

function App() {
  const [theme, colorMode] = useMode();

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="App">
          <div className="content-container">
            <Routes>
              {/* Public Routes */}
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
              <Route path="member/signup" element={<SignupMember />} />
              <Route path="user/signup" element={<SignUpUser />} />

              {/* Protected Routes - Member */}
              <Route
                path="/member/stripe"
                element={
                  <ProtectedRoute>
                    <StripeSubsriptionPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="member/chats"
                element={
                  <ProtectedRoute>
                    <ChatDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="member/contract/:id"
                element={
                  <ProtectedRoute>
                    <ContractReviewPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="member/signup-info"
                element={
                  <ProtectedRoute withLayout={false}>
                    <SignupPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="member/contracts"
                element={
                  <ProtectedRoute>
                    <ContractPage />
                  </ProtectedRoute>
                }
              />

              {/* Protected Routes - User */}
              <Route
                path="user/signup-info"
                element={
                  <ProtectedRoute withLayout={false}>
                    <UserSignupPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="user/update-profile"
                element={
                  <ProtectedRoute>
                    <UpdateProfilePage />
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
