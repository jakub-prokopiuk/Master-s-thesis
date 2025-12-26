import { CheckCircle2, AlertTriangle } from 'lucide-react';

function Toast({ type = 'default', message }) {
    if (!message) return null;

    return (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-[60] px-4 py-2 rounded-md shadow-lg border flex items-center gap-2 text-sm font-medium animate-in slide-in-from-top-2 fade-in
            ${type === 'success'
                ? 'bg-green-900/90 border-green-700 text-green-100'
                : 'bg-red-900/90 border-red-700 text-red-100'}`}
        >
            {type === 'success' ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
            {message}
        </div>
    );
}

export default Toast;