import { Trash2, Edit2 } from 'lucide-react';
import { colors } from '../theme';

function FieldList({ fields, onRemoveField, onEditField, editingIndex }) {
    return (
        <div className="space-y-2 mb-6">
            {fields.map((field, idx) => (
                <div
                    key={idx}
                    className={`group flex items-center justify-between p-3 rounded-md border transition ${editingIndex === idx
                            ? 'border-blue-500 bg-blue-900/10'
                            : `${colors.border} bg-[#0d1117] hover:border-gray-500`
                        }`}
                >
                    <div>
                        <div className="flex items-center gap-2">
                            <span className={`font-mono text-sm font-semibold ${editingIndex === idx ? 'text-blue-300' : 'text-blue-400'}`}>
                                {field.name}
                            </span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full border uppercase font-bold tracking-wide ${field.type === 'faker' ? 'border-gray-600 text-gray-400' :
                                    field.type === 'llm' ? 'border-purple-800 text-purple-400 bg-purple-900/20' :
                                        'border-orange-800 text-orange-400 bg-orange-900/20'
                                }`}>
                                {field.type}
                            </span>
                            {field.is_unique && (
                                <span className="text-[10px] border border-green-800 text-green-400 bg-green-900/20 px-1.5 py-0.5 rounded-full">UNIQ</span>
                            )}
                        </div>
                        {field.dependencies && field.dependencies.length > 0 && (
                            <div className="text-[10px] text-gray-500 mt-1 flex items-center gap-1">
                                <span className="opacity-50">↳</span> Depends on: {field.dependencies.join(", ")}
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => onEditField(idx)}
                            className={`p-1.5 rounded transition ${editingIndex === idx ? 'text-blue-400 bg-blue-500/10' : 'text-gray-500 hover:text-blue-400 hover:bg-gray-800'}`}
                            title="Edit field"
                        >
                            <Edit2 size={14} />
                        </button>
                        <button
                            onClick={() => onRemoveField(idx)}
                            className="p-1.5 rounded text-gray-500 hover:text-red-400 hover:bg-gray-800 transition"
                            title="Remove field"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                </div>
            ))}
            {fields.length === 0 && (
                <div className="text-center p-8 border border-dashed border-[#30363d] rounded-lg text-gray-500 text-xs">
                    No fields defined. Add some fields above.
                </div>
            )}
        </div>
    );
}

export default FieldList;