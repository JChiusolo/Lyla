import React from 'react'
import { Filter } from 'lucide-react'

export default function SearchFilters({ filters, onFilterChange }) {
  return (
    <div className="card p-6 h-fit sticky top-20">
      <div className="flex items-center gap-2 mb-6">
        <Filter className="w-5 h-5 text-primary-600" />
        <h3 className="font-bold text-neutral-900">Filters</h3>
      </div>

      <div className="mb-8">
        <h4 className="text-sm font-semibold text-neutral-900 mb-3">Research Sources</h4>
        <div className="space-y-2">
          {['pubmed', 'clinicalTrials'].map(source => (
            <label key={source} className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={filters.sources.includes(source)}
                onChange={() => {
                  const newSources = filters.sources.includes(source)
                    ? filters.sources.filter(s => s !== source)
                    : [...filters.sources, source]
                  onFilterChange({ ...filters, sources: newSources })
                }}
                className="rounded"
              />
              <span className="ml-3 text-sm text-neutral-700">
                {source === 'pubmed' ? '🔬 PubMed' : '⚕️ Clinical Trials'}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-neutral-900 mb-3">Results Per Source</label>
        <select
          value={filters.maxResults}
          onChange={(e) => onFilterChange({ ...filters, maxResults: parseInt(e.target.value) })}
          className="input text-sm"
        >
          <option value="5">5 results</option>
          <option value="10">10 results</option>
          <option value="20">20 results</option>
        </select>
      </div>
    </div>
  )
}
