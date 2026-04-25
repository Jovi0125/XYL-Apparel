import React from 'react';
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
} from 'recharts';
import ChartCard from './ChartCard';

const COLORS = {
    pending: '#f59e0b',
    paid: '#10b981',
    failed: '#ef4444',
};

const LABELS = {
    pending: 'Pending',
    paid: 'Paid',
    failed: 'Failed',
};

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white border border-gray-200 rounded-lg px-4 py-3 shadow-xl">
                <p className="text-black font-semibold">
                    {payload[0].name}: {payload[0].value}
                </p>
            </div>
        );
    }
    return null;
};

const DeviceChart = ({ data = null }) => {
    const isEmpty = !data || data.length === 0 || data.every(d => d.value === 0);

    const chartIcon = (
        <svg className="w-12 h-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
    );

    const total = data ? data.reduce((sum, d) => sum + d.value, 0) : 0;

    return (
        <ChartCard
            title="Order Status"
            subtitle="Payment status breakdown"
            isEmpty={isEmpty}
            emptyMessage="No orders yet"
            emptyIcon={chartIcon}
            className="h-full"
        >
            <div className="flex flex-col items-center">
                <div className="h-[200px] w-full max-w-[200px] relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={55}
                                outerRadius={80}
                                paddingAngle={4}
                                dataKey="value"
                                stroke="none"
                            >
                                {data && data.map((entry) => (
                                    <Cell
                                        key={`cell-${entry.name}`}
                                        fill={COLORS[entry.name] || '#d1d5db'}
                                        className="transition-all duration-300 hover:opacity-80"
                                    />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>
                    {/* Center total */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="text-center">
                            <p className="text-2xl font-black text-black">{total}</p>
                            <p className="text-[10px] text-gray-400 uppercase tracking-wider">Total</p>
                        </div>
                    </div>
                </div>
                {data && (
                    <div className="w-full max-w-[220px] flex flex-col gap-3 mt-4">
                        {data.map((item) => (
                            <div key={item.name} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: COLORS[item.name] || '#d1d5db' }}
                                    />
                                    <span className="text-gray-500 text-sm">{LABELS[item.name] || item.name}</span>
                                </div>
                                <span className="text-black font-semibold text-sm">
                                    {item.value}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </ChartCard>
    );
};

export default DeviceChart;
