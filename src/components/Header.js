import React from 'react';
import '../styles/Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <span className="logo-icon">🚗</span>
          <h1>АвтоАтелье CRM</h1>
        </div>
        <p className="subtitle">
          Система управления клиентами детейлинг центра
        </p>
      </div>
    </header>
  );
};

export default Header;