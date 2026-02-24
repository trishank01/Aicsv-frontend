import React from 'react';
import {
    BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const COLORS = ['#2563eb', '#16a34a', '#d97706', '#dc2626', '#9333ea', '#06b6d4', '#ec4899'];

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-popover border border-border p-3 rounded-lg shadow-lg">
                <p className="font-semibold">{label}</p>
                <p className="text-primary">{`${payload[0].name || 'Value'}: ${payload[0].value}`}</p>
            </div>
        );
    }
    return null;
};

const ChartsContainer = ({ visualizations, isPDF = false }) => {
    if (!visualizations || visualizations.length === 0) return null;

    return (
        <div className={`grid grid-cols-1 ${isPDF ? '' : 'md:grid-cols-2'} gap-6 my-8 break-inside-avoid`}>
            {visualizations.map((chart, index) => (
                <Card key={index} className="shadow-md hover:shadow-lg transition-shadow duration-300 break-inside-avoid">
                    <CardHeader>
                        <CardTitle>{chart.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            {chart.type === 'pie' ? (
                                <PieChart>
                                    <Pie
                                        data={chart.data}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                        nameKey="label"
                                        isAnimationActive={false}
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {chart.data.map((entry, i) => (
                                            <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend />
                                </PieChart>
                            ) : (
                                <BarChart data={chart.data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                    <XAxis dataKey="label" className="text-xs" />
                                    <YAxis className="text-xs" />
                                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                                    <Legend />
                                    <Bar dataKey="value" fill="#2563eb" radius={[4, 4, 0, 0]} isAnimationActive={false}>
                                        {chart.data.map((entry, i) => (
                                            <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            )}
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default ChartsContainer;
