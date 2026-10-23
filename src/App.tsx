
import { createBrowserRouter, Navigate, RouterProvider } from "react-router";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import AuthLayout from "./Layouts/AuthLayout";
import MainLayout from "./Layouts/MainLayout";
import Newsfeed from "./pages/Newsfeed/Newsfeed";
import Profile from "./pages/Profile/Profile";
import Notification from "./pages/Notification/Notification";
import Notfound from "./pages/Notfoud/Notfound";
import AppProtectedRoutes from "./component/ProtectedRoutes/AppProtectedRoutes";
import AuthProtectedRoutes from "./component/ProtectedRoutes/AuthProtectedRoutes";
import PostDetails from "./pages/PostDetails/PostDetails";
import Home from "./pages/Home/Home";
import Settings from "./pages/Settings/Settings";

const routes = createBrowserRouter([
  {
    path: "/auth",
    element: (
      <AuthProtectedRoutes>
        <AuthLayout />
      </AuthProtectedRoutes>
    ),
    children: [
      { index: true, element: <Navigate to="/auth/login" replace /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
    ],
  },
  {
    path: "/",
    element: (
      <AppProtectedRoutes>
        <MainLayout />
      </AppProtectedRoutes>
    ),
    children: [
      { index: true, element: <Navigate to="/home" replace /> },
      {path: "home", element: <Home /> },
      {path: "feed", element: <Newsfeed /> },
      { path: "profile", element: <Profile /> },
      { path: "notifications", element: <Notification /> },
      { path: "postDetails/:id", element: <PostDetails /> },
      { path: "settings", element: <Settings /> },
      { path: "*", element: <Notfound /> },
    ],
  },
  { path: "*", element: <Notfound /> },
]);
function App() {
  return (
    <>
      <div className="min-h-screen bg-[#f0f2f5]">
        <RouterProvider router={routes} />
      </div>
    </>
  );
}

export default App;
