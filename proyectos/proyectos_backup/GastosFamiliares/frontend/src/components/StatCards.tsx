"use client";

import React from 'react';
import { PieChart, Clock, Zap } from 'lucide-react';
import styles from '../app/dashboard.module.css';

export default function StatCards() {
  return (
    <section className={styles.statsGrid}>
      <div className={`glass-card ${styles.statCard}`}>
        <div className="flex justify-between items-center">
          <span className={`${styles.textSm} ${styles.opacity50}`}>Total Mes</span>
          <div className="p-2 rounded-full bg-indigo-500/10">
            <PieChart size={20} color="var(--primary)" />
          </div>
        </div>
        <span className={styles.statValue}>2.450€</span>
        <span className="text-xs text-green-400">+12% vs mes anterior</span>
      </div>
      
      <div className={`glass-card ${styles.statCard}`}>
        <div className="flex justify-between items-center">
          <span className={`${styles.textSm} ${styles.opacity50}`}>Próximos Pagos</span>
          <div className="p-2 rounded-full bg-yellow-500/10">
            <Clock size={20} color="#fbbf24" />
          </div>
        </div>
        <span className={styles.statValue}>450€</span>
        <span className={`text-xs ${styles.opacity50}`}>3 facturas pendientes</span>
      </div>

      <div className={`glass-card ${styles.statCard}`}>
        <div className="flex justify-between items-center">
          <span className={`${styles.textSm} ${styles.opacity50}`}>Suministros</span>
          <div className="p-2 rounded-full bg-green-500/10">
            <Zap size={20} color="#10b981" />
          </div>
        </div>
        <span className={styles.statValue}>185€</span>
        <span className="text-xs text-green-400">-5% ahorro logrado</span>
      </div>
    </section>
  );
}
