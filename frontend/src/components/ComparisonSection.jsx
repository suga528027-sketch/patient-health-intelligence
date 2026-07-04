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
            <div className="flex items-center space-x-2 py-4 text-gray-500">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                <span className="text-sm font-medium">Checking comparison with last report...</span>
            </div>
        );
    }

    if (errorMsg) {
        return (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-700 mt-6">
                ℹ️ No previous report to compare with yet. Upload another report later to see trends.
            </div>
        );
    }

    if (!comparison || !comparison.comparisons || comparison.comparisons.length === 0) {
        return null;
    }

    // A helper to format parameters nicely for humans
    const formatName = (name) => {
        if (name === "BP_SYSTOLIC") return "Systolic Blood Pressure";
        if (name === "BP_DIASTOLIC") return "Diastolic Blood Pressure";
        if (name === "GLUCOSE_FASTING") return "Fasting Glucose";
        if (name === "HBA1C") return "HbA1c";
        if (name === "HEMOGLOBIN") return "Hemoglobin";
        if (name === "CHOLESTEROL_TOTAL") return "Total Cholesterol";
        if (name === "LDL") return "LDL Cholesterol";
        if (name === "HDL") return "HDL Cholesterol";
        if (name === "CREATININE") return "Creatinine";
        return name.replace('_', ' ');
    };

    // Color code indicator.
    // Blood pressure, glucose, cholesterol, LDL, creatinine are better when LOWER (decreased is green, increased is red).
    // Hemoglobin, HDL are better when HIGHER or stable (decreased is red, increased is green).
    const getColorClass = (paramName, trend, diff) => {
        const lowerIsBetter = ["BP_SYSTOLIC", "BP_DIASTOLIC", "GLUCOSE_FASTING", "CHOLESTEROL_TOTAL", "LDL", "CREATININE", "HBA1C"].includes(paramName);
        
        if (trend === "STABLE") {
            return "text-green-600 bg-green-50 border-green-200";
        }
        if (trend === "INCREASED") {
            return lowerIsBetter ? "text-red-600 bg-red-50 border-red-200" : "text-green-600 bg-green-50 border-green-200";
        }
        if (trend === "DECREASED") {
            return lowerIsBetter ? "text-green-600 bg-green-50 border-green-200" : "text-red-600 bg-red-50 border-red-200";
        }
        return "text-gray-600 bg-gray-50 border-gray-200";
    };

    return (
        <div className="mt-8 border-t pt-6">
            <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                📊 Comparison with your previous report
            </h4>
            <div className="space-y-4">
                {comparison.comparisons.map((c, index) => {
                    const colorClasses = getColorClass(c.parameterName, c.trend, c.difference);
                    
                    return (
                        <div key={index} className={`p-4 border rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 ${colorClasses}`}>
                            <div className="flex-1">
                                <div className="font-bold text-gray-800 flex items-center gap-2 text-sm md:text-base">
                                    {formatName(c.parameterName)}
                                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full border bg-white shadow-sm">
                                        {c.trend}
                                    </span>
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                    Current: <span className="font-semibold text-gray-700">{c.currentValue} {c.unit}</span> | 
                                    Previous: <span className="font-semibold text-gray-700">{c.previousValue} {c.unit}</span>
                                </div>
                                <p className="text-sm font-medium text-gray-700 mt-2">
                                    💡 {c.interpretation}
                                </p>
                            </div>
                            <div className="text-right font-bold text-lg whitespace-nowrap self-start md:self-center text-gray-800">
                                {c.difference > 0 ? `+${c.difference.toFixed(1)}` : c.difference.toFixed(1)} {c.unit}
                                <div className="text-xs font-medium text-gray-400">
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
