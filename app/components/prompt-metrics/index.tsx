'use client';
import React, { useState } from 'react';
import styles from './styles.module.css';

interface PromptMetricsProps {
  features?: string[];
  models?: {
    [key: string]: {
      tokenConsumption: { input: number; output: number; total: number; limit: number };
      cost: { average: number; total: number; currency: string };
    };
  };
  modelCompatibility?: { [key: string]: number };
  complexity?: number; // 0 to 100
  mcpRequirements?: { name: string; url: string }[];
  variant?: 'default' | 'compact';
}

const DefaultMetrics: Required<Omit<PromptMetricsProps, 'variant'>> = {
  features: ['Zero-shot', 'Chain of Thought', 'Code Generation'],
  models: {
    'Gemini 3 Pro': {
      tokenConsumption: { input: 1200, output: 800, total: 2000, limit: 128000 },
      cost: { average: 0.015, total: 12.5, currency: 'USD' },
    },
    'GPT 5.2': {
      tokenConsumption: { input: 1100, output: 700, total: 1800, limit: 128000 },
      cost: { average: 0.018, total: 15.5, currency: 'USD' },
    },
    'Opus 4.5': {
      tokenConsumption: { input: 1000, output: 600, total: 1600, limit: 200000 },
      cost: { average: 0.025, total: 20.5, currency: 'USD' },
    },
  },
  modelCompatibility: { 'GPT-4o': 95, 'Claude 3.5 Sonnet': 98, 'Gemini 1.5 Pro': 92, 'Llama 3.1': 88 },
  complexity: 65,
  mcpRequirements: [],
};

export const PromptMetrics: React.FC<PromptMetricsProps> = (props) => {
  const { variant = 'default', ...rest } = props;
  const [isExpanded, setIsExpanded] = useState(false);
  const data = { ...DefaultMetrics, ...rest };

  const modelNames = Object.keys(data.models);
  const [selectedModel, setSelectedModel] = useState(modelNames[0]);
  const currentModelMetrics = data.models[selectedModel] || data.models[modelNames[0]];

  if (variant === 'compact' && !isExpanded) {
    return (
      <div className={`${styles.container} ${styles.compact}`}>
        <div className={styles.compactRow}>
          <div className={styles.compactCard}>
            <span className={styles.compactLabel}>Model</span>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className={styles.modelSelectCompact}
              onClick={(e) => e.stopPropagation()}
            >
              {modelNames.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.compactCard}>
            <span className={styles.compactLabel}>Avg. Cost</span>
            <span className={styles.compactValue}>
              {currentModelMetrics.cost.currency === 'USD' ? '$' : ''}
              {currentModelMetrics.cost.average.toFixed(3)}
            </span>
          </div>

          <div className={styles.compactCard}>
            <span className={styles.compactLabel}>Context Window</span>
            <div style={{ height: '40px', width: '100%' }}>
              <TokenConsumptionChart data={currentModelMetrics.tokenConsumption} compact />
            </div>
          </div>
        </div>

        <div className={styles.compactRow}>
          <div className={styles.compactChartCard}>
            <span className={styles.compactLabel}>Features</span>
            <div style={{ height: '40px', width: '100%' }}>
              <FeaturesList data={data.features} compact />
            </div>
          </div>

          <div className={styles.compactChartCard}>
            <span className={styles.compactLabel}>Best Model</span>
            <span className={styles.compactValue}>
              {Object.entries(data.modelCompatibility).sort((a, b) => b[1] - a[1])[0][0]}
            </span>
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

      <div
        className={styles.fullWidthCard}
        style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '12px' }}
      >
        <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Select Model:</span>
        <div className={styles.modelSelector}>
          {modelNames.map((name) => (
            <button
              key={name}
              className={`${styles.modelButton} ${selectedModel === name ? styles.modelButtonActive : ''}`}
              onClick={() => setSelectedModel(name)}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {/* 1. Performance & Reliability */}
      {/* SuccessRateChart removed */}
      <ComplexityChart value={data.complexity} />

      {/* 2. Cost & Efficiency */}
      <CostChart data={currentModelMetrics.cost} />
      <TokenConsumptionChart data={currentModelMetrics.tokenConsumption} />

      {/* 3. Capabilities & Compatibility */}
      <FeaturesList data={data.features} />
      <ModelCompatibilityChart data={data.modelCompatibility} />
      <MCPRequirementsCard data={data.mcpRequirements} />
    </div>
  );
};

// --- Sub-components (Charts) ---

const FeaturesList = ({ data, compact }: { data: string[]; compact?: boolean }) => {
  if (compact) {
    return (
      <div
        style={{
          display: 'flex',
          gap: '4px',
          flexWrap: 'wrap',
          height: '100%',
          overflow: 'hidden',
          alignItems: 'center',
        }}
      >
        {data.slice(0, 2).map((feature, i) => (
          <span
            key={i}
            style={{
              fontSize: '10px',
              backgroundColor: 'var(--bg-input)',
              padding: '2px 6px',
              borderRadius: '4px',
              whiteSpace: 'nowrap',
              color: 'var(--text-secondary)',
            }}
          >
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
      <div
        className={styles.chartContainer}
        style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '8px', overflowY: 'auto', padding: '0 10px' }}
      >
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

const CostChart = ({ data }: { data: { average: number; total: number; currency: string } }) => {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <span className={styles.cardTitle}>Execution Cost</span>
        <span className={styles.cardSubtitle}>Estimated ({data.currency})</span>
      </div>
      <div className={styles.chartContainer} style={{ flexDirection: 'column', justifyContent: 'center', gap: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Avg. per Run</span>
          <span style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--accent-mint)' }}>
            {data.currency === 'USD' ? '$' : ''}
            {data.average.toFixed(3)}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Total Project Cost</span>
          <span style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text-primary)' }}>
            {data.currency === 'USD' ? '$' : ''}
            {data.total.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

const TokenConsumptionChart = ({
  data,
  compact,
}: { data: { input: number; output: number; total: number; limit: number }; compact?: boolean }) => {
  const total = data.input + data.output;
  const inputPercent = (data.input / total) * 100;
  const outputPercent = (data.output / total) * 100;
  const limitPercent = (data.total / data.limit) * 100;

  if (compact) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', height: '100%', justifyContent: 'center' }}>
        <div
          style={{
            width: '100%',
            height: '8px',
            backgroundColor: 'var(--bg-input)',
            borderRadius: '4px',
            overflow: 'hidden',
          }}
        >
          <div style={{ width: `${limitPercent}%`, backgroundColor: 'var(--accent-mint)', height: '100%' }} />
        </div>
        <div
          style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-secondary)' }}
        >
          <span>{data.total.toLocaleString()} tokens</span>
          <span>{limitPercent.toFixed(1)}% of limit</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <span className={styles.cardTitle}>Token Consumption</span>
        <span className={styles.cardSubtitle}>Context Window Usage</span>
      </div>
      <div className={styles.chartContainer} style={{ flexDirection: 'column', justifyContent: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Total Usage</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>
              {data.total.toLocaleString()} / {data.limit.toLocaleString()}
            </span>
          </div>
          <div
            style={{
              width: '100%',
              height: '12px',
              backgroundColor: 'var(--bg-input)',
              borderRadius: '6px',
              overflow: 'hidden',
            }}
          >
            <div style={{ width: `${limitPercent}%`, backgroundColor: 'var(--accent-mint)', height: '100%' }} />
          </div>
        </div>

        <div style={{ width: '100%', height: '30px', display: 'flex', borderRadius: '6px', overflow: 'hidden' }}>
          <div
            style={{
              width: `${inputPercent}%`,
              backgroundColor: 'var(--chart-purple)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#000',
              fontSize: '11px',
              fontWeight: 'bold',
            }}
          >
            {Math.round(inputPercent)}%
          </div>
          <div
            style={{
              width: `${outputPercent}%`,
              backgroundColor: 'var(--accent-mint)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#000',
              fontSize: '11px',
              fontWeight: 'bold',
            }}
          >
            {Math.round(outputPercent)}%
          </div>
        </div>
        <div className={styles.legend} style={{ marginTop: '0' }}>
          <div className={styles.legendItem}>
            <div className={styles.legendColor} style={{ backgroundColor: 'var(--chart-purple)' }} />
            Input
          </div>
          <div className={styles.legendItem}>
            <div className={styles.legendColor} style={{ backgroundColor: 'var(--accent-mint)' }} />
            Output
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
            <div
              style={{
                flex: 1,
                backgroundColor: 'var(--bg-input)',
                borderRadius: '4px',
                height: '8px',
                overflow: 'hidden',
              }}
            >
              <div style={{ width: getWidth(item.value), backgroundColor: item.color, height: '100%' }} />
            </div>
            <span style={{ width: '40px', fontSize: '12px', color: 'var(--text-primary)', textAlign: 'right' }}>
              {item.value}s
            </span>
          </div>
        ))}
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
          {[0.25, 0.5, 0.75, 1].map((scale) => (
            <polygon
              key={scale}
              points={models
                .map((_, i) => {
                  const angle = (Math.PI * 2 * i) / count - Math.PI / 2;
                  const r = radius * scale;
                  return `${centerX + r * Math.cos(angle)},${centerY + r * Math.sin(angle)}`;
                })
                .join(' ')}
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
        <div
          style={{
            width: '100%',
            height: '12px',
            backgroundColor: 'var(--bg-input)',
            borderRadius: '6px',
            position: 'relative',
          }}
        >
          <div
            style={{
              width: `${value}%`,
              height: '100%',
              background: 'linear-gradient(90deg, var(--accent-mint), var(--chart-purple))',
              borderRadius: '6px',
            }}
          />
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            marginTop: '8px',
            fontSize: '10px',
            color: 'var(--text-secondary)',
          }}
        >
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

const MCPRequirementsCard = ({ data, compact }: { data: { name: string; url: string }[]; compact?: boolean }) => {
  if (!data || data.length === 0) return null;

  if (compact) {
    return (
      <div
        style={{
          display: 'flex',
          gap: '6px',
          flexWrap: 'wrap',
          height: '100%',
          overflow: 'hidden',
          alignContent: 'center',
        }}
      >
        {data.map((req, i) => (
          <a
            key={i}
            href={req.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
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
              border: '1px solid var(--border)',
            }}
          >
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
      <div
        className={styles.chartContainer}
        style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '8px', overflowY: 'auto', padding: '0 10px' }}
      >
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
              color: 'inherit',
            }}
          >
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--chart-purple)' }} />
            <span style={{ fontSize: '13px', color: 'var(--text-primary)', textDecoration: 'underline' }}>
              {req.name}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
};
