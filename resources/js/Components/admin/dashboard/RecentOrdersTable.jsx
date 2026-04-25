import React from 'react';
import TableCard from './TableCard';

const StatusBadge = ({ status }) => {
    const statusStyles = {
        'paid': 'bg-green-100 text-green-700 border-green-200',
        'completed': 'bg-green-100 text-green-700 border-green-200',
        'processing': 'bg-blue-100 text-blue-700 border-blue-200',
        'pending': 'bg-yellow-100 text-yellow-700 border-yellow-200',
        'shipped': 'bg-purple-100 text-purple-700 border-purple-200',
        'cancelled': 'bg-red-100 text-red-700 border-red-200',
        'refunded': 'bg-gray-100 text-gray-600 border-gray-200',
    };

    const style = statusStyles[status?.toLowerCase()] || statusStyles['pending'];
    const label = status ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase() : 'Unknown';

    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${style}`}>
            {label}
        </span>
    );
};

const RecentOrdersTable = ({ orders = [] }) => {
    const columns = [
        {
            header: 'Order ID',
            accessor: 'id',
            render: (value) => (
                <span className="text-black font-medium">#{value}</span>
            )
        },
        {
            header: 'Customer',
            accessor: 'buyer_name',
            render: (value, row) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white text-xs font-semibold">
                        {(value || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="text-black text-sm font-medium">{value || 'Unknown'}</p>
                        {row.email && (
                            <p className="text-gray-400 text-xs">{row.email}</p>
                        )}
                    </div>
                </div>
            )
        },
        {
            header: 'Amount',
            accessor: 'total',
            render: (value) => (
                <span className="text-black font-semibold">
                    {value || '₱0.00'}
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
        <svg className="w-12 h-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
    );

    const viewAllButton = orders.length > 0 ? (
        <button className="text-[#E60012] hover:text-red-600 text-xs font-bold transition-colors flex items-center gap-1">
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
