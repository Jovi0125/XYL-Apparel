import React from 'react';
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    Legend
} from 'recharts';
import ChartCard from './ChartCard';

const COLORS = ['#3b82f6', '#8b5cf6', '#06b6d4'];

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white border border-gray-200 rounded-lg px-4 py-3 shadow-xl">
                <p className="text-black font-semibold">
                    {payload[0].name}: {payload[0].value}%
                </p>
            </div>
        );
    }
    return null;
};

const CustomLegend = ({ payload }) => {
    return (
        <div className="flex flex-col gap-3 mt-4">
            {payload.map((entry, index) => (
                <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-gray-500 text-sm">{entry.value}</span>
                    </div>
                    <span className="text-black font-semibold text-sm">
                        {entry.payload.value}%
                    </span>
                </div>
            ))}
        </div>
    );
};

const DeviceChart = ({ data = null }) => {
    const isEmpty = !data || data.length === 0;

    const deviceIcon = (
        <svg className="w-12 h-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
    );

    return (
        <ChartCard
            title="Device Usage"
            subtitle="User traffic by device"
            isEmpty={isEmpty}
            emptyMessage="No device data yet"
            emptyIcon={deviceIcon}
            className="h-full"
        >
            <div className="flex flex-col items-center">
                <div className="h-[200px] w-full max-w-[200px]">
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
                                {data && data.map((entry, index) => (
                                    <Cell 
                                        key={`cell-${index}`} 
                                        fill={COLORS[index % COLORS.length]}
                                        className="transition-all duration-300 hover:opacity-80"
                                    />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                {data && (
                    <div className="w-full max-w-[220px]">
                        <CustomLegend 
                            payload={data.map((item, index) => ({
                                value: item.name,
                                color: COLORS[index % COLORS.length],
                                payload: item
                            }))}
                        />
                    </div>
                )}
            </div>
        </ChartCard>
    );
};

export default DeviceChart;
