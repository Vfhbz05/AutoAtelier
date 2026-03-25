import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import ClientForm from './components/ClientForm';
import ClientsTable from './components/ClientsTable';
import NotificationBell from './components/NotificationBell';
import Filters from './components/Filters';
import { getClients, addClient, updateClient, deleteClient } from './firebase';

const App = () => {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    serviceDate: '',
    phone: '',
    carNumber: '',
    fullName: '',
    carBrand: '',
    nextServiceDate: '',
    service: '',
    servicePrice: '',
    comment: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getClients();
      setClients(data);
      checkExpiredServices(data);
    } catch (err) {
      setError('Не удалось загрузить данные. Проверьте подключение к интернету.');
    } finally {
      setLoading(false);
    }
  };

  const checkExpiredServices = (clientsList) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expired = clientsList.filter(client => {
      if (!client.nextServiceDate) return false;
      const nextDate = new Date(client.nextServiceDate);
      nextDate.setHours(0, 0, 0, 0);
      return nextDate < today;
    });
    setNotifications(expired);
  };

  const handleAddClient = async (clientData) => {
    try {
      const newClient = await addClient(clientData);
      setClients([newClient, ...clients]);
      alert('✅ Клиент успешно добавлен!');
    } catch (error) {
      alert('❌ Ошибка при добавлении клиента');
    }
  };

  const handleUpdateClient = async (id, updatedData) => {
    try {
      await updateClient(id, updatedData);
      setClients(clients.map(client =>
        client.id === id ? { ...client, ...updatedData } : client
      ));
      alert('✅ Клиент успешно обновлен!');
    } catch (error) {
      alert('❌ Ошибка при обновлении клиента');
    }
  };

  const handleDeleteClient = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить этого клиента?')) {
      try {
        await deleteClient(id);
        setClients(clients.filter(client => client.id !== id));
        alert('✅ Клиент успешно удален!');
      } catch (error) {
        alert('❌ Ошибка при удалении клиента');
      }
    }
  };

  // Фильтрация и поиск
  useEffect(() => {
    let result = [...clients];

    // Фильтры по полям
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        result = result.filter(client =>
          client[key] && client[key].toLowerCase().includes(filters[key].toLowerCase())
        );
      }
    });

    // Глобальный поиск
    if (searchTerm) {
      result = result.filter(client =>
        Object.values(client).some(value =>
          value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    setFilteredClients(result);
  }, [clients, filters, searchTerm]);

  const resetFilters = () => {
    setFilters({
      serviceDate: '',
      phone: '',
      carNumber: '',
      fullName: '',
      carBrand: '',
      nextServiceDate: '',
      service: '',
      servicePrice: '',
      comment: ''
    });
    setSearchTerm('');
  };

  // Статистика
  const totalRevenue = clients.reduce((sum, client) => {
    const price = parseFloat(client.servicePrice);
    return sum + (isNaN(price) ? 0 : price);
  }, 0);

  const avgCheck = (() => {
    const paid = clients.filter(c => c.servicePrice && parseFloat(c.servicePrice) > 0);
    return paid.length ? totalRevenue / paid.length : 0;
  })();

  const paidCount = clients.filter(c => c.servicePrice && parseFloat(c.servicePrice) > 0).length;

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Загрузка данных из Firebase...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <h2>Ошибка подключения</h2>
        <p>{error}</p>
        <button onClick={loadClients} className="btn-retry">Повторить попытку</button>
      </div>
    );
  }

  return (
    <div className="App">
      <Header />
      <div className="container">
        <div className="main-content">
          <div className="form-section">
            <h2>➕ Добавление нового клиента</h2>
            <ClientForm onSubmit={handleAddClient} />
          </div>

          <div className="table-section">
            <div className="table-header">
              <h2>📋 Реестр клиентов</h2>
              <NotificationBell notifications={notifications} />
            </div>

            <Filters
              filters={filters}
              setFilters={setFilters}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              resetFilters={resetFilters}
            />

            <ClientsTable
              clients={filteredClients}
              onUpdate={handleUpdateClient}
              onDelete={handleDeleteClient}
            />

            <div className="stats">
              <div className="stat-card">
                <span className="stat-icon">👥</span>
                <div>
                  <div className="stat-value">{clients.length}</div>
                  <div className="stat-label">Всего клиентов</div>
                </div>
              </div>
              <div className="stat-card">
                <span className="stat-icon">💰</span>
                <div>
                  <div className="stat-value">
                    {new Intl.NumberFormat('ru-RU').format(totalRevenue)} ₽
                  </div>
                  <div className="stat-label">Общая выручка</div>
                </div>
              </div>
              <div className="stat-card">
                <span className="stat-icon">📊</span>
                <div>
                  <div className="stat-value">
                    {new Intl.NumberFormat('ru-RU').format(Math.round(avgCheck))} ₽
                  </div>
                  <div className="stat-label">Средний чек</div>
                </div>
              </div>
              <div className="stat-card">
                <span className="stat-icon">💳</span>
                <div>
                  <div className="stat-value">{paidCount}</div>
                  <div className="stat-label">Оплативших услуги</div>
                </div>
              </div>
              <div className="stat-card warning">
                <span className="stat-icon">⚠️</span>
                <div>
                  <div className="stat-value">{notifications.length}</div>
                  <div className="stat-label">Просроченных услуг</div>
                </div>
              </div>
              <div className="stat-card cloud">
                <span className="stat-icon">☁️</span>
                <div>
                  <div className="stat-label">Данные в</div>
                  <div className="stat-label">Firebase Cloud</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
