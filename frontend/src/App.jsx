import { useState } from 'react';
import axios from 'axios';
import { Database, Play } from 'lucide-react';
import { colors } from './theme';

import GlobalConfig from './components/GlobalConfig';
import SchemaBuilder from './components/SchemaBuilder';
import FieldList from './components/FieldList';
import OutputDisplay from './components/OutputDisplay';

function App() {
  const [loading, setLoading] = useState(false);
  const [generatedData, setGeneratedData] = useState(null);
  const [error, setError] = useState(null);

  const [config, setConfig] = useState({
    job_name: "Your own dataset",
    rows_count: 10,
    global_context: "Dataset for testing person information generation.",
    output_format: "json"
  });

  const [fields, setFields] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

  const addField = (newField) => {
    setFields([...fields, newField]);
  };

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

  const startEditing = (index) => {
    setEditingIndex(index);
  };

  const cancelEditing = () => {
    setEditingIndex(null);
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setGeneratedData(null);

    const payload = {
      config: config,
      schema_structure: fields
    };

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

    const blob = new Blob([
      typeof generatedData === 'object' ? JSON.stringify(generatedData.data, null, 2) : generatedData
    ], { type: 'text/plain' });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${config.job_name}.${config.output_format}`;
    a.click();
  };

  return (
    <div className={`min-h-screen ${colors.bgMain} ${colors.textMain} font-sans flex flex-col md:flex-row selection:bg-blue-500 selection:text-white`}>

      <div className={`w-full md:w-5/12 lg:w-4/12 ${colors.bgPanel} border-r ${colors.border} p-6 overflow-y-auto h-screen z-10 flex flex-col`}>

        <div className="flex items-center gap-3 mb-8">
          <div className="bg-white/10 p-2 rounded-md">
            <Database size={24} className="text-blue-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">DataSynth<span className="text-blue-400">.ai</span></h1>
            <p className={`text-xs ${colors.textMuted}`}>Synthetic Data Generator</p>
          </div>
        </div>

        <GlobalConfig config={config} setConfig={setConfig} />

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