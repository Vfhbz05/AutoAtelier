import React, { useState, useEffect } from 'react';
import '../styles/NotificationBell.css';

const NotificationBell = ({ notifications }) => {
  const [show, setShow] = useState(false);
  const [hasNew, setHasNew] = useState(false);

  useEffect(() => {
    if (notifications.length > 0) {
      setHasNew(true);
      const timer = setTimeout(() => setHasNew(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [notifications]);

  const getMessage = (client) => {
    const today = new Date();
    const next = new Date(client.nextServiceDate);
    const diff = Math.ceil((next - today) / (1000 * 60 * 60 * 24));
    if (diff < 0) return `🔴 ${client.fullName} (${client.carNumber}): просрочено на ${-diff} дн.`;
    if (diff === 0) return `🟠 ${client.fullName} (${client.carNumber}): сегодня последний день!`;
    if (diff <= 3) return `🟡 ${client.fullName} (${client.carNumber}): осталось ${diff} дн.`;
    return `🔵 ${client.fullName} (${client.carNumber}): осталось ${diff} дн.`;
  };

  return (
    <div className="notification-container">
      <div className={`notification-bell ${hasNew ? 'has-new' : ''}`} onClick={() => setShow(!show)}>
        🔔
        {notifications.length > 0 && <span className="notification-badge">{notifications.length}</span>}
      </div>
      {show && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3>📢 Просроченные услуги</h3>
            <button className="close-btn" onClick={() => setShow(false)}>✕</button>
          </div>
          {notifications.length === 0 ? (
            <div className="notification-empty"><span>✅</span><p>Нет просроченных услуг</p></div>
          ) : (
            <ul className="notification-list">
              {notifications.map(n => <li key={n.id} className="notification-item">{getMessage(n)}</li>)}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;