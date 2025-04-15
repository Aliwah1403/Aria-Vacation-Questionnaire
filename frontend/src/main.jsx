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

const router = createBrowserRouter([
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
  {
    element: <MemberSideLayout />,
    children: [
      {
        path: "/feedback/:formType/:id",
        element: <MemberHomepage />,
      },
      {
        path: "/feedback/:formType/:id/questionnaire",
        element: <FeedbackFromDB />,
      },
      // {
      //   path: "/feedback/testID/questionnaire", //will replace with actual ID and form type
      //   element: <Feedback />,
      // },
      {
        path: "/feedback/:formType/:id/success",
        element: <Success />,
      },
    ],
  },
  {
    path: "/",
    element: <Homepage />,
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
