import React from 'react';

const statusConfig = {
    pending: { label: 'Pending', bg: 'bg-amber-500/15',   text: 'text-amber-400',   border: 'border-amber-500/25'   },
    paid:    { label: 'Paid',    bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/25' },
    unpaid:  { label: 'Unpaid',  bg: 'bg-slate-500/15',   text: 'text-slate-400',   border: 'border-slate-500/25'   },
    failed:  { label: 'Failed',  bg: 'bg-rose-500/15',    text: 'text-rose-400',    border: 'border-rose-500/25'    },
};

export default function PaymentStatusBadge({ status }) {
    const config = statusConfig[status] || statusConfig.pending;

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${config.bg} ${config.text} ${config.border}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${config.text.replace('text-', 'bg-')}`} />
            {config.label}
        </span>
    );
}
