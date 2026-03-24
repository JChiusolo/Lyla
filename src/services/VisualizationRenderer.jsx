import React from 'react';
import { StackedBarChart } from '../components/Visualizations/StackedBarChart';

/**
 * Fallback simple visualizations used when Recharts is unavailable
 */
function BarVisualization({ data, ...options }) {
  if (!Array.isArray(data) || data.length === 0) {
    return <div className="text-gray-500 p-4">No data to display</div>;
  }
  const keys = Object.keys(data[0]).slice(1);
  const maxValue = Math.max(...data.flatMap((d) => keys.map((k) => Math.abs(d[k] || 0))));
  const colors = ['#3b82f6', '#06b6d4', '#8b5cf6', '#10b981', '#f59e0b'];
  return (
    <div className="w-full p-6 bg-white rounded-lg border border-gray-200">
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '20px', height: '300px', padding: '20px 0' }}>
        {data.map((item, idx) => (
          <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full">
            {keys.map((key, kidx) => {
              const value = item[key] || 0;
              const pct = (Math.abs(value) / maxValue) * 100;
              return (
                <div
                  key={key}
                  style={{ width: '40px', height: `${pct * 2}px`, backgroundColor: colors[kidx % colors.length], margin: '0 2px', borderRadius: '4px 4px 0 0' }}
                  title={`${key}: ${value}`}
                />
              );
            })}
            <div className="text-xs text-gray-600 mt-2 text-center">{item[Object.keys(data[0])[0]]}</div>
          </div>
        ))}
      </div>
      <div className="flex gap-4 justify-center mt-4 flex-wrap">
        {keys.map((key, idx) => (
          <div key={key} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: colors[idx % colors.length] }} />
            <span className="text-xs text-gray-600">{key}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function GroupedBarVisualization({ data, ...options }) {
  return <BarVisualization data={data} {...options} />;
}

function LineVisualization({ data, height = 300 }) {
  if (!Array.isArray(data) || data.length === 0) return <div className="text-gray-500 p-4">No data</div>;
  const keys = Object.keys(data[0]).slice(1);
  const colors = ['#3b82f6', '#8b5cf6', '#10b981'];
  return (
    <div className="w-full p-6 bg-white rounded-lg border border-gray-200">
      <svg width="100%" height={height} style={{ border: '1px solid #e5e7eb' }}>
        {keys.map((key, kidx) => {
          const values = data.map((d) => d[key] || 0);
          const min = Math.min(...values);
          const max = Math.max(...values);
          const range = max - min || 1;
          const points = data
            .map((item, i) => {
              const x = (i / (data.length - 1 || 1)) * 100;
              const y = 100 - ((item[key] - min) / range) * 80 - 10;
              return `${x}%,${y}%`;
            })
            .join(' ');
          return <polyline key={key} points={points} fill="none" stroke={colors[kidx % colors.length]} strokeWidth="2" vectorEffect="non-scaling-stroke" />;
        })}
      </svg>
      <div className="flex gap-4 justify-center mt-4 flex-wrap">
        {keys.map((key, idx) => (
          <div key={key} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: colors[idx % colors.length] }} />
            <span className="text-xs text-gray-600">{key}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AreaVisualization({ data, ...options }) {
  return <LineVisualization data={data} {...options} />;
}

function ComposedVisualization({ data, ...options }) {
  return <LineVisualization data={data} {...options} />;
}

function ScatterVisualization({ data }) {
  return <div className="p-4 text-gray-500">Scatter chart — {data?.length ?? 0} points</div>;
}

function RadarVisualization({ data }) {
  return <div className="p-4 text-gray-500">Radar chart — {data?.length ?? 0} series</div>;
}

function PieVisualization({ data }) {
  return <div className="p-4 text-gray-500">Pie chart — {data?.length ?? 0} slices</div>;
}

function CustomSVGVisualization({ data }) {
  return <div className="p-4 text-gray-500">Custom visualization</div>;
}

function TableVisualization({ data }) {
  if (!Array.isArray(data) || data.length === 0) return <div className="p-4 text-gray-500">No data</div>;
  const keys = Object.keys(data[0]);
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left border border-gray-200">
        <thead className="bg-gray-50">
          <tr>{keys.map((k) => <th key={k} className="px-4 py-2 font-medium text-gray-700 border-b">{k}</th>)}</tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="border-b hover:bg-gray-50">
              {keys.map((k) => <td key={k} className="px-4 py-2 text-gray-600">{String(row[k] ?? '')}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * VISUALIZATION RENDERER
 * Renders the selected visualization type
 */
class VisualizationRenderer {
  static render(data, vizType, options = {}) {
    switch (vizType) {
      case 'stacked-bar':   return <StackedBarChart data={data} {...options} />;
      case 'bar':           return <BarVisualization data={data} {...options} />;
      case 'grouped-bar':   return <GroupedBarVisualization data={data} {...options} />;
      case 'line':          return <LineVisualization data={data} {...options} />;
      case 'area':          return <AreaVisualization data={data} {...options} />;
      case 'composed':      return <ComposedVisualization data={data} {...options} />;
      case 'scatter':       return <ScatterVisualization data={data} {...options} />;
      case 'radar':         return <RadarVisualization data={data} {...options} />;
      case 'pie':           return <PieVisualization data={data} {...options} />;
      case 'custom-svg':    return <CustomSVGVisualization data={data} {...options} />;
      case 'table':
      default:              return <TableVisualization data={data} {...options} />;
    }
  }
}

export { VisualizationRenderer };
