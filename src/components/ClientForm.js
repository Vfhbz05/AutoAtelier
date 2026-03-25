import React, { useState } from 'react';
import '../styles/ClientForm.css';

const services = [
  'Мойка',
  'Химчистка',
  'Полировка',
  'Нанесение керамики',
  'Антигравийная пленка',
  'Тонировка',
  'Детейлинг салона',
  'Детейлинг кузова',
  'Чистка двигателя',
  'Полировка фар'
];

const ClientForm = ({ onSubmit, initialData = null, onCancel }) => {
  const [formData, setFormData] = useState(initialData || {
    serviceDate: new Date().toISOString().split('T')[0],
    phone: '',
    carNumber: '',
    fullName: '',
    carBrand: '',
    nextServiceDate: '',
    service: '',
    servicePrice: '',
    comment: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePriceChange = (e) => {
    let value = e.target.value;
    // Разрешаем только цифры
    value = value.replace(/[^\d]/g, '');
    setFormData(prev => ({ ...prev, servicePrice: value }));
    if (errors.servicePrice) {
      setErrors(prev => ({ ...prev, servicePrice: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Введите ФИО клиента';
    if (!formData.phone.trim()) newErrors.phone = 'Введите номер телефона';
    else {
      const phoneDigits = formData.phone.replace(/\D/g, '');
      if (phoneDigits.length < 10) newErrors.phone = 'Введите корректный номер телефона (минимум 10 цифр)';
    }
    if (!formData.carNumber.trim()) newErrors.carNumber = 'Введите номер машины';
    if (!formData.serviceDate) newErrors.serviceDate = 'Выберите дату услуги';
    if (formData.servicePrice && isNaN(parseFloat(formData.servicePrice))) {
      newErrors.servicePrice = 'Цена должна быть числом';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
      if (!initialData) {
        setFormData({
          serviceDate: new Date().toISOString().split('T')[0],
          phone: '',
          carNumber: '',
          fullName: '',
          carBrand: '',
          nextServiceDate: '',
          service: '',
          servicePrice: '',
          comment: ''
        });
      }
    }
  };

  const formatPrice = (price) => {
    if (!price) return '';
    return new Intl.NumberFormat('ru-RU').format(price);
  };

  return (
    <form className="client-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-group">
          <label>📅 Дата оказания услуги <span className="required">*</span></label>
          <input
            type="date"
            name="serviceDate"
            value={formData.serviceDate}
            onChange={handleChange}
            className={errors.serviceDate ? 'error' : ''}
          />
          {errors.serviceDate && <span className="error-message">{errors.serviceDate}</span>}
        </div>
        <div className="form-group">
          <label>📞 Номер телефона <span className="required">*</span></label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+7 (XXX) XXX-XX-XX"
            className={errors.phone ? 'error' : ''}
          />
          {errors.phone && <span className="error-message">{errors.phone}</span>}
        </div>
        <div className="form-group">
          <label>🚗 Номер машины <span className="required">*</span></label>
          <input
            type="text"
            name="carNumber"
            value={formData.carNumber}
            onChange={handleChange}
            placeholder="А123ВС77"
            className={errors.carNumber ? 'error' : ''}
          />
          {errors.carNumber && <span className="error-message">{errors.carNumber}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>👤 ФИО клиента <span className="required">*</span></label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Иванов Иван Иванович"
            className={errors.fullName ? 'error' : ''}
          />
          {errors.fullName && <span className="error-message">{errors.fullName}</span>}
        </div>
        <div className="form-group">
          <label>🏭 Марка машины</label>
          <input
            type="text"
            name="carBrand"
            value={formData.carBrand}
            onChange={handleChange}
            placeholder="Toyota Camry"
          />
        </div>
        <div className="form-group">
          <label>⏰ Срок до следующей услуги</label>
          <input
            type="date"
            name="nextServiceDate"
            value={formData.nextServiceDate}
            onChange={handleChange}
          />
          <small className="hint">Укажите дату следующего визита</small>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>🔧 Услуга</label>
          <select name="service" value={formData.service} onChange={handleChange}>
            <option value="">Выберите услугу</option>
            {services.map(service => (
              <option key={service} value={service}>{service}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>💰 Стоимость услуги (₽)</label>
          <input
            type="text"
            name="servicePrice"
            value={formData.servicePrice}
            onChange={handlePriceChange}
            placeholder="Введите сумму, например: 5000"
            className={errors.servicePrice ? 'error' : ''}
          />
          {formData.servicePrice && (
            <small className="hint">{formatPrice(formData.servicePrice)} ₽</small>
          )}
          {errors.servicePrice && <span className="error-message">{errors.servicePrice}</span>}
          <small className="hint">Введите стоимость в рублях (только цифры)</small>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group full-width">
          <label>💬 Комментарий</label>
          <textarea
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            rows="3"
            placeholder="Дополнительная информация..."
          />
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn-submit">
          {initialData ? '💾 Сохранить изменения' : '➕ Добавить клиента'}
        </button>
        {initialData && onCancel && (
          <button type="button" className="btn-cancel" onClick={onCancel}>
            ❌ Отмена
          </button>
        )}
      </div>
    </form>
  );
};

export default ClientForm;