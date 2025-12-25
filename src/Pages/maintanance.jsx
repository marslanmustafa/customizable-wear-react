// MaintenancePage.js
import React from 'react';
import { Link } from 'react-router-dom';
import CompanyLogo from "../assets/images/log.png";
const MaintenancePage = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      textAlign: 'center',
      padding: '2rem',
      backgroundColor: '#f5f7fa',
      fontFamily: "'Segoe UI', Roboto, 'Helvetica Neue', sans-serif"
    }}>
      {/* Company Logo - Replace with your actual logo */}
      <div  style={{
        marginBottom: '2rem',
        width: '100px',
        height: 'auto'
      }}>
        <img 
          src={CompanyLogo} // Replace with your logo path
          alt="CustomizableWear Logo"
          style={{ width: '100%', height: 'auto' }}
          onError={(e) => {
            e.target.onerror = null; 
            e.target.src = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 30'%3E%3Crect width='100' height='30' fill='%23007bff'/%3E%3Ctext x='50%' y='50%' font-family='sans-serif' font-size='16' fill='white' text-anchor='middle' dominant-baseline='middle'%3ECustomizableWear%3C/text%3E%3C/svg%3E"
          }}
        />
      </div>

      <div style={{ 
        backgroundColor: '#fff',
        padding: '2.5rem',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        maxWidth: '650px',
        width: '100%',
        borderTop: '4px solid #007bff'
      }}>
        <div style={{
          marginBottom: '1.5rem',
          color: '#2c3e50'
        }}>
          <h1 style={{ 
            fontSize: '2.2rem', 
            marginBottom: '1rem',
            fontWeight: '600',
            color: '#2c3e50'
          }}>
            <span style={{ color: '#007bff' }}>Maintenance</span> in Progress
          </h1>
          <p style={{ 
            fontSize: '1.1rem',
            lineHeight: '1.6',
            color: '#5a6a7d'
          }}>
            We're upgrading our systems to serve you better. Our online store will be back shortly.
          </p>
        </div>

        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '1.5rem',
          borderRadius: '8px',
          marginBottom: '2rem',
          textAlign: 'left'
        }}>
          <h3 style={{ 
            marginTop: '0',
            marginBottom: '1rem',
            color: '#2c3e50',
            fontSize: '1.1rem'
          }}>
            What's happening:
          </h3>
          <ul style={{ 
            margin: '0 0 0 1rem', 
            paddingLeft: '1rem',
            lineHeight: '1.8',
            color: '#5a6a7d'
          }}>
            <li>Scheduled system maintenance and upgrades</li>
            <li>Improved performance and new features coming soon</li>
            <li>All orders will be processed once we're back online</li>
          </ul>
        </div>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem'
        }}>
          

          <p style={{ 
            margin: '1rem 0 0',
            color: '#5a6a7d',
            fontSize: '0.95rem'
          }}>
            Need immediate assistance? <br />
            Email us at <a href="mailto:info@customizablewear.com" style={{ color: '#007bff', textDecoration: 'none', fontWeight: '500' }}>info@customizablewear.com</a>
          </p>
        </div>
      </div>

      <div style={{ marginTop: '2.5rem' }}>
        <Link 
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.75rem',
            backgroundColor: '#007bff',
            color: 'white',
            borderRadius: '6px',
            textDecoration: 'none',
            fontWeight: '500',
            transition: 'all 0.2s ease',
            ':hover': {
              backgroundColor: '#0069d9',
              transform: 'translateY(-1px)'
            }
          }}
          onClick={(e) => {
            e.preventDefault();
            window.location.reload();
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12C1 5.92487 5.92487 1 12 1C15.7202 1 19.0094 2.5533 21.2561 5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <path d="M20 5H15V10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Refresh Page
        </Link>
      </div>

      <footer style={{
        marginTop: '3rem',
        color: '#95a5a6',
        fontSize: '0.85rem'
      }}>
        © {new Date().getFullYear()} CustomizableWear. All rights reserved.
      </footer>
    </div>
  );
};

export default MaintenancePage;