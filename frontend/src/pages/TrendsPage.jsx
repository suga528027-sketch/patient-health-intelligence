import React, { useState, useEffect } from 'react';
import { reportService } from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const TrendsPage = () => {
    const [parameter, setParameter] = useState('BP_SYSTOLIC');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const parameters = [
        { value: 'BP_SYSTOLIC', label: 'Systolic Blood Pressure' },
        { value: 'BP_DIASTOLIC', label: 'Diastolic Blood Pressure' },
        { value: 'GLUCOSE_FASTING', label: 'Fasting Glucose' },
        { value: 'HBA1C', label: 'HbA1c (Glycated Hemoglobin)' },
        { value: 'HEMOGLOBIN', label: 'Hemoglobin' },
        { value: 'CHOLESTEROL_TOTAL', label: 'Total Cholesterol' },
        { value: 'LDL', label: 'LDL Cholesterol' },
        { value: 'HDL', label: 'HDL Cholesterol' },
        { value: 'CREATININE', label: 'Creatinine' }
    ];

    const fetchTrends = async (param) => {
        setLoading(true);
        setErrorMsg('');
        try {
            const trends = await reportService.getTrends(param);
            if (trends.length === 0) {
                setErrorMsg('No data points found for this parameter yet. Ensure reports containing this value are uploaded.');
                setData([]);
            } else {
                // Format dates for display
                const formatted = trends.map(t => ({
                    ...t,
                    formattedDate: new Date(t.date).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: '2-digit'
                    })
                }));
                setData(formatted);
            }
        } catch (err) {
            console.error("Failed to fetch trends", err);
            setErrorMsg("Failed to load parameter trends from the server.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTrends(parameter);
    }, [parameter]);

    const activeParam = parameters.find(p => p.value === parameter);
    const unit = data.length > 0 ? data[0].unit : '';

    return (
        <div className="container mx-auto p-4 md:p-8 max-w-4xl">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Health Parameter Trends</h1>
            <p className="text-gray-500 mb-8">Visualize chronological changes in key biomarkers across your reports</p>

            <div className="bg-white p-6 rounded-xl border shadow-sm space-y-6">
                {/* Select dropdown */}
                <div className="max-w-xs">
                    <label className="block text-gray-700 text-sm font-semibold mb-2">Select Parameter</label>
                    <select 
                        value={parameter} 
                        onChange={e => setParameter(e.target.value)}
                        className="w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                        {parameters.map(p => (
                            <option key={p.value} value={p.value}>{p.label}</option>
                        ))}
                    </select>
                </div>

                <hr />

                {/* Graph display */}
                {loading ? (
                    <div className="h-96 flex flex-col items-center justify-center space-y-4">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                        <span className="text-gray-500 font-medium">Generating trends chart...</span>
                    </div>
                ) : errorMsg ? (
                    <div className="h-96 flex items-center justify-center bg-gray-50 rounded-lg border border-dashed border-gray-200 p-8 text-center text-gray-500">
                        <div>
                            <span className="text-3xl">📊</span>
                            <p className="mt-3 text-sm font-medium">{errorMsg}</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <h3 className="text-base font-bold text-gray-800">
                            {activeParam.label} Over Time {unit && `(${unit})`}
                        </h3>
                        <div className="h-96 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart
                                    data={data}
                                    margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis 
                                        dataKey="formattedDate" 
                                        tick={{ fill: '#6b7280', fontSize: 11 }}
                                        tickLine={false}
                                    />
                                    <YAxis 
                                        tick={{ fill: '#6b7280', fontSize: 11 }}
                                        tickLine={false}
                                        domain={['auto', 'auto']}
                                    />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                                    />
                                    <Legend />
                                    <Line 
                                        type="monotone" 
                                        dataKey="value" 
                                        name={activeParam.label}
                                        stroke="#2563eb" 
                                        strokeWidth={3} 
                                        activeDot={{ r: 8 }} 
                                        dot={{ stroke: '#2563eb', strokeWidth: 2, r: 4, fill: '#ffffff' }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TrendsPage;
