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
import QuestionnairesOverview from "./pages/Admin-Side/Questionnaires/Overview/Overview";
import QuestionnaireSetup from "./pages/Admin-Side/Setup";
import ReactQueryProvider from "./providers/ReactQueryProviuder";
import FeedbackFromDB from "./pages/Member-Side/Feedback/FeedbackFromDB";
import LoginPage from "./pages/Admin-Side/Auth/Login/login";
import SignupPage from "./pages/Admin-Side/Auth/Signup/signup";
import AdminAuthLayout from "./layouts/AdminAuthLayout";
import ProtectedRoute from "./pages/Admin-Side/Auth/ProtectRoutes/ProtectedRoute";
import ForgotPassword from "./pages/Admin-Side/Auth/Forgot-Account/forgot-password";
import ResetPassword from "./pages/Admin-Side/Auth/Forgot-Account/reset-password";
import AdminNotFound from "./AdminNotFound";
import MemberNotFound from "./MemberNotFound";

const router = createBrowserRouter([
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          {
            path: "/admin/dashboard",
            element: <AdminDashboard />,
          },
          {
            path: "/admin/questionnaires",
            element: <QuestionnairesOverview />,
          },
          {
            path: "/admin/questionnaire-setup",
            element: <QuestionnaireSetup />,
          },
        ],
      },
    ],
  },
  {
    element: <MemberSideLayout />,
    children: [
      {
        path: "/:id",
        element: <MemberHomepage />,
      },
      {
        path: "/:id/questionnaire",
        element: <FeedbackFromDB />,
      },
      // {
      //   path: "/feedback/testID/questionnaire", //will replace with actual ID and form type
      //   element: <Feedback />,
      // },
      {
        path: "/feedback/:id/success",
        element: <Success />,
      },
    ],
  },
  {
    element: <AdminAuthLayout />,
    children: [
      {
        path: "/admin/login",
        element: <LoginPage />,
      },
      {
        path: "/admin/signup",
        element: <SignupPage />,
      },
      {
        path: "/admin/forgot-account",
        element: <ForgotPassword />,
      },
      {
        path: "/admin/forgot-account/reset-password",
        element: <ResetPassword />,
      },
    ],
  },

  {
    path: "/",
    element: <Homepage />,
  },

  {
    path: "/admin/*",
    element: <AdminNotFound />,
  },
  {
    path: "/feedback/*",
    element: <MemberNotFound />,
  },
]);

// createRoot(document.getElementById("root")).render(
//   <StrictMode>
//     <App />
//   </StrictMode>
// );

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ReactQueryProvider>
      <RouterProvider router={router} />
    </ReactQueryProvider>
  </React.StrictMode>
);
