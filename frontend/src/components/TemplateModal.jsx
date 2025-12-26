import { X, Layout, ShoppingCart, Briefcase, Activity, ArrowRight } from 'lucide-react';
import { colors } from '../theme';
import { TEMPLATES } from '../data/templates';

const ICON_MAP = {
    "ShoppingCart": ShoppingCart,
    "Briefcase": Briefcase,
    "Activity": Activity
};

function TemplateModal({ onClose, onSelect }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className={`relative w-full max-w-4xl bg-[#0d1117] border ${colors.border} rounded-xl shadow-2xl flex flex-col max-h-[90vh]`}>

                <div className="flex items-center justify-between p-6 border-b border-[#30363d] bg-[#161b22] rounded-t-xl">
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <Layout className="text-blue-400" /> Choose a Template
                        </h2>
                        <p className="text-sm text-gray-400 mt-1">Start with a pre-built schema to save time.</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-8 overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {TEMPLATES.map((template) => {
                            const Icon = ICON_MAP[template.icon] || Layout;

                            return (
                                <button
                                    key={template.id}
                                    onClick={() => onSelect(template)}
                                    className={`flex flex-col text-left h-full p-5 rounded-lg border transition-all duration-200 group hover:-translate-y-1 hover:shadow-lg ${template.bg} ${template.border} hover:border-opacity-100 border-opacity-40`}
                                >
                                    <div className={`p-3 rounded-md w-fit mb-4 bg-black/20 ${template.color}`}>
                                        <Icon size={24} />
                                    </div>

                                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                                        {template.name}
                                    </h3>

                                    <p className="text-xs text-gray-400 mb-6 flex-1 leading-relaxed">
                                        {template.description}
                                    </p>

                                    <div className="mt-auto space-y-3">
                                        <div className="flex flex-wrap gap-2">
                                            {template.tables.map(t => (
                                                <span key={t.id} className="text-[10px] px-2 py-1 rounded bg-black/40 text-gray-300 border border-white/5">
                                                    {t.name}
                                                </span>
                                            ))}
                                        </div>

                                        <div className={`flex items-center gap-2 text-xs font-bold ${template.color} opacity-0 group-hover:opacity-100 transition-opacity`}>
                                            Load Template <ArrowRight size={14} />
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="p-4 border-t border-[#30363d] bg-[#161b22] rounded-b-xl flex justify-center text-xs text-gray-500">
                    You can always edit the schema after loading a template.
                </div>
            </div>
        </div>
    );
}

export default TemplateModal;