import App from "@/App";
import { createBrowserRouter } from "react-router-dom";
import LayoutAdmin from "@/router/layoutAdmin";
import UserPage from "@/components/user/user.page";
import ProtectedRoute from "@/router/protectedRoute";
import Login from "@/components/auth/login.page";
import AccommodationPage from "../components/accommodation/accommodation.page";
import AdminPage from "../components/admin/admin.page";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <LayoutAdmin />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <AdminPage />,
      },
      {
        path: "accommodation",
        element: <AccommodationPage />,
      },
      {
        path: "user",
        element: <UserPage />,
      },
    ],
  },
]);
