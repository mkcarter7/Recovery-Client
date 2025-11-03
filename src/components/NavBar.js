/* eslint-disable jsx-a11y/anchor-is-valid */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Navbar, Container, Nav, NavDropdown, Button } from 'react-bootstrap';
import { useAuth } from '@/utils/context/authContext';
import { signIn, signOut } from '@/utils/auth';

export default function NavBar() {
  const [expanded, setExpanded] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();

  const handleNavClick = () => {
    setExpanded(false);
  };

  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" expanded={expanded} onToggle={setExpanded} className="shadow-sm" style={{ borderBottom: '2px solid #dc3545' }}>
      <Container>
        <Link passHref href="/" className="navbar-brand fw-bold" style={{ color: '#dc3545' }}>
          2nd Chance Recovery
        </Link>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto" onClick={handleNavClick}>
            <Link className={`nav-link ${pathname === '/' ? 'active' : ''}`} href="/">
              Home
            </Link>
            <NavDropdown title="About" id="about-dropdown">
              <Link className="dropdown-item" href="/about/our-story">
                Our Story
              </Link>
              <Link className="dropdown-item" href="/about/our-team">
                Our Team
              </Link>
              <Link className="dropdown-item" href="/about/partners">
                Partners
              </Link>
              <Link className="dropdown-item" href="/about/mission-housing">
                Mission & Housing
              </Link>
            </NavDropdown>
            <NavDropdown title="Programs" id="programs-dropdown">
              <Link className="dropdown-item" href="/programs/php-housing">
                PHP with Housing
              </Link>
              <Link className="dropdown-item" href="/programs/iop">
                Intensive Outpatient Program (IOP)
              </Link>
              <Link className="dropdown-item" href="/programs/vocational">
                6-Month Vocational Rehabilitation
              </Link>
            </NavDropdown>
            <Link className={`nav-link ${pathname === '/respite-housing' ? 'active' : ''}`} href="/respite-housing">
              Respite Housing
            </Link>
            <Link className={`nav-link ${pathname === '/contact' ? 'active' : ''}`} href="/contact">
              Contact
            </Link>
            <Link className={`nav-link ${pathname === '/get-involved' ? 'active' : ''}`} href="/get-involved">
              Get Involved
            </Link>
          </Nav>
          <Nav onClick={handleNavClick}>
            {user ? (
              <>
                <Link className={`nav-link ${pathname === '/admin' ? 'active' : ''}`} href="/admin">
                  Admin Dashboard
                </Link>
                <Button variant="outline-secondary" size="sm" className="ms-2" onClick={signOut}>
                  Sign Out
                </Button>
              </>
            ) : (
              <Button variant="primary" size="sm" onClick={signIn}>
                Sign In
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
