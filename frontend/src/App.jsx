import React from 'react';
import SEO from './components/SEO';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { redirects } from './data/seoRoutes';
import Layout from './components/Layout';
import Home from './pages/Home';
import CategoryPage from './pages/CategoryPage';
import CityToursPage from './pages/CityToursPage';
import TourPage from './pages/TourPage';
import SimplePage from './pages/SimplePage';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import ServicesPage from './pages/ServicesPage';
import ToursPage from './pages/ToursPage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import DesertSafariPage from './pages/DesertSafariPage';
import Gallery from './pages/Gallery';
import TransfersPage from './pages/TransfersPage';
import LegalPage from './pages/LegalPage';
import FaqPage from './pages/FaqPage';
function SEO404() {
  return <SEO title="Page Not Found" description="The requested Zuhd Tours page could not be found." noindex path="/404" />;
}
const AdminApp = React.lazy(() => import('./admin/AdminApp'));
export default function App() {
  const location = useLocation();
  if (location.pathname === '/admin' || location.pathname.startsWith('/admin/')) return <React.Suspense fallback={<div className="admin-loading">Opening Content Studio…</div>}><AdminApp /></React.Suspense>;
  return <Layout><Routes>
  {Object.entries(redirects).map(([from, to]) => <Route key={from} path={from} element={<Navigate replace to={to} />} />)}
  <Route path="/" element={<Home />} />
  <Route path="/tours" element={<ToursPage />} />
  <Route path="/services" element={<ServicesPage />} />
  <Route path="/desert-safari-dubai-tours" element={<DesertSafariPage />} />
  <Route path="/dubai-city-tours" element={<CityToursPage />} />
  <Route path="/abu-dhabi-city-tours" element={<TourPage slug="abu-dhabi-city-tour" />} /><Route path="/global-village-dubai" element={<TourPage slug="global-village-dubai" />} />
  <Route path="/private-tours" element={<ServiceDetailPage kind="private" />} />
  <Route path="/tour-guides" element={<ServiceDetailPage kind="guides" />} />
  <Route path="/transport-services" element={<ServiceDetailPage kind="transport" />} />
  <Route path="/parks-tickets" element={<ServiceDetailPage kind="parks" />} />
  <Route path="/combo-tours-dubai" element={<SimplePage kind="combo" />} />
  <Route path="/transfers" element={<TransfersPage />} />
  <Route path="/faqs" element={<FaqPage />} />
  <Route path="/dubai-top-city-tour-landmarks" element={<SimplePage kind="landmarks" />} />
  <Route path="/gallery" element={<Gallery />} />
  <Route path="/about" element={<SimplePage kind="about" />} /><Route path="/about/" element={<SimplePage kind="about" />} />
  <Route path="/contact" element={<SimplePage kind="contact" />} />
  <Route path="/privacy-policy" element={<LegalPage kind="privacy" />} />
  <Route path="/terms-of-use" element={<LegalPage kind="terms" />} />
  <Route path="/blog" element={<Blog />} />
  <Route path="/blog/:slug" element={<BlogPost />} />
  <Route path="/tours/:slug" element={<TourPage />} />
  <Route path="*" element={<><SEO404 /><div className="not-found"><div><h1>404</h1><p>Page not found.</p></div></div></>} />
</Routes></Layout>;
}
