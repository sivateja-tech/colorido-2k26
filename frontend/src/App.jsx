import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';

// Unified Authentication Pages
import AuthPage from './pages/AuthPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import VerifyEmailPage from './pages/VerifyEmailPage';

// Public Festival Pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import EventsPage from './pages/EventsPage';
import SportsEventsPage from './pages/SportsEventsPage';
import CulturalEventsPage from './pages/CulturalEventsPage';
import TechnicalEventsPage from './pages/TechnicalEventsPage';
import EventDetailsPage from './pages/EventDetailsPage';
import SchedulePage from './pages/SchedulePage';
import ResultsPage from './pages/ResultsPage';
import LeaderboardPage from './pages/LeaderboardPage';
import GalleryPage from './pages/GalleryPage';
import RegistrationPage from './pages/RegistrationPage';
import MyRegistrationsPage from './pages/MyRegistrationsPage';
import PassPage from './pages/PassPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';

// Admin Portal Pages
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminEventsPage from './pages/AdminEventsPage';
import AdminRegistrationsPage from './pages/AdminRegistrationsPage';
import AdminSchedulePage from './pages/AdminSchedulePage';
import AdminResultsPage from './pages/AdminResultsPage';
import AdminMessagesPage from './pages/AdminMessagesPage';

// Components
import SplashScreen from './components/SplashScreen';

export default function App() {
  return (
    <>
      <SplashScreen />
      <Routes>
        {/* Public Festival Website Routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />

          {/* Festival Events */}
          <Route path="events" element={<EventsPage />} />
          <Route path="events/sports" element={<SportsEventsPage />} />
          <Route path="events/cultural" element={<CulturalEventsPage />} />
          <Route path="events/technical" element={<TechnicalEventsPage />} />
          <Route path="sports" element={<SportsEventsPage />} />
          <Route path="cultural" element={<CulturalEventsPage />} />
          <Route path="technical" element={<TechnicalEventsPage />} />
          <Route path="events/:id" element={<EventDetailsPage />} />

          {/* Schedule & Results */}
          <Route path="schedule" element={<SchedulePage />} />
          <Route path="results" element={<ResultsPage />} />
          <Route path="leaderboard" element={<LeaderboardPage />} />

          {/* Media & Campus */}
          <Route path="gallery" element={<GalleryPage />} />

          {/* Registration, Passes & User Roster */}
          <Route path="register" element={<RegistrationPage />} />
          <Route path="register/:id" element={<RegistrationPage />} />
          <Route path="my-registrations" element={<MyRegistrationsPage />} />
          <Route path="pass" element={<PassPage />} />
          <Route path="pass/:id" element={<PassPage />} />
          <Route path="verify/:id" element={<PassPage />} />

          {/* Authentication Routes */}
          <Route path="auth" element={<AuthPage />} />
          <Route path="login" element={<AuthPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="reset-password" element={<ResetPasswordPage />} />
          <Route path="verify-email" element={<VerifyEmailPage />} />

          {/* Helpdesk & 404 */}
          <Route path="contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* Admin Portal Authentication & Routes */}
        <Route path="/admin/login" element={<Navigate to="/auth" replace />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="events" element={<AdminEventsPage />} />
          <Route path="registrations" element={<AdminRegistrationsPage />} />
          <Route path="schedule" element={<AdminSchedulePage />} />
          <Route path="results" element={<AdminResultsPage />} />
          <Route path="messages" element={<AdminMessagesPage />} />
        </Route>
      </Routes>
    </>
  );
}
