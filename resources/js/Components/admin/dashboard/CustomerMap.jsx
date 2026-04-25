import React from 'react';
import ChartCard from './ChartCard';

const CustomerMap = ({ data = null }) => {
    const isEmpty = !data || data.length === 0;

    const customerIcon = (
        <svg className="w-12 h-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        </svg>
    );

    return (
        <ChartCard
            title="Top Customers"
            subtitle="Ranked by total spending"
            isEmpty={isEmpty}
            emptyMessage="No customer data yet"
            emptyIcon={customerIcon}
            className="h-full"
        >
            <div className="space-y-3">
                {data && data.map((customer, index) => (
                    <div
                        key={customer.id || index}
                        className="flex items-center gap-4 p-3 rounded-lg bg-gray-50 border border-gray-100 hover:bg-gray-100/80 transition-colors"
                    >
                        {/* Rank */}
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 ${
                            index === 0 ? 'bg-amber-100 text-amber-700' :
                            index === 1 ? 'bg-gray-200 text-gray-600' :
                            index === 2 ? 'bg-orange-100 text-orange-600' :
                            'bg-gray-100 text-gray-500'
                        }`}>
                            {index + 1}
                        </div>

                        {/* Avatar */}
                        <div className="w-9 h-9 rounded-full bg-black flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                            {(customer.name || 'U').charAt(0).toUpperCase()}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-black truncate">{customer.name}</p>
                            <p className="text-xs text-gray-400">{customer.total_orders} order{customer.total_orders !== 1 ? 's' : ''}</p>
                        </div>

                        {/* Total Spent */}
                        <div className="text-right flex-shrink-0">
                            <p className="text-sm font-bold text-black">₱{Number(customer.total_spent).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                        </div>
                    </div>
                ))}
            </div>
        </ChartCard>
    );
};

export default CustomerMap;
