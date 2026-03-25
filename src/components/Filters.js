import React from 'react';
import '../styles/FiltersAndSearchs.css';

const services = [
  'Мойка', 'Химчистка', 'Полировка', 'Нанесение керамики',
  'Антигравийная пленка', 'Тонировка', 'Детейлинг салона', 'Детейлинг кузова'
];

const Filters = ({ filters, setFilters, searchTerm, setSearchTerm, resetFilters }) => {
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="filters-section">
      <div className="search-bar">
        <input
          type="text"
          placeholder="🔍 Поиск по всем полям..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>
      <div className="filters-grid">
        <input type="date" placeholder="Дата услуги" value={filters.serviceDate}
               onChange={e => handleFilterChange('serviceDate', e.target.value)} />
        <input type="text" placeholder="Телефон" value={filters.phone}
               onChange={e => handleFilterChange('phone', e.target.value)} />
        <input type="text" placeholder="Номер машины" value={filters.carNumber}
               onChange={e => handleFilterChange('carNumber', e.target.value)} />
        <input type="text" placeholder="ФИО" value={filters.fullName}
               onChange={e => handleFilterChange('fullName', e.target.value)} />
        <input type="text" placeholder="Марка" value={filters.carBrand}
               onChange={e => handleFilterChange('carBrand', e.target.value)} />
        <input type="date" placeholder="Срок след. услуги" value={filters.nextServiceDate}
               onChange={e => handleFilterChange('nextServiceDate', e.target.value)} />
        <select value={filters.service} onChange={e => handleFilterChange('service', e.target.value)}>
          <option value="">Все услуги</option>
          {services.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <input type="text" placeholder="Стоимость" value={filters.servicePrice}
               onChange={e => handleFilterChange('servicePrice', e.target.value)} />
        <input type="text" placeholder="Комментарий" value={filters.comment}
               onChange={e => handleFilterChange('comment', e.target.value)} />
      </div>
      <div className="filter-actions">
        <button onClick={resetFilters} className="btn-reset">🔄 Сбросить все фильтры</button>
      </div>
    </div>
  );
};

export default Filters;
