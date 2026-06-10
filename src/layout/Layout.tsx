import { Outlet } from "react-router-dom";

// No authentication required per project requirements.
// This layout just wraps pages — NavBar is rendered per-page
// so each page can pass the correct variant prop.
const Layout = () => {
  return <Outlet />;
};

export default Layout;
