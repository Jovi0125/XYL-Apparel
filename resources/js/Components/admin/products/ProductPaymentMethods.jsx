import React from 'react';

export default function ProductPaymentMethods({ data, setData, errors }) {
    const paymentOptions = [
        { id: 'cod', name: 'Cash on Delivery', icon: '💵' },
        { id: 'gcash', name: 'GCash', icon: '📱' },
    ];

    const togglePaymentMethod = (method) => {
        const exists = data.payment_methods.includes(method);
        if (exists) {
            setData('payment_methods', data.payment_methods.filter(m => m !== method));
        } else {
            setData('payment_methods', [...data.payment_methods, method]);
        }
    };

    return (
        <div className="relative overflow-hidden rounded-2xl bg-slate-900/80 border border-slate-800/50 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-violet-500/5 pointer-events-none" />
            
            <div className="relative p-6 space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-teal-500/20 flex items-center justify-center">
                        <svg className="w-4 h-4 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                    </div>
                    Payment Methods
                </h3>

                <div className="grid grid-cols-2 gap-3">
                    {paymentOptions.map(option => (
                        <button
                            key={option.id}
                            type="button"
                            onClick={() => togglePaymentMethod(option.id)}
                            className={`p-4 rounded-xl border-2 transition-all text-left ${
                                data.payment_methods.includes(option.id)
                                    ? 'border-blue-500 bg-blue-500/10'
                                    : 'border-slate-700/50 bg-slate-800/30 hover:border-slate-600/50'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">{option.icon}</span>
                                <span className={`font-medium ${
                                    data.payment_methods.includes(option.id) ? 'text-blue-400' : 'text-slate-400'
                                }`}>
                                    {option.name}
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
