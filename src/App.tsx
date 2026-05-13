// import { useEffect } from "react";
// import { Route, Routes, Navigate } from "react-router-dom";
// import DashboardLayout from "./components/layout/DashboardLayout";
// import DashboardHome from "./pages/DashboardHome";
// import EntityPage from "./pages/EntityPage";
// import { applyTheme, getTheme } from "./lib/theme";
// import { applyDocumentDirection } from "./i18n";
// import i18n from "./i18n";
// import Login from "./pages/auth/Login";

// export default function App() {
//   useEffect(() => {
//     applyTheme(getTheme());
//     applyDocumentDirection(i18n.language);
//   }, []);

//   return (
//     <Routes>
//       <Route path="/login" index={true} element={<Login />} />
//       <Route element={<DashboardLayout />}>
//         <Route path="/" element={<DashboardHome />} />

//         {/* Home sections CRUD */}
//         <Route
//           path="/home/hero"
//           element={<EntityPage hasEdit={true} entity="hero" />}
//         />
//         <Route
//           path="/home/stats"
//           element={<EntityPage hasEdit={false} entity="stats" />}
//         />

//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Route>
//     </Routes>
//   );
// }

// import { useEffect } from "react";
// import { Route, Routes, Navigate } from "react-router-dom";
// import DashboardLayout from "./components/layout/DashboardLayout";
// import DashboardHome from "./pages/DashboardHome";
// import EntityPage from "./pages/EntityPage";
// import { applyTheme, getTheme } from "./lib/theme";
// import { applyDocumentDirection } from "./i18n";
// import i18n from "./i18n";
// import Login from "./pages/auth/Login";
// import { useAuth } from "./store/AuthProvider";

// export default function App() {
//   useEffect(() => {
//     applyTheme(getTheme());
//     applyDocumentDirection(i18n.language);
//   }, []);

//   const { user } = useAuth();
//   return (
//     <Routes>
//       <Route path="/login" element={<Login />} />

//       <Route
//         element={user ? <DashboardLayout /> : <Navigate to="/login" replace />}
//       >
//         <Route path="/" element={<DashboardHome />} />

//         <Route
//           path="/home/hero"
//           element={<EntityPage hasEdit={true} entity="hero" />}
//         />

//         <Route
//           path="/home/stats"
//           element={<EntityPage hasEdit={false} entity="stats" />}
//         />

//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Route>
//     </Routes>
//   );
// }

import { useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";

import DashboardLayout from "./components/layout/DashboardLayout";
import AuthLayout from "./components/auth/AuthLayout";

import DashboardHome from "./pages/DashboardHome";
import EntityPage from "./pages/EntityPage";

import Login from "./pages/auth/Login";

import { applyTheme, getTheme } from "./lib/theme";
import { applyDocumentDirection } from "./i18n";
import i18n from "./i18n";

import { useAuth } from "./store/AuthProvider";

export default function App() {
  useEffect(() => {
    applyTheme(getTheme());
    applyDocumentDirection(i18n.language);
  }, []);

  const { user } = useAuth();

  return (
    <Routes>
      {/* Auth Layout */}
      <Route element={<AuthLayout />}>
        <Route
          path="/login"
          element={user ? <Navigate to="/" replace /> : <Login />}
        />
      </Route>

      {/* Dashboard Layout */}
      <Route
        element={user ? <DashboardLayout /> : <Navigate to="/login" replace />}
      >
        <Route path="/" element={<DashboardHome />} />

        <Route
          path="/home/hero"
          element={<EntityPage hasEdit={true} entity="hero" />}
        />

        <Route
          path="/home/stats"
          element={<EntityPage hasEdit={false} entity="stats" />}
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
