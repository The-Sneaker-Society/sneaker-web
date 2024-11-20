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
import { ApolloProvider } from "@apollo/client";
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { Dashboard } from "./pages/Dashboard/Dashboard";
import { Blockers } from "./components/Blockers";
import CheckYourEmail from "./pages/ForgotPassword/CheckYourEmail";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import PasswordReset from "./pages/ForgotPassword/PasswordReset";
import SetANewPassword from "./pages/ForgotPassword/SetANewPassword";
import SuccessfulPage from "./pages/ForgotPassword/SuccessfulPage";

function App() {
  // const { status } = useContext(AuthContext);
  const [theme, colorMode] = useMode();

  const httpLink = createHttpLink({
    uri: `${import.meta.env.VITE_API_URL}/graphql`,
  });

  const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    const token = localStorage.getItem("authToken");
    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      },
    };
  });

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });

  return (
    <ApolloProvider client={client}>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <div className="App">
            <div className="content-container">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/logout" element={<LogoutPage />} />
                <Route path="stripeOnboarding" element={<StripeSignupPage />} />
                <Route path="/ForgotPassword" element={<ForgotPassword />} />
                <Route path="/CheckYourEmail" element={<CheckYourEmail />} />
                <Route path="/PasswordReset" element={<PasswordReset />} />
                <Route path="/SetANewPassword" element={<SetANewPassword />} />
                <Route path="/SuccessfulPage" element={<SuccessfulPage />} />

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
    </ApolloProvider>
  );
}

export default App;
