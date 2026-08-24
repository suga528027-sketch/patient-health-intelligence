import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { reportService } from '../services/api';
import ComparisonSection from '../components/ComparisonSection';

const PatientDashboard = () => {
    const { user, isDemoMode } = useAuth();
    const [reports, setReports] = useState([]);
    const [file, setFile] = useState(null);
    const [reportType, setReportType] = useState('BLOOD_TEST');
    const [notes, setNotes] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [dragActive, setDragActive] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    // Semantic Search states
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    // AI Summary modal states
    const [selectedReportSummary, setSelectedReportSummary] = useState(null);
    const [isSummaryLoading, setIsSummaryLoading] = useState(false);
    const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
    const [selectedReportName, setSelectedReportName] = useState('');
    const [selectedReportId, setSelectedReportId] = useState(null);
    const [copied, setCopied] = useState(false);

    const fetchReports = async () => {
        try {
            const data = await reportService.getReports();
            setReports(data || []);
        } catch (err) {
            console.error("Failed to fetch reports", err);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    // Drag and drop handlers
    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0];
            if (droppedFile.type === "application/pdf" || droppedFile.name.endsWith('.pdf')) {
                setFile(droppedFile);
                setError('');
            } else {
                setError('Please upload a PDF file only.');
            }
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return setError('Please select or drop a PDF lab report.');
        
        setIsUploading(true);
        setError('');
        setSuccessMsg('');
        setUploadProgress(20);

        try {
            setUploadProgress(60);
            await reportService.uploadReport(file, reportType, notes);
            setUploadProgress(100);
            setSuccessMsg('Report uploaded, parsed, and AI-summarized successfully!');
            setFile(null);
            setNotes('');
            const fileInput = document.getElementById('file-upload');
            if (fileInput) fileInput.value = '';
            await fetchReports();
            setTimeout(() => setSuccessMsg(''), 5000);
        } catch (err) {
            setError(err.response?.data?.error || 'Upload failed. Ensure backend or demo mode is active.');
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    const handleQuickLoadSample = async () => {
        setIsUploading(true);
        setError('');
        try {
            await reportService.loadSampleReports();
            await fetchReports();
            setSuccessMsg('Loaded 2 comprehensive sample clinical lab reports (Jan & Feb 2026)!');
            setTimeout(() => setSuccessMsg(''), 5000);
        } catch (err) {
            setError('Failed to load sample reports.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this report?")) return;
        try {
            await reportService.deleteReport(id);
            fetchReports();
        } catch (err) {
            console.error("Failed to delete", err);
        }
    };

    const handleDownload = async (id, filename) => {
        try {
            const response = await reportService.downloadReportUrl(id);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename || 'medical-report.pdf');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error("Failed to download", err);
        }
    };

    const handleViewSummary = async (id, fileName) => {
        setIsSummaryLoading(true);
        setSelectedReportName(fileName);
        setSelectedReportId(id);
        setIsSummaryModalOpen(true);
        setSelectedReportSummary(null);
        setCopied(false);
        try {
            const data = await reportService.getReportSummary(id);
            setSelectedReportSummary(data.summary);
        } catch (err) {
            console.error("Failed to fetch summary", err);
            setSelectedReportSummary("Summary not available");
        } finally {
            setIsSummaryLoading(false);
        }
    };

    const handleCopyToClipboard = () => {
        if (selectedReportSummary) {
            navigator.clipboard.writeText(selectedReportSummary);
            setCopied(true);
            setTimeout(() => setCopied(false), 3000);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;
        
        setIsSearching(true);
        try {
            const data = await reportService.searchReports(searchQuery);
            setSearchResults(data || []);
        } catch (err) {
            console.error("Search failed", err);
            setError("Search failed. Ensure vector database is indexed.");
        }
    };

    const handleClearSearch = () => {
        setSearchQuery('');
        setSearchResults([]);
        setIsSearching(false);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            {/* Header with quick stats */}
            <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold mb-2">
                            <span>{isDemoMode ? '🔵 Interactive Demo Workspace' : '🟢 Live Clinical Workspace'}</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                            Welcome back, {user?.name || 'Patient'}
                        </h1>
                        <p className="text-blue-100 text-xs sm:text-sm mt-1 max-w-xl">
                            Upload and organize your lab reports. Our AI automatically parses biomarkers, summarizes clinical findings, and tracks your health trajectory.
                        </p>
                    </div>

                    {/* Quick Load Sample Reports button */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={handleQuickLoadSample}
                            className="bg-white hover:bg-blue-50 text-blue-800 font-bold px-4 py-2.5 rounded-xl shadow-md transition text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer"
                        >
                            <span>⚡ Load 2 Sample Reports</span>
                        </button>
                    </div>
                </div>

                {/* Dashboard Key Stat Chips */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-white/20">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                        <div className="text-[11px] uppercase tracking-wider text-blue-200 font-semibold">Total Reports</div>
                        <div className="text-2xl font-black text-white mt-0.5">{reports.length}</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                        <div className="text-[11px] uppercase tracking-wider text-blue-200 font-semibold">Biomarkers Tracked</div>
                        <div className="text-2xl font-black text-white mt-0.5">{reports.length > 0 ? '9 Metrics' : '0'}</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                        <div className="text-[11px] uppercase tracking-wider text-blue-200 font-semibold">AI Summaries</div>
                        <div className="text-2xl font-black text-emerald-300 mt-0.5">{reports.length} Ready</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                        <div className="text-[11px] uppercase tracking-wider text-blue-200 font-semibold">Longitudinal Status</div>
                        <div className="text-2xl font-black text-amber-300 mt-0.5">{reports.length >= 2 ? 'Active Delta' : 'Need 2 Reports'}</div>
                    </div>
                </div>

                {/* Decorative background glow */}
                <div className="absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl pointer-events-none"></div>
            </div>

            {/* Notification messages */}
            {successMsg && (
                <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 px-4 py-3 rounded-xl text-sm font-medium flex items-center justify-between shadow-sm animate-fade-in">
                    <span className="flex items-center gap-2">✅ {successMsg}</span>
                    <button onClick={() => setSuccessMsg('')} className="text-emerald-600 hover:text-emerald-900 font-bold">✕</button>
                </div>
            )}

            {error && (
                <div className="bg-red-50 border border-red-300 text-red-800 px-4 py-3 rounded-xl text-sm font-medium flex items-center justify-between shadow-sm animate-fade-in">
                    <span className="flex items-center gap-2">⚠️ {error}</span>
                    <button onClick={() => setError('')} className="text-red-600 hover:text-red-900 font-bold">✕</button>
                </div>
            )}

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Upload Form Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 lg:col-span-1 h-fit space-y-5">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <span>📤</span> Upload Medical Report
                        </h2>
                        <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">PDF only</span>
                    </div>

                    <form onSubmit={handleUpload} className="space-y-4">
                        <div>
                            <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-1.5">Report Type</label>
                            <select
                                value={reportType}
                                onChange={e => setReportType(e.target.value)}
                                className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                            >
                                <option value="BLOOD_TEST">🩸 Blood Test Panel</option>
                                <option value="PRESCRIPTION">💊 Prescription / Medications</option>
                                <option value="DISCHARGE_SUMMARY">🏥 Hospital Discharge Summary</option>
                                <option value="CONSULTATION">🩺 Doctor Consultation Notes</option>
                                <option value="OTHER">📄 Other Medical Report</option>
                            </select>
                        </div>

                        {/* Drag and Drop Zone */}
                        <div>
                            <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-1.5">Lab Report PDF</label>
                            <div
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                                className={`border-2 border-dashed rounded-xl p-5 text-center transition-all cursor-pointer ${
                                    dragActive
                                        ? 'border-blue-500 bg-blue-50/80 scale-102'
                                        : file
                                            ? 'border-emerald-400 bg-emerald-50/40'
                                            : 'border-slate-300 bg-slate-50 hover:bg-slate-100/80'
                                }`}
                                onClick={() => document.getElementById('file-upload').click()}
                            >
                                <input
                                    id="file-upload"
                                    type="file"
                                    accept="application/pdf"
                                    onChange={e => {
                                        if (e.target.files && e.target.files[0]) {
                                            setFile(e.target.files[0]);
                                            setError('');
                                        }
                                    }}
                                    className="hidden"
                                />
                                {file ? (
                                    <div className="space-y-1">
                                        <div className="text-2xl">📄</div>
                                        <div className="text-xs font-bold text-slate-800 truncate max-w-[200px] mx-auto">{file.name}</div>
                                        <div className="text-[10px] text-emerald-600 font-semibold">Ready to parse ({(file.size / 1024).toFixed(1)} KB)</div>
                                    </div>
                                ) : (
                                    <div className="space-y-1">
                                        <div className="text-2xl">📁</div>
                                        <div className="text-xs font-semibold text-slate-700">Drag & drop your PDF here</div>
                                        <div className="text-[11px] text-blue-600 font-bold hover:underline">or browse from device</div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-1.5">Notes (Optional)</label>
                            <textarea
                                value={notes}
                                onChange={e => setNotes(e.target.value)}
                                rows="2"
                                className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                                placeholder="e.g. Fasting 12 hours before test, feeling dizzy in morning..."
                            ></textarea>
                        </div>

                        {isUploading && uploadProgress > 0 && (
                            <div className="space-y-1.5">
                                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                                    <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                                </div>
                                <div className="text-[11px] text-slate-500 text-center font-medium">Extracting text & running Gemini analysis...</div>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isUploading}
                            className={`w-full py-3 text-white font-bold rounded-xl text-sm transition shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                                isUploading ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
                            }`}
                        >
                            {isUploading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Processing Report...</span>
                                </>
                            ) : (
                                <span>Upload & Analyze</span>
                            )}
                        </button>
                    </form>
                </div>

                {/* Reports Management Table */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 lg:col-span-2 space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <span>📚</span> My Medical Reports ({reports.length})
                            </h2>
                            <p className="text-xs text-slate-500">Historical records stored with vector embeddings</p>
                        </div>
                        
                        {/* Semantic Search Bar */}
                        <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                placeholder="Semantic search (e.g. sugar, BP)..."
                                className="border border-slate-300 rounded-xl px-3.5 py-1.5 text-xs sm:text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white w-full md:w-60"
                            />
                            <button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl transition cursor-pointer"
                            >
                                Search
                            </button>
                            {isSearching && (
                                <button
                                    type="button"
                                    onClick={handleClearSearch}
                                    className="text-slate-400 hover:text-slate-600 text-xs px-2 cursor-pointer font-bold"
                                >
                                    ✕
                                </button>
                            )}
                        </form>
                    </div>

                    {/* Semantic Search Results Banner */}
                    {searchResults.length > 0 && (
                        <div className="bg-indigo-50/80 border border-indigo-200 rounded-2xl p-4 space-y-3 animate-fade-in">
                            <div className="flex items-center justify-between">
                                <h3 className="font-bold text-indigo-900 text-xs sm:text-sm flex items-center gap-1.5">
                                    🔍 Semantic Search Matches ({searchResults.length})
                                </h3>
                                <button
                                    onClick={handleClearSearch}
                                    className="text-xs text-indigo-600 hover:text-indigo-900 font-bold"
                                >
                                    Clear Filter
                                </button>
                            </div>
                            <div className="space-y-2.5">
                                {searchResults.map((res, index) => (
                                    <div key={index} className="bg-white p-3.5 rounded-xl border border-indigo-100 shadow-sm flex flex-col sm:flex-row justify-between gap-2 sm:items-center">
                                        <div className="flex-1">
                                            <div className="text-xs font-bold text-indigo-700 flex items-center gap-2">
                                                <span>{(res.reportType || 'REPORT').replace(/_/g, ' ')}</span>
                                                <span className="text-slate-300">•</span>
                                                <span className="text-slate-500 font-normal">{new Date(res.uploadedAt).toLocaleDateString()}</span>
                                            </div>
                                            <p className="text-xs text-slate-700 mt-1 italic font-medium leading-relaxed">
                                                "{res.snippet}"
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handleViewSummary(res.reportId, `Report #${res.reportId}`)}
                                            className="text-blue-600 hover:text-blue-800 text-xs font-bold bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg border border-blue-200 transition cursor-pointer self-start sm:self-center"
                                        >
                                            View AI Summary
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Reports Table */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="py-3 px-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                                    <th className="py-3 px-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Report Type</th>
                                    <th className="py-3 px-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">File Name</th>
                                    <th className="py-3 px-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                    <th className="py-3 px-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {reports.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="py-12 text-center text-slate-400">
                                            <div className="text-3xl mb-2">📄</div>
                                            <p className="text-sm font-semibold text-slate-600">No medical reports uploaded yet.</p>
                                            <p className="text-xs text-slate-400 mt-1">Upload a PDF report above or click "Load 2 Sample Reports" to test.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    reports.map(report => (
                                        <tr key={report.id} className="hover:bg-slate-50/80 transition">
                                            <td className="py-3.5 px-3 text-xs text-slate-600 whitespace-nowrap font-medium">
                                                {new Date(report.uploadedAt).toLocaleDateString(undefined, {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </td>
                                            <td className="py-3.5 px-3 text-xs font-bold text-slate-800 whitespace-nowrap">
                                                <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md border border-blue-200">
                                                    {(report.reportType || 'BLOOD_TEST').replace(/_/g, ' ')}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-3 text-xs text-slate-700 font-medium truncate max-w-[140px]" title={report.fileName}>
                                                {report.fileName}
                                            </td>
                                            <td className="py-3.5 px-3 text-xs whitespace-nowrap">
                                                <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                                    Summarized
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-3 text-xs font-medium text-right space-x-2 whitespace-nowrap">
                                                <button
                                                    onClick={() => handleViewSummary(report.id, report.fileName)}
                                                    className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-lg border border-indigo-200 font-bold transition cursor-pointer"
                                                >
                                                    AI Summary
                                                </button>
                                                <button
                                                    onClick={() => handleDownload(report.id, report.fileName)}
                                                    className="text-slate-600 hover:text-slate-900 px-2 py-1 transition cursor-pointer"
                                                    title="Download Report"
                                                >
                                                    ⬇
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(report.id)}
                                                    className="text-red-500 hover:text-red-700 px-2 py-1 transition cursor-pointer"
                                                    title="Delete Report"
                                                >
                                                    🗑
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* AI Medical Summary & Comparison Modal */}
            {isSummaryModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
                    <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] flex flex-col border border-slate-200">
                        {/* Modal Header */}
                        <div className="flex items-start justify-between pb-4 border-b border-slate-200">
                            <div>
                                <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">Gemini 2.5 Flash Summary</span>
                                <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">
                                    {selectedReportName}
                                </h3>
                            </div>
                            <button
                                onClick={() => setIsSummaryModalOpen(false)}
                                className="text-slate-400 hover:text-slate-700 text-2xl font-bold p-1 rounded-lg focus:outline-none cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="flex-1 overflow-y-auto py-5 space-y-6 text-sm text-slate-700 leading-relaxed pr-2">
                            {isSummaryLoading ? (
                                <div className="flex flex-col items-center justify-center py-16 space-y-4">
                                    <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                    <span className="text-slate-500 font-semibold text-sm">Extracting lab biomarkers & analyzing with Gemini...</span>
                                </div>
                            ) : (
                                <>
                                    {/* Markdown formatted summary */}
                                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                                        <div className="prose prose-sm max-w-none whitespace-pre-line text-slate-800 font-normal">
                                            {selectedReportSummary || "Summary not available"}
                                        </div>
                                    </div>

                                    {/* Longitudinal Comparison Component */}
                                    <ComparisonSection />
                                </>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
                            <button
                                onClick={handleCopyToClipboard}
                                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-300 transition flex items-center gap-1.5 cursor-pointer"
                            >
                                <span>{copied ? '✅ Copied!' : '📋 Copy Summary'}</span>
                            </button>
                            <button
                                onClick={() => setIsSummaryModalOpen(false)}
                                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition shadow-sm cursor-pointer"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PatientDashboard;
