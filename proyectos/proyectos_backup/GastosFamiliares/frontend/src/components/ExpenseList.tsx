"use client";

import React from 'react';
import { Clock, FileText, Upload } from 'lucide-react';
import styles from '../app/dashboard.module.css';

interface Expense {
  id: string;
  title: string;
  amount: number;
  property: string;
  date: string;
  status: string;
  isRecurring?: boolean;
  receiptUrl?: string | null;
}

interface ExpenseListProps {
  expenses: Expense[];
  filterProperty: string | null;
  openReceipt: (url: string) => void;
  handleUploadClick: (id?: string) => void;
}

export default function ExpenseList({
  expenses,
  filterProperty,
  openReceipt,
  handleUploadClick
}: ExpenseListProps) {
  return (
    <div className="glass-card p-8">
      <h3>{filterProperty ? `Gastos de ${filterProperty}` : 'Gastos Recientes'}</h3>
      <div className="mt-6">
        {expenses.map((expense, i) => (
          <div key={i} className={`${styles.categoryItem} border-b-white-5`}>
            <div className={styles.flexCol}>
              <span className={styles.font600}>{expense.title}</span>
              <span className={`text-xs ${styles.opacity50}`}>{expense.property}</span>
            </div>
            <div className={`flex-center ${styles.gap4}`}>
              {expense.isRecurring && (
                <div className="recurring-badge" title="Gasto recurrente">
                  <Clock size={12} />
                </div>
              )}
              <span className={`text-sm ${styles.opacity50}`}>{expense.date}</span>
              {expense.receiptUrl ? (
                <button 
                  className="btn-icon" 
                  onClick={() => openReceipt(expense.receiptUrl!)}
                  title="Ver recibo"
                >
                  <FileText size={16} color="var(--primary)" />
                </button>
              ) : (
                <button 
                  className="btn-icon" 
                  onClick={() => handleUploadClick(expense.id)}
                  title="Subir recibo"
                >
                  <Upload size={16} />
                </button>
              )}
              <span className={styles.font600}>{expense.amount.toFixed(2)} €</span>
            </div>
          </div>
        ))}
        {expenses.length === 0 && (
          <p className={`text-center mt-4 ${styles.opacity50}`}>No hay gastos registrados para esta propiedad.</p>
        )}
      </div>
    </div>
  );
}
