import { useState, useEffect } from 'react';
import { Wand2, Plus, Save, XCircle } from 'lucide-react';
import { colors } from '../theme';

function SchemaBuilder({ onAddField, onUpdateField, onCancelEdit, existingFields, fieldToEdit }) {
    const [newField, setNewField] = useState({
        name: "",
        type: "faker",
        is_unique: false,
        dependencies: []
    });

    const [fakerMethod, setFakerMethod] = useState("uuid4");
    const [llmPrompt, setLlmPrompt] = useState("");
    const [distOptions, setDistOptions] = useState("BUG, FEATURE, DOCS");
    const [distWeights, setDistWeights] = useState("50, 30, 20");

    useEffect(() => {
        if (fieldToEdit) {
            setNewField({
                name: fieldToEdit.name,
                type: fieldToEdit.type,
                is_unique: fieldToEdit.is_unique || false,
                dependencies: fieldToEdit.dependencies || []
            });

            if (fieldToEdit.type === 'faker') {
                setFakerMethod(fieldToEdit.params.method || "uuid4");
            } else if (fieldToEdit.type === 'llm') {
                setLlmPrompt(fieldToEdit.params.prompt_template || "");
            } else if (fieldToEdit.type === 'distribution') {
                setDistOptions(fieldToEdit.params.options ? fieldToEdit.params.options.join(", ") : "");
                setDistWeights(fieldToEdit.params.weights ? fieldToEdit.params.weights.join(", ") : "");
            }
        } else {
            resetForm();
        }
    }, [fieldToEdit]);

    const resetForm = () => {
        setNewField({ name: "", type: "faker", is_unique: false, dependencies: [] });
        setFakerMethod("uuid4");
        setLlmPrompt("");
        setDistOptions("BUG, FEATURE, DOCS");
        setDistWeights("50, 30, 20");
    };

    const handleSubmit = () => {
        if (!newField.name) return;

        let finalParams = {};
        if (newField.type === "faker") {
            finalParams = { method: fakerMethod };
        } else if (newField.type === "llm") {
            finalParams = {
                prompt_template: llmPrompt,
                model: "gpt-4o-mini",
                temperature: 0.1
            };
        } else if (newField.type === "distribution") {
            finalParams = {
                options: distOptions.split(",").map(s => s.trim()),
                weights: distWeights.split(",").map(s => parseFloat(s.trim()))
            };
        }

        const fieldPayload = {
            ...newField,
            params: finalParams
        };

        if (fieldToEdit) {
            onUpdateField(fieldPayload);
        } else {
            onAddField(fieldPayload);
            resetForm();
        }
    };

    return (
        <section className="flex-1">
            <h2 className={`text-xs font-bold ${colors.textMuted} uppercase tracking-wider flex items-center gap-2 mb-4`}>
                <Wand2 size={14} /> Schema Builder
            </h2>

            <div className={`p-4 rounded-md border ${colors.border} ${fieldToEdit ? 'bg-blue-900/10 border-blue-500/30' : 'bg-[#0d1117]'} mb-6 transition-colors`}>
                <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="col-span-2">
                        <label className={`block text-[10px] uppercase font-bold ${colors.textMuted} mb-1`}>
                            {fieldToEdit ? 'Editing Field Name' : 'Field Name'}
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. user_id"
                            value={newField.name}
                            onChange={(e) => setNewField({ ...newField, name: e.target.value })}
                            className={`w-full p-2 rounded-md ${colors.bgPanel} border ${colors.border} text-sm text-white focus:border-blue-500 outline-none`}
                        />
                    </div>
                    <div className="col-span-1">
                        <label className={`block text-[10px] uppercase font-bold ${colors.textMuted} mb-1`}>Type</label>
                        <select
                            value={newField.type}
                            onChange={(e) => setNewField({ ...newField, type: e.target.value })}
                            className={`w-full p-2 rounded-md ${colors.bgPanel} border ${colors.border} text-sm text-white focus:border-blue-500 outline-none`}
                        >
                            <option value="faker">Faker</option>
                            <option value="llm">AI / LLM</option>
                            <option value="distribution">Distro</option>
                        </select>
                    </div>
                </div>

                <div className={`mb-4 p-3 rounded border border-dashed border-gray-700 bg-[#161b22]/50`}>
                    {newField.type === "faker" && (
                        <div>
                            <label className={`block text-xs font-bold ${colors.textMuted} mb-1`}>Faker Method</label>
                            <select
                                value={fakerMethod}
                                onChange={e => setFakerMethod(e.target.value)}
                                className={`w-full p-2 rounded border ${colors.border} bg-[#0d1117] text-white text-sm`}
                            >
                                <option value="uuid4">UUID</option>
                                <option value="name">Name</option>
                                <option value="email">Email</option>
                                <option value="job">Job Title</option>
                                <option value="address">Address</option>
                                <option value="ean">EAN Code</option>
                                <option value="phone_number">Phone</option>
                            </select>
                        </div>
                    )}

                    {newField.type === "llm" && (
                        <div className="space-y-3">
                            <div>
                                <label className={`block text-xs font-bold ${colors.textMuted} mb-1`}>Context Dependencies</label>
                                {existingFields.filter(f => f.name !== newField.name).length === 0 && <p className="text-xs text-red-400 italic">No other fields available.</p>}
                                <div className="flex flex-wrap gap-2">
                                    {existingFields.filter(f => f.name !== newField.name).map(f => (
                                        <button
                                            key={f.name}
                                            onClick={() => {
                                                const newDeps = newField.dependencies.includes(f.name)
                                                    ? newField.dependencies.filter(d => d !== f.name)
                                                    : [...newField.dependencies, f.name];
                                                setNewField({ ...newField, dependencies: newDeps });
                                            }}
                                            className={`text-xs px-2 py-1 rounded border transition ${newField.dependencies.includes(f.name)
                                                ? 'bg-blue-500/20 border-blue-500 text-blue-300'
                                                : 'bg-[#0d1117] border-[#30363d] text-gray-400 hover:border-gray-500'
                                                }`}
                                        >
                                            {f.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className={`block text-xs font-bold ${colors.textMuted} mb-1`}>Prompt Template</label>
                                <textarea
                                    value={llmPrompt}
                                    onChange={e => setLlmPrompt(e.target.value)}
                                    placeholder="e.g. Based on {pension_type}, generate..."
                                    className={`w-full p-2 rounded border ${colors.border} bg-[#0d1117] text-white text-sm h-20 font-mono text-xs`}
                                />
                            </div>
                        </div>
                    )}

                    {newField.type === "distribution" && (
                        <div className="space-y-3">
                            <div>
                                <label className={`block text-xs font-bold ${colors.textMuted} mb-1`}>Options (comma sep)</label>
                                <input
                                    type="text"
                                    value={distOptions}
                                    onChange={e => setDistOptions(e.target.value)}
                                    className={`w-full p-2 rounded border ${colors.border} bg-[#0d1117] text-white text-sm`}
                                />
                            </div>
                            <div>
                                <label className={`block text-xs font-bold ${colors.textMuted} mb-1`}>Weights (comma sep)</label>
                                <input
                                    type="text"
                                    value={distWeights}
                                    onChange={e => setDistWeights(e.target.value)}
                                    className={`w-full p-2 rounded border ${colors.border} bg-[#0d1117] text-white text-sm`}
                                />
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#30363d]">
                    <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={newField.is_unique}
                            onChange={(e) => setNewField({ ...newField, is_unique: e.target.checked })}
                            className="w-4 h-4 rounded border-gray-600 bg-[#0d1117] text-blue-600 focus:ring-offset-[#161b22]"
                        />
                        <span className="text-xs font-medium">Unique Value</span>
                    </label>

                    <div className="flex gap-2">
                        {fieldToEdit && (
                            <button
                                onClick={onCancelEdit}
                                className="px-3 py-1.5 rounded-md text-xs font-medium text-gray-400 hover:text-white hover:bg-white/10 transition flex items-center gap-1"
                            >
                                <XCircle size={14} /> Cancel
                            </button>
                        )}
                        <button
                            onClick={handleSubmit}
                            className={`text-white px-3 py-1.5 rounded-md text-sm font-semibold flex items-center gap-2 transition shadow-md border border-[rgba(240,246,252,0.1)] ${fieldToEdit ? 'bg-blue-600 hover:bg-blue-500' : 'bg-[#238636] hover:bg-[#2ea043]'
                                }`}
                        >
                            {fieldToEdit ? <Save size={16} /> : <Plus size={16} />}
                            {fieldToEdit ? 'Update Field' : 'Add Field'}
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default SchemaBuilder;