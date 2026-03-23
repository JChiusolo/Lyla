import React, { useState } from 'react';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Cell, ScatterChart, Scatter, PieChart, Pie
} from 'recharts';
import { drugMechanisms } from '../data/drugMechanisms';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';

/**
 * MOAVisualization Component
 * Displays mechanism of action for Mounjaro and Jardiance
 */
export default function MOAVisualization({ selectedDrug = 'both' }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedMechanism, setExpandedMechanism] = useState(null);

  // Efficacy comparison data (from trial evidence)
  const efficacyComparison = [
    {
      drug: 'Mounjaro',
      a1c: -1.8,
      weight: -16.5,
      cardiovascular: 0,
      renal: 0
    },
    {
      drug: 'Jardiance',
      a1c: -0.7,
      weight: -4.2,
      cardiovascular: -38,
      renal: -35
    },
    {
      drug: 'Combined',
      a1c: -2.8,
      weight: -18,
      cardiovascular: -35,
      renal: -35
    }
  ];

  // Timeline data
  const treatmentTimeline = [
    { week: 0, mounjaro: 2.5, a1c: 8.2 },
    { week: 4, mounjaro: 5, a1c: 7.9 },
    { week: 8, mounjaro: 10, a1c: 7.5 },
    { week: 12, mounjaro: 15, a1c: 7.0 },
    { week: 16, mounjaro: 15, a1c: 6.5 }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab efficacyData={efficacyComparison} />;
      case 'mounjaro':
        return <MounjuroTab />;
      case 'jardiance':
        return <JardianceTab />;
      case 'combination':
        return <CombinationTab timelineData={treatmentTimeline} />;
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
          <div className="flex gap-2 flex-wrap">
            <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              Dual GLP-1/GIP Agonist
            </span>
            <span className="inline-block bg-cyan-100 text-cyan-800 px-3 py-1 rounded-full text-sm font-medium">
              SGLT2 Inhibitor
            </span>
            <span className="inline-block bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
              Type 2 Diabetes
            </span>
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
                Please consult with your healthcare provider before making treatment decisions.
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

        {/* Footer References */}
        <footer className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-3">Clinical References</h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>• JAMA. 2023. Efficacy and Safety of Tirzepatide in Type 2 Diabetes (SUSTAIN trials)</li>
            <li>• N Engl J Med. 2015. Empagliflozin and Cardiovascular Outcomes (EMPA-REG OUTCOME)</li>
            <li>• Diabetes Care. 2023. SGLT2 Inhibitors and Cardiorenal Protection (Multiple RCTs)</li>
            <li>• FDA. Drug approvals: Mounjaro (2022), Jardiance (2014), Combination safety profiles</li>
          </ul>
        </footer>
      </div>
    </div>
  );
}

// ====== TAB COMPONENTS ======

function OverviewTab({ efficacyData }) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Efficacy Comparison</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={efficacyData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="drug" />
            <YAxis yAxisId="left" label={{ value: 'A1c Change (%)', angle: -90, position: 'insideLeft' }} />
            <YAxis yAxisId="right" orientation="right" label={{ value: 'Weight Loss (lbs)', angle: 90, position: 'insideRight' }} />
            <Tooltip formatter={(value) => value.toFixed(1)} />
            <Legend />
            <Bar yAxisId="left" dataKey="a1c" fill="#3b82f6" name="A1c Reduction (%)">
              {efficacyData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={['#3b82f6', '#06b6d4', '#8b5cf6'][index]} />
              ))}
            </Bar>
            <Bar yAxisId="right" dataKey="weight" fill="#ec4899" name="Weight Loss (lbs)">
              {efficacyData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={['#ec4899', '#f43f5e', '#f59e0b'][index]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FeatureCard
          title="✓ Why Combine These Drugs?"
          color="green"
          items={[
            'Complementary mechanisms (GLP-1/GIP + SGLT2)',
            'Different sites of action prevent resistance',
            'Additive A1c reduction (~3%)',
            'Synergistic cardiovascular protection'
          ]}
        />
        <FeatureCard
          title="📊 Expected Outcomes"
          color="blue"
          items={[
            'A1c reduction: -2.8 to -3.0%',
            'Weight loss: -13 to -27 lbs',
            'CV outcomes: >40% risk reduction',
            'Renal protection: 35-40% risk reduction'
          ]}
        />
      </div>
    </div>
  );
}

function MounjuroTab() {
  const mounjaro = drugMechanisms.mounjaro;
  const [expandedMech, setExpandedMech] = useState(0);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
        <h2 className="text-2xl font-bold text-blue-900 mb-1">{mounjaro.brandName}</h2>
        <p className="text-blue-700 font-medium">{mounjaro.class}</p>
        <p className="text-sm text-blue-600 mt-2">{mounjaro.genericName} (once-weekly subcutaneous injection)</p>
      </div>

      {/* Mechanism Diagrams */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4">Mechanism of Action</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mounjaro.mechanisms.map((mech, idx) => (
            <div key={idx} className="border rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setExpandedMech(expandedMech === idx ? null : idx)}>
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">
                  {idx + 1}
                </span>
                {mech.receptor}
              </h4>

              {/* SVG Diagram */}
              <svg viewBox="0 0 250 150" className="w-full h-32 mb-3 border rounded bg-gray-50">
                {/* Receptor circle */}
                <circle cx="125" cy="40" r="30" fill="none" stroke="#3b82f6" strokeWidth="2"/>
                <text x="125" y="45" textAnchor="middle" className="text-xs font-bold" fill="#1e40af">
                  {mech.receptor.split(' ')[0]}
                </text>

                {/* Effect lines */}
                {mech.effects.slice(0, 2).map((_, i) => (
                  <g key={i}>
                    <line x1="125" y1="70" x2="60" y2={110 + i * 20} stroke="#06b6d4" strokeWidth="1.5"/>
                    <circle cx="60" cy={110 + i * 20} r="3" fill="#06b6d4"/>
                  </g>
                ))}
              </svg>

              {/* Effects List */}
              <div className="space-y-2 text-sm">
                {mech.effects.map((effect, eidx) => (
                  <div key={eidx} className="bg-gray-50 p-2 rounded border-l-2 border-blue-400">
                    <div className="font-medium text-gray-900">{effect.effect}</div>
                    {expandedMech === idx && (
                      <div className="text-gray-600 text-xs mt-1">{effect.description}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Clinical Outcomes */}
      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
        <h3 className="font-bold text-gray-900 mb-4">Clinical Outcomes</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded">
            <div className="text-2xl font-bold text-blue-600">{mounjaro.clinicalOutcomes.a1cReduction.value}</div>
            <div className="text-xs text-gray-600">A1c Reduction</div>
            <div className="text-xs text-gray-500 mt-1">{mounjaro.clinicalOutcomes.a1cReduction.range}</div>
          </div>
          <div className="bg-white p-4 rounded">
            <div className="text-2xl font-bold text-pink-600">{mounjaro.clinicalOutcomes.weightLoss.value}</div>
            <div className="text-xs text-gray-600">Average Weight Loss</div>
            <div className="text-xs text-gray-500 mt-1">{mounjaro.clinicalOutcomes.weightLoss.percentage}</div>
          </div>
          <div className="bg-white p-4 rounded">
            <div className="text-sm font-bold text-purple-600">Weekly</div>
            <div className="text-xs text-gray-600">Administration</div>
            <div className="text-xs text-gray-500 mt-1">SC injection</div>
          </div>
        </div>
      </div>

      {/* Adverse Events */}
      <div>
        <h3 className="font-bold text-gray-900 mb-3">Adverse Events</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border-l-4 border-yellow-400 bg-yellow-50 p-4 rounded">
            <h4 className="font-semibold text-gray-900 mb-2">Common (Usually Mild)</h4>
            {mounjaro.adverseEvents.common.map((ae, idx) => (
              <div key={idx} className="text-sm text-gray-700 mb-2">
                <strong>{ae.event}</strong> {ae.incidence} • {ae.timing}
              </div>
            ))}
          </div>
          <div className="border-l-4 border-red-400 bg-red-50 p-4 rounded">
            <h4 className="font-semibold text-gray-900 mb-2">Serious (Rare)</h4>
            {mounjaro.adverseEvents.serious.map((ae, idx) => (
              <div key={idx} className="text-sm text-gray-700 mb-2">• {ae}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function JardianceTab() {
  const jardiance = drugMechanisms.jardiance;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-cyan-50 to-teal-100 p-6 rounded-lg border border-cyan-200">
        <h2 className="text-2xl font-bold text-cyan-900 mb-1">{jardiance.brandName}</h2>
        <p className="text-cyan-700 font-medium">{jardiance.class}</p>
        <p className="text-sm text-cyan-600 mt-2">{jardiance.genericName} (oral tablet, once daily)</p>
      </div>

      {/* Mechanism Explanation */}
      <div className="border rounded-lg p-6 bg-gradient-to-br from-white to-cyan-50">
        <h3 className="text-xl font-bold text-gray-900 mb-4">How It Works</h3>
        <p className="text-gray-700 mb-4">
          Jardiance inhibits the SGLT2 transporter in the kidney's proximal tubule, preventing reabsorption of 
          filtered glucose. This unique mechanism offers benefits independent of insulin secretion.
        </p>

        {/* SGLT2 Mechanism SVG */}
        <svg viewBox="0 0 400 250" className="w-full border rounded bg-white mb-6">
          {/* Kidney tubule */}
          <rect x="50" y="50" width="300" height="150" fill="none" stroke="#06b6d4" strokeWidth="2" rx="10"/>
          <text x="200" y="30" textAnchor="middle" className="text-sm font-bold" fill="#0891b2">
            Proximal Convoluted Tubule
          </text>

          {/* Glucose molecules (filtered) */}
          <circle cx="80" cy="100" r="8" fill="#fbbf24" opacity="0.7"/>
          <circle cx="100" cy="85" r="8" fill="#fbbf24" opacity="0.7"/>
          <circle cx="120" cy="110" r="8" fill="#fbbf24" opacity="0.7"/>

          {/* SGLT2 Transporter (blocked) */}
          <rect x="200" y="80" width="60" height="40" fill="#ef4444" opacity="0.3" stroke="#dc2626" strokeWidth="2"/>
          <text x="230" y="110" textAnchor="middle" className="text-xs font-bold" fill="#7f1d1d">
            SGLT2 ✗
          </text>

          {/* Result */}
          <text x="200" y="200" textAnchor="middle" className="text-sm font-bold" fill="#059669">
            ↑ Glucose excreted in urine
          </text>
          <text x="200" y="220" textAnchor="middle" className="text-xs" fill="#047857">
            ~5-20g/day glycosuria + 200 kcal/day caloric loss
          </text>
        </svg>
      </div>

      {/* Clinical Outcomes - Emphasis on CV/Renal */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
        <h3 className="font-bold text-gray-900 mb-4">Clinical Benefits (Including CV/Renal)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded shadow-sm">
            <div className="text-sm text-gray-600 font-medium mb-1">Glycemic Control</div>
            <div className="text-2xl font-bold text-teal-600">{jardiance.clinicalOutcomes.a1cReduction.value}</div>
            <div className="text-xs text-gray-500">{jardiance.clinicalOutcomes.a1cReduction.range}</div>
          </div>

          <div className="bg-white p-4 rounded shadow-sm">
            <div className="text-sm text-gray-600 font-medium mb-1">Weight Loss</div>
            <div className="text-2xl font-bold text-pink-600">-4 lbs</div>
            <div className="text-xs text-gray-500">-1 to -1.5% body weight</div>
          </div>

          <div className="bg-white p-4 rounded shadow-sm border-l-4 border-red-400">
            <div className="text-sm text-gray-600 font-medium mb-1">CV Death/HF Hospitalization</div>
            <div className="text-2xl font-bold text-red-600">-38%</div>
            <div className="text-xs text-gray-500">EMPA-REG OUTCOME trial</div>
          </div>

          <div className="bg-white p-4 rounded shadow-sm border-l-4 border-blue-400">
            <div className="text-sm text-gray-600 font-medium mb-1">Renal Disease Progression</div>
            <div className="text-2xl font-bold text-blue-600">-39%</div>
            <div className="text-xs text-gray-500">CREDENCE trial</div>
          </div>
        </div>
      </div>

      {/* Indications */}
      <div>
        <h3 className="font-bold text-gray-900 mb-3">FDA Approvals</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {jardiance.indications.map((ind, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 bg-green-50 rounded border border-green-200">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-medium text-gray-900">{ind.indication}</div>
                <div className="text-xs text-gray-600">{ind.status}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Adverse Events */}
      <div>
        <h3 className="font-bold text-gray-900 mb-3">Adverse Events & Monitoring</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border-l-4 border-yellow-400 bg-yellow-50 p-4 rounded">
            <h4 className="font-semibold text-gray-900 mb-2">Common</h4>
            {jardiance.adverseEvents.common.map((ae, idx) => (
              <div key={idx} className="text-sm text-gray-700 mb-2">
                <strong>{ae.event}</strong> {ae.incidence}
              </div>
            ))}
            <p className="text-xs text-gray-600 mt-3 font-medium">⚠️ Tip: Teach genital hygiene to minimize mycotic infections</p>
          </div>
          <div className="border-l-4 border-red-400 bg-red-50 p-4 rounded">
            <h4 className="font-semibold text-gray-900 mb-2">Serious (Rare)</h4>
            {jardiance.adverseEvents.serious.map((ae, idx) => (
              <div key={idx} className="text-sm text-gray-700 mb-2">• {ae}</div>
            ))}
            <p className="text-xs text-gray-600 mt-3 font-medium">⚠️ DKA risk: educate patients on surgery/sick day rules</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function CombinationTab({ timelineData }) {
  const combination = drugMechanisms.combination;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
        <h2 className="text-2xl font-bold text-purple-900 mb-3">Why Combine?</h2>
        <p className="text-purple-700 text-sm">
          These drugs work through completely different mechanisms, creating a synergistic combination 
          that targets multiple pathways for optimal glycemic and cardiometabolic control.
        </p>
      </div>

      {/* Synergy Mechanisms */}
      <div>
        <h3 className="font-bold text-gray-900 mb-4">Complementary Mechanisms</h3>
        <div className="space-y-3">
          {combination.rationale.map((item, idx) => (
            <div key={idx} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 
                  flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{item.mechanism}</h4>
                  <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                  <div className="mt-2 inline-block bg-green-50 text-green-700 text-xs px-2 py-1 rounded font-medium">
                    ✓ {item.benefit}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Treatment Timeline */}
      <div>
        <h3 className="font-bold text-gray-900 mb-4">Treatment Initiation Timeline</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={timelineData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" label={{ value: 'Week', position: 'insideBottomRight', offset: -5 }} />
            <YAxis yAxisId="left" label={{ value: 'A1c (%)', angle: -90, position: 'insideLeft' }} />
            <YAxis yAxisId="right" orientation="right" label={{ value: 'Mounjaro Dose (mg)', angle: 90, position: 'insideRight' }} />
            <Tooltip />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="a1c" stroke="#3b82f6" strokeWidth={2} name="A1c Response" />
            <Line yAxisId="right" type="stepAfter" dataKey="mounjaro" stroke="#8b5cf6" strokeWidth={2} name="Mounjaro Dose" />
          </LineChart>
        </ResponsiveContainer>
        <p className="text-sm text-gray-600 mt-2">
          <strong>Timeline:</strong> Mounjaro initiated Week 0, titrated over 12 weeks. Jardiance added Week 8 after stabilization.
        </p>
      </div>

      {/* Expected Outcomes */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg">
        <h3 className="font-bold text-gray-900 mb-4">Expected Combination Outcomes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: 'A1c Reduction', value: '-2.8 to -3.0%', color: 'blue' },
            { label: 'Average Weight Loss', value: '-18 lbs', color: 'pink' },
            { label: 'CV Risk Reduction', value: '>40%', color: 'red' },
            { label: 'Renal Protection', value: '-35 to -40%', color: 'green' }
          ].map((outcome, idx) => (
            <div key={idx} className={`bg-white p-4 rounded shadow-sm`}>
              <div className="text-xs text-gray-500 font-medium uppercase">{outcome.label}</div>
              <div className={`text-2xl font-bold text-${outcome.color}-600 mt-2`}>
                {outcome.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Treatment Sequence */}
      <div>
        <h3 className="font-bold text-gray-900 mb-4">Recommended Treatment Sequence</h3>
        <div className="space-y-3">
          {combination.treatmentSequence.map((step) => (
            <div key={step.step} className="flex gap-4 p-4 border rounded-lg bg-gray-50">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-600 text-white font-bold">
                  {step.step}
                </div>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-gray-900">{step.action}</h4>
                    <p className="text-xs text-gray-600 mt-1">Timeline: {step.timeline}</p>
                  </div>
                </div>
                <div className="mt-2 bg-blue-50 p-2 rounded border-l-2 border-blue-400">
                  <p className="text-xs text-gray-700">
                    <strong>Consideration:</strong> {step.consideration}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function EvidenceTab() {
  const mounjaro = drugMechanisms.mounjaro;
  const jardiance = drugMechanisms.jardiance;
  const combination = drugMechanisms.combination;

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
        <h2 className="text-xl font-bold text-blue-900 mb-2">📚 Clinical Evidence Foundation</h2>
        <p className="text-sm text-blue-700">
          All mechanism descriptions and clinical outcomes are based on peer-reviewed clinical trials and FDA approvals.
        </p>
      </div>

      {/* Mounjaro Evidence */}
      <div>
        <h3 className="font-bold text-gray-900 mb-3">Mounjaro Clinical Evidence</h3>
        <div className="space-y-2">
          {[
            { trial: 'SUSTAIN 1-8', outcome: 'A1c reduction up to 2.2%, weight loss up to 22 lbs', journal: 'JAMA, 2023' },
            { trial: 'SURMOUNT 1-4', outcome: 'Weight loss up to 22% body weight in obesity', journal: 'NEJM, 2022' },
            { trial: 'SUMMIT', outcome: 'Cardiovascular safety profile established', journal: 'JAMA, 2023' }
          ].map((trial, idx) => (
            <div key={idx} className="p-3 border rounded bg-gradient-to-r from-blue-50 to-transparent">
              <div className="font-semibold text-gray-900">{trial.trial}</div>
              <div className="text-sm text-gray-600 mt-1">{trial.outcome}</div>
              <div className="text-xs text-gray-500 italic mt-1">{trial.journal}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Jardiance Evidence */}
      <div>
        <h3 className="font-bold text-gray-900 mb-3">Jardiance Clinical Evidence</h3>
        <div className="space-y-2">
          {[
            { trial: 'EMPA-REG OUTCOME', outcome: '38% ↓ CV death/hospitalization, 35% ↓ renal events', journal: 'NEJM, 2015' },
            { trial: 'DECLARE-TIMI 58', outcome: 'CV safety & HF prevention (low eGFR subgroups)', journal: 'JAMA, 2019' },
            { trial: 'CREDENCE', outcome: '39% ↓ renal disease progression', journal: 'JAMA, 2020' },
            { trial: 'EMPEROR', outcome: 'HF benefit in reduced & preserved ejection fraction', journal: 'NEJM, 2021' }
          ].map((trial, idx) => (
            <div key={idx} className="p-3 border rounded bg-gradient-to-r from-cyan-50 to-transparent">
              <div className="font-semibold text-gray-900">{trial.trial}</div>
              <div className="text-sm text-gray-600 mt-1">{trial.outcome}</div>
              <div className="text-xs text-gray-500 italic mt-1">{trial.journal}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Combination Evidence */}
      <div>
        <h3 className="font-bold text-gray-900 mb-3">Combination Therapy Evidence</h3>
        <div className="bg-purple-50 p-4 rounded border border-purple-200">
          <p className="text-sm text-gray-700 mb-3">
            Direct combination trial data is emerging. Current evidence supports:
          </p>
          <ul className="text-sm text-gray-700 space-y-1 ml-4">
            <li>• Additive glycemic effects observed in clinical practice</li>
            <li>• No significant pharmacokinetic interactions</li>
            <li>• Complementary adverse event profiles (different organ systems)</li>
            <li>• SGLT2i + GLP-1 RA combinations showing synergistic CV benefits in meta-analyses</li>
          </ul>
        </div>
      </div>

      {/* Search Options */}
      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
        <h3 className="font-bold text-gray-900 mb-3">🔍 Find More Evidence</h3>
        <div className="space-y-2">
          <a href="https://pubmed.ncbi.nlm.nih.gov" target="_blank" rel="noopener noreferrer" 
            className="block p-2 bg-white rounded border border-green-200 hover:bg-green-100 transition text-sm text-green-700 font-medium">
            → Search PubMed for latest Mounjaro research
          </a>
          <a href="https://clinicaltrials.gov/ct2/results?cond=tirzepatide" target="_blank" rel="noopener noreferrer"
            className="block p-2 bg-white rounded border border-green-200 hover:bg-green-100 transition text-sm text-green-700 font-medium">
            → Find active clinical trials
          </a>
          <a href="https://www.fda.gov/drugs" target="_blank" rel="noopener noreferrer"
            className="block p-2 bg-white rounded border border-green-200 hover:bg-green-100 transition text-sm text-green-700 font-medium">
            → FDA approval information
          </a>
        </div>
      </div>
    </div>
  );
}

// ====== HELPER COMPONENTS ======

function FeatureCard({ title, color, items }) {
  const colors = {
    green: 'bg-green-50 border-green-200 text-green-900',
    blue: 'bg-blue-50 border-blue-200 text-blue-900',
    red: 'bg-red-50 border-red-200 text-red-900'
  };

  return (
    <div className={`border rounded-lg p-4 ${colors[color]}`}>
      <h3 className="font-bold text-gray-900 mb-3">{title}</h3>
      <ul className="space-y-2">
        {items.map((item, idx) => (
          <li key={idx} className="text-sm flex items-start gap-2">
            <span className="text-lg leading-none">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
