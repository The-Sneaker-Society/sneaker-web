import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import { ClerkProvider } from "@clerk/clerk-react";
import ApolloProviderWithAuth from "./ApolloProviderWithAuth";
import { UserProvider } from "./context/UserContext";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <BrowserRouter>
        <ApolloProviderWithAuth>
          <AuthProvider>
            <UserProvider>
              <App />
            </UserProvider>
          </AuthProvider>
        </ApolloProviderWithAuth>
      </BrowserRouter>
    </ClerkProvider>
  </React.StrictMode>
);
