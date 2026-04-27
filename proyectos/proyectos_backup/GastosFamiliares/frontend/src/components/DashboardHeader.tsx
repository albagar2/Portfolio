"use client";

import React from 'react';
import { Search, PlusCircle } from 'lucide-react';
import styles from '../app/dashboard.module.css';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onAddExpense: () => void;
}

export default function DashboardHeader({
  searchQuery,
  setSearchQuery,
  onAddExpense
}: HeaderProps) {
  return (
    <header className={styles.header}>
      <div>
        <h1 className="text-3xl font-bold">Resumen de Gastos</h1>
        <p className="text-muted">Control total de tus finanzas familiares</p>
      </div>
      <div className="flex gap-4">
        <div className="search-container">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Buscar gastos..." 
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="btn-primary flex items-center gap-2" onClick={onAddExpense}>
          <PlusCircle size={20} />
          Añadir Gasto
        </button>
      </div>
    </header>
  );
}
