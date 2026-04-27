"use client";

import React, { useState } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import styles from './AddExpenseForm.module.css';

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddExpenseForm({ onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    category: 'VIVIENDA',
    date: new Date().toISOString().split('T')[0],
    propertyId: '',
    paymentMethodId: ''
  });

  const paymentMethods = [
    { id: 'card-1', name: 'Visa Oro' },
    { id: 'card-2', name: 'Mastercard' },
    { id: 'cash', name: 'Efectivo' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:3001/api/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Note: Real auth token would be here
        },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount),
          userId: 'admin-user-id',
          familyId: 'default-family-id'
        })
      });

      if (!response.ok) throw new Error('Error al guardar el gasto');
      
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={`glass-card ${styles.modal}`}>
        <div className={styles.modalHeader}>
          <h2 className="gradient-text">Nuevo Gasto</h2>
          <button onClick={onClose} className={styles.closeButton} title="Cerrar modal">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="amount" className={styles.label}>Importe (€)</label>
            <input 
              id="amount"
              type="number" 
              step="0.01"
              required
              title="Importe del gasto en euros"
              value={formData.amount}
              onChange={e => setFormData({...formData, amount: e.target.value})}
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description" className={styles.label}>Descripción</label>
            <input 
              id="description"
              type="text" 
              required
              title="Descripción breve del gasto"
              placeholder="Ej. Recibo de Luz"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="paymentMethod" className={styles.label}>Método de Pago</label>
            <select 
              id="paymentMethod"
              title="Selecciona la tarjeta o método usado"
              value={formData.paymentMethodId}
              onChange={e => setFormData({...formData, paymentMethodId: e.target.value})}
              className={styles.select}
            >
              <option value="">Selecciona tarjeta...</option>
              {paymentMethods.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="category" className={styles.label}>Categoría</label>
            <select 
              id="category"
              title="Categoría del gasto"
              value={formData.category}
              onChange={e => setFormData({...formData, category: e.target.value})}
              className={styles.select}
            >
              <option value="VIVIENDA">Vivienda</option>
              <option value="SUMINISTROS">Suministros</option>
              <option value="ALIMENTACION">Alimentación</option>
              <option value="GASOIL / IBI">Gasoil / IBI</option>
              <option value="SCENI">Coche (Sceni)</option>
            </select>
          </div>

          {error && (
            <div className={styles.error}>
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <button type="submit" disabled={loading} title="Guardar cambios" className={`btn-primary ${styles.submitButton}`}>
            <Save size={18} />
            {loading ? 'Guardando...' : 'Guardar Gasto'}
          </button>
        </form>
      </div>
    </div>
  );
}
