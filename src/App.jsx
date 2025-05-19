import React from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { useMode, ColorModeContext } from "./theme/theme";
import HomePage from "./pages/HomePage/HomePage";
import ErrorPage from "./pages/ErrorPage";
import StripeSignupPage from "./pages/StripeSignUpPage/StripeSignupPage";
import LoginPage from "./pages/Login/LoginPage";
import { LogoutPage } from "./pages/Logout/LogoutPage";
import SignupMember from "./pages/SignUpMemberPage/SignUpMemberPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
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
import { ContractForm } from "./pages/ContractForm/ContractForm";
import ShippingInfo from "./components/ShippingInfoModal/ShippingInfoModal";
import DashboardRouter from "./routes/DashboardRouter";

import MemberRoutes from "./routes/MemberRoutes";
import UserRoutes from "./routes/UserRoutes";

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
              <Route path="/shippinginfo" element={<ShippingInfo />} />
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

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute requireRole={["member", "client"]}>
                    <DashboardRouter />
                  </ProtectedRoute>
                }
              />

              {/* Protected Routes - Member */}
              <Route
                path="/member/*"
                element={
                  <ProtectedRoute requireRole="member">
                    <MemberRoutes />
                  </ProtectedRoute>
                }
              />

              {/* Protected Routes - User */}
              <Route
                path="/user/*"
                element={
                  <ProtectedRoute requireRole="client">
                    <UserRoutes />
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
