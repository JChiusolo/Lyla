import React, { useState } from 'react'
import { Search, Loader } from 'lucide-react'
import SearchFilters from '../components/SearchFilters'
import ResultsList from '../components/ResultsList'
import SummaryPanel from '../components/SummaryPanel'
import useSearch from '../hooks/useSearch'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState({ sources: ['pubmed', 'clinicalTrials'], maxResults: 10 })
  const { results, summary, loading, error, search } = useSearch()

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) search(query, filters)
  }

  const hasResults = Object.keys(results).length > 0

  return (
    <div className="container-max py-8">
      <h1 className="text-4xl font-bold text-neutral-900 mb-8">Medical Information Search</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <SearchFilters filters={filters} onFilterChange={setFilters} />
        </div>

        <div className="lg:col-span-3">
          <form onSubmit={handleSearch} className="mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search research..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="input text-lg"
                autoFocus
              />
              <button type="submit" disabled={loading} className="absolute right-2 top-1/2 -translate-y-1/2">
                {loading ? <Loader className="w-6 h-6 animate-spin" /> : <Search className="w-6 h-6 text-primary-600" />}
              </button>
            </div>
          </form>

          {error && (
            <div className="card p-4 bg-red-50 border-red-2
