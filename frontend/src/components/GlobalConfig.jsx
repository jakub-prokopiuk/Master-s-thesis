import { useRef } from 'react';
import { Settings, Upload, Save, Globe } from 'lucide-react';
import { colors } from '../theme';

function GlobalConfig({ config, setConfig, onExport, onImport }) {
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        onImport(file);
        e.target.value = null;
    };

    return (
        <section className="mb-8 space-y-4 border-b border-[#30363d] pb-6">
            <div className="flex items-center justify-between">
                <h2 className={`text-xs font-bold ${colors.textMuted} uppercase tracking-wider flex items-center gap-2`}>
                    <Settings size={14} /> Global Configuration
                </h2>

                <div className="flex gap-2">
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".json" />
                    <button onClick={() => fileInputRef.current.click()} className="text-[10px] bg-[#21262d] hover:bg-[#30363d] text-gray-300 px-2 py-1 rounded border border-[#30363d] flex items-center gap-1 transition">
                        <Upload size={12} /> Import
                    </button>
                    <button onClick={onExport} className="text-[10px] bg-[#21262d] hover:bg-[#30363d] text-gray-300 px-2 py-1 rounded border border-[#30363d] flex items-center gap-1 transition">
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
                        <label className={`block text-xs font-semibold ${colors.textMain} mb-1.5 flex items-center gap-1.5`}>
                            <Globe size={12} className="text-gray-400" /> Region / Locale
                        </label>
                        <div className="relative">
                            <select
                                value={config.locale || "en_US"}
                                onChange={(e) => setConfig({ ...config, locale: e.target.value })}
                                className={`w-full p-2.5 rounded-md ${colors.inputBg} border ${colors.border} focus:border-blue-500 outline-none text-sm text-white appearance-none cursor-pointer`}
                            >
                                <option value="en_US">English (US)</option>
                                <option value="pl_PL">Polish (Poland)</option>
                                <option value="de_DE">German (Germany)</option>
                                <option value="fr_FR">French (France)</option>
                                <option value="es_ES">Spanish (Spain)</option>
                                <option value="it_IT">Italian (Italy)</option>
                                <option value="ja_JP">Japanese (Japan)</option>
                            </select>
                            <div className="absolute right-3 top-3 pointer-events-none text-gray-500">▼</div>
                        </div>
                    </div>

                    <div className="flex-1">
                        <label className={`block text-xs font-semibold ${colors.textMain} mb-1.5`}>Output Format</label>
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
                        placeholder="e.g. Healthcare system..."
                    />
                </div>
            </div>
        </section>
    );
}

export default GlobalConfig;