import React from 'react';
import DiscountCard from './DiscountCard';
import DiscountEmptyState from './DiscountEmptyState';

export default function DiscountGrid({ discounts, onEdit, onDelete }) {
    if (!discounts || discounts.length === 0) {
        return <DiscountEmptyState />;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {discounts.map((discount) => (
                <DiscountCard
                    key={discount.id}
                    discount={discount}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}
