import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import './StatGraph.css';

function StatGraph({ stats }) {
    if (!stats) return null;

    // Convert the stats object into the array format Recharts needs
    const data = [
        { subject: 'Knowledge', A: stats.knowledge || 0, fullMark: 100 },
        { subject: 'Discipline', A: stats.discipline || 0, fullMark: 100 },
        { subject: 'Charisma', A: stats.charisma || 0, fullMark: 100 },
        { subject: 'Creativity', A: stats.creativity || 0, fullMark: 100 },
        { subject: 'Courage', A: stats.courage || 0, fullMark: 100 },
        { subject: 'Physique', A: stats.physique || 0, fullMark: 100 },
        { subject: 'Empathy', A: stats.empathy || 0, fullMark: 100 },
        { subject: 'Essence', A: stats.essence || 0, fullMark: 100 },
    ];

    return (
        <div className="stat-graph-container">
            <div className="stat-graph-chart-wrapper">
                <ResponsiveContainer width="100%" height={300}>
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                        <PolarGrid stroke="rgba(76, 161, 175, 0.4)" />
                        <PolarAngleAxis 
                            dataKey="subject" 
                            tick={{ fill: '#7ec8e3', fontSize: 12, fontWeight: 600 }} 
                        />
                        <Radar
                            name="Dreamer Stats"
                            dataKey="A"
                            stroke="#4CA1AF"
                            strokeWidth={2}
                            fill="url(#colorGradient)"
                            fillOpacity={0.6}
                        />
                        {/* SVG Definitions for the gradient fill */}
                        <defs>
                            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#7ec8e3" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#4CA1AF" stopOpacity={0.4}/>
                            </linearGradient>
                        </defs>
                    </RadarChart>
                </ResponsiveContainer>
            </div>

            <div className="stat-sliders-container">
                {data.map((stat, index) => (
                    <div key={index} className="stat-slider-row">
                        <div className="stat-slider-header">
                            <span className="stat-slider-name">{stat.subject}</span>
                            <span className="stat-slider-value">{stat.A} / 100</span>
                        </div>
                        <div className="stat-slider-track">
                            <div 
                                className="stat-slider-fill" 
                                style={{ 
                                    '--target-width': `${stat.A}%`,
                                    animationDelay: `${index * 0.1}s` 
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default StatGraph;
