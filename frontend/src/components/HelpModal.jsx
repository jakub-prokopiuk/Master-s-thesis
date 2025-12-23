import { X, BookOpen, Wand2, Link, Thermometer, Layers } from 'lucide-react';
import { colors } from '../theme';

function HelpModal({ onClose }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className={`relative w-full max-w-3xl max-h-[85vh] overflow-y-auto ${colors.bgPanel} border ${colors.border} rounded-xl shadow-2xl flex flex-col`}>

                <div className="flex items-center justify-between p-6 border-b border-[#30363d] sticky top-0 bg-[#161b22] z-10">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <BookOpen className="text-blue-400" /> User Guide & Prompting Tutorial
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-8 space-y-8 text-sm text-gray-300 leading-relaxed">

                    <section>
                        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                            <Layers size={18} className="text-green-400" /> 1. How it works
                        </h3>
                        <p className="mb-2">DataSynth generates data row by row. The process is sequential:</p>
                        <ol className="list-decimal list-inside space-y-1 ml-2 marker:text-gray-500">
                            <li>Define <strong>Global Configuration</strong> (rows count, format).</li>
                            <li>Build your <strong>Schema</strong> field by field.</li>
                            <li>Use <strong>Faker</strong> for standard data (names, emails, UUIDs).</li>
                            <li>Use <strong>AI/LLM</strong> for complex, creative, or context-aware data.</li>
                        </ol>
                    </section>

                    <hr className="border-[#30363d]" />

                    <section>
                        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                            <Wand2 size={18} className="text-purple-400" /> 2. Prompt Engineering 101
                        </h3>
                        <div className="bg-blue-900/10 border border-blue-500/20 p-4 rounded-md mb-4">
                            <p className="font-semibold text-blue-300 mb-1">Key Rule: Be explicit about format.</p>
                            <p className="text-xs">The AI tries to be helpful, but for data generation, you want raw values, not "Here is your data: ...".</p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <h4 className="font-bold text-white mb-1">A. Context Injection (Dependencies)</h4>
                                <p className="mb-2">You can reference values from previous fields using curly braces <code className="bg-gray-700 px-1 rounded text-orange-300">{`{field_name}`}</code>.</p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                    <div className="p-3 bg-black/30 rounded border border-red-900/30">
                                        <span className="text-xs font-bold text-red-400 uppercase">Bad Prompt</span>
                                        <p className="font-mono text-xs mt-1 text-gray-400">"Generate a matching email address."</p>
                                        <p className="text-[10px] text-gray-500 italic mt-1">(AI doesn't know who the email is for)</p>
                                    </div>
                                    <div className="p-3 bg-black/30 rounded border border-green-900/30">
                                        <span className="text-xs font-bold text-green-400 uppercase">Good Prompt</span>
                                        <p className="font-mono text-xs mt-1 text-gray-300">"Generate a corporate email for <span className="text-orange-300">{`{full_name}`}</span> using the domain <span className="text-orange-300">{`{company}`}</span>. Return ONLY the email."</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-bold text-white mb-1">B. Controlling Output Format</h4>
                                <p>Force the AI to output exactly what you need for a database column.</p>
                                <ul className="list-disc list-inside ml-2 mt-1 space-y-1 text-xs">
                                    <li>"Return <strong>only</strong> the number, no text."</li>
                                    <li>"Format as YYYY-MM-DD."</li>
                                    <li>"One word answer."</li>
                                    <li>"If <code className="bg-gray-700 px-1 rounded text-orange-300">{`{age}`}</code> &lt; 18, return 'Minor', else 'Adult'."</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <hr className="border-[#30363d]" />

                    <section>
                        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                            <Thermometer size={18} className="text-orange-400" /> 3. Controlling Creativity (Temperature)
                        </h3>
                        <p className="mb-4">
                            AI models are deterministic by default. If you ask the same question twice with <strong>Temperature 0.0</strong>, you get the same answer.
                        </p>

                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div className="p-3 rounded bg-[#0d1117] border border-[#30363d]">
                                <div className="text-blue-400 font-bold mb-1">0.0 - 0.3</div>
                                <div className="text-xs font-semibold uppercase text-gray-500 mb-2">Precise</div>
                                <p className="text-[10px] text-gray-400">Good for classification, formatting, or when there is only one correct answer.</p>
                            </div>
                            <div className="p-3 rounded bg-[#0d1117] border border-[#30363d]">
                                <div className="text-green-400 font-bold mb-1">0.7 - 1.0</div>
                                <div className="text-xs font-semibold uppercase text-gray-500 mb-2">Creative</div>
                                <p className="text-[10px] text-gray-400">Default. Good for names, descriptions, reviews, bios.</p>
                            </div>
                            <div className="p-3 rounded bg-[#0d1117] border border-[#30363d]">
                                <div className="text-red-400 font-bold mb-1">1.1 - 1.5+</div>
                                <div className="text-xs font-semibold uppercase text-gray-500 mb-2">Chaotic</div>
                                <p className="text-[10px] text-gray-400">High variance. Can produce nonsense or hallucinations, but ensures uniqueness.</p>
                            </div>
                        </div>

                        <div className="mt-4 p-3 bg-yellow-900/10 border border-yellow-700/30 rounded flex gap-3">
                            <div className="text-yellow-500 shrink-0">⚠️</div>
                            <div className="text-xs text-yellow-200/80">
                                <strong>Duplicates Issue:</strong> If you use a generic prompt like "Generate a name" with <span className="font-mono">Temp: 0.1</span>, you will get "John Doe" 100 times. Increase temperature or add <strong>Frequency Penalty</strong> to fix this.
                            </div>
                        </div>
                    </section>

                </div>

                <div className="p-6 border-t border-[#30363d] bg-[#161b22] flex justify-end sticky bottom-0 z-10">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-[#21262d] hover:bg-[#30363d] text-white rounded-md font-medium border border-[#30363d] transition"
                    >
                        Got it
                    </button>
                </div>
            </div>
        </div>
    );
}

export default HelpModal;