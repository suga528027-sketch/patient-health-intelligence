import React, { useState, useEffect } from 'react';
import { reportService } from '../services/api';

const TimelinePage = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

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

    if (loading) {
        return (
            <div className="container mx-auto p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-500 font-medium">Generating chronological health timeline...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 md:p-8 max-w-3xl">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">My Health Timeline</h1>
            <p className="text-gray-500 mb-8">A chronological record of your medical reports and activities</p>

            {items.length === 0 ? (
                <div className="bg-white border rounded-xl p-8 text-center text-gray-500">
                    No reports uploaded yet. Upload a report from your dashboard to start building your health timeline.
                </div>
            ) : (
                <div className="relative border-l-2 border-blue-200 ml-4 md:ml-8 space-y-8 pb-8">
                    {items.map((item, index) => (
                        <div key={index} className="relative pl-6 md:pl-10">
                            {/* Bullet icon */}
                            <span className="absolute -left-[11px] top-1.5 bg-blue-600 text-white rounded-full h-5 w-5 flex items-center justify-center text-[10px] font-bold ring-4 ring-blue-50">
                                ✓
                            </span>
                            <div className="bg-white p-5 rounded-xl border shadow-sm hover:shadow-md transition">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-3">
                                    <h3 className="font-bold text-gray-800 text-lg">{item.title}</h3>
                                    <span className="text-xs text-gray-400 font-medium">
                                        {new Date(item.date).toLocaleDateString(undefined, {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </span>
                                </div>
                                <div className="text-sm text-gray-600 whitespace-pre-line bg-gray-50 p-3 rounded-lg border">
                                    {item.description}
                                </div>
                                <div className="mt-3 flex justify-between items-center text-xs">
                                    <span className="bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded border border-blue-100">
                                        {item.type}
                                    </span>
                                    <span className="text-gray-400">Report ID: {item.reportId}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TimelinePage;
