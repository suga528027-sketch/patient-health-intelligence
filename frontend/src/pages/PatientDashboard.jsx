import { useState, useEffect } from 'react';
import { authService, reportService } from '../services/api';
import ComparisonSection from '../components/ComparisonSection';

const PatientDashboard = () => {
    const user = authService.getCurrentUser();
    const [reports, setReports] = useState([]);
    const [file, setFile] = useState(null);
    const [reportType, setReportType] = useState('BLOOD_TEST');
    const [notes, setNotes] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState('');

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

    const fetchReports = async () => {
        try {
            const data = await reportService.getReports();
            setReports(data);
        } catch (err) {
            console.error("Failed to fetch reports", err);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return setError('Please select a PDF file');
        
        setIsUploading(true);
        setError('');
        try {
            await reportService.uploadReport(file, reportType, notes);
            setFile(null);
            setNotes('');
            document.getElementById('file-upload').value = '';
            fetchReports();
        } catch (err) {
            setError(err.response?.data?.error || 'Upload failed');
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
            link.setAttribute('download', filename);
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

    const isLatestReport = (reportId) => {
        if (!reports || reports.length === 0) return false;
        const latest = reports.reduce((latestVal, currentVal) => {
            return new Date(currentVal.uploadedAt) > new Date(latestVal.uploadedAt) ? currentVal : latestVal;
        }, reports[0]);
        return latest.id === reportId;
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;
        
        setIsSearching(true);
        try {
            const data = await reportService.searchReports(searchQuery);
            setSearchResults(data);
        } catch (err) {
            console.error("Search failed", err);
            setError("Search failed. Ensure Qdrant is connected.");
        }
    };

    const handleClearSearch = () => {
        setSearchQuery('');
        setSearchResults([]);
        setIsSearching(false);
    };

    return (
        <div className="container mx-auto p-4 md:p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Welcome, {user?.name}</h1>
            
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Upload Form */}
                <div className="bg-white p-6 rounded-xl shadow-md lg:col-span-1 h-fit">
                    <h2 className="text-xl font-bold mb-6 text-gray-800">Upload New Report</h2>
                    {error && <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}
                    
                    <form onSubmit={handleUpload}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-semibold mb-2">Report Type</label>
                            <select value={reportType} onChange={e => setReportType(e.target.value)}
                                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="BLOOD_TEST">Blood Test</option>
                                <option value="PRESCRIPTION">Prescription</option>
                                <option value="DISCHARGE_SUMMARY">Discharge Summary</option>
                                <option value="CONSULTATION">Consultation</option>
                                <option value="OTHER">Other</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-semibold mb-2">PDF File</label>
                            <input id="file-upload" type="file" accept="application/pdf" onChange={e => setFile(e.target.files[0])}
                                className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" required />
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-semibold mb-2">Notes (Optional)</label>
                            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows="3"
                                className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Any summary..."></textarea>
                        </div>
                        <button type="submit" disabled={isUploading}
                            className={`w-full text-white py-3 rounded-lg font-semibold transition ${isUploading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}>
                            {isUploading ? 'Uploading...' : 'Upload Report'}
                        </button>
                    </form>
                </div>

                {/* Reports Table */}
                <div className="bg-white p-6 rounded-xl shadow-md lg:col-span-2">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <h2 className="text-xl font-bold text-gray-800">My Medical Reports</h2>
                        
                        {/* Semantic Search Bar */}
                        <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto">
                            <input 
                                type="text" 
                                value={searchQuery} 
                                onChange={e => setSearchQuery(e.target.value)}
                                placeholder="Semantic search (e.g. kidney, sugar)..." 
                                className="border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
                            />
                            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2 rounded-lg transition cursor-pointer">
                                Search
                            </button>
                            {isSearching && (
                                <button type="button" onClick={handleClearSearch} className="text-gray-400 hover:text-gray-600 text-xs px-2 cursor-pointer">
                                    Clear
                                </button>
                            )}
                        </form>
                    </div>

                    {/* Semantic Search Results */}
                    {searchResults.length > 0 && (
                        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-6 space-y-3 animate-fade-in">
                            <h3 className="font-bold text-indigo-900 text-sm flex items-center gap-1.5">
                                🔍 Semantic Search Results ({searchResults.length})
                            </h3>
                            <div className="space-y-3">
                                {searchResults.map((res, index) => (
                                    <div key={index} className="bg-white p-3 rounded-lg border border-indigo-150 shadow-sm flex flex-col md:flex-row justify-between gap-2 items-start md:items-center">
                                        <div className="flex-1">
                                            <div className="text-xs font-semibold text-indigo-700 flex gap-2">
                                                <span>{res.reportType.replace('_', ' ')}</span>
                                                <span className="text-gray-400">|</span>
                                                <span className="text-gray-500">{new Date(res.uploadedAt).toLocaleDateString()}</span>
                                            </div>
                                            <p className="text-sm text-gray-700 mt-1.5 italic font-medium leading-relaxed">
                                                "...{res.snippet}..."
                                            </p>
                                        </div>
                                        <button 
                                            onClick={() => handleViewSummary(res.reportId, `Report #${res.reportId}`)}
                                            className="text-blue-600 hover:text-blue-800 text-xs font-bold whitespace-nowrap self-end md:self-center bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg border transition cursor-pointer"
                                        >
                                            View Summary
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">File Name</th>
                                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {reports.length === 0 ? (
                                    <tr><td colSpan="4" className="py-8 text-center text-gray-500">No reports uploaded yet.</td></tr>
                                ) : (
                                    reports.map(report => (
                                        <tr key={report.id} className="hover:bg-gray-50 transition">
                                            <td className="py-4 px-4 text-sm text-gray-700 whitespace-nowrap">{new Date(report.uploadedAt).toLocaleDateString()}</td>
                                            <td className="py-4 px-4 text-sm font-medium text-gray-800">{report.reportType.replace('_', ' ')}</td>
                                            <td className="py-4 px-4 text-sm text-gray-600">{report.fileName}</td>
                                            <td className="py-4 px-4 text-sm font-medium flex space-x-4">
                                                <button onClick={() => handleViewSummary(report.id, report.fileName)}
                                                    className="text-indigo-600 hover:text-indigo-800 transition">View Summary</button>
                                                <button onClick={() => handleDownload(report.id, report.fileName)}
                                                    className="text-blue-600 hover:text-blue-800 transition">Download</button>
                                                <button onClick={() => handleDelete(report.id)}
                                                    className="text-red-600 hover:text-red-800 transition">Delete</button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {isSummaryModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-2xl relative">
                        <button onClick={() => setIsSummaryModalOpen(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold focus:outline-none">
                            &times;
                        </button>
                        <h3 className="text-xl font-bold text-gray-800 mb-4">
                            AI Medical Summary: <span className="font-semibold text-blue-600">{selectedReportName}</span>
                        </h3>
                        <hr className="mb-4" />
                        <div className="text-gray-700 leading-relaxed text-sm max-h-96 overflow-y-auto">
                            {isSummaryLoading ? (
                                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                                    <span className="text-gray-500 font-medium">Extracting text & analyzing with Gemini...</span>
                                </div>
                            ) : (
                                <>
                                    <p className="whitespace-pre-line bg-gray-50 p-4 rounded-lg border">
                                        {selectedReportSummary || "Summary not available"}
                                    </p>
                                    {reports.length > 1 && isLatestReport(selectedReportId) && (
                                        <ComparisonSection />
                                    )}
                                </>
                            )}
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button onClick={() => setIsSummaryModalOpen(false)}
                                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
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
