import React, { useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Lightbulb, TrendingUp, AlertTriangle, CheckCircle2, Target, ShieldCheck, Download, Loader2, FileText, Globe, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ChartsContainer from './ChartsContainer';
import PDFReportTemplate from './PDFReportTemplate';
import html2pdf from 'html2pdf.js';

const SeverityBadge = ({ level }) => {
    const colors = {
        High: "bg-red-100 text-red-800 border-red-200",
        Medium: "bg-amber-100 text-amber-800 border-amber-200",
        Low: "bg-green-100 text-green-800 border-green-200"
    };
    return (
        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded border ${colors[level] || colors.Medium}`}>
            {level}
        </span>
    );
};

const ReportView = ({ report }) => {
    const reportRef = useRef(null);
    const [isDownloading, setIsDownloading] = useState(false);

    if (!report) return null;

    const handleDownloadPDF = async () => {
        if (!reportRef.current) return;

        setIsDownloading(true);
        const element = reportRef.current;
        const opt = {
            margin: [15, 15],
            filename: `${report.title.replace(/\s+/g, '_')}_Strategic_Report.pdf`,
            image: { type: 'jpeg', quality: 1 },
            html2canvas: {
                scale: 2,
                useCORS: true,
                letterRendering: true,
                logging: false,
                windowWidth: 800 // Matching the hardcoded width in PDFReportTemplate
            },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
            pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
        };

        try {
            await html2pdf().from(element).set(opt).save();
        } catch (error) {
            console.error("PDF generation failed:", error);
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700 relative">
            {/* Hidden PDF Clone */}
            <div className="absolute top-0 left-0 -translate-y-full opacity-0 pointer-events-none -translate-x-[9999px]">
                <PDFReportTemplate ref={reportRef} report={report} />
            </div>

            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 py-8 border-b border-gray-100">
                <div className="text-center md:text-left space-y-4 max-w-2xl">
                    <h1 className="text-4xl font-extrabold tracking-tight text-primary leading-tight">
                        {report.title}
                    </h1>
                    <p className="text-xl text-muted-foreground leading-relaxed">
                        {report.executive_summary}
                    </p>
                </div>
                <div className="flex-shrink-0">
                    <Button
                        onClick={handleDownloadPDF}
                        disabled={isDownloading}
                        className="bg-primary hover:bg-primary/90 text-white px-6 py-6 h-auto text-lg rounded-xl shadow-xl hover:shadow-2xl transition-all flex items-center gap-3"
                    >
                        {isDownloading ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            <Download className="h-5 w-5" />
                        )}
                        {isDownloading ? "Generating PDF..." : "Export Report as PDF"}
                    </Button>
                </div>
            </div>

            <div className="space-y-12 bg-white rounded-2xl p-8">
                <div className="space-y-4">
                    <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5 px-3 py-1 text-xs font-bold uppercase tracking-widest">
                        Executive Analysis
                    </Badge>
                    <h2 className="text-3xl font-bold text-gray-900 leading-tight">Project: {report.title}</h2>
                </div>

                {/* Visualizations */}
                <ChartsContainer visualizations={report.visualizations} />

                {/* Data Quality Assessment */}
                {report.data_quality_assessment && (
                    <section className="animate-in slide-in-from-bottom duration-500">
                        <div className="flex items-center gap-2 mb-4">
                            <ShieldCheck className="h-6 w-6 text-indigo-600" />
                            <h2 className="text-2xl font-semibold text-gray-900">Data Quality Assessment</h2>
                        </div>
                        <Card className="border-l-4 border-l-indigo-600 overflow-hidden">
                            <CardHeader className="bg-indigo-50/50 pb-4">
                                <div className="flex justify-between items-center">
                                    <CardTitle className="text-indigo-900">Health Score</CardTitle>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-3xl font-bold ${report.data_quality_assessment.overall_score > 80 ? 'text-green-600' :
                                            report.data_quality_assessment.overall_score > 50 ? 'text-amber-600' : 'text-red-600'
                                            }`}>
                                            {report.data_quality_assessment.overall_score}/100
                                        </span>
                                    </div>
                                </div>
                                <CardDescription className="text-indigo-700/80">
                                    This score represents the structural integrity and completeness of the uploaded dataset.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                                        Key Findings
                                    </h3>
                                    <ul className="space-y-2">
                                        {report.data_quality_assessment.findings.map((finding, idx) => (
                                            <li key={idx} className="text-sm text-muted-foreground flex gap-2">
                                                <span className="text-indigo-400">•</span>
                                                {finding}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="space-y-3 bg-indigo-50/30 p-4 rounded-lg border border-indigo-100">
                                    <h3 className="font-semibold text-indigo-900 flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-indigo-600" />
                                        Remediation Steps
                                    </h3>
                                    <p className="text-sm text-indigo-800/80 leading-relaxed italic">
                                        "{report.data_quality_assessment.remediation_steps}"
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </section>
                )}

                {/* Key Insights Grid */}
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <Lightbulb className="h-6 w-6 text-yellow-500" />
                        <h2 className="text-2xl font-semibold">Key Insights</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {report.key_insights.map((insight, idx) => (
                            <Card key={idx} className="hover:shadow-lg transition-all border-l-4 border-l-yellow-400">
                                <CardHeader className="pb-2">
                                    <div className="flex justify-between items-start gap-2">
                                        <CardTitle className="text-lg">{insight.title}</CardTitle>
                                        <SeverityBadge level={insight.severity} />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground leading-relaxed">{insight.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>

                {/* Strategic Recommendations */}
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <Target className="h-6 w-6 text-blue-600" />
                        <h2 className="text-2xl font-semibold">Strategic Recommendations</h2>
                    </div>
                    <div className="space-y-4">
                        {report.strategic_recommendations.map((rec, idx) => (
                            <Card key={idx} className="border-l-4 border-l-blue-600">
                                <CardContent className="pt-6">
                                    <div className="flex flex-col md:flex-row gap-4 justify-between items-start">
                                        <div className="space-y-2 flex-1">
                                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                                {idx + 1}. {rec.title}
                                            </h3>
                                            <p className="text-muted-foreground">{rec.description}</p>
                                        </div>
                                        <div className="flex flex-wrap gap-2 min-w-40 justify-end">
                                            <div className="flex flex-col items-end">
                                                <span className="text-xs text-muted-foreground uppercase font-bold">Impact</span>
                                                <SeverityBadge level={rec.impact} />
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className="text-xs text-muted-foreground uppercase font-bold">Difficulty</span>
                                                <span className="text-xs font-medium px-2.5 py-0.5 rounded bg-slate-100 text-slate-800">
                                                    {rec.difficulty}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>

                {/* Feature Improvements */}
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <TrendingUp className="h-6 w-6 text-green-600" />
                        <h2 className="text-2xl font-semibold">Suggested Improvements</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {report.feature_improvements.map((feat, idx) => (
                            <Card key={idx} className="bg-gradient-to-br from-green-50 to-transparent border-green-200">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-green-800">
                                        <div className="p-2 bg-green-200 rounded-full">
                                            <CheckCircle2 className="h-4 w-4 text-green-700" />
                                        </div>
                                        {feat.feature}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <div>
                                            <span className="font-semibold text-sm text-green-800">Proposal: </span>
                                            <span className="text-sm text-muted-foreground">{feat.proposal}</span>
                                        </div>
                                        <div>
                                            <span className="font-semibold text-sm text-green-800">Benefit: </span>
                                            <span className="text-sm text-muted-foreground">{feat.expected_benefit}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default ReportView;
