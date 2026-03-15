import React from 'react';
import styles from './Dashboard.module.scss';

export default function DashboardWidget({ title, value }) {
  return (
    <div className={styles.card}>
      <div className={styles.cardTitle}>{title}</div>
      <div className={styles.cardValue}>{value ?? '—'}</div>
    </div>
  );
}
