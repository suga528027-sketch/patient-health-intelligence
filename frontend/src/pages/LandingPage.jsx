import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
    const { loginAsDemo } = useAuth();
    const [newsletterEmail, setNewsletterEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);
    const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
    const [feedbackText, setFeedbackText] = useState('');
    const [feedbackSent, setFeedbackSent] = useState(false);

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (newsletterEmail.trim()) {
            setSubscribed(true);
            setTimeout(() => setSubscribed(false), 4000);
            setNewsletterEmail('');
        }
    };

    const handleSendFeedback = (e) => {
        e.preventDefault();
        if (feedbackText.trim()) {
            setFeedbackSent(true);
            setTimeout(() => {
                setFeedbackSent(false);
                setFeedbackModalOpen(false);
                setFeedbackText('');
            }, 2000);
        }
    };

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

            {/* WHO-Style Institutional Footer Section (About Us, Policies & Contact Us) */}
            <footer className="bg-[#0C2340] text-slate-200 pt-16 pb-12 px-4 sm:px-6 lg:px-8 border-t border-[#15294A]">
                <div className="max-w-6xl mx-auto space-y-16">
                    {/* Columns: Policies, About Us, Contact Us */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 text-sm">
                        {/* Column 1: About Us (md:col-span-5) */}
                        <div className="md:col-span-5 space-y-4">
                            <h3 className="text-base font-bold text-white tracking-tight border-b border-white/10 pb-2">
                                About Cura
                            </h3>
                            <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
                                Cura is a next-generation clinical intelligence system dedicated to empowering patients and medical providers with transparent, automated diagnostic parsing, semantic knowledge retrieval, and longitudinal disease prevention tracking.
                            </p>
                            <ul className="space-y-2 text-xs text-slate-300">
                                <li>• Standards-compliant healthcare data ingestion</li>
                                <li>• High-accuracy vector retrieval (3072-D cosine similarity)</li>
                                <li>• Secure patient-isolated data architecture</li>
                                <li>• Designed under clinical decision-support best practices</li>
                            </ul>
                        </div>

                        {/* Column 2: Policies (md:col-span-3) */}
                        <div className="md:col-span-3 space-y-4">
                            <h3 className="text-base font-bold text-white tracking-tight border-b border-white/10 pb-2">
                                Policies & Standards
                            </h3>
                            <ul className="space-y-2.5 text-xs text-slate-300">
                                <li>
                                    <span className="hover:text-white cursor-pointer transition">Data Privacy & HIPAA Principles</span>
                                </li>
                                <li>
                                    <span className="hover:text-white cursor-pointer transition">Clinical AI Ethics & Safety</span>
                                </li>
                                <li>
                                    <span className="hover:text-white cursor-pointer transition">Information Disclosure</span>
                                </li>
                                <li>
                                    <span className="hover:text-white cursor-pointer transition">Terms of Use & Licensing</span>
                                </li>
                                <li>
                                    <span className="hover:text-white cursor-pointer transition">Non-Diagnostic Medical Disclaimer</span>
                                </li>
                            </ul>
                        </div>

                        {/* Column 3: Contact Us (md:col-span-4) */}
                        <div className="md:col-span-4 space-y-4">
                            <h3 className="text-base font-bold text-white tracking-tight border-b border-white/10 pb-2">
                                Contact Us
                            </h3>
                            <p className="text-xs text-slate-300 leading-relaxed">
                                Get in touch with our clinical engineering team or subscribe to receive periodic updates on medical AI research.
                            </p>

                            {/* Newsletter subscription form */}
                            <form onSubmit={handleSubscribe} className="space-y-2">
                                <div className="flex gap-2">
                                    <input
                                        type="email"
                                        value={newsletterEmail}
                                        onChange={e => setNewsletterEmail(e.target.value)}
                                        placeholder="Enter your email..."
                                        className="bg-white/10 border border-white/20 rounded px-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-400 flex-1"
                                    />
                                    <button
                                        type="submit"
                                        className="bg-[#1C355E] hover:bg-blue-900 text-white font-semibold text-xs px-3 py-1.5 rounded border border-white/20 transition cursor-pointer"
                                    >
                                        Subscribe
                                    </button>
                                </div>
                                {subscribed && (
                                    <p className="text-[11px] text-emerald-400 font-medium">✓ Subscribed to clinical updates.</p>
                                )}
                            </form>

                            <div className="pt-2 flex flex-col gap-2">
                                <button
                                    onClick={() => setFeedbackModalOpen(true)}
                                    className="w-full text-left bg-white/5 hover:bg-white/10 text-slate-200 text-xs px-3 py-2 rounded border border-white/15 transition flex items-center justify-between cursor-pointer"
                                >
                                    <span>Submit Feedback or Report Issue</span>
                                    <span>➔</span>
                                </button>
                                <div className="text-[11px] text-slate-400">
                                    Direct inquiries: <a href="mailto:support@trycura.health" className="text-blue-300 hover:underline">support@trycura.health</a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Grand Institutional Center Logo & Emblem (WHO Style with Laurel Wreath & Medical Cross) */}
                    <div className="pt-10 border-t border-white/15 flex flex-col sm:flex-row items-center justify-center gap-4 text-center sm:text-left">
                        {/* Custom SVG Institutional Laurel Wreath Emblem for Cura */}
                        <div className="flex items-center gap-4">
                            <svg className="w-16 h-16 text-white shrink-0" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                {/* Laurel Wreath Left */}
                                <path d="M30 80C22 70 18 55 22 40C24 32 28 25 35 18C34 25 36 32 40 37C32 45 30 60 38 72C36 75 33 78 30 80Z" fill="currentColor" fillOpacity="0.85"/>
                                <path d="M24 60C16 52 16 40 20 28C22 34 26 39 31 43C27 50 26 56 24 60Z" fill="currentColor" fillOpacity="0.6"/>
                                
                                {/* Laurel Wreath Right */}
                                <path d="M70 80C78 70 82 55 78 40C76 32 72 25 65 18C66 25 64 32 60 37C68 45 70 60 62 72C64 75 67 78 70 80Z" fill="currentColor" fillOpacity="0.85"/>
                                <path d="M76 60C84 52 84 40 80 28C78 34 74 39 69 43C73 50 74 56 76 60Z" fill="currentColor" fillOpacity="0.6"/>
                                
                                {/* Central Medical Shield */}
                                <path d="M50 14C38 14 30 20 30 36C30 58 50 76 50 76C50 76 70 58 70 36C70 20 62 14 50 14Z" fill="#1C355E" stroke="currentColor" strokeWidth="2.5"/>
                                
                                {/* Inner Rod of Asclepius & Medical Cross */}
                                <path d="M50 24V56M39 37H61" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round"/>
                                <circle cx="50" cy="84" r="3" fill="currentColor"/>
                            </svg>

                            <div className="flex flex-col">
                                <span className="text-2xl sm:text-3xl font-extrabold tracking-wider uppercase text-white font-serif leading-none">
                                    Cura
                                </span>
                                <span className="text-xs tracking-widest uppercase text-slate-300 font-semibold mt-1">
                                    Clinical Intelligence Organization
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Utility Bar */}
                    <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-400">
                        <div className="flex items-center gap-4">
                            <span className="hover:text-slate-200 cursor-pointer">Privacy Policy</span>
                            <span>•</span>
                            <span className="hover:text-slate-200 cursor-pointer">Security Standards</span>
                            <span>•</span>
                            <span className="hover:text-slate-200 cursor-pointer">HIPAA Guidelines</span>
                        </div>
                        <div>
                            © 2026 Cura Clinical Intelligence. All rights reserved.
                        </div>
                    </div>
                </div>
            </footer>

            {/* Feedback / Contact Modal */}
            {feedbackModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
                    <div className="bg-white rounded max-w-md w-full p-6 shadow-xl border border-slate-300 relative space-y-4">
                        <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                            <h4 className="font-bold text-slate-900 text-base">Submit Feedback / Report Discrepancy</h4>
                            <button onClick={() => setFeedbackModalOpen(false)} className="text-slate-400 hover:text-slate-700 font-bold">✕</button>
                        </div>
                        {feedbackSent ? (
                            <div className="py-8 text-center text-emerald-700 font-semibold space-y-1">
                                <div className="text-2xl">✓</div>
                                <p>Thank you. Your feedback has been submitted to the clinical team.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSendFeedback} className="space-y-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                        Your Clinical Feedback or Inquiry
                                    </label>
                                    <textarea
                                        rows="4"
                                        required
                                        value={feedbackText}
                                        onChange={e => setFeedbackText(e.target.value)}
                                        className="w-full border border-slate-300 rounded p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#1C355E]"
                                        placeholder="Describe your inquiry, bug report, or clinical suggestion..."
                                    ></textarea>
                                </div>
                                <div className="flex justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setFeedbackModalOpen(false)}
                                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-1.5 bg-[#1C355E] hover:bg-blue-900 text-white text-xs font-semibold rounded"
                                    >
                                        Submit Report
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default LandingPage;
