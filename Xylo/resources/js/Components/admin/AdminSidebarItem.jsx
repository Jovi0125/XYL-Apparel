import { Link } from '@inertiajs/react';

export default function AdminSidebarItem({ item, isActive = false }) {
    const baseClasses = `
        flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
        transition-all duration-200 ease-out
        group relative
    `;

    const activeClasses = isActive
        ? 'bg-violet-500/10 text-violet-400'
        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50';

    const content = (
        <>
            {item.icon && (
                <span className={`w-5 h-5 flex-shrink-0 transition-colors duration-200 ${
                    isActive ? 'text-violet-400' : 'text-slate-500 group-hover:text-slate-400'
                }`}>
                    {item.icon}
                </span>
            )}
            <span className="truncate">{item.label}</span>
            {item.badge && (
                <span className="ml-auto px-2 py-0.5 text-xs font-semibold rounded-full bg-violet-500/20 text-violet-400">
                    {item.badge}
                </span>
            )}
        </>
    );

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
