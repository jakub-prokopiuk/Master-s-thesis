import { Table2, Plus, Trash2, Layers } from 'lucide-react';
import { colors } from '../theme';

function TableManager({ tables, activeTableId, onAddTable, onRemoveTable, onSelectTable, onUpdateTable }) {
    return (
        <div className="mb-6">
            <div className="flex items-center justify-between mb-3 px-1">
                <h2 className={`text-xs font-bold ${colors.textMuted} uppercase tracking-wider flex items-center gap-2`}>
                    <Layers size={14} /> Database Tables
                </h2>
                <button
                    onClick={onAddTable}
                    className="text-[10px] flex items-center gap-1 bg-blue-600 hover:bg-blue-500 text-white px-2 py-1 rounded transition"
                >
                    <Plus size={12} /> Add Table
                </button>
            </div>

            <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1 custom-scrollbar">
                {tables.map((table) => (
                    <div
                        key={table.id}
                        onClick={() => onSelectTable(table.id)}
                        className={`group p-3 rounded-md border cursor-pointer transition relative ${table.id === activeTableId
                            ? 'bg-blue-900/20 border-blue-500 ring-1 ring-blue-500/50'
                            : `bg-[#0d1117] ${colors.border} hover:border-gray-500`
                            }`}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                                <Table2 size={16} className={table.id === activeTableId ? "text-blue-400" : "text-gray-500"} />
                                <input
                                    type="text"
                                    value={table.name}
                                    onChange={(e) => onUpdateTable(table.id, { name: e.target.value })}
                                    className="bg-transparent text-sm font-bold text-white outline-none w-32 focus:border-b focus:border-blue-500"
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </div>
                            {tables.length > 1 && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onRemoveTable(table.id);
                                    }}
                                    className="text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition"
                                >
                                    <Trash2 size={14} />
                                </button>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            <label className="text-[10px] text-gray-500 uppercase font-bold">Rows:</label>
                            <input
                                type="number"
                                value={table.rows_count}
                                onChange={(e) => onUpdateTable(table.id, { rows_count: parseInt(e.target.value) || 0 })}
                                onClick={(e) => e.stopPropagation()}
                                className="bg-[#161b22] text-xs text-white border border-[#30363d] rounded px-1 py-0.5 w-16 text-right outline-none focus:border-blue-500"
                            />
                            <span className="text-[10px] text-gray-600 ml-auto">
                                {table.fields.length} fields
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TableManager;