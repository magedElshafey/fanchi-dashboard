import { lazyLoad } from "../utils/LazyLoad";
import Guard from "./Guard";
export const authRoutes = {
  path: "auth",
  element: lazyLoad(() => import("../components/auth/AuthLayout")),

  children: [
    {
      path: "login",
      index: true,
      element: (
        <Guard guestOnly={true}>
          {lazyLoad(() => import("../pages/auth/Login"))}
        </Guard>
      ),
    },

    // {
    //   path: "forget-password-otp",
    //   element: (
    //     <Guard>
    //       {lazyLoad(() => import("../features/auth/pages/ForgetPasswordOtp"))}
    //     </Guard>
    //   ),
    // },
    // {
    //   path: "reset-password",
    //   element: (
    //     <Guard>
    //       {lazyLoad(() => import("../features/auth/pages/ResetPassword"))}
    //     </Guard>
    //   ),
    // },
    // {
    //   path: "reset-password-success",
    //   element: (
    //     <Guard>
    //       {lazyLoad(
    //         () => import("../features/auth/pages/ResetPasswordSuccess"),
    //       )}
    //     </Guard>
    //   ),
    // },
  ],
};
