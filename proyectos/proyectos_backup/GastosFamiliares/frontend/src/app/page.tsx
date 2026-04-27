"use client";

import React, { useRef, useState } from 'react';
import { Upload } from 'lucide-react';
import styles from './dashboard.module.css';

// Components
import AddExpenseForm from '../components/AddExpenseForm';
import Sidebar from '../components/Sidebar';
import DashboardHeader from '../components/DashboardHeader';
import StatCards from '../components/StatCards';
import ExpenseList from '../components/ExpenseList';

// Data
import { categories, properties, cards, recentExpenses } from './mockData';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('Resumen');
  const [isAdding, setIsAdding] = useState(false);
  const [filterProperty, setFilterProperty] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddExpense = () => setIsAdding(true);
  
  const handleUploadClick = (id?: string) => {
    console.log('Uploading for expense:', id);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      alert(`Archivo "${e.target.files[0].name}" listo para subir.`);
    }
  };

  const openReceipt = (url: string) => {
    window.open(url, '_blank');
  };

  const filteredExpenses = recentExpenses.filter(e => {
    const matchesProperty = !filterProperty || e.property === filterProperty;
    const matchesCard = !selectedCard || e.paymentMethodId === selectedCard;
    const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          e.property.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesProperty && matchesCard && matchesSearch;
  });

  return (
    <div className={styles.dashboard}>
      {isAdding && (
        <AddExpenseForm 
          onClose={() => setIsAdding(false)} 
          onSuccess={() => alert('¡Gasto registrado en el sistema!')} 
        />
      )}

      <input 
        id="fileUpload"
        type="file" 
        ref={fileInputRef} 
        className="hidden"
        title="Subir recibo o factura"
        aria-label="Subir recibo o factura"
        onChange={handleFileChange}
        accept="image/*,.pdf"
      />

      <Sidebar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        filterProperty={filterProperty}
        setFilterProperty={setFilterProperty}
        selectedCard={selectedCard}
        setSelectedCard={setSelectedCard}
        properties={properties}
        cards={cards}
        onAddExpense={handleAddExpense}
      />

      <main className={styles.mainContent}>
        <DashboardHeader 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onAddExpense={handleAddExpense}
        />

        <StatCards />

        <div className={styles.chartSection}>
          <div className="glass-card p-8">
            <h3>Tendencia de Gastos</h3>
            <div className={styles.chartPlaceholder}>
              <span className={styles.opacity50}>Visualización de gráfico anual</span>
            </div>
          </div>

          <ExpenseList 
            expenses={filteredExpenses}
            filterProperty={filterProperty}
            openReceipt={openReceipt}
            handleUploadClick={handleUploadClick}
          />
        </div>

        <div className={`glass-card ${styles.p8} mt-8`}>
          <h3>Distribución por Categoría</h3>
          <ul className={`${styles.categoryList} mt-6`}>
            {categories.map((cat, i) => (
              <li key={i} className={styles.categoryItem}>
                <div className={styles.categoryIcon}>
                  <div style={{ color: cat.color }}>{cat.icon}</div>
                  <span>{cat.name}</span>
                </div>
                <span className={styles.font600}>{cat.amount} €</span>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.dropzone} onClick={() => handleUploadClick()}>
          <div className={`flex-center ${styles.flexCol} ${styles.gap4}`}>
            <div className="p-4 rounded-full bg-white/5">
              <Upload size={32} />
            </div>
            <div>
              <p className={styles.font600}>Subir nuevo recibo o factura</p>
              <p className={`text-xs ${styles.opacity50}`}>Arrastra archivos o haz clic aquí</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
