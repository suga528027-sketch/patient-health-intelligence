import React, { useState, useEffect } from 'react';
import { reportService } from '../services/api';

const ComparisonSection = () => {
    const [comparison, setComparison] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        const fetchComparison = async () => {
            try {
                const data = await reportService.getLatestComparison();
                if (data.message) {
                    setErrorMsg(data.message);
                } else {
                    setComparison(data);
                }
            } catch (err) {
                console.error("Failed to load comparison data", err);
                setErrorMsg("No previous report to compare with yet.");
            } finally {
                setLoading(false);
            }
        };

        fetchComparison();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center space-x-2 py-4 text-slate-500">
                <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-xs font-semibold">Comparing against prior baseline report...</span>
            </div>
        );
    }

    if (errorMsg) {
        return (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-xs sm:text-sm text-blue-800 flex items-start gap-2.5">
                <span className="text-base">ℹ️</span>
                <div>
                    <div className="font-bold">Longitudinal Comparison Notice</div>
                    <div className="mt-0.5">{errorMsg}</div>
                </div>
            </div>
        );
    }

    if (!comparison || !comparison.comparisons || comparison.comparisons.length === 0) {
        return null;
    }

    const formatName = (name) => {
        if (name === "BP_SYSTOLIC") return "Systolic Blood Pressure";
        if (name === "BP_DIASTOLIC") return "Diastolic Blood Pressure";
        if (name === "GLUCOSE_FASTING") return "Fasting Blood Glucose";
        if (name === "HBA1C") return "HbA1c (3-Month Glucose)";
        if (name === "HEMOGLOBIN") return "Hemoglobin";
        if (name === "CHOLESTEROL_TOTAL") return "Total Cholesterol";
        if (name === "LDL") return "LDL ('Bad') Cholesterol";
        if (name === "HDL") return "HDL ('Good') Cholesterol";
        if (name === "CREATININE") return "Serum Creatinine (Kidney)";
        return name.replace(/_/g, ' ');
    };

    const getStatusTheme = (paramName, trend, diff) => {
        const lowerIsBetter = ["BP_SYSTOLIC", "BP_DIASTOLIC", "GLUCOSE_FASTING", "CHOLESTEROL_TOTAL", "LDL", "CREATININE", "HBA1C"].includes(paramName);

        if (trend === "STABLE") {
            return {
                bg: "bg-emerald-50/70 border-emerald-200 text-emerald-900",
                badge: "bg-emerald-100 text-emerald-800 border-emerald-300",
                icon: "🟢 Stable"
            };
        }
        if (trend === "INCREASED") {
            return lowerIsBetter ? {
                bg: "bg-amber-50/80 border-amber-300 text-amber-950",
                badge: "bg-amber-100 text-amber-900 border-amber-400",
                icon: "⚠️ Elevated"
            } : {
                bg: "bg-emerald-50/70 border-emerald-200 text-emerald-900",
                badge: "bg-emerald-100 text-emerald-800 border-emerald-300",
                icon: "✅ Improved"
            };
        }
        if (trend === "DECREASED") {
            return lowerIsBetter ? {
                bg: "bg-emerald-50/70 border-emerald-200 text-emerald-900",
                badge: "bg-emerald-100 text-emerald-800 border-emerald-300",
                icon: "✅ Improved"
            } : {
                bg: "bg-amber-50/80 border-amber-300 text-amber-950",
                badge: "bg-amber-100 text-amber-900 border-amber-400",
                icon: "⚠️ Decreased"
            };
        }
        return {
            bg: "bg-slate-50 border-slate-200 text-slate-800",
            badge: "bg-slate-100 text-slate-700 border-slate-300",
            icon: "ℹ️ Monitored"
        };
    };

    return (
        <div className="border-t border-slate-200 pt-6 space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h4 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                        <span>📊</span> Longitudinal Biomarker Comparison
                    </h4>
                    <p className="text-xs text-slate-500">Automated shift analysis vs. your previous test</p>
                </div>
                <span className="text-[11px] bg-indigo-50 text-indigo-700 border border-indigo-200 px-2.5 py-1 rounded-full font-bold">
                    {comparison.comparisons.length} Overlapping Biomarkers
                </span>
            </div>

            <div className="space-y-3">
                {comparison.comparisons.map((c, index) => {
                    const theme = getStatusTheme(c.parameterName, c.trend, c.difference);

                    return (
                        <div
                            key={index}
                            className={`p-4 border rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm transition ${theme.bg}`}
                        >
                            <div className="flex-1 space-y-1">
                                <div className="font-extrabold text-slate-900 flex items-center gap-2 text-sm">
                                    <span>{formatName(c.parameterName)}</span>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shadow-2xs ${theme.badge}`}>
                                        {theme.icon}
                                    </span>
                                </div>
                                <div className="text-xs text-slate-600 font-medium">
                                    Current: <strong className="text-slate-900">{c.currentValue} {c.unit}</strong> |{' '}
                                    Previous: <strong className="text-slate-900">{c.previousValue} {c.unit}</strong>
                                </div>
                                <p className="text-xs text-slate-700 leading-relaxed font-normal pt-1">
                                    💡 {c.interpretation}
                                </p>
                            </div>

                            <div className="text-left sm:text-right font-black text-base whitespace-nowrap self-start sm:self-center border-t sm:border-t-0 pt-2 sm:pt-0 w-full sm:w-auto">
                                <div className={`${c.difference > 0 ? 'text-amber-700' : 'text-emerald-700'}`}>
                                    {c.difference > 0 ? `+${c.difference.toFixed(1)}` : c.difference.toFixed(1)} {c.unit}
                                </div>
                                <div className="text-[11px] font-semibold text-slate-500">
                                    ({c.percentChange > 0 ? `+${c.percentChange.toFixed(1)}` : c.percentChange.toFixed(1)}%)
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ComparisonSection;
