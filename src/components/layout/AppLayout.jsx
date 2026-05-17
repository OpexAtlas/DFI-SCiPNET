import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import AlerteBandeau from './AlerteBandeau';

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-background noise-overlay flex flex-col">
      <Navbar />
      <div className="pt-16 flex flex-col flex-1">
        <AlerteBandeau />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
}