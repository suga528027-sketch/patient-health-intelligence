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
            <div className="flex items-center space-x-2 py-4 text-slate-600">
                <div className="w-4 h-4 border-2 border-[#1C355E] border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm font-medium">Evaluating longitudinal baseline comparisons...</span>
            </div>
        );
    }

    if (errorMsg) {
        return (
            <div className="bg-slate-50 border border-slate-300 rounded p-4 text-sm text-slate-700">
                <div className="font-bold text-[#0F172A] text-base">Longitudinal Baseline Notice</div>
                <div className="mt-0.5 text-slate-600">{errorMsg}</div>
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
        if (name === "HBA1C") return "HbA1c (Glycated Hemoglobin)";
        if (name === "HEMOGLOBIN") return "Hemoglobin";
        if (name === "CHOLESTEROL_TOTAL") return "Total Cholesterol";
        if (name === "LDL") return "LDL Cholesterol";
        if (name === "HDL") return "HDL Cholesterol";
        if (name === "CREATININE") return "Serum Creatinine";
        return name.replace(/_/g, ' ');
    };

    const getStatusTheme = (paramName, trend) => {
        const lowerIsBetter = ["BP_SYSTOLIC", "BP_DIASTOLIC", "GLUCOSE_FASTING", "CHOLESTEROL_TOTAL", "LDL", "CREATININE", "HBA1C"].includes(paramName);

        if (trend === "STABLE") {
            return {
                border: "border-l-4 border-emerald-600 bg-emerald-50/40 text-slate-800",
                badge: "bg-emerald-100 text-emerald-900 border-emerald-300",
                label: "Stable"
            };
        }
        if (trend === "INCREASED") {
            return lowerIsBetter ? {
                border: "border-l-4 border-amber-600 bg-amber-50/40 text-slate-800",
                badge: "bg-amber-100 text-amber-900 border-amber-300",
                label: "Elevated Shift"
            } : {
                border: "border-l-4 border-emerald-600 bg-emerald-50/40 text-slate-800",
                badge: "bg-emerald-100 text-emerald-900 border-emerald-300",
                label: "Favorable Increase"
            };
        }
        if (trend === "DECREASED") {
            return lowerIsBetter ? {
                border: "border-l-4 border-emerald-600 bg-emerald-50/40 text-slate-800",
                badge: "bg-emerald-100 text-emerald-900 border-emerald-300",
                label: "Favorable Decrease"
            } : {
                border: "border-l-4 border-amber-600 bg-amber-50/40 text-slate-800",
                badge: "bg-amber-100 text-amber-900 border-amber-300",
                label: "Decreased Shift"
            };
        }
        return {
            border: "border-l-4 border-slate-400 bg-slate-50 text-slate-800",
            badge: "bg-slate-100 text-slate-800 border-slate-300",
            label: "Monitored"
        };
    };

    return (
        <div className="border-t border-slate-200 pt-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <div>
                    <h4 className="text-base font-bold text-[#0F172A] uppercase tracking-wider">
                        Longitudinal Biomarker Comparison (Consecutive Panels)
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-500">Quantitative differential against prior lab baseline</p>
                </div>
                <span className="text-xs bg-slate-100 text-slate-800 border border-slate-300 px-3 py-1 rounded font-semibold">
                    {comparison.comparisons.length} Overlapping Biomarkers
                </span>
            </div>

            <div className="space-y-3.5">
                {comparison.comparisons.map((c, index) => {
                    const theme = getStatusTheme(c.parameterName, c.trend);

                    return (
                        <div
                            key={index}
                            className={`p-4 rounded border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs ${theme.border}`}
                        >
                            <div className="flex-1 space-y-1">
                                <div className="font-bold text-[#0F172A] flex items-center gap-2 text-base">
                                    <span>{formatName(c.parameterName)}</span>
                                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded border ${theme.badge}`}>
                                        {theme.label}
                                    </span>
                                </div>
                                <div className="text-sm text-slate-600">
                                    Current: <strong className="text-slate-900">{c.currentValue} {c.unit}</strong> |{' '}
                                    Previous: <strong className="text-slate-900">{c.previousValue} {c.unit}</strong>
                                </div>
                                <p className="text-sm text-slate-700 leading-relaxed pt-1">
                                    {c.interpretation}
                                </p>
                            </div>

                            <div className="text-left sm:text-right font-bold text-lg whitespace-nowrap self-start sm:self-center border-t sm:border-t-0 pt-2 sm:pt-0 w-full sm:w-auto">
                                <div className={`${c.difference > 0 ? 'text-amber-800' : 'text-emerald-800'}`}>
                                    {c.difference > 0 ? `+${c.difference.toFixed(1)}` : c.difference.toFixed(1)} {c.unit}
                                </div>
                                <div className="text-xs font-normal text-slate-500">
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
