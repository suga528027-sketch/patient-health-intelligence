import React, { useState, useEffect } from 'react';
import { reportService } from '../services/api';
import { 
    LineChart, 
    Line, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer, 
    Legend, 
    ReferenceArea,
    ReferenceLine 
} from 'recharts';

const PARAMETERS = [
    { value: 'BP_COMBINED', label: '🩺 Combined Blood Pressure (Systolic + Diastolic)', unit: 'mmHg', normalRange: '90-120 / 60-80' },
    { value: 'BP_SYSTOLIC', label: 'Systolic Blood Pressure', unit: 'mmHg', normalMin: 90, normalMax: 120, normalRange: '90–120 mmHg' },
    { value: 'BP_DIASTOLIC', label: 'Diastolic Blood Pressure', unit: 'mmHg', normalMin: 60, normalMax: 80, normalRange: '60–80 mmHg' },
    { value: 'GLUCOSE_FASTING', label: '🩸 Fasting Blood Glucose', unit: 'mg/dL', normalMin: 70, normalMax: 100, normalRange: '70–100 mg/dL' },
    { value: 'HBA1C', label: '🧪 HbA1c (Glycated Hemoglobin)', unit: '%', normalMin: 4.0, normalMax: 5.7, normalRange: '< 5.7 %' },
    { value: 'HEMOGLOBIN', label: '🩸 Hemoglobin', unit: 'g/dL', normalMin: 12.0, normalMax: 16.0, normalRange: '12.0–16.0 g/dL' },
    { value: 'CHOLESTEROL_TOTAL', label: '🫀 Total Cholesterol', unit: 'mg/dL', normalMin: 120, normalMax: 200, normalRange: '< 200 mg/dL' },
    { value: 'LDL', label: '🫀 LDL ("Bad") Cholesterol', unit: 'mg/dL', normalMin: 50, normalMax: 100, normalRange: '< 100 mg/dL' },
    { value: 'HDL', label: '🫀 HDL ("Good") Cholesterol', unit: 'mg/dL', normalMin: 40, normalMax: 80, normalRange: '> 40 mg/dL' },
    { value: 'CREATININE', label: '🧪 Serum Creatinine (Kidney)', unit: 'mg/dL', normalMin: 0.6, normalMax: 1.2, normalRange: '0.6–1.2 mg/dL' }
];

const TrendsPage = () => {
    const [selectedParam, setSelectedParam] = useState('BP_COMBINED');
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const activeConfig = PARAMETERS.find(p => p.value === selectedParam) || PARAMETERS[0];

    const fetchTrendData = async (paramKey) => {
        setLoading(true);
        setErrorMsg('');
        try {
            if (paramKey === 'BP_COMBINED') {
                const [systolic, diastolic] = await Promise.all([
                    reportService.getTrends('BP_SYSTOLIC'),
                    reportService.getTrends('BP_DIASTOLIC')
                ]);

                if (!systolic || systolic.length === 0) {
                    setErrorMsg('No blood pressure data points found. Upload reports containing blood pressure.');
                    setChartData([]);
                } else {
                    const merged = systolic.map((s, idx) => {
                        const d = diastolic[idx] || {};
                        return {
                            date: s.date,
                            formattedDate: new Date(s.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: '2-digit' }),
                            systolic: s.value,
                            diastolic: d.value || null,
                            unit: 'mmHg'
                        };
                    });
                    setChartData(merged);
                }
            } else {
                const trends = await reportService.getTrends(paramKey);
                if (!trends || trends.length === 0) {
                    setErrorMsg(`No data points found for ${activeConfig.label}. Upload reports containing this parameter.`);
                    setChartData([]);
                } else {
                    const formatted = trends.map(t => ({
                        date: t.date,
                        formattedDate: new Date(t.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: '2-digit' }),
                        value: t.value,
                        unit: t.unit || activeConfig.unit
                    }));
                    setChartData(formatted);
                }
            }
        } catch (err) {
            console.error("Failed to fetch trends", err);
            setErrorMsg("Failed to load biomarker trends from the server.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTrendData(selectedParam);
    }, [selectedParam]);

    // Calculate Summary Statistics
    const getStats = () => {
        if (!chartData || chartData.length === 0) return null;

        if (selectedParam === 'BP_COMBINED') {
            const latest = chartData[chartData.length - 1];
            const previous = chartData.length > 1 ? chartData[chartData.length - 2] : null;
            const sysDiff = previous ? latest.systolic - previous.systolic : 0;
            return {
                latestText: `${latest.systolic}/${latest.diastolic} mmHg`,
                previousText: previous ? `${previous.systolic}/${previous.diastolic} mmHg` : 'Baseline',
                deltaText: sysDiff !== 0 ? `${sysDiff > 0 ? '+' : ''}${sysDiff} mmHg (Systolic)` : 'Stable',
                isElevated: latest.systolic > 120 || latest.diastolic > 80
            };
        }

        const values = chartData.map(d => d.value).filter(v => v !== undefined);
        const latest = values[values.length - 1];
        const previous = values.length > 1 ? values[values.length - 2] : null;
        const diff = previous !== null ? latest - previous : 0;
        const avg = (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1);
        const min = Math.min(...values);
        const max = Math.max(...values);

        const isElevated = activeConfig.normalMax && latest > activeConfig.normalMax;
        const isBelow = activeConfig.normalMin && latest < activeConfig.normalMin;

        return {
            latestText: `${latest} ${activeConfig.unit}`,
            previousText: previous !== null ? `${previous} ${activeConfig.unit}` : 'Baseline',
            deltaText: diff !== 0 ? `${diff > 0 ? '+' : ''}${diff.toFixed(1)} ${activeConfig.unit}` : 'Stable',
            avgText: `${avg} ${activeConfig.unit}`,
            rangeText: `${min} – ${max} ${activeConfig.unit}`,
            isElevated,
            isBelow
        };
    };

    const stats = getStats();

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            {/* Header */}
            <div>
                <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold mb-2">
                    <span>📈 Longitudinal Trajectory Analytics</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Biomarker Health Trends
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Continuous visual tracking across all historical lab panels with clinical reference zones
                </p>
            </div>

            {/* Parameter Selector Bar */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="w-full md:w-96">
                        <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-2">
                            Select Biomarker to Visualize
                        </label>
                        <select
                            value={selectedParam}
                            onChange={e => setSelectedParam(e.target.value)}
                            className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                        >
                            {PARAMETERS.map(p => (
                                <option key={p.value} value={p.value}>{p.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center gap-3 self-start md:self-end text-xs font-semibold text-slate-600 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200">
                        <span>Standard Reference Range:</span>
                        <strong className="text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-300">
                            {activeConfig.normalRange}
                        </strong>
                    </div>
                </div>

                {/* Summary Stat Cards */}
                {stats && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-2">
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Latest Reading</div>
                            <div className="text-lg sm:text-xl font-black text-slate-900 mt-1">{stats.latestText}</div>
                        </div>

                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Prior Reading</div>
                            <div className="text-lg sm:text-xl font-black text-slate-700 mt-1">{stats.previousText}</div>
                        </div>

                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Shift / Delta</div>
                            <div className="text-lg sm:text-xl font-black text-slate-900 mt-1">{stats.deltaText}</div>
                        </div>

                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Clinical Status</div>
                            <div className="mt-1">
                                <span className={`text-xs font-black px-2.5 py-1 rounded-full border ${
                                    stats.isElevated
                                        ? 'bg-amber-100 text-amber-900 border-amber-300'
                                        : stats.isBelow
                                            ? 'bg-blue-100 text-blue-900 border-blue-300'
                                            : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                                }`}>
                                    {stats.isElevated ? '⚠️ Elevated' : stats.isBelow ? 'ℹ️ Low' : '✅ Optimal Range'}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Graph Container */}
                <div className="pt-4 border-t border-slate-200">
                    {loading ? (
                        <div className="h-96 flex flex-col items-center justify-center space-y-4">
                            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-slate-500 font-semibold text-sm">Rendering chronological graph...</span>
                        </div>
                    ) : errorMsg ? (
                        <div className="h-96 flex items-center justify-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 p-8 text-center text-slate-500">
                            <div>
                                <span className="text-4xl">📊</span>
                                <p className="mt-3 text-sm font-semibold text-slate-700">{errorMsg}</p>
                                <p className="text-xs text-slate-400 mt-1">Upload additional reports on the dashboard to build your longitudinal trajectory.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                                    {activeConfig.label} Trajectory
                                </h3>
                                <div className="text-[11px] text-slate-500 flex items-center gap-2">
                                    <span className="w-3 h-3 bg-emerald-100 border border-emerald-400 rounded"></span>
                                    <span>Green Shaded Area = Standard Normal Zone</span>
                                </div>
                            </div>

                            <div className="h-[400px] w-full pt-2">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart
                                        data={chartData}
                                        margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                        <XAxis
                                            dataKey="formattedDate"
                                            tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                                            tickLine={false}
                                            axisLine={{ stroke: '#cbd5e1' }}
                                        />
                                        <YAxis
                                            tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                                            tickLine={false}
                                            axisLine={{ stroke: '#cbd5e1' }}
                                            domain={['auto', 'auto']}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: '#ffffff',
                                                borderRadius: '16px',
                                                border: '1px solid #cbd5e1',
                                                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                                                fontSize: '12px',
                                                fontWeight: 600
                                            }}
                                        />
                                        <Legend verticalAlign="top" height={36} />

                                        {/* Normal Range Reference Area */}
                                        {activeConfig.normalMin !== undefined && activeConfig.normalMax !== undefined && (
                                            <ReferenceArea
                                                y1={activeConfig.normalMin}
                                                y2={activeConfig.normalMax}
                                                fill="#10b981"
                                                fillOpacity={0.08}
                                                stroke="#10b981"
                                                strokeDasharray="3 3"
                                            />
                                        )}

                                        {selectedParam === 'BP_COMBINED' ? (
                                            <>
                                                <ReferenceLine y={120} stroke="#f59e0b" strokeDasharray="4 4" label={{ value: 'Systolic Limit (120)', position: 'insideTopRight', fill: '#d97706', fontSize: 10 }} />
                                                <ReferenceLine y={80} stroke="#f59e0b" strokeDasharray="4 4" label={{ value: 'Diastolic Limit (80)', position: 'insideTopRight', fill: '#d97706', fontSize: 10 }} />
                                                <Line
                                                    type="monotone"
                                                    dataKey="systolic"
                                                    name="Systolic BP (mmHg)"
                                                    stroke="#2563eb"
                                                    strokeWidth={3}
                                                    activeDot={{ r: 8, stroke: '#1d4ed8', strokeWidth: 2 }}
                                                    dot={{ stroke: '#2563eb', strokeWidth: 2, r: 5, fill: '#ffffff' }}
                                                />
                                                <Line
                                                    type="monotone"
                                                    dataKey="diastolic"
                                                    name="Diastolic BP (mmHg)"
                                                    stroke="#7c3aed"
                                                    strokeWidth={3}
                                                    activeDot={{ r: 8, stroke: '#6d28d9', strokeWidth: 2 }}
                                                    dot={{ stroke: '#7c3aed', strokeWidth: 2, r: 5, fill: '#ffffff' }}
                                                />
                                            </>
                                        ) : (
                                            <Line
                                                type="monotone"
                                                dataKey="value"
                                                name={`${activeConfig.label} (${activeConfig.unit})`}
                                                stroke="#2563eb"
                                                strokeWidth={3}
                                                activeDot={{ r: 8, stroke: '#1d4ed8', strokeWidth: 2 }}
                                                dot={{ stroke: '#2563eb', strokeWidth: 2, r: 5, fill: '#ffffff' }}
                                            />
                                        )}
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TrendsPage;
