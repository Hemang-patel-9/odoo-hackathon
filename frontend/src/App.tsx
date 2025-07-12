import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { ThemeProvider } from "./contexts/theme-context"
import { ConfirmationProvider } from "./contexts/confirmation-context"
import Layout from "./components/layout"
import { Toaster } from "./components/ui/toaster"
import LoginForm from "./components/login-form"
import Signup from "./pages/Signup"
import { AuthProvider } from "./contexts/authContext";
import HomePage from "./pages/HomePage"
import AskQuestionPage from "./pages/AskQuestionPage"
import OneQuestion from "./pages/OneQuestion"
import ProfilePage from "./pages/ProfilePage"
import { SocketProvider } from "./contexts/socketContext"

export default function App() {
  return (
    <ThemeProvider>
      <ConfirmationProvider>
        <AuthProvider>
          <Router>
            <Layout>
              <SocketProvider>
                <Routes>
                  <Route path="/" element={<Navigate to="/homepage" />} />
                  <Route path="/homepage" element={<HomePage />} />
                  <Route path="/ask" element={<AskQuestionPage />} />
                  <Route path="/login" element={<LoginForm />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/question/:id" element={<OneQuestion />} />
                  <Route path="/:id" element={<ProfilePage />} />
                </Routes>
              </SocketProvider>
              {/* <Routes>
                <Route path="/" element={<Navigate to="/dashboard" />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/billing" element={<Billing />} />
                <Route path="/invoices" element={<Invoices />} />
                <Route path="/clients" element={<Clients />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/payments" element={<Payments />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="*" element={<NotFound />} />
              </Routes> */}
            </Layout>
          </Router>
          <Toaster />
        </AuthProvider>
      </ConfirmationProvider>
    </ThemeProvider >
  )
}
