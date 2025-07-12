import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { ThemeProvider } from "./contexts/theme-context"
import { ConfirmationProvider } from "./contexts/confirmation-context"
import Layout from "./components/layout"
import { Toaster } from "./components/ui/toaster"
import LoginForm from "./components/login-form"
import NotFound from "./pages/NotFound"
import Signup from "./pages/Signup"
import { AuthProvider } from "./contexts/authContext";
import HomePage from "./pages/HomePage"
import AskQuestionPage from "./pages/AskQuestionPage"
import OneQuestion from "./pages/OneQuestion"
import ProfilePage from "./pages/ProfilePage"
import HeroSection from "./pages/HeroSection"
import AboutUs from "./pages/AboutusPage"

export default function App() {
  return (
    <ThemeProvider>
      <ConfirmationProvider>
        <AuthProvider>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<HeroSection />} />
                <Route path="/homepage" element={<HomePage />} />
                <Route path="/ask" element={<AskQuestionPage />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/question/:id" element={<OneQuestion />} />
                <Route path="/:id" element={<ProfilePage />} />
                <Route path="/about" element={<AboutUs />} />
              </Routes>
            </Layout>
          </Router>
          <Toaster />
        </AuthProvider>
      </ConfirmationProvider>
    </ThemeProvider >
  )
}
