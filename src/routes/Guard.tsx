// import { useAuth } from "../store/AuthProvider";
// import { Navigate, useLocation, Outlet } from "react-router-dom";

// type GuardProps = {
//   requireAuth?: boolean;
//   guestOnly?: boolean;
//   allowedRoles?: string[];
//   redirectTo?: string;
//   children?: React.ReactNode;
// };

// const Guard: React.FC<GuardProps> = ({
//   requireAuth = false,
//   guestOnly = false,
//   allowedRoles,
//   redirectTo,
//   children,
// }) => {
//   const { user, loading } = useAuth();
//   const location = useLocation();

//   if (loading) return null;
//   if (guestOnly && user) {
//     const from = (location.state as any)?.from;
//     return <Navigate to={from || redirectTo || "/"} replace />;
//   }

//   if (!user) {
//     return <Navigate to="/auth/login" state={{ from: location }} replace />;
//   }

//   // 🔸 لو فيه صلاحيات محددة والمستخدم مش مسموح له
//   if (allowedRoles && user && !allowedRoles.includes("")) {
//     return <Navigate to={redirectTo || "/unauthorized"} replace />;
//   }

//   // ✅ نعرض المحتوى المطلوب
//   return <>{children || <Outlet />}</>;
// };

// export default Guard;

import { useAuth } from "../store/AuthProvider";
import { Navigate, useLocation, Outlet } from "react-router-dom";

type GuardProps = {
  requireAuth?: boolean;
  guestOnly?: boolean;
  allowedRoles?: string[];
  redirectTo?: string;
  children?: React.ReactNode;
};

const Guard: React.FC<GuardProps> = ({
  requireAuth = false,
  guestOnly = false,
  allowedRoles,
  redirectTo,
  children,
}) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;

  // ✅ لو الصفحة للزوار فقط
  if (guestOnly && user) {
    const from = (location.state as any)?.from;
    return <Navigate to={from || redirectTo || "/"} replace />;
  }

  // ✅ لو الصفحة محتاجة تسجيل دخول
  if (requireAuth && !user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // ✅ صلاحيات
  if (allowedRoles && user && !allowedRoles.includes(user?.role)) {
    return <Navigate to={redirectTo || "/unauthorized"} replace />;
  }

  return <>{children || <Outlet />}</>;
};

export default Guard;
