import React from 'react';
import SEO from './components/SEO';
import { Routes, Route } from 'react-router-dom';
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

function SEO404(){ return <SEO title="Page Not Found" description="The requested Zuhd Tours page could not be found." noindex path="/404"/>; }

export default function App(){return <Layout><Routes>
  <Route path="/" element={<Home/>}/>
  <Route path="/tours" element={<ToursPage/>}/>
  <Route path="/services" element={<ServicesPage/>}/>
  <Route path="/desert-safari-dubai-tours" element={<DesertSafariPage/>}/>
  <Route path="/dubai-city-tours" element={<CityToursPage/>}/>
  <Route path="/abu-dhabi-city-tours" element={<TourPage slug="abu-dhabi-city-tour"/>}/><Route path="/global-village-dubai" element={<TourPage slug="global-village-dubai"/>}/>
  <Route path="/private-tours" element={<ServiceDetailPage kind="private"/>}/>
  <Route path="/tour-guides" element={<ServiceDetailPage kind="guides"/>}/>
  <Route path="/transport-services" element={<ServiceDetailPage kind="transport"/>}/>
  <Route path="/parks-tickets" element={<ServiceDetailPage kind="parks"/>}/>
  <Route path="/combo-tours-dubai" element={<SimplePage kind="combo"/>}/>
  <Route path="/dubai-airport-transfer" element={<SimplePage kind="transfer"/>}/>
  <Route path="/dubai-top-city-tour-landmarks" element={<SimplePage kind="landmarks"/>}/>
  <Route path="/gallery" element={<Gallery/>}/>
  <Route path="/about" element={<SimplePage kind="about"/>}/><Route path="/about/" element={<SimplePage kind="about"/>}/>
  <Route path="/contact" element={<SimplePage kind="contact"/>}/><Route path="/contact_us" element={<SimplePage kind="contact"/>}/><Route path="/contact_us/" element={<SimplePage kind="contact"/>}/>
  <Route path="/blog" element={<Blog/>}/>
  <Route path="/blog/:slug" element={<BlogPost/>}/>
  <Route path="/tours/:slug" element={<TourPage/>}/>
  <Route path="*" element={<><SEO404/><div className="not-found"><div><h1>404</h1><p>Page not found.</p></div></div></>}/>
</Routes></Layout>}
