import { Terminal, Download, AlertCircle, X, Database, CheckCircle2 } from 'lucide-react';
import { colors } from '../theme';

function OutputDisplay({ loading, error, generatedData, config, onDownload, setError }) {
    return (
        <div className={`flex-1 ${colors.bgMain} p-6 overflow-hidden flex flex-col`}>

            <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#30363d]">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Terminal size={20} className="text-gray-400" /> Output Console
                </h2>
                {generatedData && (
                    <button
                        onClick={onDownload}
                        className="flex items-center gap-2 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] text-gray-200 px-3 py-1.5 rounded-md text-xs font-medium transition"
                    >
                        <Download size={14} /> Export {config.output_format.toUpperCase()}
                    </button>
                )}
            </div>

            <div className="flex-1 overflow-auto rounded-md border border-[#30363d] bg-[#0d1117] relative">

                {error && (
                    <div className="absolute inset-0 bg-[#0d1117] z-20 p-6">
                        <div className="bg-red-900/20 border border-red-500/50 text-red-200 p-4 rounded-md flex items-start gap-3">
                            <AlertCircle className="mt-0.5 shrink-0" />
                            <div>
                                <h3 className="font-bold text-sm">Execution Error</h3>
                                <p className="text-xs mt-1 font-mono opacity-80">{error}</p>
                            </div>
                            <button onClick={() => setError(null)} className="ml-auto hover:bg-red-900/40 p-1 rounded"><X size={14} /></button>
                        </div>
                    </div>
                )}

                {!generatedData && !loading && !error && (
                    <div className="h-full flex flex-col items-center justify-center text-[#484f58] select-none">
                        <div className="w-16 h-16 rounded-full bg-[#161b22] border border-[#30363d] flex items-center justify-center mb-4">
                            <Database size={32} className="opacity-50" />
                        </div>
                        <p className="text-sm font-medium">Waiting for input...</p>
                    </div>
                )}

                {generatedData && (
                    <div className="h-full overflow-auto">
                        {config.output_format === 'json' ? (
                            <div className="min-w-full inline-block align-middle">
                                <table className="min-w-full divide-y divide-[#30363d]">
                                    <thead className="bg-[#161b22] sticky top-0 z-10">
                                        <tr>
                                            {generatedData.data.length > 0 && Object.keys(generatedData.data[0]).map(key => (
                                                <th key={key} className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                                                    {key}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#21262d] bg-[#0d1117]">
                                        {generatedData.data.map((row, i) => (
                                            <tr key={i} className="hover:bg-[#161b22]/50 transition-colors">
                                                {Object.values(row).map((val, j) => (
                                                    <td key={j} className="px-4 py-2.5 text-xs text-gray-300 font-mono whitespace-nowrap max-w-[200px] truncate" title={String(val)}>
                                                        {String(val)}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <pre className="p-4 text-xs font-mono text-gray-300 leading-relaxed whitespace-pre-wrap">
                                {typeof generatedData === 'string' ? generatedData : JSON.stringify(generatedData, null, 2)}
                            </pre>
                        )}
                    </div>
                )}
            </div>

            {generatedData && (
                <div className="mt-3 flex items-center gap-2 text-[10px] text-gray-500 font-mono">
                    <CheckCircle2 size={12} className="text-green-500" />
                    Completed: {config.rows_count} rows generated in {config.output_format} format.
                </div>
            )}
        </div>
    );
}

export default OutputDisplay;