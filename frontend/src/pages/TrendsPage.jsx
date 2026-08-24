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

const PARAMETER_GROUPS = [
    {
        group: "Cardiovascular & Vitals",
        items: [
            { value: 'BP_COMBINED', label: 'Blood Pressure (Combined Systolic & Diastolic)', unit: 'mmHg', normalRange: '90-120 / 60-80' },
            { value: 'BP_SYSTOLIC', label: 'Systolic Blood Pressure', unit: 'mmHg', normalMin: 90, normalMax: 120, normalRange: '90–120 mmHg' },
            { value: 'BP_DIASTOLIC', label: 'Diastolic Blood Pressure', unit: 'mmHg', normalMin: 60, normalMax: 80, normalRange: '60–80 mmHg' }
        ]
    },
    {
        group: "Glycemic & Metabolic",
        items: [
            { value: 'GLUCOSE_FASTING', label: 'Fasting Blood Glucose', unit: 'mg/dL', normalMin: 70, normalMax: 100, normalRange: '70–100 mg/dL' },
            { value: 'HBA1C', label: 'HbA1c (Glycated Hemoglobin)', unit: '%', normalMin: 4.0, normalMax: 5.7, normalRange: '< 5.7 %' }
        ]
    },
    {
        group: "Lipid Profile & Cholesterol",
        items: [
            { value: 'CHOLESTEROL_TOTAL', label: 'Total Cholesterol', unit: 'mg/dL', normalMin: 120, normalMax: 200, normalRange: '< 200 mg/dL' },
            { value: 'LDL', label: 'LDL Cholesterol', unit: 'mg/dL', normalMin: 50, normalMax: 100, normalRange: '< 100 mg/dL' },
            { value: 'HDL', label: 'HDL Cholesterol', unit: 'mg/dL', normalMin: 40, normalMax: 80, normalRange: '> 40 mg/dL' }
        ]
    },
    {
        group: "Renal, Hepatic & Hematology",
        items: [
            { value: 'CREATININE', label: 'Serum Creatinine (Kidney)', unit: 'mg/dL', normalMin: 0.6, normalMax: 1.2, normalRange: '0.6–1.2 mg/dL' },
            { value: 'HEMOGLOBIN', label: 'Hemoglobin', unit: 'g/dL', normalMin: 12.0, normalMax: 16.0, normalRange: '12.0–16.0 g/dL' }
        ]
    }
];

const ALL_PARAMETERS = PARAMETER_GROUPS.flatMap(g => g.items);

const TrendsPage = () => {
    const [selectedParam, setSelectedParam] = useState('BP_COMBINED');
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const activeConfig = ALL_PARAMETERS.find(p => p.value === selectedParam) || ALL_PARAMETERS[0];

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
                    setErrorMsg('No blood pressure data points recorded in patient history.');
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
                    setErrorMsg(`No historical measurements found for ${activeConfig.label}.`);
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
        <div className="min-h-screen bg-[#F8FAFC]">
            {/* Header Banner */}
            <div className="bg-[#1C355E] text-white py-8 px-4 sm:px-6 lg:px-8 border-b border-[#15294A]">
                <div className="max-w-7xl mx-auto">
                    <div className="text-xs sm:text-sm font-semibold text-slate-300 uppercase tracking-wider mb-1">
                        Longitudinal Clinical Analytics
                    </div>
                    <h1 className="text-2xl sm:text-3.5xl font-bold tracking-tight text-white">
                        Biomarker Trends & Reference Trajectories
                    </h1>
                    <p className="text-sm sm:text-base text-slate-200 mt-1 max-w-2xl leading-relaxed">
                        Time-series plotting of physiological biomarkers against clinical reference standards
                    </p>
                </div>
            </div>

            {/* Content Container */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                <div className="bg-white p-6 rounded border border-slate-200 shadow-xs space-y-6">
                    {/* Controls */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                        <div className="w-full md:w-96">
                            <label className="block text-slate-700 text-xs sm:text-sm font-bold uppercase tracking-wider mb-2">
                                Select Biomarker Parameter
                            </label>
                            <select
                                value={selectedParam}
                                onChange={e => setSelectedParam(e.target.value)}
                                className="w-full border border-slate-300 rounded px-3.5 py-2.5 text-sm sm:text-base font-semibold bg-white focus:outline-none focus:ring-1 focus:ring-[#1C355E] focus:border-[#1C355E]"
                            >
                                {PARAMETER_GROUPS.map(grp => (
                                    <optgroup key={grp.group} label={grp.group}>
                                        {grp.items.map(p => (
                                            <option key={p.value} value={p.value}>{p.label}</option>
                                        ))}
                                    </optgroup>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-center gap-3 self-start md:self-end text-sm font-medium text-slate-700 bg-slate-50 px-4 py-2.5 rounded border border-slate-300">
                            <span className="font-semibold text-slate-900">Standard Clinical Range:</span>
                            <strong className="text-[#1C355E] text-sm sm:text-base">{activeConfig.normalRange}</strong>
                        </div>
                    </div>

                    {/* Summary Statistical Metric Cards */}
                    {stats && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div className="bg-slate-50 rounded p-4 border border-slate-200">
                                <div className="text-xs sm:text-sm font-bold text-slate-600 uppercase tracking-wider">Latest Measurement</div>
                                <div className="text-xl sm:text-2xl font-bold text-[#0F172A] mt-1">{stats.latestText}</div>
                            </div>

                            <div className="bg-slate-50 rounded p-4 border border-slate-200">
                                <div className="text-xs sm:text-sm font-bold text-slate-600 uppercase tracking-wider">Prior Baseline</div>
                                <div className="text-xl sm:text-2xl font-bold text-slate-700 mt-1">{stats.previousText}</div>
                            </div>

                            <div className="bg-slate-50 rounded p-4 border border-slate-200">
                                <div className="text-xs sm:text-sm font-bold text-slate-600 uppercase tracking-wider">Shift Magnitude</div>
                                <div className="text-xl sm:text-2xl font-bold text-[#0F172A] mt-1">{stats.deltaText}</div>
                            </div>

                            <div className="bg-slate-50 rounded p-4 border border-slate-200">
                                <div className="text-xs sm:text-sm font-bold text-slate-600 uppercase tracking-wider">Clinical Status</div>
                                <div className="mt-1">
                                    <span className={`text-xs sm:text-sm font-semibold px-3 py-1 rounded border inline-block ${
                                        stats.isElevated
                                            ? 'bg-amber-50 text-amber-900 border-amber-300'
                                            : stats.isBelow
                                                ? 'bg-blue-50 text-blue-900 border-blue-300'
                                                : 'bg-emerald-50 text-emerald-900 border-emerald-300'
                                    }`}>
                                        {stats.isElevated ? 'Elevated Shift' : stats.isBelow ? 'Below Range' : 'Optimal Standard Range'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Graph Canvas */}
                    <div className="pt-4">
                        {loading ? (
                            <div className="h-96 flex flex-col items-center justify-center space-y-4">
                                <div className="w-8 h-8 border-3 border-[#1C355E] border-t-transparent rounded-full animate-spin"></div>
                                <span className="text-slate-600 font-medium text-sm sm:text-base">Rendering time-series chart...</span>
                            </div>
                        ) : errorMsg ? (
                            <div className="h-96 flex items-center justify-center bg-slate-50 rounded border border-dashed border-slate-300 p-8 text-center text-slate-500">
                                <div>
                                    <p className="text-base font-semibold text-slate-700">{errorMsg}</p>
                                    <p className="text-xs sm:text-sm text-slate-400 mt-1">Upload additional laboratory documents to establish continuous trend curves.</p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                                    <h3 className="text-base font-bold text-[#0F172A] uppercase tracking-wider">
                                        {activeConfig.label} Time-Series Plot
                                    </h3>
                                    <div className="text-xs sm:text-sm text-slate-500 flex items-center gap-2">
                                        <span className="w-3.5 h-3.5 bg-emerald-50 border border-emerald-500 rounded"></span>
                                        <span>Shaded Band = Normal Reference Standard</span>
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
                                                tick={{ fill: '#475569', fontSize: 13, fontWeight: 500 }}
                                                tickLine={false}
                                                axisLine={{ stroke: '#cbd5e1' }}
                                            />
                                            <YAxis
                                                tick={{ fill: '#475569', fontSize: 13, fontWeight: 500 }}
                                                tickLine={false}
                                                axisLine={{ stroke: '#cbd5e1' }}
                                                domain={['auto', 'auto']}
                                            />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: '#ffffff',
                                                    borderRadius: '4px',
                                                    border: '1px solid #94a3b8',
                                                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                                                    fontSize: '13px',
                                                    fontWeight: 500
                                                }}
                                            />
                                            <Legend verticalAlign="top" height={36} />

                                            {/* Normal Range Reference Area */}
                                            {activeConfig.normalMin !== undefined && activeConfig.normalMax !== undefined && (
                                                <ReferenceArea
                                                    y1={activeConfig.normalMin}
                                                    y2={activeConfig.normalMax}
                                                    fill="#10b981"
                                                    fillOpacity={0.06}
                                                    stroke="#10b981"
                                                    strokeDasharray="3 3"
                                                />
                                            )}

                                            {selectedParam === 'BP_COMBINED' ? (
                                                <>
                                                    <ReferenceLine y={120} stroke="#d97706" strokeDasharray="4 4" label={{ value: 'Systolic Limit (120)', position: 'insideTopRight', fill: '#92400e', fontSize: 11 }} />
                                                    <ReferenceLine y={80} stroke="#d97706" strokeDasharray="4 4" label={{ value: 'Diastolic Limit (80)', position: 'insideTopRight', fill: '#92400e', fontSize: 11 }} />
                                                    <Line
                                                        type="monotone"
                                                        dataKey="systolic"
                                                        name="Systolic BP (mmHg)"
                                                        stroke="#1C355E"
                                                        strokeWidth={2.5}
                                                        activeDot={{ r: 7, stroke: '#0F172A', strokeWidth: 2 }}
                                                        dot={{ stroke: '#1C355E', strokeWidth: 2, r: 5, fill: '#ffffff' }}
                                                    />
                                                    <Line
                                                        type="monotone"
                                                        dataKey="diastolic"
                                                        name="Diastolic BP (mmHg)"
                                                        stroke="#026CB6"
                                                        strokeWidth={2.5}
                                                        activeDot={{ r: 7, stroke: '#004A80', strokeWidth: 2 }}
                                                        dot={{ stroke: '#026CB6', strokeWidth: 2, r: 5, fill: '#ffffff' }}
                                                    />
                                                </>
                                            ) : (
                                                <Line
                                                    type="monotone"
                                                    dataKey="value"
                                                    name={`${activeConfig.label} (${activeConfig.unit})`}
                                                    stroke="#1C355E"
                                                    strokeWidth={2.5}
                                                    activeDot={{ r: 7, stroke: '#0F172A', strokeWidth: 2 }}
                                                    dot={{ stroke: '#1C355E', strokeWidth: 2, r: 5, fill: '#ffffff' }}
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
        </div>
    );
};

export default TrendsPage;
