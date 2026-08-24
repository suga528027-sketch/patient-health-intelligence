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
            <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-sm font-semibold text-slate-600">Assembling chronological clinical timeline...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            {/* Header */}
            <div>
                <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold mb-2">
                    <span>📅 Multi-Domain Clinical Record</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Chronological Health Timeline
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Complete sequential audit of your medical checkups, imaging scans, biopsies, and hospital discharges
                </p>
            </div>

            {/* Filter & Search Controls */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div className="flex gap-2 w-full sm:w-auto">
                    <input
                        type="text"
                        value={filterQuery}
                        onChange={e => setFilterQuery(e.target.value)}
                        placeholder="Search timeline notes..."
                        className="border border-slate-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white w-full sm:w-64"
                    />
                </div>

                {/* Category Filters */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs self-start sm:self-auto">
                    <button
                        onClick={() => setSelectedCategory('ALL')}
                        className={`px-3 py-1.5 rounded-lg font-bold transition whitespace-nowrap cursor-pointer ${
                            selectedCategory === 'ALL'
                                ? 'bg-blue-600 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                    >
                        All ({items.length})
                    </button>
                    {REPORT_CATEGORIES.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`px-3 py-1.5 rounded-lg font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-1 ${
                                selectedCategory === cat.id
                                    ? 'bg-blue-600 text-white shadow-xs'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                        >
                            <span>{cat.icon}</span>
                            <span>{cat.name.split(' ')[0]}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Timeline Stream */}
            {filteredItems.length === 0 ? (
                <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center text-slate-500 space-y-4">
                    <div className="text-4xl">📅</div>
                    <div className="font-bold text-slate-800 text-base">No timeline records found</div>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        Upload reports across any of the 4 clinical domains to build your chronological medical record.
                    </p>
                    <Link
                        to="/patient/dashboard"
                        className="inline-block px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition"
                    >
                        Go to Dashboard ➔
                    </Link>
                </div>
            ) : (
                <div className="relative border-l-2 border-blue-200 ml-4 sm:ml-8 space-y-8 pb-8">
                    {filteredItems.map((item, index) => {
                        const cat = getCategoryObj(item.category);
                        return (
                            <div key={index} className="relative pl-6 sm:pl-10 group">
                                {/* Dot / Icon */}
                                <span className="absolute -left-[11px] top-1.5 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-full h-5 w-5 flex items-center justify-center text-[10px] font-black ring-4 ring-blue-50 group-hover:scale-110 transition-transform">
                                    ✓
                                </span>

                                <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition space-y-3">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                        <h3 className="font-extrabold text-slate-900 text-base sm:text-lg flex items-center gap-2">
                                            <span>{cat.icon}</span>
                                            <span>{item.title}</span>
                                        </h3>
                                        <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full w-fit">
                                            {new Date(item.date).toLocaleDateString(undefined, {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </span>
                                    </div>

                                    <div className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200 font-normal">
                                        {item.description}
                                    </div>

                                    <div className="flex items-center justify-between pt-1 text-xs">
                                        <span className={`px-2.5 py-0.5 rounded-full font-bold border ${cat.badgeColor}`}>
                                            {cat.name}
                                        </span>
                                        <Link
                                            to="/patient/dashboard"
                                            className="text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 hover:underline"
                                        >
                                            <span>View in Dashboard</span>
                                            <span>➔</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default TimelinePage;
