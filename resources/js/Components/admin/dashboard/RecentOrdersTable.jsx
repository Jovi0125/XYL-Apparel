import React from 'react';
import TableCard from './TableCard';

const StatusBadge = ({ status }) => {
    const statusStyles = {
        'completed': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
        'processing': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        'pending': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
        'shipped': 'bg-violet-500/20 text-violet-400 border-violet-500/30',
        'cancelled': 'bg-rose-500/20 text-rose-400 border-rose-500/30',
        'refunded': 'bg-slate-500/20 text-slate-400 border-slate-500/30',
    };

    const style = statusStyles[status.toLowerCase()] || statusStyles['pending'];

    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${style}`}>
            {status}
        </span>
    );
};

const RecentOrdersTable = ({ orders = [] }) => {
    const columns = [
        {
            header: 'Order ID',
            accessor: 'id',
            render: (value) => (
                <span className="text-white font-medium">#{value}</span>
            )
        },
        {
            header: 'Customer',
            accessor: 'customer',
            render: (value, row) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white text-xs font-semibold">
                        {value.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="text-white text-sm font-medium">{value}</p>
                        {row.email && (
                            <p className="text-slate-500 text-xs">{row.email}</p>
                        )}
                    </div>
                </div>
            )
        },
        {
            header: 'Amount',
            accessor: 'amount',
            render: (value) => (
                <span className="text-white font-semibold">
                    ${typeof value === 'number' ? value.toLocaleString('en-US', { minimumFractionDigits: 2 }) : value}
                </span>
            )
        },
        {
            header: 'Status',
            accessor: 'status',
            render: (value) => <StatusBadge status={value} />
        }
    ];

    const orderIcon = (
        <svg className="w-12 h-12 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
    );

    const viewAllButton = orders.length > 0 ? (
        <button className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors flex items-center gap-1">
            View all
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
        </button>
    ) : null;

    return (
        <TableCard
            title="Recent Orders"
            subtitle="Latest customer orders"
            columns={columns}
            data={orders}
            emptyMessage="No recent orders yet"
            emptyIcon={orderIcon}
            headerAction={viewAllButton}
        />
    );
};

export default RecentOrdersTable;
