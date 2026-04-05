import React from 'react';
import { Head } from '@inertiajs/react';
import LogisticsLayout from '@/Layouts/LogisticsLayout';

export default function Dashboard({ stats }) {
    return (
        <LogisticsLayout>
            <Head title="Logistics Dashboard" />
            
            <div className="space-y-12">
                {/* Welcome Segment */}
                <div>
                    <h1 className="text-4xl font-black tracking-tight uppercase italic underline decoration-white/10 underline-offset-8">
                        Operational Status
                    </h1>
                    <p className="mt-4 text-white/40 text-sm font-medium tracking-wide">
                        Supply chain overview and active shipment tracking.
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard label="Assigned Shipments" value={stats.assigned} accent="border-white/10" />
                    <StatCard label="In Transit" value={stats.in_transit} accent="border-white/10" />
                    <StatCard label="Completed Deliveries" value={stats.delivered} accent="border-white/20" />
                </div>

                {/* Placeholder for Map/Shipment List */}
                <div className="bg-[#111] rounded-2xl border border-white/5 p-12 text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">
                        No active dispatch packets found.
                    </p>
                </div>
            </div>
        </LogisticsLayout>
    );
}

function StatCard({ label, value, accent }) {
    return (
        <div className={`p-8 bg-[#111] rounded-2xl border ${accent} transition-all hover:bg-[#151515]`}>
            <p className="text-[10px] font-bold tracking-[0.3em] text-white/30 uppercase mb-4">{label}</p>
            <p className="text-5xl font-black italic">{value}</p>
        </div>
    );
}
