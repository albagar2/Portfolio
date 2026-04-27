"use client";

import React from 'react';
import { 
  PieChart, 
  Home, 
  PlusCircle, 
  Settings, 
  LogOut 
} from 'lucide-react';
import styles from './dashboard.module.css';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  filterProperty: string | null;
  setFilterProperty: (prop: string | null) => void;
  selectedCard: string | null;
  setSelectedCard: (id: string | null) => void;
  properties: any[];
  cards: any[];
  onAddExpense: () => void;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  filterProperty,
  setFilterProperty,
  selectedCard,
  setSelectedCard,
  properties,
  cards,
  onAddExpense
}: SidebarProps) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <h2 className={`gradient-text ${styles.logoTitle}`}>FamiliaGasto</h2>
      </div>
      
      <nav className={styles.categoryList}>
        {[
          { name: 'Resumen', icon: <PieChart size={20} /> },
          { name: 'Propiedades', icon: <Home size={20} /> },
          { name: 'Añadir Gasto', icon: <PlusCircle size={20} />, action: onAddExpense },
          { name: 'Configuración', icon: <Settings size={20} /> }
        ].map((item) => (
          <div 
            key={item.name} 
            className={`${styles.categoryItem} pointer ${activeTab === item.name ? styles.activeNavItem : ''}`}
            onClick={() => {
              if (item.action) item.action();
              else {
                setActiveTab(item.name);
                if (item.name === 'Resumen') {
                  setFilterProperty(null);
                  setSelectedCard(null);
                }
              }
            }}
          >
            <div className={styles.categoryIcon}>
              {item.icon}
              <span className="font-500">{item.name}</span>
            </div>
          </div>
        ))}
      </nav>

      <div className={styles.itemGroup}>
        <span className={styles.sectionTitle}>Mis Casas</span>
        <div className={`${styles.categoryList} mt-2`}>
          {properties.map((p, i) => (
            <div 
              key={i} 
              className={`${styles.categoryItem} pointer ${filterProperty === p.name ? styles.activeFilter : ''}`}
              onClick={() => {
                setFilterProperty(p.name === filterProperty ? null : p.name);
                setSelectedCard(null);
              }}
            >
              <span className={styles.textSm}>{p.name}</span>
              <span className={styles.opacity50}>{p.expenses}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.itemGroup}>
        <span className={styles.sectionTitle}>Tus Tarjetas</span>
        <div className={`${styles.categoryList} mt-2`}>
          {cards.map((c, i) => (
            <div 
              key={i} 
              className={`${styles.categoryItem} pointer ${selectedCard === c.id ? styles.activeNavItem : ''}`}
              onClick={() => {
                setSelectedCard(c.id === selectedCard ? null : c.id);
                setFilterProperty(null);
              }}
            >
              <div className={styles.categoryIcon} style={{ gap: '0.5rem' }}>
                {c.icon}
                <span className={styles.textSm}>{c.name}</span>
              </div>
              <span className={styles.badge}>{c.total.toFixed(0)}€</span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.footerBtn}>
        <button 
          className={`${styles.categoryItem} pointer w-full text-red-500`}
          onClick={() => alert('Cerrando sesión...')}
        >
          <div className={styles.categoryIcon}>
            <LogOut size={20} />
            <span>Cerrar Sesión</span>
          </div>
        </button>
      </div>
    </aside>
  );
}
