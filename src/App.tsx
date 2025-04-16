import { Suspense, lazy } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/home";
import LoginPage from "./components/auth/LoginPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import routes from "tempo-routes";
import userData from "@/data/users.json";

// Lazy load components
const MintNewSupply = lazy(() => import("./components/minting/MintNewSupply"));
const AccountsPage = lazy(() => import("./components/accounts/AccountsPage"));
const ProfilePage = lazy(() => import("./components/profile/ProfilePage"));
const HistoryPage = lazy(() => import("./components/history/HistoryPage"));
const MintApproval = lazy(() => import("./components/minting/MintApproval"));

function App() {
  const { isAuthenticated } = useAuth();
  localStorage.setItem("users", JSON.stringify(userData));

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        <Routes>
          {/* Public route */}
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />}
          />

          {/* Protected routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <HistoryPage />
              </ProtectedRoute>
            }
          />

          {/* Central Bank only route */}
          <Route
            path="/mint"
            element={
              <ProtectedRoute requiredRole="central_bank">
                <MintNewSupply />
              </ProtectedRoute>
            }
          />

          <Route
            path="/mint/approval"
            element={
              <ProtectedRoute requiredRole="central_bank">
                <MintApproval />
              </ProtectedRoute>
            }
          />

          {/* Commercial Bank and Central Bank route */}
          <Route
            path="/accounts"
            element={
              <ProtectedRoute requiredRole="commercial_bank">
                <AccountsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </>
    </Suspense>
  );
}

export default App;
