import { useState } from 'react';
import axios from 'axios';
import { Database, Play, HelpCircle } from 'lucide-react';
import { colors } from './theme';

import GlobalConfig from './components/GlobalConfig';
import SchemaBuilder from './components/SchemaBuilder';
import FieldList from './components/FieldList';
import OutputDisplay from './components/OutputDisplay';
import HelpModal from './components/HelpModal';

function App() {
  const [loading, setLoading] = useState(false);
  const [generatedData, setGeneratedData] = useState(null);
  const [error, setError] = useState(null);
  const [showHelp, setShowHelp] = useState(false);

  const [config, setConfig] = useState({
    job_name: "Your own dataset",
    rows_count: 10,
    global_context: "Dataset for testing person information generation.",
    output_format: "json"
  });

  const [fields, setFields] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

  const handleExportConfig = () => {
    const projectData = { config, schema_structure: fields, version: "1.0" };
    const blob = new Blob([JSON.stringify(projectData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${config.job_name.replace(/\s+/g, '_').toLowerCase()}_schema.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportConfig = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        if (importedData.config && Array.isArray(importedData.schema_structure)) {
          setConfig(importedData.config);
          setFields(importedData.schema_structure);
          setError(null);
        } else {
          setError("Invalid schema file format.");
        }
      } catch (err) {
        setError("Failed to parse JSON file: " + err.message);
      }
    };
    reader.readAsText(file);
  };

  const addField = (newField) => setFields([...fields, newField]);
  const updateField = (updatedField) => {
    const updatedFields = [...fields];
    updatedFields[editingIndex] = updatedField;
    setFields(updatedFields);
    setEditingIndex(null);
  };
  const removeField = (index) => {
    const newFields = [...fields];
    newFields.splice(index, 1);
    setFields(newFields);
    if (editingIndex === index) setEditingIndex(null);
  };
  const startEditing = (index) => setEditingIndex(index);
  const cancelEditing = () => setEditingIndex(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setGeneratedData(null);
    const payload = { config: config, schema_structure: fields };
    try {
      const response = await axios.post('http://127.0.0.1:8000/generate', payload);
      setGeneratedData(response.data);
    } catch (err) {
      setError(err.message + (err.response ? ": " + JSON.stringify(err.response.data) : ""));
    } finally {
      setLoading(false);
    }
  };

  const downloadFile = () => {
    if (!generatedData) return;
    const blob = new Blob([typeof generatedData === 'object' ? JSON.stringify(generatedData.data, null, 2) : generatedData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${config.job_name}.${config.output_format}`;
    a.click();
  };

  return (
    <div className={`min-h-screen ${colors.bgMain} ${colors.textMain} font-sans flex flex-col md:flex-row selection:bg-blue-500 selection:text-white relative`}>

      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}

      <div className={`w-full md:w-5/12 lg:w-4/12 ${colors.bgPanel} border-r ${colors.border} p-6 overflow-y-auto h-screen z-10 flex flex-col`}>

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-2 rounded-md">
              <Database size={24} className="text-blue-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">DataSynth<span className="text-blue-400">.ai</span></h1>
              <p className={`text-xs ${colors.textMuted}`}>Synthetic Data Generator</p>
            </div>
          </div>

          <button
            onClick={() => setShowHelp(true)}
            className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition"
            title="Open Tutorial & Guide"
          >
            <HelpCircle size={20} />
          </button>
        </div>

        <GlobalConfig
          config={config}
          setConfig={setConfig}
          onExport={handleExportConfig}
          onImport={handleImportConfig}
        />

        <SchemaBuilder
          onAddField={addField}
          onUpdateField={updateField}
          onCancelEdit={cancelEditing}
          existingFields={fields}
          fieldToEdit={editingIndex !== null ? fields[editingIndex] : null}
        />

        <FieldList
          fields={fields}
          onRemoveField={removeField}
          onEditField={startEditing}
          editingIndex={editingIndex}
        />

        <button
          onClick={handleGenerate}
          disabled={loading || fields.length === 0}
          className={`w-full py-2.5 rounded-md font-bold text-white shadow-lg flex justify-center items-center gap-2 transition-all border border-[rgba(240,246,252,0.1)] ${loading || fields.length === 0
            ? 'bg-[#21262d] text-gray-500 cursor-not-allowed border-none'
            : 'bg-[#1f6feb] hover:bg-[#388bfd]'
            }`}
        >
          {loading ? (
            <span className="flex items-center gap-2 text-sm"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Generating...</span>
          ) : (
            <span className="flex items-center gap-2 text-sm"><Play size={16} fill="currentColor" /> Run Generation</span>
          )}
        </button>
      </div>

      <OutputDisplay
        loading={loading}
        error={error}
        generatedData={generatedData}
        config={config}
        onDownload={downloadFile}
        setError={setError}
      />

    </div>
  );
}

export default App;