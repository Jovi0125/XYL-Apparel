import { Head } from '@inertiajs/react';

export default function Dashboard({ user }) {
    return (
        <div className="min-h-screen bg-slate-950 p-8 text-white">
            <Head title="Logistics Dashboard" />
            
            <div className="max-w-7xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold">Logistics Dashboard</h1>
                    <p className="text-slate-400 mt-2">Welcome back, {user?.name}</p>
                </header>

                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                    <p className="text-slate-300">
                        This is the boilerplate Logistics Dashboard. Additional features will be structured here in the future.
                    </p>
                </div>
            </div>
        </div>
    );
}
