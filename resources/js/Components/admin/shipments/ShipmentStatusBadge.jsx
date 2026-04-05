import React from 'react';

const statusConfig = {
    pending:    { label: 'Pending',    bg: 'bg-amber-500/15',   text: 'text-amber-400',   border: 'border-amber-500/25', dot: 'bg-amber-400'   },
    preparing:  { label: 'Preparing',  bg: 'bg-blue-500/15',    text: 'text-blue-400',    border: 'border-blue-500/25',  dot: 'bg-blue-400'    },
    shipped:    { label: 'Shipped',    bg: 'bg-indigo-500/15',  text: 'text-indigo-400',  border: 'border-indigo-500/25',dot: 'bg-indigo-400'  },
    in_transit: { label: 'In Transit', bg: 'bg-cyan-500/15',    text: 'text-cyan-400',    border: 'border-cyan-500/25',  dot: 'bg-cyan-400'    },
    delivered:  { label: 'Delivered',  bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/25',dot: 'bg-emerald-400' },
    cancelled:  { label: 'Cancelled',  bg: 'bg-rose-500/15',    text: 'text-rose-400',    border: 'border-rose-500/25',  dot: 'bg-rose-400'    },
};

export default function ShipmentStatusBadge({ status }) {
    const config = statusConfig[status] || statusConfig.pending;

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${config.bg} ${config.text} ${config.border}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
            {config.label}
        </span>
    );
}
