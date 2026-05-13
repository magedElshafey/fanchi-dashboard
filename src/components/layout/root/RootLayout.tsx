import { Outlet, useLocation } from "react-router-dom";

import { useEffect } from "react";
const RootLayout = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <Outlet />
    </>
  );
};

export default RootLayout;
