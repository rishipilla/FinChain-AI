import { useState } from 'react';
import api from '../api';

export default function ReportDownload() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    const res = await api.get('/report/generate');
    setReport(res.data);
    setLoading(false);
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Financial Report</h1>
      <button onClick={generate} disabled={loading} className="bg-blue-600 text-white px-6 py-2 rounded mb-6">
        {loading ? 'Generating...' : 'Generate Report'}
      </button>

      {report && (
        <div className="bg-white shadow rounded-xl p-4">
          <p className="mb-2">Report ready.</p>
          <a href={`http://localhost:5000${report.filePath}`} target="_blank" rel="noreferrer" className="text-blue-600 underline">
            Download PDF
          </a>
          <div className="mt-4 p-3 bg-green-50 border border-green-300 rounded flex items-center gap-2">
            <span className="text-green-700 font-bold">Blockchain Verified</span>
          </div>
          <p className="text-xs text-gray-500 mt-2 break-all">Hash: {report.hash}</p>
        </div>
      )}
    </div>
  );
}