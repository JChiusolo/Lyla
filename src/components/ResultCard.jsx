import React, { useState } from 'react'
import { ExternalLink, ChevronDown, Calendar, Users } from 'lucide-react'

export default function ResultCard({ article, source }) {
  const [expanded, setExpanded] = useState(false)

  const badgeColor = source === 'pubmed' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'

  return (
    <div className="card hover:shadow-md">
      <div className="p-5">
        <div className="flex justify-between items-start gap-3 mb-3">
          <h3 className="text-lg font-semibold text-neutral-900">{article.title}</h3>
          <span className={`badge ${badgeColor}`}>{source === 'pubmed' ? 'PubMed' : 'Trial'}</span>
        </div>

        {article.abstract && <p className="text-sm text-neutral-600 mb-4 line-clamp-2">{article.abstract}</p>}

        <div className="space-y-1 mb-4 text-sm text-neutral-600">
          {source === 'pubmed' && article.authors?.length > 0 && (
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>{article.authors.slice(0, 2).map(a => `${a.firstName} ${a.lastName}`).join(', ')}</span>
            </div>
          )}
          {article.publicationDate && (
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{new Date(article.publicationDate).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        {article.abstract && (
          <button onClick={() => setExpanded(!expanded)} className="text-primary-600 text-sm font-medium flex items-center gap-1">
            {expanded ? 'Less' : 'More'} <ChevronDown className={`w-4 h-4 ${expanded ? 'rotate-180' : ''}`} />
          </button>
        )}
      </div>

      {expanded && article.abstract && (
        <div className="border-t border-neutral-200 p-5 bg-neutral-50">
          <p className="text-sm text-neutral-700">{article.abstract}</p>
        </div>
      )}

      <div className="border-t border-neutral-200 px-5 py-3 bg-neutral-50 flex justify-between items-center">
        <span className="text-xs text-neutral-500">{source === 'pubmed' ? `PMID: ${article.pmid}` : `NCT: ${article.id}`}</span>
        <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-primary-600 text-sm flex items-center gap-1">
          View <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  )
}
