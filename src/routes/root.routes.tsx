import { websiteRoutes } from "./website.routes";
import { authRoutes } from "./auth.routes";
import AuthProvider from "../store/AuthProvider";
import AxiosConfig from "../lib/axios/Axios";
import RootLayout from "../components/layout/root/RootLayout";

export const rootRoutes = {
  path: "/",
  element: (
    <AuthProvider>
      <AxiosConfig />
      <RootLayout />
    </AuthProvider>
  ),

  children: [
    websiteRoutes,
    authRoutes,
    // {
    //   path: "*",
    //   element: <NotFound />,
    // },
  ],
};
