import { Suspense, lazy } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import routes from "tempo-routes";

// Lazy load components
const CBDCDashboard = lazy(() => import("./components/cbdc/CBDCDashboard"));
const MintNewSupply = lazy(() => import("./components/minting/MintNewSupply"));
const AccountsPage = lazy(() => import("./components/accounts/AccountsPage"));
const ProfilePage = lazy(() => import("./components/profile/ProfilePage"));

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cbdc" element={<CBDCDashboard />} />
          <Route path="/mint" element={<MintNewSupply />} />
          <Route path="/accounts" element={<AccountsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<ProfilePage />} />
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </>
    </Suspense>
  );
}

export default App;
