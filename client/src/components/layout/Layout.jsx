import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import './Layout.css';

export default function Layout({ children, showFooter = true }) {
  return (
    <div className="site-wrapper">
      <Navbar />
      <main className="main-content" id="main-content">
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
}

