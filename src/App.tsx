import { Suspense, lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppLayout from "./layout/AppLayout";
import ErrorPage from "./pages/ErrorPage/ErrorPage";
import ProtectedRoute from "./Components/ProtectedRoute";
import PublicRoute from "./Components/PublicRoute";
import PrivacyPolicy from "./pages/PrivacyPolicy/PrivacyPolicy";

// Lazy load components to optimize performance
const Dashboard = lazy(() => import("./pages/Dashboard/Dashboard"));
const Landing = lazy(()=> import("./pages/Landing/Landing"))
const Login = lazy(() => import("./pages/Login/Login"));
const ForgotPassword = lazy(() => import("./Components/ForgotPassword/ForgotPassword"));
const AboutUs = lazy(() => import("./pages/AboutUs/AboutUs"));
const TermsAndConditions = lazy(() =>
  import("./pages/TermsAndConditions/TermsAndConditions")
);
const Blogs = lazy(() => import("./pages/Blogs/Blogs"));
// const BlogDetail = lazy(() => import("./pages/BlogDetail/BlogDetail")); // Blog detail page
const BlogDetail = lazy(()=> import('./pages/BlogDetail/BlogDetail'))
const ContactUs = lazy(()=> import("./Components/ContactUs/ContactUs"))
const LearnAboutDonation = lazy(() => import("./pages/LearnAboutDonation/LearnAboutDonation")); // New import


// QueryClient with enhanced config
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60, // Data stays fresh for 1 minute
    },
  },
});

const PATHS = {
  ROOT: "/",
  LOGIN: "/login",
  FORGOT_PASSWORD: "/forgot-password",
  DASHBOARD: "/dashboard",
  REVIEWS: "/reviews",
  ABOUT_US: "/about-us",
  TERMS: "/terms-and-conditions",
  PRIVACY_POLICY: "/privacy-policy",
  BLOGS: "/blogs",
  BLOG_DETAIL: "/blogs/:title", // Dynamic path for blog detail
  CONTACT_US: "/contact-us", // New path for ContactUs page
  LEARN_ABOUT_DONATION: "/learn-about-donation", // New path for LearnAboutDonation
};

const App = () => {
  // Define router configuration
  const router = createBrowserRouter([
    {
      path: PATHS.ROOT,
      element: <AppLayout />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: PATHS.ROOT,
          element: (
            <PublicRoute>
              <Suspense fallback={<div>Loading...</div>}>
                <Landing />
              </Suspense>
            </PublicRoute>
          ),
        },
        {
          path: PATHS.LOGIN,
          element: (
            <PublicRoute>
              <Suspense fallback={<div>Loading...</div>}>
                <Login />
              </Suspense>
            </PublicRoute>
          ),
        },
        {
          path: PATHS.FORGOT_PASSWORD,
          element: (
            <Suspense fallback={<div>Loading...</div>}>
              <ForgotPassword />
            </Suspense>
          ),
        },
        {
          path: PATHS.DASHBOARD,
          element: <ProtectedRoute />,
          children: [
            {
              path: PATHS.DASHBOARD,
              element: (
                <Suspense fallback={<div>Loading...</div>}>
                  <Dashboard />
                </Suspense>
              ),
            },
          ],
        },
        {
          path: PATHS.ABOUT_US,
          element: (
            <PublicRoute>
              <Suspense fallback={<div>Loading...</div>}>
                <AboutUs />
              </Suspense>
            </PublicRoute>
          ),
        },
        {
          path: PATHS.TERMS,
          element: (
            <PublicRoute>
              <Suspense fallback={<div>Loading...</div>}>
                <TermsAndConditions />
              </Suspense>
            </PublicRoute>
          ),
        },
        {
          path: PATHS.PRIVACY_POLICY,
          element: (
            <PublicRoute>
              <Suspense fallback={<div>Loading...</div>}>
                <PrivacyPolicy />
              </Suspense>
            </PublicRoute>
          ),
        },
        {
          path: PATHS.BLOGS,
          element: (
            <PublicRoute>
              <Suspense fallback={<div>Loading...</div>}>
                <Blogs />
              </Suspense>
            </PublicRoute>
          ),
        },
        {
          path: PATHS.BLOG_DETAIL, // Dynamic route for individual blog posts
          element: (
            <PublicRoute>
              <Suspense fallback={<div>Loading...</div>}>
                <BlogDetail />
              </Suspense>
            </PublicRoute>
          ),
        },
        {
          path: PATHS.CONTACT_US, // Route for ContactUs
          element: (
            <PublicRoute>
              <Suspense fallback={<div>Loading...</div>}>
                <ContactUs />
              </Suspense>
            </PublicRoute>
          ),
        },
        {
          path: PATHS.LEARN_ABOUT_DONATION, // New route for LearnAboutDonation
          element: (
            <PublicRoute>
              <Suspense fallback={<div>Loading...</div>}>
                <LearnAboutDonation />
              </Suspense>
            </PublicRoute>
          ),
        },
        {
          path: "*",
          element: <ErrorPage />,
        },
      ],
    },
  ]);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
};

export default App;
