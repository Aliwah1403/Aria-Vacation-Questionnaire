import React from "react";
import ReactDOM from "react-dom/client";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import "./index.css";
import App from "./App.jsx";
import Homepage from "./pages/Admin-Side/Homepage/Homepage";
import Feedback from "./pages/Member-Side/Feedback/Feedback";
import Success from "./pages/Member-Side/Success/Success";
import AdminDashboard from "./pages/Admin-Side/AdminPanel";

const router = createBrowserRouter([
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
  {
    path: "/admin/dashboard",
    element: <AdminDashboard />,
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
