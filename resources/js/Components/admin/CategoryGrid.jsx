import React from 'react';
import CategoryCard from './CategoryCard';
import CategoryEmptyState from './CategoryEmptyState';

const CategoryGrid = ({ categories = [] }) => {
    if (!categories || categories.length === 0) {
        return <CategoryEmptyState />;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categories.map((category) => (
                <CategoryCard key={category.id} category={category} />
            ))}
        </div>
    );
};

export default CategoryGrid;
