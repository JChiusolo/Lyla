import { useState } from "react";
import { searchMedicalQuestion } from "../services/searchService";

export default function SearchInterface() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setError(null);
    setResults(null);
    try {
      const data = await searchMedicalQuestion(question);
      setResults(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Lyla Medical Search</h1>

      <div className="flex gap-2 mb-4">
        <input
          className="flex-1 border rounded px-4 py-2"
          placeholder="e.g. Can fibrin glue be used on the brain?"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button
          className="bg-blue-600 text-white px-6 py-2 rounded disabled:opacity-50"
          onClick={handleSearch}
          disabled={loading}
        >
          {loading ? "Searching…" : "Search"}
        </button>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {results && (
        <div className="space-y-6">
          {/* AI Summary */}
          <div className="bg-blue-50 border border-blue-200 rounded p-4">
            <h2 className="font-semibold text-blue-800 mb-2">AI Summary</h2>
            <p className="text-sm text-blue-900">{results.summary}</p>
          </div>

          {/* Search terms transparency */}
          <details className="text-xs text-gray-500">
            <summary className="cursor-pointer">Search terms used</summary>
            <pre className="mt-2 bg-gray-100 p-2 rounded overflow-auto">
              {JSON.stringify(results.searchTerms, null, 2)}
            </pre>
          </details>

          {/* PubMed Results */}
          <section>
            <h2 className="font-semibold text-lg mb-2">
              PubMed ({results.results.pubmed.length} articles)
            </h2>
            {results.results.pubmed.map((r) => (
              <div key={r.id} className="border rounded p-3 mb-2">
                <a href={r.url} target="_blank" rel="noreferrer" className="font-medium text-blue-700 hover:underline">
                  {r.title}
                </a>
                <p className="text-sm text-gray-500 mt-1">
                  {r.authors.join(", ")} · {r.journal} · {r.pubDate}
                </p>
              </div>
            ))}
          </section>

          {/* ClinicalTrials Results */}
          <section>
            <h2 className="font-semibold text-lg mb-2">
              ClinicalTrials.gov ({results.results.clinicalTrials.length} studies)
            </h2>
            {results.results.clinicalTrials.map((r) => (
              <div key={r.id} className="border rounded p-3 mb-2">
                <a href={r.url} target="_blank" rel="noreferrer" className="font-medium text-blue-700 hover:underline">
                  {r.title}
                </a>
                <p className="text-sm text-gray-500 mt-1">
                  Status: <span className="font-medium">{r.status}</span> · {r.startDate}
                </p>
                {r.summary && <p className="text-sm text-gray-700 mt-1">{r.summary}…</p>}
              </div>
            ))}
          </section>
        </div>
      )}
    </div>
  );
}
