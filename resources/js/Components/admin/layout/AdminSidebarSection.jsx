import { useState, useRef, useEffect } from 'react';
import AdminSidebarItem from './AdminSidebarItem';

export default function AdminSidebarSection({ 
    section, 
    isOpen, 
    onToggle, 
    activeItem = null 
}) {
    const contentRef = useRef(null);
    const [contentHeight, setContentHeight] = useState(0);

    useEffect(() => {
        if (contentRef.current) {
            setContentHeight(contentRef.current.scrollHeight);
        }
    }, [section.children]);

    const hasChildren = section.children && section.children.length > 0;

    // For sections without children (like Dashboard)
    if (!hasChildren) {
        return (
            <div className="px-3">
                <AdminSidebarItem 
                    item={section} 
                    isActive={activeItem === section.id} 
                />
            </div>
        );
    }

    return (
        <div className="px-3">
            {/* Section Header */}
            <button
                type="button"
                onClick={onToggle}
                className={`
                    w-full flex items-center justify-between px-3 py-2.5 rounded-lg
                    text-sm font-medium transition-all duration-200 ease-out
                    group
                    ${isOpen 
                        ? 'text-black bg-gray-50' 
                        : 'text-gray-500 hover:text-black hover:bg-gray-50'
                    }
                `}
            >
                <div className="flex items-center gap-3">
                    {section.icon && (
                        <span className={`w-5 h-5 flex-shrink-0 transition-colors duration-200 ${
                            isOpen ? 'text-[#E60012]' : 'text-gray-400 group-hover:text-gray-600'
                        }`}>
                            {section.icon}
                        </span>
                    )}
                    <span>{section.label}</span>
                </div>
                
                {/* Chevron */}
                <svg
                    className={`w-4 h-4 text-gray-400 transition-transform duration-300 ease-out ${
                        isOpen ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Children Container */}
            <div
                className="overflow-hidden transition-all duration-300 ease-out"
                style={{ 
                    maxHeight: isOpen ? `${contentHeight}px` : '0px',
                    opacity: isOpen ? 1 : 0
                }}
            >
                <div ref={contentRef} className="pl-4 pt-1 pb-1 space-y-0.5">
                    {section.children.map((child) => (
                        <AdminSidebarItem
                            key={child.id}
                            item={child}
                            isActive={activeItem === child.id}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
