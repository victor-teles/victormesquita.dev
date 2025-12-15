'use client'
import React, { useState } from 'react';
import styles from './styles.module.css';

interface PromptMetricsProps {
  usageHistory?: { date: string; value: number }[];
  features?: string[];
  tokenConsumption?: { input: number; output: number };
  ratings?: { [key: number]: number };
  successRate?: { success: number; error: number };
  modelCompatibility?: { [key: string]: number };
  complexity?: number; // 0 to 100
  mcpRequirements?: { name: string; url: string }[];
  variant?: 'default' | 'compact';
}

const DefaultMetrics: Required<Omit<PromptMetricsProps, 'variant'>> = {
  usageHistory: Array.from({ length: 30 }, (_, i) => ({ date: `Day ${i + 1}`, value: Math.floor(Math.random() * 100) + 50 })),
  features: ['Zero-shot', 'Chain of Thought', 'Code Generation'],
  tokenConsumption: { input: 300, output: 700 },
  ratings: { 5: 120, 4: 45, 3: 10, 2: 5, 1: 2 },
  successRate: { success: 95, error: 5 },
  modelCompatibility: { 'GPT-4': 90, 'Claude 3.5': 85, 'Gemini 1.5': 95, 'Llama 3': 70, 'Mistral': 60 },
  complexity: 65,
  mcpRequirements: [],
};

export const PromptMetrics: React.FC<PromptMetricsProps> = (props) => {
  const { variant = 'default', ...rest } = props;
  const [isExpanded, setIsExpanded] = useState(false);
  const data = { ...DefaultMetrics, ...rest };

  if (variant === 'compact' && !isExpanded) {
    return (
      <div className={`${styles.container} ${styles.compact}`}>
        <div className={styles.compactRow}>
          <div className={styles.compactCard}>
            <span className={styles.compactLabel}>Success Rate</span>
            <span className={styles.compactValue}>{Math.round((data.successRate.success / (data.successRate.success + data.successRate.error)) * 100)}%</span>
          </div>
          <div className={styles.compactCard}>
            <span className={styles.compactLabel}>Complexity</span>
            <span className={styles.compactValue}>{data.complexity < 25 ? 'Simple' : data.complexity < 50 ? 'Moderate' : data.complexity < 75 ? 'Complex' : 'Advanced'}</span>
          </div>
          <div className={styles.compactCard}>
            <span className={styles.compactLabel}>Best Model</span>
            <span className={styles.compactValue}>{Object.entries(data.modelCompatibility).sort((a, b) => b[1] - a[1])[0][0]}</span>
          </div>
        </div>
        
        <div className={styles.compactRow}>
           <div className={styles.compactChartCard}>
             <span className={styles.compactLabel}>Usage Trend</span>
             <div style={{ height: '40px', width: '100%' }}>
                <UsageHistoryChart data={data.usageHistory} compact />
             </div>
           </div>
           <div className={styles.compactChartCard}>
             <span className={styles.compactLabel}>Features</span>
             <div style={{ height: '40px', width: '100%' }}>
                <FeaturesList data={data.features} compact />
             </div>
           </div>
        </div>

        {data.mcpRequirements && data.mcpRequirements.length > 0 && (
          <div className={styles.compactRow}>
             <div className={styles.compactChartCard} style={{ width: '100%', flex: '1 1 100%' }}>
               <span className={styles.compactLabel}>MCP Requirements</span>
               <div style={{ height: '40px', width: '100%' }}>
                  <MCPRequirementsCard data={data.mcpRequirements} compact />
               </div>
             </div>
          </div>
        )}

        <button className={styles.expandButton} onClick={() => setIsExpanded(true)}>
          View Detailed Metrics
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {variant === 'compact' && (
        <div className={styles.headerActions}>
          <button className={styles.expandButton} onClick={() => setIsExpanded(false)}>
            Back to Summary
          </button>
        </div>
      )}
      {/* 1. Popularity & Engagement */}
      <UsageHistoryChart data={data.usageHistory} />
      <FeaturesList data={data.features} />

      {/* 2. Cost & Efficiency */}
      <TokenConsumptionChart data={data.tokenConsumption} />

      {/* 3. Quality & Satisfaction */}
      <RatingChart data={data.ratings} />
      <SuccessRateChart data={data.successRate} />

      {/* 4. Advanced Insights */}
      <ModelCompatibilityChart data={data.modelCompatibility} />
      <ComplexityChart value={data.complexity} />
      <MCPRequirementsCard data={data.mcpRequirements} />
    </div>
  );
};

// --- Sub-components (Charts) ---

const UsageHistoryChart = ({ data, compact }: { data: { date: string; value: number }[], compact?: boolean }) => {
  const width = 300;
  const height = compact ? 40 : 150;
  const padding = compact ? 0 : 20;
  
  const maxValue = Math.max(...data.map(d => d.value));
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * (width - padding * 2) + padding;
    const y = height - padding - (d.value / maxValue) * (height - padding * 2);
    return `${x},${y}`;
  }).join(' ');

  const areaPoints = `${padding},${height - padding} ${points} ${width - padding},${height - padding}`;

  if (compact) {
    return (
      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
          <polyline points={points} className={styles.chartLine} style={{ strokeWidth: 2 }} />
      </svg>
    )
  }

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <span className={styles.cardTitle}>Usage History</span>
        <span className={styles.cardSubtitle}>Last 30 Days</span>
      </div>
      <div className={styles.chartContainer}>
        <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
          <defs>
            <linearGradient id="greenGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--accent-mint)" stopOpacity="0.5" />
              <stop offset="100%" stopColor="var(--accent-mint)ccent-mint)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <polyline points={areaPoints} className={styles.chartArea} />
          <polyline points={points} className={styles.chartLine} />
        </svg>
      </div>
    </div>
  );
};

const FeaturesList = ({ data, compact }: { data: string[], compact?: boolean }) => {
  if (compact) {
    return (
      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', height: '100%', overflow: 'hidden', alignItems: 'center' }}>
        {data.slice(0, 2).map((feature, i) => (
          <span key={i} style={{ 
            fontSize: '10px', 
            backgroundColor: 'var(--bg-input)', 
            padding: '2px 6px', 
            borderRadius: '4px',
            whiteSpace: 'nowrap',
            color: 'var(--text-secondary)'
          }}>
            {feature}
          </span>
        ))}
        {data.length > 2 && (
           <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>+{data.length - 2}</span>
        )}
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <span className={styles.cardTitle}>Capabilities</span>
        <span className={styles.cardSubtitle}>{data.length} Features</span>
      </div>
      <div className={styles.chartContainer} style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '8px', overflowY: 'auto', padding: '0 10px' }}>
        {data.map((feature, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--accent-mint)' }} />
            <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{feature}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const TokenConsumptionChart = ({ data }: { data: { input: number; output: number } }) => {
  const total = data.input + data.output;
  const inputPercent = (data.input / total) * 100;
  const outputPercent = (data.output / total) * 100;

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <span className={styles.cardTitle}>Token Consumption</span>
      </div>
      <div className={styles.chartContainer} style={{ flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ width: '100%', height: '40px', display: 'flex', borderRadius: '8px', overflow: 'hidden' }}>
          <div style={{ width: `${inputPercent}%`, backgroundColor: 'var(--chart-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontSize: '12px', fontWeight: 'bold' }}>
            {Math.round(inputPercent)}%
          </div>
          <div style={{ width: `${outputPercent}%`, backgroundColor: 'var(--accent-mint)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontSize: '12px', fontWeight: 'bold' }}>
            {Math.round(outputPercent)}%
          </div>
        </div>
        <div className={styles.legend}>
          <div className={styles.legendItem}>
            <div className={styles.legendColor} style={{ backgroundColor: 'var(--chart-purple)' }} />
            Input (Context)
          </div>
          <div className={styles.legendItem}>
            <div className={styles.legendColor} style={{ backgroundColor: 'var(--accent-mint)' }} />
            Output (Generation)
          </div>
        </div>
      </div>
    </div>
  );
};

const LatencyChart = ({ data }: { data: { p50: number; p90: number; p99: number } }) => {
  // Simple visualization of p50, p90, p99
  const max = Math.max(data.p99 * 1.2, 1); // Scale
  
  const getWidth = (val: number) => `${(val / max) * 100}%`;

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <span className={styles.cardTitle}>Latency (sec)</span>
      </div>
      <div className={styles.chartContainer} style={{ flexDirection: 'column', gap: '12px', alignItems: 'stretch' }}>
        {[
          { label: 'p50', value: data.p50, color: 'var(--accent-mint)' },
          { label: 'p90', value: data.p90, color: 'var(--chart-yellow)' },
          { label: 'p99', value: data.p99, color: 'var(--chart-red)' },
        ].map((item) => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ width: '30px', fontSize: '12px', color: 'var(--text-secondary)' }}>{item.label}</span>
            <div style={{ flex: 1, backgroundColor: 'var(--bg-input)', borderRadius: '4px', height: '8px', overflow: 'hidden' }}>
              <div style={{ width: getWidth(item.value), backgroundColor: item.color, height: '100%' }} />
            </div>
            <span style={{ width: '40px', fontSize: '12px', color: 'var(--text-primary)', textAlign: 'right' }}>{item.value}s</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const RatingChart = ({ data }: { data: { [key: number]: number } }) => {
  const total = Object.values(data).reduce((a, b) => a + b, 0);
  const max = Math.max(...Object.values(data));

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <span className={styles.cardTitle}>Ratings</span>
        <span className={styles.cardSubtitle}>{total} Reviews</span>
      </div>
      <div className={styles.chartContainer} style={{ flexDirection: 'column', gap: '8px', alignItems: 'stretch' }}>
        {[5, 4, 3, 2, 1].map((star) => (
          <div key={star} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ width: '10px', fontSize: '12px', color: 'var(--text-secondary)' }}>{star}</span>
            <div style={{ flex: 1, backgroundColor: 'var(--bg-input)', borderRadius: '4px', height: '6px' }}>
              <div 
                style={{ 
                  width: `${(data[star] / max) * 100}%`, 
                  backgroundColor: star >= 4 ? 'var(--accent-mint)' : star === 3 ? 'var(--chart-yellow)' : 'var(--chart-red)', 
                  height: '100%',
                  borderRadius: '4px'
                }} 
              />
            </div>
            <span style={{ width: '30px', fontSize: '10px', color: 'var(--text-secondary)', textAlign: 'right' }}>{data[star]}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const SuccessRateChart = ({ data }: { data: { success: number; error: number } }) => {
  const total = data.success + data.error;
  const successPercent = (data.success / total) * 100;
  
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <span className={styles.cardTitle}>Success Rate</span>
      </div>
      <div className={styles.chartContainer}>
        <svg width="200" height="120" viewBox="0 0 200 120">
          <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="var(--bg-input)" strokeWidth="20" strokeLinecap="round" />
          <path 
            d="M 20 100 A 80 80 0 0 1 180 100" 
            fill="none" 
            stroke={successPercent > 90 ? "var(--accent-mint)" : "var(--chart-yellow)"} 
            strokeWidth="20" 
            strokeLinecap="round"
            strokeDasharray={`${(successPercent / 100) * (Math.PI * 80)} ${Math.PI * 80}`}
          />
          <text x="100" y="90" textAnchor="middle" fill="var(--text-primary)" fontSize="32" fontWeight="bold">
            {Math.round(successPercent)}%
          </text>
        </svg>
      </div>
    </div>
  );
};

const ModelCompatibilityChart = ({ data }: { data: { [key: string]: number } }) => {
  const models = Object.keys(data);
  const count = models.length;
  const radius = 80;
  const centerX = 100;
  const centerY = 100;
  
  const getPoint = (value: number, index: number) => {
    const angle = (Math.PI * 2 * index) / count - Math.PI / 2;
    const r = (value / 100) * radius;
    return `${centerX + r * Math.cos(angle)},${centerY + r * Math.sin(angle)}`;
  };

  const points = models.map((model, i) => getPoint(data[model], i)).join(' ');
  const fullPoints = models.map((_, i) => getPoint(100, i)).join(' ');

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <span className={styles.cardTitle}>Model Compatibility</span>
      </div>
      <div className={styles.chartContainer}>
        <svg width="200" height="200" viewBox="0 0 200 200">
          {/* Grid */}
          {[0.25, 0.5, 0.75, 1].map(scale => (
             <polygon 
               key={scale}
               points={models.map((_, i) => {
                 const angle = (Math.PI * 2 * i) / count - Math.PI / 2;
                 const r = radius * scale;
                 return `${centerX + r * Math.cos(angle)},${centerY + r * Math.sin(angle)}`;
               }).join(' ')}
               className={styles.radarGrid}
             />
          ))}
          
          {/* Data */}
          <polygon points={points} className={styles.radarPolygon} />
          
          {/* Labels */}
          {models.map((model, i) => {
             const angle = (Math.PI * 2 * i) / count - Math.PI / 2;
             const r = radius + 15;
             const x = centerX + r * Math.cos(angle);
             const y = centerY + r * Math.sin(angle);
             return (
               <text 
                 key={model} 
                 x={x} 
                 y={y} 
                 textAnchor="middle" 
                 dominantBaseline="middle" 
                 fill="var(--text-secondary)" 
                 fontSize="10"
               >
                 {model}
               </text>
             );
          })}
        </svg>
      </div>
    </div>
  );
};

const ComplexityChart = ({ value }: { value: number }) => {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <span className={styles.cardTitle}>Complexity</span>
      </div>
      <div className={styles.chartContainer} style={{ flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ width: '100%', height: '12px', backgroundColor: 'var(--bg-input)', borderRadius: '6px', position: 'relative' }}>
          <div 
            style={{ 
              width: `${value}%`, 
              height: '100%', 
              background: 'linear-gradient(90deg, var(--accent-mint), var(--chart-purple))', 
              borderRadius: '6px' 
            }} 
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: '8px', fontSize: '10px', color: 'var(--text-secondary)' }}>
          <span>Zero-shot</span>
          <span>Few-shot</span>
          <span>CoT</span>
          <span>Agentic</span>
        </div>
        <div style={{ marginTop: '12px', textAlign: 'center', color: 'var(--text-primary)', fontWeight: 'bold' }}>
          {value < 25 ? 'Simple' : value < 50 ? 'Moderate' : value < 75 ? 'Complex' : 'Advanced'}
        </div>
      </div>
    </div>
  );
};

const MCPRequirementsCard = ({ data, compact }: { data: { name: string; url: string }[], compact?: boolean }) => {
  if (!data || data.length === 0) return null;
  
  if (compact) {
    return (
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', height: '100%', overflow: 'hidden', alignContent: 'center' }}>
        {data.map((req, i) => (
          <a key={i} href={req.url} target="_blank" rel="noopener noreferrer" style={{ 
            fontSize: '11px', 
            backgroundColor: 'var(--bg-input)', 
            padding: '4px 8px', 
            borderRadius: '4px',
            whiteSpace: 'nowrap',
            color: 'var(--text-secondary)',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            border: '1px solid var(--border)'
          }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--chart-purple)' }} />
            {req.name}
          </a>
        ))}
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <span className={styles.cardTitle}>MCP Requirements</span>
        <span className={styles.cardSubtitle}>{data.length} Servers</span>
      </div>
      <div className={styles.chartContainer} style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '8px', overflowY: 'auto', padding: '0 10px' }}>
        {data.map((req, i) => (
          <a 
            key={i} 
            href={req.url} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              width: '100%',
              textDecoration: 'none',
              color: 'inherit'
            }}
          >
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--chart-purple)' }} />
            <span style={{ fontSize: '13px', color: 'var(--text-primary)', textDecoration: 'underline' }}>{req.name}</span>
          </a>
        ))}
      </div>
    </div>
  );
};
