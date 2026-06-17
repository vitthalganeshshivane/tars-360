import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useUIStore } from '../../stores';
import PillNav from './PillNav';
import SearchBar from './SearchBar';
import './Navbar.css';

const navItems = [
  { label: 'Home', href: '/' },
  { label: '360 Photos', href: '/photos' },
  { label: '360 Videos', href: '/videos' },
  { label: 'Virtual Tours', href: '/tours' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

const logoSvg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='50' fill='%23e60023'/%3E%3Ctext x='50' y='58' text-anchor='middle' fill='white' font-family='Inter,system-ui,sans-serif' font-size='28' font-weight='700'%3ETARS%3C/text%3E%3C/svg%3E";

export default function Navbar() {
  const { searchOpen, toggleSearch } = useUIStore();
  const location = useLocation();

  return (
    <>
      <PillNav
        logo={logoSvg}
        logoAlt="TARS 360"
        items={navItems}
        activeHref={location.pathname}
        ease="power3.easeOut"
        baseColor="#ffffff"
        pillColor="#000000"
        hoveredPillTextColor="#ffffff"
        pillTextColor="#ffffff"
        initialLoadAnimation={true}
      />

      <AnimatePresence>
        {searchOpen && <SearchBar />}
      </AnimatePresence>
    </>
  );
}
