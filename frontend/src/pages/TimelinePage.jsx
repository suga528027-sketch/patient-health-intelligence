import React, { useState, useEffect } from 'react';
import { reportService } from '../services/api';
import { REPORT_CATEGORIES } from '../data/mockHealthData';
import { Link } from 'react-router-dom';

const TimelinePage = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterQuery, setFilterQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('ALL');

    useEffect(() => {
        const fetchTimeline = async () => {
            try {
                const data = await reportService.getTimeline();
                setItems(data.items || []);
            } catch (err) {
                console.error("Failed to fetch timeline", err);
            } finally {
                setLoading(false);
            }
        };
        fetchTimeline();
    }, []);

    const getCategoryObj = (catId) => {
        return REPORT_CATEGORIES.find(c => c.id === catId) || REPORT_CATEGORIES[3];
    };

    const filteredItems = items.filter(item => {
        const matchesQuery = item.title.toLowerCase().includes(filterQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(filterQuery.toLowerCase());
        const matchesCat = selectedCategory === 'ALL' || item.category === selectedCategory;
        return matchesQuery && matchesCat;
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center space-y-4">
                <div className="w-8 h-8 border-3 border-[#1C355E] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm font-medium text-slate-600">Loading chronological clinical audit...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            {/* Header Banner */}
            <div className="bg-[#1C355E] text-white py-8 px-4 sm:px-6 lg:px-8 border-b border-[#15294A]">
                <div className="max-w-5xl mx-auto">
                    <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                        Patient Longitudinal History
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                        Chronological Clinical Timeline
                    </h1>
                    <p className="text-sm text-slate-200 mt-1 max-w-2xl">
                        Sequential timeline of diagnostic imaging, pathology evaluations, laboratory panels, and hospital discharge records
                    </p>
                </div>
            </div>

            {/* Content Container */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                {/* Search & Filter Bar */}
                <div className="bg-white p-4 rounded border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div className="w-full sm:w-auto">
                        <input
                            type="text"
                            value={filterQuery}
                            onChange={e => setFilterQuery(e.target.value)}
                            placeholder="Filter clinical notes or title..."
                            className="border border-slate-300 rounded px-3 py-1.5 text-xs sm:text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#1C355E] focus:border-[#1C355E] w-full sm:w-72"
                        />
                    </div>

                    {/* Category Navigation Filter */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs self-start sm:self-auto">
                        <button
                            onClick={() => setSelectedCategory('ALL')}
                            className={`px-3 py-1.5 font-semibold transition whitespace-nowrap cursor-pointer rounded border ${
                                selectedCategory === 'ALL'
                                    ? 'bg-[#1C355E] text-white border-[#1C355E]'
                                    : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                            }`}
                        >
                            All Records ({items.length})
                        </button>
                        {REPORT_CATEGORIES.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`px-3 py-1.5 font-semibold transition whitespace-nowrap cursor-pointer rounded border ${
                                    selectedCategory === cat.id
                                        ? 'bg-[#1C355E] text-white border-[#1C355E]'
                                        : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                                }`}
                            >
                                <span>{cat.name.split(' ')[0]}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Timeline Stream */}
                {filteredItems.length === 0 ? (
                    <div className="bg-white border border-slate-200 rounded p-12 text-center text-slate-500 space-y-3">
                        <div className="font-semibold text-slate-800 text-base">No clinical records found in this view</div>
                        <p className="text-xs text-slate-500 max-w-sm mx-auto">
                            Upload documents across any of the 4 clinical categories to establish your chronological record.
                        </p>
                        <Link
                            to="/patient/dashboard"
                            className="inline-block px-4 py-2 bg-[#1C355E] hover:bg-[#15294A] text-white font-medium text-xs rounded transition mt-2"
                        >
                            Return to Dashboard
                        </Link>
                    </div>
                ) : (
                    <div className="relative border-l-2 border-[#1C355E]/30 ml-4 sm:ml-6 space-y-6 pb-8">
                        {filteredItems.map((item, index) => {
                            const cat = getCategoryObj(item.category);
                            return (
                                <div key={index} className="relative pl-6 sm:pl-8">
                                    {/* Timeline Marker */}
                                    <span className="absolute -left-[9px] top-2 bg-[#1C355E] text-white rounded-full h-4 w-4 flex items-center justify-center text-[9px] ring-4 ring-slate-100">
                                    </span>

                                    <div className="bg-white p-5 rounded border border-slate-200 shadow-2xs space-y-2.5">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-100 pb-2">
                                            <h3 className="font-bold text-[#0F172A] text-base">
                                                {item.title}
                                            </h3>
                                            <span className="text-xs font-medium text-slate-600">
                                                {new Date(item.date).toLocaleDateString(undefined, {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </span>
                                        </div>

                                        <div className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-3 rounded border border-slate-200">
                                            {item.description}
                                        </div>

                                        <div className="flex items-center justify-between pt-1 text-xs">
                                            <span className="bg-slate-100 text-slate-700 border border-slate-300 px-2 py-0.5 rounded font-medium text-[11px]">
                                                {cat.name}
                                            </span>
                                            <Link
                                                to="/patient/dashboard"
                                                className="text-[#026CB6] hover:text-[#004A80] font-semibold hover:underline"
                                            >
                                                View Document Record
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TimelinePage;
