import { useState, useCallback } from 'react'
import axios from 'axios'

/**
 * Normalize a single source's result value to always be an array.
 */
function normalizeSourceResults(value) {
  if (!value) return []
  if (Array.isArray(value)) return value
  if (Array.isArray(value.hits))     return value.hits
  if (Array.isArray(value.results))  return value.results
  if (Array.isArray(value.articles)) return value.articles
  if (Array.isArray(value.studies))  return value.studies
  if (typeof value === 'object')     return [value]
  return []
}

/**
 * Normalize the full results map:
 *  - coerce every value to an array
 *  - remap camelCase keys from the API to the snake_case keys the UI expects
 */
function normalizeResults(raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {}

  const KEY_MAP = {
    clinicalTrials:  'clinical_trials',
    clinical_trials: 'clinical_trials',
    pubmed:          'pubmed',
  }

  return Object.fromEntries(
    Object.entries(raw).map(([source, value]) => [
      KEY_MAP[source] ?? source,
      normalizeSourceResults(value),
    ])
  )
}

export default function useSearch() {
  const [results, setResults] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [summary, setSummary] = useState(null)

  const search = useCallback(async (query, filters) => {
    setLoading(true)
    setError(null)
    setResults({})
    setSummary(null)

    try {
      const response = await axios.post('/api/search', {
        question: query,
        filters,
      })
      const data = response.data
      setResults(normalizeResults(data?.results))
      setSummary(data?.summary ?? null)
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Search failed')
      setResults({})
    } finally {
      setLoading(false)
    }
  }, [])

  return { results, loading, error, search, summary }
}
