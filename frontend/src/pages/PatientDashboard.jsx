import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { reportService } from '../services/api';
import { REPORT_CATEGORIES } from '../data/mockHealthData';
import ComparisonSection from '../components/ComparisonSection';

const PatientDashboard = () => {
    const { user, isDemoMode } = useAuth();
    const [reports, setReports] = useState([]);
    const [file, setFile] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('LABORATORY');
    const [reportType, setReportType] = useState('LAB_CMP');
    const [notes, setNotes] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [dragActive, setDragActive] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    // Category filter for table
    const [activeTabCategory, setActiveTabCategory] = useState('ALL');

    // Semantic Search states
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    // AI Summary modal states
    const [selectedReportSummary, setSelectedReportSummary] = useState(null);
    const [isSummaryLoading, setIsSummaryLoading] = useState(false);
    const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
    const [selectedReportName, setSelectedReportName] = useState('');
    const [selectedReportType, setSelectedReportType] = useState('');
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

    // Update reportType default when category changes
    const handleCategoryChange = (catId) => {
        setSelectedCategory(catId);
        const cat = REPORT_CATEGORIES.find(c => c.id === catId);
        if (cat && cat.types.length > 0) {
            setReportType(cat.types[0].value);
        }
    };

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
        if (!file) return setError('Please select or drop a PDF medical report.');
        
        setIsUploading(true);
        setError('');
        setSuccessMsg('');
        setUploadProgress(20);

        try {
            setUploadProgress(60);
            await reportService.uploadReport(file, reportType, notes);
            setUploadProgress(100);
            setSuccessMsg('Report uploaded, parsed, and AI clinical summary generated successfully.');
            setFile(null);
            setNotes('');
            const fileInput = document.getElementById('file-upload');
            if (fileInput) fileInput.value = '';
            await fetchReports();
            setTimeout(() => setSuccessMsg(''), 5000);
        } catch (err) {
            setError(err.response?.data?.error || 'Upload failed. Please check network connection.');
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
            setSuccessMsg('Loaded 5 multi-domain clinical reports across Laboratory, Radiology, Pathology, and Discharge Summary.');
            setTimeout(() => setSuccessMsg(''), 5000);
        } catch (err) {
            setError('Failed to load sample reports.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this clinical record?")) return;
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

    const handleViewSummary = async (id, fileName, type) => {
        setIsSummaryLoading(true);
        setSelectedReportName(fileName);
        setSelectedReportType(type);
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

    // Helper to get category metadata
    const getReportCategory = (type) => {
        for (const cat of REPORT_CATEGORIES) {
            if (cat.types.some(t => t.value === type)) return cat;
        }
        if (type === 'BLOOD_TEST') return REPORT_CATEGORIES[0];
        if (type === 'PRESCRIPTION' || type === 'DISCHARGE_SUMMARY' || type === 'CONSULTATION') return REPORT_CATEGORIES[3];
        return REPORT_CATEGORIES[3];
    };

    const getReportTypeLabel = (type) => {
        for (const cat of REPORT_CATEGORIES) {
            const found = cat.types.find(t => t.value === type);
            if (found) return found.label;
        }
        return (type || 'REPORT').replace(/_/g, ' ');
    };

    // Filter reports based on active tab
    const filteredReports = reports.filter(r => {
        if (activeTabCategory === 'ALL') return true;
        const cat = getReportCategory(r.reportType || r.category);
        return cat.id === activeTabCategory;
    });

    const activeCatObj = REPORT_CATEGORIES.find(c => c.id === selectedCategory) || REPORT_CATEGORIES[0];

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            {/* Professional Subheader Banner (WHO Institutional Style) */}
            <div className="bg-[#1C355E] text-white border-b border-[#15294A] py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <div className="text-xs sm:text-sm font-semibold text-slate-300 uppercase tracking-wider mb-1">
                                Patient Health Record & Diagnostics Portal
                            </div>
                            <h1 className="text-2xl sm:text-3.5xl font-bold tracking-tight text-white">
                                Medical Dashboard: {user?.name || 'Patient Record'}
                            </h1>
                            <p className="text-sm sm:text-base text-slate-200 mt-1 max-w-2xl leading-relaxed">
                                Secure clinical document repository with automated optical extraction, semantic vector search, and longitudinal biomarker tracking.
                            </p>
                        </div>

                        {/* Quick Sample Button */}
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleQuickLoadSample}
                                className="bg-white hover:bg-slate-100 text-[#1C355E] font-semibold px-4 py-2.5 rounded text-sm border border-slate-200 shadow-sm transition flex items-center gap-2 cursor-pointer"
                            >
                                <span>Load Sample Clinical Bundle</span>
                            </button>
                        </div>
                    </div>

                    {/* Institutional Metric Strip */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/15">
                        <div className="bg-white/10 rounded p-4 border border-white/10">
                            <div className="text-xs sm:text-sm font-medium text-slate-300">Total Documents</div>
                            <div className="text-2xl sm:text-3xl font-bold text-white mt-1">{reports.length}</div>
                        </div>
                        <div className="bg-white/10 rounded p-4 border border-white/10">
                            <div className="text-xs sm:text-sm font-medium text-slate-300">Clinical Categories</div>
                            <div className="text-2xl sm:text-3xl font-bold text-white mt-1">4 Domains</div>
                        </div>
                        <div className="bg-white/10 rounded p-4 border border-white/10">
                            <div className="text-xs sm:text-sm font-medium text-slate-300">AI Clinical Summaries</div>
                            <div className="text-2xl sm:text-3xl font-bold text-white mt-1">{reports.length} Indexed</div>
                        </div>
                        <div className="bg-white/10 rounded p-4 border border-white/10">
                            <div className="text-xs sm:text-sm font-medium text-slate-300">Longitudinal Trajectory</div>
                            <div className="text-2xl sm:text-3xl font-bold text-white mt-1">{reports.length >= 2 ? 'Active Delta' : 'Baseline'}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Workspace */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                {/* Notification banners */}
                {successMsg && (
                    <div className="bg-emerald-50 border-l-4 border-emerald-600 text-emerald-900 px-4 py-3.5 text-sm sm:text-base font-medium flex items-center justify-between shadow-xs">
                        <span>{successMsg}</span>
                        <button onClick={() => setSuccessMsg('')} className="text-emerald-700 hover:text-emerald-900 font-bold ml-4 text-base">✕</button>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-600 text-red-900 px-4 py-3.5 text-sm sm:text-base font-medium flex items-center justify-between shadow-xs">
                        <span>{error}</span>
                        <button onClick={() => setError('')} className="text-red-700 hover:text-red-900 font-bold ml-4 text-base">✕</button>
                    </div>
                )}

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Upload Card */}
                    <div className="bg-white p-6 rounded border border-slate-200 shadow-xs lg:col-span-1 h-fit space-y-5">
                        <div className="border-b border-slate-200 pb-3">
                            <h2 className="text-lg font-bold text-[#0F172A]">
                                Upload Clinical Document
                            </h2>
                            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Select clinical category and upload PDF report</p>
                        </div>

                        <form onSubmit={handleUpload} className="space-y-4">
                            {/* Category Selector */}
                            <div>
                                <label className="block text-slate-700 text-xs sm:text-sm font-bold uppercase tracking-wider mb-2">
                                    1. Clinical Domain
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    {REPORT_CATEGORIES.map(cat => (
                                        <button
                                            type="button"
                                            key={cat.id}
                                            onClick={() => handleCategoryChange(cat.id)}
                                            className={`p-3 rounded border text-left transition cursor-pointer ${
                                                selectedCategory === cat.id
                                                    ? 'border-[#1C355E] bg-[#1C355E] text-white font-semibold shadow-xs'
                                                    : 'border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-medium'
                                            }`}
                                        >
                                            <div className="text-sm font-semibold truncate">{cat.name.split(' ')[0]}</div>
                                            <div className={`text-xs truncate ${selectedCategory === cat.id ? 'text-slate-200' : 'text-slate-500'}`}>
                                                {cat.id === 'LABORATORY' ? 'Blood/Urine' : cat.id === 'RADIOLOGY' ? 'Imaging/Scans' : cat.id === 'PATHOLOGY' ? 'Biopsies' : 'Summaries'}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Sub-type dropdown */}
                            <div>
                                <label className="block text-slate-700 text-xs sm:text-sm font-bold uppercase tracking-wider mb-1.5">
                                    2. Report Classification
                                </label>
                                <select
                                    value={reportType}
                                    onChange={e => setReportType(e.target.value)}
                                    className="w-full border border-slate-300 rounded px-3.5 py-2.5 text-sm sm:text-base font-medium bg-white focus:outline-none focus:ring-1 focus:ring-[#1C355E] focus:border-[#1C355E]"
                                >
                                    {activeCatObj.types.map(t => (
                                        <option key={t.value} value={t.value}>
                                            {t.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Drag and Drop Zone */}
                            <div>
                                <label className="block text-slate-700 text-xs sm:text-sm font-bold uppercase tracking-wider mb-1.5">
                                    3. Select Document (PDF)
                                </label>
                                <div
                                    onDragEnter={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDragOver={handleDrag}
                                    onDrop={handleDrop}
                                    className={`border-2 border-dashed rounded p-5 text-center transition cursor-pointer ${
                                        dragActive
                                            ? 'border-[#1C355E] bg-blue-50/50'
                                            : file
                                                ? 'border-emerald-600 bg-emerald-50/30'
                                                : 'border-slate-300 bg-slate-50 hover:bg-slate-100'
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
                                            <div className="text-sm font-bold text-slate-800 truncate max-w-[220px] mx-auto">{file.name}</div>
                                            <div className="text-xs text-emerald-700 font-medium">Document attached ({(file.size / 1024).toFixed(1)} KB)</div>
                                        </div>
                                    ) : (
                                        <div className="space-y-1">
                                            <div className="text-sm font-semibold text-slate-700">Drag and drop PDF report here</div>
                                            <div className="text-xs text-[#026CB6] font-medium hover:underline">or click to browse files</div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Clinical Notes */}
                            <div>
                                <label className="block text-slate-700 text-xs sm:text-sm font-bold uppercase tracking-wider mb-1.5">
                                    Clinical Indications / Notes (Optional)
                                </label>
                                <textarea
                                    value={notes}
                                    onChange={e => setNotes(e.target.value)}
                                    rows="2"
                                    className="w-full border border-slate-300 rounded px-3.5 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#1C355E] focus:border-[#1C355E]"
                                    placeholder="Enter clinical symptoms, ordering doctor instructions, or context..."
                                ></textarea>
                            </div>

                            {isUploading && uploadProgress > 0 && (
                                <div className="space-y-1.5">
                                    <div className="w-full bg-slate-200 rounded h-2 overflow-hidden">
                                        <div className="bg-[#1C355E] h-2 transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                                    </div>
                                    <div className="text-xs text-slate-500 text-center font-medium">Processing optical extraction & clinical analysis...</div>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isUploading}
                                className={`w-full py-3 text-white font-semibold rounded text-sm sm:text-base transition flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
                                    isUploading ? 'bg-slate-400 cursor-not-allowed' : 'bg-[#1C355E] hover:bg-[#15294A]'
                                }`}
                            >
                                {isUploading ? 'Analyzing Document...' : 'Upload & Generate Clinical Summary'}
                            </button>
                        </form>
                    </div>

                    {/* Reports Table & Repository */}
                    <div className="bg-white p-6 rounded border border-slate-200 shadow-xs lg:col-span-2 space-y-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                            <div>
                                <h2 className="text-lg font-bold text-[#0F172A]">
                                    Clinical Document Repository ({reports.length})
                                </h2>
                                <p className="text-xs sm:text-sm text-slate-500">Verified medical records catalogued with semantic vector indexing</p>
                            </div>
                            
                            {/* Search bar */}
                            <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    placeholder="Search keywords (e.g. chest, thyroid)..."
                                    className="border border-slate-300 rounded px-3.5 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#1C355E] focus:border-[#1C355E] w-full md:w-60"
                                />
                                <button
                                    type="submit"
                                    className="bg-[#1C355E] hover:bg-[#15294A] text-white font-medium text-sm px-4 py-2 rounded transition cursor-pointer"
                                >
                                    Search
                                </button>
                                {isSearching && (
                                    <button
                                        type="button"
                                        onClick={handleClearSearch}
                                        className="text-slate-400 hover:text-slate-700 text-sm px-2 cursor-pointer font-bold"
                                    >
                                        ✕
                                    </button>
                                )}
                            </form>
                        </div>

                        {/* Category Navigation Filter Tabs */}
                        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-sm border-b border-slate-200">
                            <button
                                onClick={() => setActiveTabCategory('ALL')}
                                className={`px-3.5 py-2 font-semibold transition whitespace-nowrap cursor-pointer border-b-2 ${
                                    activeTabCategory === 'ALL'
                                        ? 'border-[#1C355E] text-[#1C355E]'
                                        : 'border-transparent text-slate-500 hover:text-slate-800'
                                }`}
                            >
                                All Records ({reports.length})
                            </button>
                            {REPORT_CATEGORIES.map(cat => {
                                const count = reports.filter(r => getReportCategory(r.reportType || r.category).id === cat.id).length;
                                return (
                                    <button
                                        key={cat.id}
                                        onClick={() => setActiveTabCategory(cat.id)}
                                        className={`px-3.5 py-2 font-semibold transition whitespace-nowrap cursor-pointer border-b-2 ${
                                            activeTabCategory === cat.id
                                                ? 'border-[#1C355E] text-[#1C355E]'
                                                : 'border-transparent text-slate-500 hover:text-slate-800'
                                        }`}
                                    >
                                        <span>{cat.name.split(' ')[0]}</span>
                                        <span className="text-xs font-normal text-slate-400 ml-1">({count})</span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Semantic Search Results Banner */}
                        {searchResults.length > 0 && (
                            <div className="bg-slate-50 border border-slate-300 rounded p-4 space-y-3">
                                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                                    <h3 className="font-bold text-[#0F172A] text-xs sm:text-sm uppercase tracking-wider">
                                        Semantic Search Matches ({searchResults.length})
                                    </h3>
                                    <button
                                        onClick={handleClearSearch}
                                        className="text-xs sm:text-sm text-[#026CB6] hover:underline font-semibold"
                                    >
                                        Clear Search
                                    </button>
                                </div>
                                <div className="space-y-2.5">
                                    {searchResults.map((res, index) => (
                                        <div key={index} className="bg-white p-3.5 rounded border border-slate-200 flex flex-col sm:flex-row justify-between gap-2 sm:items-center">
                                            <div className="flex-1">
                                                <div className="text-sm font-semibold text-slate-700">
                                                    <span>{getReportTypeLabel(res.reportType)}</span>
                                                    <span className="text-slate-400 mx-1.5">•</span>
                                                    <span className="text-slate-500">{new Date(res.uploadedAt).toLocaleDateString()}</span>
                                                </div>
                                                <p className="text-xs sm:text-sm text-slate-600 mt-1 italic leading-relaxed">
                                                    "{res.snippet}"
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => handleViewSummary(res.reportId, `Report #${res.reportId}`, res.reportType)}
                                                className="text-[#026CB6] hover:text-[#004A80] text-xs sm:text-sm font-semibold px-3 py-1.5 rounded border border-slate-300 hover:bg-slate-50 transition cursor-pointer self-start sm:self-center"
                                            >
                                                View Summary
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Reports Table */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200 text-left">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="py-3 px-3 text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wider">Date</th>
                                        <th className="py-3 px-3 text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wider">Classification</th>
                                        <th className="py-3 px-3 text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wider">Document Name</th>
                                        <th className="py-3 px-3 text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wider">Status</th>
                                        <th className="py-3 px-3 text-right text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {filteredReports.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="py-12 text-center text-slate-500">
                                                <p className="text-base font-medium">No clinical documents found in this category.</p>
                                                <p className="text-xs sm:text-sm text-slate-400 mt-1">Upload a PDF or click "Load Sample Clinical Bundle".</p>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredReports.map(report => {
                                            const cat = getReportCategory(report.reportType || report.category);
                                            return (
                                                <tr key={report.id} className="hover:bg-slate-50 transition">
                                                    <td className="py-3.5 px-3 text-sm text-slate-600 whitespace-nowrap">
                                                        {new Date(report.uploadedAt).toLocaleDateString(undefined, {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric'
                                                        })}
                                                    </td>
                                                    <td className="py-3.5 px-3 text-sm font-semibold whitespace-nowrap">
                                                        <span className="bg-slate-100 text-slate-800 border border-slate-300 px-2.5 py-1 rounded text-xs sm:text-sm">
                                                            {getReportTypeLabel(report.reportType)}
                                                        </span>
                                                    </td>
                                                    <td className="py-3.5 px-3 text-sm text-slate-700 font-medium truncate max-w-[180px]" title={report.fileName}>
                                                        {report.fileName}
                                                    </td>
                                                    <td className="py-3.5 px-3 text-sm whitespace-nowrap">
                                                        <span className="inline-flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-50 border border-emerald-300 px-2.5 py-1 rounded font-medium">
                                                            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                                                            Analyzed
                                                        </span>
                                                    </td>
                                                    <td className="py-3.5 px-3 text-sm font-medium text-right space-x-2 whitespace-nowrap">
                                                        <button
                                                            onClick={() => handleViewSummary(report.id, report.fileName, report.reportType)}
                                                            className="text-[#026CB6] hover:text-[#004A80] hover:underline font-semibold cursor-pointer"
                                                        >
                                                            View Summary
                                                        </button>
                                                        <span className="text-slate-300">|</span>
                                                        <button
                                                            onClick={() => handleDownload(report.id, report.fileName)}
                                                            className="text-slate-600 hover:text-slate-900 cursor-pointer"
                                                            title="Download File"
                                                        >
                                                            Download
                                                        </button>
                                                        <span className="text-slate-300">|</span>
                                                        <button
                                                            onClick={() => handleDelete(report.id)}
                                                            className="text-red-600 hover:text-red-800 cursor-pointer"
                                                            title="Delete Record"
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* AI Medical Summary & Clinical Insights Modal (Institutional Clean Style) */}
            {isSummaryModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
                    <div className="bg-white rounded max-w-3xl w-full p-6 sm:p-8 shadow-xl relative max-h-[90vh] flex flex-col border border-slate-300">
                        {/* Modal Header */}
                        <div className="flex items-start justify-between pb-4 border-b border-slate-200">
                            <div>
                                <div className="text-xs sm:text-sm font-bold text-[#1C355E] uppercase tracking-wider">
                                    {getReportTypeLabel(selectedReportType)}
                                </div>
                                <h3 className="text-xl sm:text-2xl font-bold text-[#0F172A] mt-0.5">
                                    {selectedReportName}
                                </h3>
                            </div>
                            <button
                                onClick={() => setIsSummaryModalOpen(false)}
                                className="text-slate-400 hover:text-slate-700 text-2xl font-bold p-1 focus:outline-none cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="flex-1 overflow-y-auto py-5 space-y-6 text-sm sm:text-base text-slate-800 leading-relaxed pr-2">
                            {isSummaryLoading ? (
                                <div className="flex flex-col items-center justify-center py-16 space-y-4">
                                    <div className="w-8 h-8 border-3 border-[#1C355E] border-t-transparent rounded-full animate-spin"></div>
                                    <span className="text-slate-600 font-medium text-sm sm:text-base">Generating clinical report summary...</span>
                                </div>
                            ) : (
                                <>
                                    {/* Formatted summary */}
                                    <div className="bg-slate-50 p-5 rounded border border-slate-200 space-y-3">
                                        <div className="prose prose-base max-w-none whitespace-pre-line text-slate-800 font-normal">
                                            {selectedReportSummary || "Summary not available"}
                                        </div>
                                    </div>

                                    {/* Longitudinal Comparison Component for Lab reports */}
                                    {(selectedReportType?.startsWith('LAB_') || selectedReportType === 'BLOOD_TEST') && reports.length > 1 && (
                                        <ComparisonSection />
                                    )}
                                </>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
                            <button
                                onClick={handleCopyToClipboard}
                                className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-700 text-xs sm:text-sm font-semibold rounded border border-slate-300 transition flex items-center gap-1.5 cursor-pointer"
                            >
                                <span>{copied ? 'Copied to Clipboard' : 'Copy Summary'}</span>
                            </button>
                            <button
                                onClick={() => setIsSummaryModalOpen(false)}
                                className="px-6 py-2.5 bg-[#1C355E] hover:bg-[#15294A] text-white text-xs sm:text-sm font-semibold rounded transition cursor-pointer"
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
