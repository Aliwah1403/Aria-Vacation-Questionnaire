import React from "react";
import ReactDOM from "react-dom/client";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import "./index.css";
import App from "./App.jsx";
import "./i18n";
import Homepage from "./pages/Admin-Side/Member-Details/Homepage";
import Feedback from "./pages/Member-Side/Feedback/Feedback";
import Success from "./pages/Member-Side/Success/Success";
import AdminDashboard from "./pages/Admin-Side/Dashboard/AdminPanel";
import AdminLayout from "./layouts/AdminLayout";
import MemberHomepage from "./pages/Member-Side/Homepage/MemberHomepage";
import MemberSideLayout from "./layouts/MemberSideLayout";

const router = createBrowserRouter([
  {
    element: <AdminLayout />,
    children: [
      {
        path: "/admin/dashboard",
        element: <AdminDashboard />,
      },
    ],
  },
  {
    element: <MemberSideLayout />,
    children: [
      {
        path: "feedback/q20zb13c", //will replace with actual ID and form type
        element: <MemberHomepage />,
      },
    ],
  },
  {
    path: "/",
    element: <Homepage />,
  },

  {
    path: "/feedback",
    element: <Feedback />,
  },
  {
    path: "/success",
    element: <Success />,
  },
]);

// createRoot(document.getElementById("root")).render(
//   <StrictMode>
//     <App />
//   </StrictMode>
// );

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
