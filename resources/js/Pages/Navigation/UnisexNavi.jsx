import React from 'react';
import NavigationBase from './NavigationBase';

export default function UnisexNavi({ categories, activeSection, searchQuery }) {
    return (
        <NavigationBase 
            categories={categories} 
            activeSection={activeSection}
            searchQuery={searchQuery}
        />
    );
}
