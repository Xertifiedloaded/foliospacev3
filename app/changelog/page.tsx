'use client'
import React, { useEffect, useState } from "react";
import { Search, Download, Copy, Calendar, Tag, GitCommit, CheckCircle } from "lucide-react";

export default function ChangelogViewer() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    fetch("/api/changelog")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((json) => {
        if (!mounted) return;
        if (Array.isArray(json)) setData({ changes: json });
        else if (json.changes) setData(json);
        else if (json.updates) setData({ changes: json.updates });
        else setData({ changes: [] });
      })
      .catch((e) => setError(e.message))
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, []);

  function filteredChanges() {
    if (!data) return [];
    const q = query.trim().toLowerCase();
    if (!q) return [...data.changes].reverse();
    return [...data.changes]
      .filter((c) => {
        const text = `${c.version ?? ""}
${c.message ?? c.changes?.join(" ") ?? ""}`.toLowerCase();
        return text.includes(q);
      })
      .reverse();
  }

  function downloadJSON() {
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "CHANGELOG.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function copyToClipboard(entry, idx) {
    navigator.clipboard?.writeText(JSON.stringify(entry, null, 2));
    setCopiedId(idx);
    setTimeout(() => setCopiedId(null), 2000);
  }

  function formatDate(dateString) {
    if (!dateString) return "No date";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }

  const changes = filteredChanges();

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 border-b border-gray-800 pb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 bg-blue-600 rounded-lg shadow-lg shadow-blue-500/20">
              <GitCommit className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Changelog</h1>
              <p className="text-gray-400 text-sm mt-1">Track all updates and changes to your project</p>
            </div>
          </div>
        </div>

        <div className="mb-8 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              aria-label="Search changelog"
              className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
              placeholder="Search by version or message..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <button
            onClick={downloadJSON}
            disabled={!data}
            className="px-5 py-3 bg-gray-900 hover:bg-gray-800 border border-gray-800 text-white rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            Export JSON
          </button>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="relative">
              <div className="w-12 h-12 rounded-full border-4 border-gray-800 border-t-blue-600 animate-spin"></div>
            </div>
          </div>
        )}


        {error && (
          <div className="bg-red-950 border border-red-800 rounded-lg p-4 text-red-400">
            <p className="font-medium">Error loading changelog</p>
            <p className="text-sm mt-1 text-red-300">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="relative">
            {changes.length > 0 && (
              <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-linear-to-b from-blue-600 via-blue-500 to-transparent"></div>
            )}
            
            <div className="space-y-6 relative">
              {changes.length === 0 && (
                <div className="text-center py-20">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-900 mb-4">
                    <GitCommit className="w-8 h-8 text-gray-700" />
                  </div>
                  <p className="text-gray-400">
                    {query ? "No matching entries found" : "No changelog entries yet"}
                  </p>
                </div>
              )}

              {changes.map((entry, idx) => {
                const version = entry.version ?? `v${idx + 1}`;
                const messages = entry.message ? [entry.message] : entry.changes ? entry.changes : [];

                return (
                  <div
                    key={`${version}-${idx}`}
                    className="group relative pl-12"
                  >
                    <div className="absolute left-0 top-2 w-6 h-6 bg-blue-600 rounded-full border-4 border-black flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/30">
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                    
                    <div className="bg-gray-900 border border-gray-800 rounded-lg p-5 hover:border-gray-700 transition-all">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-950 border border-blue-800 rounded-md text-blue-400 font-mono text-sm font-semibold">
                            <Tag className="w-3.5 h-3.5" />
                            {version}
                          </span>
                          <span className="inline-flex items-center gap-1.5 text-sm text-gray-500">
                            <Calendar className="w-3.5 h-3.5" />
                            {formatDate(entry.date)}
                          </span>
                        </div>
                        
                        <button
                          onClick={() => copyToClipboard(entry, idx)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-md transition-all"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          {copiedId === idx ? "Copied!" : "Copy"}
                        </button>
                      </div>

                      <div className="space-y-2">
                        {messages.length === 0 ? (
                          <p className="text-gray-600 text-sm italic">No message available</p>
                        ) : (
                          messages.map((m, i) => (
                            <div key={i} className="flex items-start gap-2">
                              <span className="text-blue-500 mt-1 text-lg leading-none">•</span>
                              <p className="flex-1 text-gray-300 leading-relaxed">{m}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}


        {!loading && !error && data && (
          <div className="mt-12 pt-6 border-t border-gray-900 text-center">
            <p className="text-sm text-gray-500">
              Total entries: <span className="text-white font-semibold">{data.changes.length}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}