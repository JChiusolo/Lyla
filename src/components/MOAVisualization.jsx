import React, { useState, useMemo } from 'react';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Cell, ScatterChart, Scatter, PieChart, Pie, RadarChart, Radar,
  ComposedChart, Area
} from 'recharts';
import { drugMechanisms } from '../data/drugMechanisms';
import { AlertCircle, CheckCircle, Info, TrendingUp, Zap } from 'lucide-react';

/**
 * INTELLIGENT VISUALIZATION SELECTOR
 * Analyzes data characteristics and selects optimal chart type
 */
class VisualizationSelector {
  
  /**
   * Analyze data to determine best visualization
   * @param {Object} data - Data object to analyze
   * @param {string} context - Context of visualization (e.g., 'efficacy', 'timeline', 'mechanism')
   * @returns {string} Recommended visualization type
   */
  static selectVisualization(data, context) {
    // Null check
    if (!data) return 'table';

    // Count data characteristics
    const characteristics = this.analyzeDataCharacteristics(data);

    // Selection logic based on context and data type
    switch (context) {
      case 'efficacy':
        return this.selectEfficacyViz(characteristics);
      case 'timeline':
        return this.selectTimelineViz(characteristics);
      case 'mechanism':
        return this.selectMechanismViz(characteristics);
      case 'comparison':
        return this.selectComparisonViz(characteristics);
      case 'distribution':
        return this.selectDistributionViz(characteristics);
      default:
        return this.selectDefaultViz(characteristics);
    }
  }

  /**
   * Analyze data structure and content
   */
  static analyzeDataCharacteristics(data) {
    if (Array.isArray(data)) {
      return {
        isTimeSeries: this.isTimeSeries(data),
        isComparison: this.isComparison(data),
        hasMultipleMetrics: this.countMetrics(data) > 1,
        metricCount: this.countMetrics(data),
        dataPoints: data.length,
        isDistribution: this.isDistribution(data),
        hasHierarchy: this.hasHierarchy(data),
        trend: this.detectTrend(data)
      };
    }
    return {};
  }

  /**
   * Is this time-series data? (has time, date, week, month, year fields)
   */
  static isTimeSeries(data) {
    if (!Array.isArray(data) || data.length === 0) return false;
    const firstRecord = data[0];
    const timeFields = ['time', 'date', 'week', 'month', 'year', 'day', 'hour'];
    return timeFields.some(field => field in firstRecord);
  }

  /**
   * Is this comparison data? (has category field)
   */
  static isComparison(data) {
    if (!Array.isArray(data) || data.length === 0) return false;
    const firstRecord = data[0];
    const categoryFields = ['drug', 'category', 'treatment', 'group', 'name', 'label'];
    return categoryFields.some(field => field in firstRecord);
  }

  /**
   * Count numeric metrics in dataset
   */
  static countMetrics(data) {
    if (!Array.isArray(data) || data.length === 0) return 0;
    const firstRecord = data[0];
    return Object.keys(firstRecord).filter(key => {
      const value = firstRecord[key];
      return typeof value === 'number' && !isNaN(value);
    }).length;
  }

  /**
   * Detect overall trend in data
   */
  static detectTrend(data) {
    if (!Array.isArray(data) || data.length < 2) return 'stable';
    
    // Find numeric values
    const firstRecord = data[0];
    const numericKey = Object.keys(firstRecord).find(k => typeof firstRecord[k] === 'number');
    
    if (!numericKey) return 'stable';
    
    const values = data.map(d => d[numericKey]);
    const firstVal = values[0];
    const lastVal = values[values.length - 1];
    
    if (lastVal > firstVal * 1.1) return 'increasing';
    if (lastVal < firstVal * 0.9) return 'decreasing';
    return 'stable';
  }

  /**
   * Is distribution data? (counts, frequencies, percentages)
   */
  static isDistribution(data) {
    if (!Array.isArray(data) || data.length === 0) return false;
    const firstRecord = data[0];
    const numericValues = Object.values(firstRecord).filter(v => typeof v === 'number');
    // Distribution if all values are positive and relatively small
    return numericValues.every(v => v >= 0 && v <= 100);
  }

  /**
   * Does data have hierarchical structure?
   */
  static hasHierarchy(data) {
    if (!Array.isArray(data)) return false;
    return data.some(record => 
      typeof record === 'object' && 
      Object.values(record).some(v => Array.isArray(v) || typeof v === 'object')
    );
  }

  /**
   * SELECT VISUALIZATION BY CONTEXT
   */

  /**
   * Efficacy visualization selector
   * Best for: A1c reduction, weight loss, CV outcomes
   */
  static selectEfficacyViz(characteristics) {
    // Multiple drugs being compared?
    if (characteristics.isComparison) {
      // Multiple metrics per drug?
      if (characteristics.metricCount >= 3) {
        return 'grouped-bar'; // Side-by-side comparison
      }
      return 'bar'; // Simple bar chart
    }

    // Single metric over time?
    if (characteristics.isTimeSeries) {
      return 'line';
    }

    // Default for efficacy
    return 'grouped-bar';
  }

  /**
   * Timeline visualization selector
   * Best for: Treatment progression, dose escalation
   */
  static selectTimelineViz(characteristics) {
    // Has clear time progression?
    if (characteristics.isTimeSeries) {
      // Multiple metrics tracked?
      if (characteristics.metricCount >= 2) {
        return 'composed'; // Line + Area combo
      }
      return 'line';
    }

    // Increasing or decreasing trend?
    if (characteristics.trend !== 'stable') {
      return 'area';
    }

    return 'line';
  }

  /**
   * Mechanism visualization selector
   * Best for: Receptor interactions, drug targets
   */
  static selectMechanismViz(characteristics) {
    // Hierarchical data (targets → effects)?
    if (characteristics.hasHierarchy) {
      return 'custom-svg'; // Custom SVG diagram
    }

    // Multiple components?
    if (characteristics.metricCount >= 2) {
      return 'radar'; // Good for showing multiple dimensions
    }

    return 'custom-svg';
  }

  /**
   * Comparison visualization selector
   * Best for: Drug A vs Drug B vs Combination
   */
  static selectComparisonViz(characteristics) {
    // Multiple metrics AND categories?
    if (characteristics.isComparison && characteristics.metricCount >= 3) {
      return 'grouped-bar'; // Best for side-by-side comparison
    }

    // Simple two-metric comparison?
    if (characteristics.metricCount === 2) {
      return 'scatter'; // Shows relationship between metrics
    }

    return 'bar';
  }

  /**
   * Distribution visualization selector
   * Best for: Adverse events, percentages, frequencies
   */
  static selectDistributionViz(characteristics) {
    // Part-to-whole relationship?
    if (characteristics.isDistribution && characteristics.dataPoints <= 5) {
      return 'pie'; // Good for 3-5 categories
    }

    // Many categories or frequency data?
    if (characteristics.dataPoints > 5 || characteristics.metricCount > 1) {
      return 'bar';
    }

    return 'bar';
  }

  /**
   * Default visualization selector
   */
  static selectDefaultViz(characteristics) {
    // If time series, use line
    if (characteristics.isTimeSeries) return 'line';
    
    // If comparison, use bar
    if (characteristics.isComparison) return 'bar';
    
    // If multiple metrics, use grouped
    if (characteristics.metricCount >= 2) return 'grouped-bar';
    
    // Fallback
    return 'bar';
  }
}

/**
 * VISUALIZATION RENDERING ENGINE
 * Renders selected visualization type with proper configuration
 */
class VisualizationRenderer {
  
  static render(data, vizType, options = {}) {
    switch (vizType) {
      case 'bar':
        return <BarVisualization data={data} {...options} />;
      
      case 'grouped-bar':
        return <GroupedBarVisualization data={data} {...options} />;
      
      case 'line':
        return <LineVisualization data={data} {...options} />;
      
      case 'area':
        return <AreaVisualization data={data} {...options} />;
      
      case 'composed':
        return <ComposedVisualization data={data} {...options} />;
      
      case 'scatter':
        return <ScatterVisualization data={data} {...options} />;
      
      case 'radar':
        return <RadarVisualization data={data} {...options} />;
      
      case 'pie':
        return <PieVisualization data={data} {...options} />;
      
      case 'custom-svg':
        return <CustomSVGVisualization data={data} {...options} />;
      
      case 'table':
      default:
        return <TableVisualization data={data} {...options} />;
    }
  }
}

/**
 * MAIN COMPONENT WITH INTELLIGENT SELECTION
 */
export default function MOAVisualization({ selectedDrug = 'both' }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [autoSelect, setAutoSelect] = useState(true); // Enable auto-selection by default
  const [manualVizType, setManualVizType] = useState(null);

  // Efficacy comparison data
  const efficacyComparison = [
    { drug: 'Mounjaro', a1c: -1.8, weight: -16.5, cardiovascular: 0, renal: 0 },
    { drug: 'Jardiance', a1c: -0.7, weight: -4.2, cardiovascular: -38, renal: -35 },
    { drug: 'Combined', a1c: -2.8, weight: -18, cardiovascular: -35, renal: -35 }
  ];

  // Treatment timeline
  const treatmentTimeline = [
    { week: 0, mounjaro: 2.5, a1c: 8.2 },
    { week: 4, mounjaro: 5, a1c: 7.9 },
    { week: 8, mounjaro: 10, a1c: 7.5 },
    { week: 12, mounjaro: 15, a1c: 7.0 },
    { week: 16, mounjaro: 15, a1c: 6.5 }
  ];

  // Adverse events distribution
  const adverseEvents = [
    { event: 'Nausea', frequency: 35 },
    { event: 'Vomiting', frequency: 10 },
    { event: 'Diarrhea', frequency: 22 },
    { event: 'Constipation', frequency: 20 },
    { event: 'Other', frequency: 13 }
  ];

  // SELECT VISUALIZATIONS BASED ON DATA
  const selectedVisualizations = useMemo(() => {
    return {
      efficacy: autoSelect 
        ? VisualizationSelector.selectVisualization(efficacyComparison, 'efficacy')
        : manualVizType || VisualizationSelector.selectVisualization(efficacyComparison, 'efficacy'),
      
      timeline: autoSelect
        ? VisualizationSelector.selectVisualization(treatmentTimeline, 'timeline')
        : manualVizType || VisualizationSelector.selectVisualization(treatmentTimeline, 'timeline'),
      
      adverseEvents: autoSelect
        ? VisualizationSelector.selectVisualization(adverseEvents, 'distribution')
        : manualVizType || VisualizationSelector.selectVisualization(adverseEvents, 'distribution')
    };
  }, [autoSelect, manualVizType]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <OverviewTab 
            efficacyData={efficacyComparison}
            efficacyVizType={selectedVisualizations.efficacy}
            autoSelect={autoSelect}
            onChangeVizType={setManualVizType}
          />
        );
      case 'mounjaro':
        return <MounjuroTab />;
      case 'jardiance':
        return <JardianceTab />;
      case 'combination':
        return (
          <CombinationTab 
            timelineData={treatmentTimeline}
            timelineVizType={selectedVisualizations.timeline}
            autoSelect={autoSelect}
            onChangeVizType={setManualVizType}
          />
        );
      case 'evidence':
        return <EvidenceTab />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Drug Mechanism of Action
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            Mounjaro (Tirzepatide) + Jardiance (Empagliflozin) Combination Therapy
          </p>
          
          {/* Auto-Selection Toggle */}
          <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <div className="flex items-center gap-2 flex-1">
              <Zap className="w-5 h-5 text-blue-600" />
              <label className="text-sm font-medium text-gray-700">
                <input
                  type="checkbox"
                  checked={autoSelect}
                  onChange={(e) => setAutoSelect(e.target.checked)}
                  className="mr-2 rounded"
                />
                <span className="text-blue-900">
                  {autoSelect ? '✓ Smart Visualization Selection' : 'Manual Visualization Selection'}
                </span>
              </label>
            </div>
            <p className="text-xs text-blue-700 max-w-md">
              {autoSelect 
                ? 'Automatically choosing optimal chart type for data characteristics'
                : 'You can manually select visualization types'
              }
            </p>
          </div>
        </header>

        {/* Warning Banner */}
        <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-900">Educational Information</h3>
              <p className="text-sm text-yellow-800 mt-1">
                This tool provides educational information about drug mechanisms. It is not medical advice.
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6 overflow-hidden">
          <div className="flex border-b border-gray-200 overflow-x-auto">
            {['overview', 'mounjaro', 'jardiance', 'combination', 'evidence'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab
                    ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

// ====== VISUALIZATION COMPONENTS ======

/**
 * Overview Tab with Auto-Selected Efficacy Chart
 */
function OverviewTab({ efficacyData, efficacyVizType, autoSelect, onChangeVizType }) {
  const [selectedVizOverride, setSelectedVizOverride] = useState(null);
  const currentViz = selectedVizOverride || efficacyVizType;

  const vizOptions = ['bar', 'grouped-bar', 'line', 'scatter'];

  return (
    <div className="space-y-6">
      {/* Visualization Type Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Efficacy Comparison</h2>
        {autoSelect && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600 font-medium">Auto-selected:</span>
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
              {currentViz.replace('-', ' ')} chart
            </span>
          </div>
        )}
      </div>

      {!autoSelect && (
        <div className="flex gap-2 flex-wrap">
          {vizOptions.map(viz => (
            <button
              key={viz}
              onClick={() => setSelectedVizOverride(viz)}
              className={`px-3 py-2 rounded text-sm font-medium transition ${
                currentViz === viz
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {viz.replace('-', ' ')}
            </button>
          ))}
        </div>
      )}

      {/* Render the Selected Visualization */}
      {VisualizationRenderer.render(efficacyData, currentViz, {
        height: 400,
        title: 'Efficacy Metrics by Treatment'
      })}
    </div>
  );
}

/**
 * Combination Tab with Auto-Selected Timeline Chart
 */
function CombinationTab({ timelineData, timelineVizType, autoSelect, onChangeVizType }) {
  const [selectedVizOverride, setSelectedVizOverride] = useState(null);
  const currentViz = selectedVizOverride || timelineVizType;

  const vizOptions = ['line', 'area', 'composed', 'bar'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Treatment Timeline</h2>
        {autoSelect && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600 font-medium">Auto-selected:</span>
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
              {currentViz.replace('-', ' ')} chart
            </span>
          </div>
        )}
      </div>

      {!autoSelect && (
        <div className="flex gap-2 flex-wrap">
          {vizOptions.map(viz => (
            <button
              key={viz}
              onClick={() => setSelectedVizOverride(viz)}
              className={`px-3 py-2 rounded text-sm font-medium transition ${
                currentViz === viz
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {viz.replace('-', ' ')}
            </button>
          ))}
        </div>
      )}

      {/* Render the Selected Visualization */}
      {VisualizationRenderer.render(timelineData, currentViz, {
        height: 300,
        title: 'A1c Response Over Time'
      })}
    </div>
  );
}

// ====== ACTUAL CHART IMPLEMENTATIONS ======

function BarVisualization({ data, height = 400 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={Object.keys(data[0])[0]} />
        <YAxis />
        <Tooltip />
        <Legend />
        {Object.keys(data[0]).slice(1).map((key, idx) => (
          <Bar key={key} dataKey={key} fill={`hsl(${idx * 60}, 70%, 50%)`} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

function GroupedBarVisualization({ data, height = 400 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={Object.keys(data[0])[0]} />
        <YAxis />
        <Tooltip />
        <Legend />
        {Object.keys(data[0]).slice(1).map((key, idx) => (
          <Bar key={key} dataKey={key} fill={`hsl(${idx * 120}, 70%, 50%)`} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

function LineVisualization({ data, height = 400 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={Object.keys(data[0])[0]} />
        <YAxis />
        <Tooltip />
        <Legend />
        {Object.keys(data[0]).slice(1).map((key, idx) => (
          <Line key={key} type="monotone" dataKey={key} stroke={`hsl(${idx * 120}, 70%, 50%)`} strokeWidth={2} />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

function AreaVisualization({ data, height = 400 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={Object.keys(data[0])[0]} />
        <YAxis />
        <Tooltip />
        <Legend />
        {Object.keys(data[0]).slice(1).map((key, idx) => (
          <Area key={key} type="monotone" dataKey={key} fill={`hsl(${idx * 120}, 70%, 50%)`} stroke={`hsl(${idx * 120}, 70%, 40%)`} />
        ))}
      </ComposedChart>
    </ResponsiveContainer>
  );
}

function ComposedVisualization({ data, height = 400 }) {
  const keys = Object.keys(data[0]).slice(1);
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={Object.keys(data[0])[0]} />
        <YAxis yAxisId="left" />
        <YAxis yAxisId="right" orientation="right" />
        <Tooltip />
        <Legend />
        {keys.map((key, idx) => (
          idx === 0 
            ? <Line key={key} yAxisId="left" type="monotone" dataKey={key} stroke={`hsl(${idx * 120}, 70%, 50%)`} strokeWidth={2} />
            : <Area key={key} yAxisId="right" type="monotone" dataKey={key} fill={`hsl(${idx * 120}, 70%, 50%)`} />
        ))}
      </ComposedChart>
    </ResponsiveContainer>
  );
}

function ScatterVisualization({ data, height = 400 }) {
  const keys = Object.keys(data[0]).slice(1);
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ScatterChart margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={keys[0]} />
        <YAxis dataKey={keys[1]} />
        <Tooltip />
        {data.map((entry, idx) => (
          <Scatter key={idx} name={entry[Object.keys(data[0])[0]]} data={[entry]} fill={`hsl(${idx * 120}, 70%, 50%)`} />
        ))}
      </ScatterChart>
    </ResponsiveContainer>
  );
}

function RadarVisualization({ data, height = 400 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RadarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
        <PolarAxis dataKey={Object.keys(data[0])[0]} />
        <Radar name="Values" dataKey={Object.keys(data[0])[1]} stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
        <Tooltip />
        <Legend />
      </RadarChart>
    </ResponsiveContainer>
  );
}

function PieVisualization({ data, height = 400 }) {
  const nameKey = Object.keys(data[0])[0];
  const valueKey = Object.keys(data[0])[1];
  
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, value }) => `${name}: ${value}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey={valueKey}
        >
          {data.map((entry, idx) => (
            <Cell key={`cell-${idx}`} fill={`hsl(${idx * 360 / data.length}, 70%, 50%)`} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}

function TableVisualization({ data }) {
  if (!Array.isArray(data)) return <p>No data to display</p>;
  
  const keys = Object.keys(data[0]);
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            {keys.map(key => (
              <th key={key} className="border border-gray-300 p-2 text-left font-semibold">
                {key}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              {keys.map(key => (
                <td key={key} className="border border-gray-300 p-2">
                  {row[key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CustomSVGVisualization({ data, title = 'Mechanism Diagram' }) {
  return (
    <div className="bg-gray-50 rounded border p-6">
      <h3 className="font-semibold mb-4">{title}</h3>
      <svg viewBox="0 0 400 250" className="w-full border rounded bg-white">
        <text x="200" y="125" textAnchor="middle" className="text-lg font-bold" fill="#333">
          Custom SVG visualization would render here
        </text>
      </svg>
    </div>
  );
}

// Placeholder components for tabs
function MounjuroTab() {
  return <div className="text-gray-700">Mounjaro detailed information...</div>;
}

function JardianceTab() {
  return <div className="text-gray-700">Jardiance detailed information...</div>;
}

function EvidenceTab() {
  return <div className="text-gray-700">Clinical evidence references...</div>;
}

export { VisualizationSelector, VisualizationRenderer };
