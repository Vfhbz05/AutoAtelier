import React, { useState } from 'react';
import ClientForm from './ClientForm';
import '../styles/ClientsTable.css';

const ClientsTable = ({ clients, onUpdate, onDelete }) => {
  const [editingId, setEditingId] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortedClients = () => {
    if (!sortConfig.key) return clients;
    return [...clients].sort((a, b) => {
      let aValue = a[sortConfig.key] || '';
      let bValue = b[sortConfig.key] || '';

      if (sortConfig.key === 'servicePrice') {
        aValue = parseFloat(aValue) || 0;
        bValue = parseFloat(bValue) || 0;
      }
      if (sortConfig.key === 'serviceDate' || sortConfig.key === 'nextServiceDate') {
        aValue = aValue || '9999-12-31';
        bValue = bValue || '9999-12-31';
      }

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const isServiceExpired = (nextServiceDate) => {
    if (!nextServiceDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const nextDate = new Date(nextServiceDate);
    nextDate.setHours(0, 0, 0, 0);
    return nextDate < today;
  };

  const formatPrice = (price) => {
    if (!price) return '-';
    const numPrice = parseFloat(price);
    if (isNaN(numPrice)) return price;
    return new Intl.NumberFormat('ru-RU').format(numPrice) + ' ₽';
  };

  const sortedClients = getSortedClients();
  const getSortIcon = (key) => sortConfig.key === key ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '↕️';

  if (clients.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📭</div>
        <h3>Нет данных</h3>
        <p>Добавьте первого клиента через форму выше</p>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="clients-table">
        <thead>
          <tr>
            <th onClick={() => handleSort('serviceDate')}>📅 Дата услуги {getSortIcon('serviceDate')}</th>
            <th onClick={() => handleSort('phone')}>📞 Телефон {getSortIcon('phone')}</th>
            <th onClick={() => handleSort('carNumber')}>🚗 Номер машины {getSortIcon('carNumber')}</th>
            <th onClick={() => handleSort('fullName')}>👤 ФИО {getSortIcon('fullName')}</th>
            <th onClick={() => handleSort('carBrand')}>🏭 Марка {getSortIcon('carBrand')}</th>
            <th onClick={() => handleSort('nextServiceDate')}>⏰ Срок след. услуги {getSortIcon('nextServiceDate')}</th>
            <th onClick={() => handleSort('service')}>🔧 Услуга {getSortIcon('service')}</th>
            <th onClick={() => handleSort('servicePrice')}>💰 Стоимость {getSortIcon('servicePrice')}</th>
            <th>💬 Комментарий</th>
            <th>⚙️ Действия</th>
          </tr>
        </thead>
        <tbody>
          {sortedClients.map(client => (
            <tr key={client.id} className={isServiceExpired(client.nextServiceDate) ? 'expired-row' : ''}>
              {editingId === client.id ? (
                <td colSpan="10" className="editing-cell">
                  <ClientForm
                    onSubmit={(updatedData) => {
                      onUpdate(client.id, updatedData);
                      setEditingId(null);
                    }}
                    initialData={client}
                    onCancel={() => setEditingId(null)}
                  />
                </td>
              ) : (
                <>
                  <td>{client.serviceDate || '-'}</td>
                  <td className="phone-cell">{client.phone}</td>
                  <td className="car-number-cell">{client.carNumber}</td>
                  <td className="fullname-cell">{client.fullName}</td>
                  <td>{client.carBrand || '-'}</td>
                  <td className={isServiceExpired(client.nextServiceDate) ? 'expired-date' : ''}>
                    {client.nextServiceDate || '-'}
                    {isServiceExpired(client.nextServiceDate) && <span className="expired-badge">⚠️</span>}
                  </td>
                  <td>{client.service || '-'}</td>
                  <td className="price-cell">{formatPrice(client.servicePrice)}</td>
                  <td className="comment-cell">{client.comment || '-'}</td>
                  <td className="actions-cell">
                    <button onClick={() => setEditingId(client.id)} className="btn-edit" title="Редактировать">✏️</button>
                    <button onClick={() => onDelete(client.id)} className="btn-delete" title="Удалить">🗑️</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClientsTable;