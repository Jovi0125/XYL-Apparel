import React from 'react';
import NavigationBase from './NavigationBase';

export default function UnisexNavi({ categories, activeSection }) {
    return (
        <NavigationBase categories={categories} activeSection={activeSection}>
        </NavigationBase>
    );
}
