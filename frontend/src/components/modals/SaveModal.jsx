import { useState } from 'react';
import { Save, X } from 'lucide-react';
import { colors } from '../../theme';

function SaveModal({ onClose, onSave, initialName }) {
    const [saveName, setSaveName] = useState(initialName || "");

    const handleSave = () => {
        onSave(saveName);
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className={`w-full max-w-md bg-[#0d1117] border ${colors.border} rounded-xl shadow-2xl p-6`}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Save className="text-blue-400" size={20} /> Save Project
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <X size={20} />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-400 mb-1.5">Project Name</label>
                        <input
                            autoFocus
                            type="text"
                            value={saveName}
                            onChange={(e) => setSaveName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                            className={`w-full p-2.5 rounded-md ${colors.inputBg} border ${colors.border} focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-white text-sm`}
                            placeholder="My Project v1"
                        />
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-[#30363d] transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-4 py-2 rounded-md text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-lg shadow-blue-900/20"
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SaveModal;