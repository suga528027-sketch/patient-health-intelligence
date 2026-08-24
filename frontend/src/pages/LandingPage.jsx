import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
    const { loginAsDemo } = useAuth();

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            {/* Top Institutional Header / Hero */}
            <section className="bg-[#1C355E] text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-[#15294A]">
                <div className="max-w-6xl mx-auto">
                    <div className="max-w-3xl space-y-4">
                        <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded text-xs font-semibold text-slate-200 border border-white/20">
                            <span>Clinical Artificial Intelligence & Diagnostics System</span>
                        </div>
                        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
                            Cura — Patient Health Intelligence & Clinical Records System
                        </h1>
                        <p className="text-base sm:text-lg text-slate-200 leading-relaxed">
                            A standards-compliant clinical platform that ingests unstructured medical reports (PDF), performs automated optical extraction, provides plain-language interpretations, and tracks longitudinal biomarker trajectories.
                        </p>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4">
                            <button
                                onClick={loginAsDemo}
                                className="bg-white hover:bg-slate-100 text-[#1C355E] font-bold px-6 py-3 rounded text-sm shadow-sm transition text-center cursor-pointer"
                            >
                                Access Interactive Clinical Demo
                            </button>
                            <Link
                                to="/login"
                                className="bg-transparent hover:bg-white/10 text-white font-semibold px-6 py-3 rounded text-sm border border-white/30 transition text-center"
                            >
                                Sign In with Credentials
                            </Link>
                        </div>
                    </div>

                    {/* Metric Cards Banner */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 pt-8 border-t border-white/15">
                        <div className="bg-white/10 p-4 rounded border border-white/10">
                            <div className="text-xs font-medium text-slate-300">Supported Modalities</div>
                            <div className="text-2xl font-bold text-white mt-1">4 Categories</div>
                            <div className="text-[11px] text-slate-300 mt-0.5">Labs, Radiology, Pathology, Clinical</div>
                        </div>
                        <div className="bg-white/10 p-4 rounded border border-white/10">
                            <div className="text-xs font-medium text-slate-300">Specialized Report Types</div>
                            <div className="text-2xl font-bold text-white mt-1">18 Formats</div>
                            <div className="text-[11px] text-slate-300 mt-0.5">CBC, CMP, MRI, Biopsy, Discharge</div>
                        </div>
                        <div className="bg-white/10 p-4 rounded border border-white/10">
                            <div className="text-xs font-medium text-slate-300">Semantic Vector Index</div>
                            <div className="text-2xl font-bold text-white mt-1">3,072-D</div>
                            <div className="text-[11px] text-slate-300 mt-0.5">Cosine Similarity Retrieval</div>
                        </div>
                        <div className="bg-white/10 p-4 rounded border border-white/10">
                            <div className="text-xs font-medium text-slate-300">Clinical Reasoning</div>
                            <div className="text-2xl font-bold text-white mt-1">Gemini 2.5</div>
                            <div className="text-[11px] text-slate-300 mt-0.5">Layperson Clinical Synthesis</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Capabilities Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-12">
                <div className="border-b border-slate-200 pb-4">
                    <h2 className="text-2xl font-bold text-[#0F172A]">
                        Clinical Capabilities & System Architecture
                    </h2>
                    <p className="text-sm text-slate-600 mt-1">
                        End-to-end medical workflow from document ingestion to longitudinal clinical synthesis
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded border border-slate-200 shadow-2xs space-y-3">
                        <div className="text-xs font-bold text-[#1C355E] uppercase tracking-wider">01 / Document Ingestion</div>
                        <h3 className="text-lg font-bold text-[#0F172A]">Optical Extraction & Parsing</h3>
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                            Automated text extraction from multi-page medical PDF files using Apache PDFBox with regex biomarker tokenization.
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded border border-slate-200 shadow-2xs space-y-3">
                        <div className="text-xs font-bold text-[#1C355E] uppercase tracking-wider">02 / Clinical Synthesis</div>
                        <h3 className="text-lg font-bold text-[#0F172A]">Domain-Tailored AI Summaries</h3>
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                            Category-specific AI prompts translate complex radiological impressions, pathology margins, and blood panels into plain English.
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded border border-slate-200 shadow-2xs space-y-3">
                        <div className="text-xs font-bold text-[#1C355E] uppercase tracking-wider">03 / Analytics</div>
                        <h3 className="text-lg font-bold text-[#0F172A]">Longitudinal Shift Deltas</h3>
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                            Continuous time-series tracking across blood pressure, fasting glucose, lipids, and liver enzymes against standard reference ranges.
                        </p>
                    </div>
                </div>

                {/* 4 Clinical Domains Grid */}
                <div className="bg-white p-8 rounded border border-slate-200 shadow-xs space-y-6">
                    <h3 className="text-xl font-bold text-[#0F172A]">
                        Supported Clinical Domains & Specialized Report Formats
                    </h3>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="space-y-2 border-l-2 border-[#1C355E] pl-3">
                            <div className="font-bold text-[#0F172A] text-sm">Laboratory & Blood Tests</div>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                Complete Blood Count (CBC), Metabolic Panels (BMP/CMP), Lipid Profile, Thyroid Hormones, Urinalysis, Coagulation.
                            </p>
                        </div>
                        <div className="space-y-2 border-l-2 border-[#1C355E] pl-3">
                            <div className="font-bold text-[#0F172A] text-sm">Diagnostic Imaging</div>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                Chest & Bone X-Rays, Brain/Joint MRI Scans, Computed Tomography (CT), Ultrasound Sonography, Nuclear PET, and ECG.
                            </p>
                        </div>
                        <div className="space-y-2 border-l-2 border-[#1C355E] pl-3">
                            <div className="font-bold text-[#0F172A] text-sm">Pathology & Biopsy</div>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                Surgical Pathology, Tissue Biopsy Histology, Cytology (Pap Smears / FNA), and Molecular DNA Biomarkers.
                            </p>
                        </div>
                        <div className="space-y-2 border-l-2 border-[#1C355E] pl-3">
                            <div className="font-bold text-[#0F172A] text-sm">Clinical & Hospital Records</div>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                Inpatient Discharge Summaries, Specialist Consultation Notes, Operative Surgical Reports, and Prescriptions.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Institutional Footer */}
            <footer className="bg-[#1C355E] text-slate-300 py-10 px-4 sm:px-6 lg:px-8 border-t border-[#15294A] text-xs">
                <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-white text-[#1C355E] font-bold flex items-center justify-center rounded text-xs">+</div>
                        <span className="font-bold text-white">Cura Clinical Intelligence System</span>
                    </div>
                    <div className="text-slate-400 text-center sm:text-right">
                        Standards-compliant clinical information architecture • For demonstration & educational use
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
