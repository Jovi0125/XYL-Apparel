import { Link } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';

export default function AdminSidebarItem({ item, isActive = false }) {
    const [isOpen, setIsOpen] = useState(false);
    const contentRef = useRef(null);
    const [contentHeight, setContentHeight] = useState(0);

    useEffect(() => {
        if (contentRef.current) {
            setContentHeight(contentRef.current.scrollHeight);
        }
    }, [item.children]);

    const hasChildren = item.children && item.children.length > 0;

    const baseClasses = `
        flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
        transition-all duration-200 ease-out
        group relative
    `;

    const activeClasses = isActive
        ? 'bg-black text-white'
        : 'text-gray-500 hover:text-black hover:bg-gray-50';

    const content = (
        <>
            {item.icon && (
                <span className={`w-5 h-5 flex-shrink-0 transition-colors duration-200 ${
                    isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'
                }`}>
                    {item.icon}
                </span>
            )}
            <span className="truncate">{item.label}</span>
            {item.badge && (
                <span className="ml-auto px-2 py-0.5 text-xs font-semibold rounded-full bg-[#E60012] text-white">
                    {item.badge}
                </span>
            )}
            {hasChildren && (
                <svg
                    className={`ml-auto w-4 h-4 text-gray-400 transition-transform duration-300 ease-out ${
                        isOpen ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
            )}
        </>
    );

    if (hasChildren) {
        return (
            <div>
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className={`${baseClasses} ${activeClasses} w-full text-left`}
                >
                    {content}
                </button>
                <div
                    className="overflow-hidden transition-all duration-300 ease-out"
                    style={{ 
                        maxHeight: isOpen ? `${contentHeight}px` : '0px',
                        opacity: isOpen ? 1 : 0
                    }}
                >
                    <div ref={contentRef} className="pl-6 pt-1 pb-1 space-y-0.5">
                        {item.children.map((child) => (
                            <AdminSidebarItem
                                key={child.id}
                                item={child}
                                isActive={isActive}
                            />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (item.href && item.href !== '#') {
        return (
            <Link href={item.href} className={`${baseClasses} ${activeClasses}`}>
                {content}
            </Link>
        );
    }

    return (
        <button
            type="button"
            onClick={item.onClick}
            className={`${baseClasses} ${activeClasses} w-full text-left`}
        >
            {content}
        </button>
    );
}
