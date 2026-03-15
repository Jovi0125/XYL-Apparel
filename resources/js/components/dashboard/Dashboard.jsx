import React from 'react';
import useDashboardData from '../../hooks/useDashboardData';
import DashboardWidget from './DashboardWidget';
import styles from './Dashboard.module.scss';

export default function Dashboard() {
  const { data, loading, error, refresh } = useDashboardData();

  if (loading) return <div className={styles.loader}>Loading dashboard...</div>;
  if (error) return <div className={styles.error}>Failed to load dashboard</div>;

  const widgets = [
    { key: 'orders', title: 'Orders', value: data.orders },
    { key: 'revenue', title: 'Revenue', value: data.revenue },
    { key: 'products', title: 'Products', value: data.products },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Dashboard</h1>
        <button onClick={refresh} className={styles.refresh}>Refresh</button>
      </div>

      <div className={styles.grid}>
        {widgets.map((w) => (
          <DashboardWidget key={w.key} title={w.title} value={w.value} />
        ))}
      </div>
    </div>
  );
}
