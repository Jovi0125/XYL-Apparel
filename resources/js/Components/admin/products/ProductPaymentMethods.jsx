import React from 'react';

export default function ProductPaymentMethods({ data, setData, errors }) {
    const paymentOptions = [
        { id: 'cod', name: 'Cash on Delivery' },
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
        <div className="relative overflow-hidden rounded-2xl bg-white border border-gray-100 ">
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-transparent pointer-events-none" />
            
            <div className="relative p-6 space-y-4">
                <h3 className="text-lg font-semibold text-black">
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
                                    ? 'border-black bg-gray-50'
                                    : 'border-gray-200 bg-white hover:border-gray-300'
                            }`}
                        >
                            <span className={`font-medium text-sm ${
                                data.payment_methods.includes(option.id) ? 'text-black' : 'text-gray-500'
                            }`}>
                                {option.name}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
