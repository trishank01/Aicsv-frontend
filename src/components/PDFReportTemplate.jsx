import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Lightbulb, TrendingUp, AlertTriangle, CheckCircle2, Target, ShieldCheck, FileText, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import ChartsContainer from './ChartsContainer';

const SeverityBadge = ({ level }) => {
    const colors = {
        High: "bg-red-100 text-red-800 border-red-200",
        Medium: "bg-amber-100 text-amber-800 border-amber-200",
        Low: "bg-green-100 text-green-800 border-green-200"
    };
    return (
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${colors[level] || colors.Medium}`}>
            {level}
        </span>
    );
};

// This component uses strictly fixed widths (800px) and avoids responsive grids 
// to ensure perfect html2pdf capturing without element overlap.
const PDFReportTemplate = React.forwardRef(({ report }, ref) => {
    if (!report) return null;

    return (
        <div
            ref={ref}
            style={{
                width: "794px", // exact A4 width in px
                padding: "40px",
                fontFamily: "Arial, sans-serif",
                color: "#1f2937",
                background: "#ffffff",
            }}
        >
            {/* HEADER */}
            <div style={{ borderBottom: "4px solid #2563eb", paddingBottom: 20, marginBottom: 30 }}>
                <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0 }}>
                    Strategic Advisory Report
                </h1>
                <p style={{ fontSize: 12, color: "#6b7280", marginTop: 6 }}>
                    Generated on {new Date().toLocaleDateString()}
                </p>
            </div>

            {/* EXEC SUMMARY */}
            <div style={{ marginBottom: 40 }}>
                <h2 style={{ fontSize: 22, marginBottom: 10 }}>
                    Project: {report.title}
                </h2>
                <p style={{ fontSize: 14, lineHeight: 1.6 }}>
                    {report.executive_summary}
                </p>
            </div>

            {/* CHARTS (1 PER ROW, SIMPLE) */}
            {report.visualizations?.map((chart, index) => (
                <div key={index} style={{ marginBottom: 40 }}>
                    <h3 style={{ fontSize: 16, marginBottom: 10 }}>
                        {chart.title}
                    </h3>
                    <div style={{ height: 350 }}>
                        <ChartsContainer visualizations={[chart]} isPDF />
                    </div>
                </div>
            ))}

            {/* DATA QUALITY */}
            {report.data_quality_assessment && (
                <div style={{ marginBottom: 40 }}>
                    <h2 style={{ fontSize: 18, marginBottom: 15 }}>
                        Data Quality Assessment
                    </h2>

                    <div style={{ marginBottom: 10 }}>
                        <strong>Health Score:</strong>{" "}
                        {report.data_quality_assessment.overall_score}/100
                    </div>

                    <ul style={{ paddingLeft: 18, fontSize: 13 }}>
                        {report.data_quality_assessment.findings.map((f, i) => (
                            <li key={i} style={{ marginBottom: 5 }}>
                                {f}
                            </li>
                        ))}
                    </ul>

                    <p style={{ marginTop: 10, fontSize: 13 }}>
                        <strong>Remediation:</strong>{" "}
                        {report.data_quality_assessment.remediation_steps}
                    </p>
                </div>
            )}

            {/* KEY INSIGHTS (STACKED - NO GRID) */}
            <div style={{ marginBottom: 40 }}>
                <h2 style={{ fontSize: 18, marginBottom: 15 }}>
                    Key Insights
                </h2>

                {report.key_insights.map((insight, idx) => (
                    <div
                        key={idx}
                        style={{
                            borderLeft: "4px solid #facc15",
                            padding: "12px 16px",
                            marginBottom: 15,
                            background: "#fafafa",
                        }}
                    >
                        <h3 style={{ fontSize: 14, fontWeight: 700 }}>
                            {insight.title} ({insight.severity})
                        </h3>
                        <p style={{ fontSize: 13, marginTop: 5 }}>
                            {insight.description}
                        </p>
                    </div>
                ))}
            </div>

            {/* STRATEGIC RECOMMENDATIONS */}
            <div style={{ marginBottom: 40 }}>
                <h2 style={{ fontSize: 18, marginBottom: 15 }}>
                    Strategic Recommendations
                </h2>

                {report.strategic_recommendations.map((rec, idx) => (
                    <div
                        key={idx}
                        style={{
                            borderLeft: "4px solid #2563eb",
                            padding: "12px 16px",
                            marginBottom: 15,
                            background: "#fafafa",
                        }}
                    >
                        <h3 style={{ fontSize: 14, fontWeight: 700 }}>
                            {idx + 1}. {rec.title}
                        </h3>
                        <p style={{ fontSize: 13, marginTop: 5 }}>
                            {rec.description}
                        </p>
                        <div style={{ marginTop: 6, fontSize: 12 }}>
                            Impact: {rec.impact} | Effort: {rec.difficulty}
                        </div>
                    </div>
                ))}
            </div>

            {/* FOOTER */}
            <div
                style={{
                    borderTop: "1px solid #e5e7eb",
                    paddingTop: 20,
                    fontSize: 11,
                    color: "#9ca3af",
                }}
            >
                © {new Date().getFullYear()} Strategic Advisory Services — Confidential
            </div>
        </div>
    );
});

export default PDFReportTemplate;
