import { useRef } from 'react';
import { Settings, Upload, Save } from 'lucide-react';
import { colors } from '../theme';

function GlobalConfig({ config, setConfig, onExport, onImport }) {
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        onImport(file);
        e.target.value = null; // Reset input value to allow re-uploading same file
    };

    return (
        <section className="mb-8 space-y-4 border-b border-[#30363d] pb-6">
            <div className="flex items-center justify-between">
                <h2 className={`text-xs font-bold ${colors.textMuted} uppercase tracking-wider flex items-center gap-2`}>
                    <Settings size={14} /> Global Configuration
                </h2>

                {/* Import/Export Actions */}
                <div className="flex gap-2">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept=".json"
                    />
                    <button
                        onClick={() => fileInputRef.current.click()}
                        className="text-[10px] bg-[#21262d] hover:bg-[#30363d] text-gray-300 px-2 py-1 rounded border border-[#30363d] flex items-center gap-1 transition"
                        title="Import schema from JSON"
                    >
                        <Upload size={12} /> Import
                    </button>
                    <button
                        onClick={onExport}
                        className="text-[10px] bg-[#21262d] hover:bg-[#30363d] text-gray-300 px-2 py-1 rounded border border-[#30363d] flex items-center gap-1 transition"
                        title="Save schema to JSON"
                    >
                        <Save size={12} /> Save
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <label className={`block text-xs font-semibold ${colors.textMain} mb-1.5`}>Dataset Name</label>
                    <input
                        type="text"
                        value={config.job_name}
                        onChange={(e) => setConfig({ ...config, job_name: e.target.value })}
                        className={`w-full p-2.5 rounded-md ${colors.inputBg} border ${colors.border} focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition text-sm text-white`}
                    />
                </div>

                <div className="flex gap-4">
                    <div className="flex-1">
                        <label className={`block text-xs font-semibold ${colors.textMain} mb-1.5`}>Rows</label>
                        <input
                            type="number"
                            value={config.rows_count}
                            onChange={(e) => setConfig({ ...config, rows_count: parseInt(e.target.value) })}
                            className={`w-full p-2.5 rounded-md ${colors.inputBg} border ${colors.border} focus:border-blue-500 outline-none text-sm text-white`}
                        />
                    </div>
                    <div className="flex-1">
                        <label className={`block text-xs font-semibold ${colors.textMain} mb-1.5`}>Format</label>
                        <div className="relative">
                            <select
                                value={config.output_format}
                                onChange={(e) => setConfig({ ...config, output_format: e.target.value })}
                                className={`w-full p-2.5 rounded-md ${colors.inputBg} border ${colors.border} focus:border-blue-500 outline-none text-sm text-white appearance-none cursor-pointer`}
                            >
                                <option value="json">JSON</option>
                                <option value="csv">CSV</option>
                                <option value="sql">SQL</option>
                            </select>
                            <div className="absolute right-3 top-3 pointer-events-none text-gray-500">▼</div>
                        </div>
                    </div>
                </div>

                <div>
                    <label className={`block text-xs font-semibold ${colors.textMain} mb-1.5`}>Global Context (AI)</label>
                    <textarea
                        rows="2"
                        value={config.global_context}
                        onChange={(e) => setConfig({ ...config, global_context: e.target.value })}
                        className={`w-full p-2.5 rounded-md ${colors.inputBg} border ${colors.border} focus:border-blue-500 outline-none text-sm text-white resize-none`}
                        placeholder="e.g. Healthcare system in Denmark..."
                    />
                </div>
            </div>
        </section>
    );
}

export default GlobalConfig;