import React, { useState } from 'react';
import ChartCard from './ChartCard';

// Simplified world map SVG paths for major regions/countries
// This is a privacy-safe aggregated country-level visualization
const COUNTRY_PATHS = {
    'US': 'M 158 120 L 165 115 L 180 118 L 200 115 L 220 120 L 225 130 L 220 140 L 200 145 L 180 142 L 165 138 L 158 130 Z',
    'CA': 'M 160 80 L 175 75 L 200 78 L 225 80 L 235 95 L 230 110 L 215 115 L 190 112 L 165 108 L 155 95 Z',
    'BR': 'M 230 200 L 250 195 L 270 205 L 280 230 L 270 255 L 250 265 L 225 255 L 220 230 Z',
    'GB': 'M 385 105 L 390 100 L 395 105 L 392 115 L 385 115 Z',
    'DE': 'M 410 110 L 420 108 L 425 118 L 418 125 L 408 120 Z',
    'FR': 'M 395 118 L 408 115 L 415 128 L 405 138 L 392 132 Z',
    'ES': 'M 378 135 L 398 132 L 400 148 L 380 152 L 375 145 Z',
    'IT': 'M 418 128 L 425 125 L 432 145 L 425 158 L 418 150 L 415 138 Z',
    'RU': 'M 440 70 L 520 60 L 600 75 L 620 95 L 600 120 L 520 125 L 460 118 L 440 100 Z',
    'CN': 'M 560 130 L 600 125 L 630 140 L 625 170 L 590 180 L 555 170 L 545 150 Z',
    'JP': 'M 650 140 L 660 135 L 665 150 L 655 165 L 645 155 Z',
    'KR': 'M 635 145 L 642 142 L 645 155 L 638 160 L 632 152 Z',
    'IN': 'M 520 160 L 545 155 L 555 180 L 545 210 L 520 205 L 510 180 Z',
    'AU': 'M 600 270 L 650 265 L 675 285 L 665 315 L 620 320 L 595 300 Z',
    'ZA': 'M 440 290 L 460 285 L 468 305 L 455 320 L 438 310 Z',
    'NG': 'M 415 200 L 430 198 L 435 215 L 422 225 L 410 215 Z',
    'EG': 'M 440 165 L 458 162 L 462 180 L 448 190 L 435 180 Z',
    'MX': 'M 145 145 L 175 148 L 185 165 L 165 180 L 145 170 Z',
    'AR': 'M 230 280 L 250 275 L 255 320 L 245 350 L 225 340 L 220 300 Z',
};

// Background map paths for continents (simplified outlines)
const CONTINENT_PATHS = [
    // North America
    'M 120 60 Q 180 50 240 70 Q 250 100 260 130 Q 230 160 180 170 Q 140 180 130 150 Q 115 120 120 60',
    // South America  
    'M 200 180 Q 250 175 280 200 Q 290 260 270 320 Q 250 370 220 360 Q 200 320 210 260 Q 200 210 200 180',
    // Europe
    'M 370 80 Q 440 70 450 100 Q 445 140 420 150 Q 380 155 365 130 Q 360 100 370 80',
    // Africa
    'M 380 160 Q 440 155 480 190 Q 485 250 460 310 Q 420 340 390 310 Q 365 260 370 200 Q 375 170 380 160',
    // Asia
    'M 450 50 Q 550 40 640 70 Q 680 110 660 180 Q 600 220 520 220 Q 470 200 450 160 Q 440 100 450 50',
    // Australia
    'M 580 250 Q 650 240 690 275 Q 700 320 670 350 Q 620 360 580 330 Q 560 290 580 250',
];

const CustomerMap = ({ data = null }) => {
    const [hoveredCountry, setHoveredCountry] = useState(null);
    const isEmpty = !data || Object.keys(data).length === 0;

    const mapIcon = (
        <svg className="w-12 h-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );

    const getCountryIntensity = (countryCode) => {
        if (!data || !data[countryCode]) return 0;
        const maxValue = Math.max(...Object.values(data));
        return data[countryCode] / maxValue;
    };

    const getCountryColor = (countryCode) => {
        const intensity = getCountryIntensity(countryCode);
        if (intensity === 0) return '#e5e7eb';
        
        // Gradient from light gray to blue based on intensity
        const r = Math.round(229 + (59 - 229) * intensity);
        const g = Math.round(231 + (130 - 231) * intensity);
        const b = Math.round(235 + (246 - 235) * intensity);
        return `rgb(${r}, ${g}, ${b})`;
    };

    return (
        <ChartCard
            title="Customer Distribution"
            subtitle="Aggregated country-level data"
            isEmpty={isEmpty}
            emptyMessage="No customer data yet"
            emptyIcon={mapIcon}
            className="h-full"
        >
            <div className="relative">
                <svg 
                    viewBox="0 0 800 400" 
                    className="w-full h-[280px]"
                    preserveAspectRatio="xMidYMid meet"
                >
                    {/* Background glow effect */}
                    <defs>
                        <radialGradient id="mapGlow" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.1" />
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                        </radialGradient>
                        <filter id="glow">
                            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                            <feMerge>
                                <feMergeNode in="coloredBlur"/>
                                <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                        </filter>
                    </defs>

                    {/* Background glow */}
                    <ellipse cx="400" cy="200" rx="350" ry="180" fill="url(#mapGlow)" />

                    {/* Continent outlines (background) */}
                    {CONTINENT_PATHS.map((path, index) => (
                        <path
                            key={`continent-${index}`}
                            d={path}
                            fill="#f3f4f6"
                            stroke="#d1d5db"
                            strokeWidth="0.5"
                            opacity="0.5"
                        />
                    ))}

                    {/* Country regions */}
                    {Object.entries(COUNTRY_PATHS).map(([code, path]) => {
                        const hasData = data && data[code];
                        const isHovered = hoveredCountry === code;
                        
                        return (
                            <path
                                key={code}
                                d={path}
                                fill={getCountryColor(code)}
                                stroke={hasData ? '#60a5fa' : '#d1d5db'}
                                strokeWidth={isHovered ? 2 : 0.5}
                                opacity={isHovered ? 1 : 0.9}
                                className="transition-all duration-200 cursor-pointer"
                                filter={hasData && isHovered ? 'url(#glow)' : 'none'}
                                onMouseEnter={() => setHoveredCountry(code)}
                                onMouseLeave={() => setHoveredCountry(null)}
                            />
                        );
                    })}

                    {/* Pulse dots for active countries */}
                    {data && Object.entries(data).map(([code, value]) => {
                        if (!COUNTRY_PATHS[code]) return null;
                        const path = COUNTRY_PATHS[code];
                        // Calculate approximate center of country path
                        const matches = path.match(/[ML]\s*(\d+)\s+(\d+)/g);
                        if (!matches) return null;
                        
                        let sumX = 0, sumY = 0, count = 0;
                        matches.forEach(m => {
                            const parts = m.match(/(\d+)\s+(\d+)/);
                            if (parts) {
                                sumX += parseInt(parts[1]);
                                sumY += parseInt(parts[2]);
                                count++;
                            }
                        });
                        const cx = sumX / count;
                        const cy = sumY / count;
                        
                        return (
                            <g key={`dot-${code}`}>
                                <circle
                                    cx={cx}
                                    cy={cy}
                                    r="4"
                                    fill="#3b82f6"
                                    className="animate-pulse"
                                />
                                <circle
                                    cx={cx}
                                    cy={cy}
                                    r="8"
                                    fill="none"
                                    stroke="#3b82f6"
                                    strokeWidth="1"
                                    opacity="0.5"
                                    className="animate-ping"
                                />
                            </g>
                        );
                    })}
                </svg>

                {/* Tooltip */}
                {hoveredCountry && data && data[hoveredCountry] && (
                    <div className="absolute top-4 right-4 bg-white border border-gray-200 rounded-lg px-4 py-3 shadow-xl">
                        <p className="text-gray-400 text-xs mb-1">{hoveredCountry}</p>
                        <p className="text-black font-semibold">
                            {data[hoveredCountry].toLocaleString()} customers
                        </p>
                    </div>
                )}

                {/* Legend */}
                {data && Object.keys(data).length > 0 && (
                    <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-blue-200"></div>
                            <span className="text-gray-400 text-xs">Low</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                            <span className="text-gray-400 text-xs">Medium</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                            <span className="text-gray-400 text-xs">High</span>
                        </div>
                    </div>
                )}
            </div>
        </ChartCard>
    );
};

export default CustomerMap;
