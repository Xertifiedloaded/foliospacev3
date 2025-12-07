"use client"
import { useEffect, useState } from "react"
import { Search, Download, Copy, Check, Circle } from "lucide-react"

export default function ChangelogViewer() {
  const [data, setData] = useState<{
    changes: Array<{ version?: string; message?: string; changes?: string[]; date?: string }>
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState("")
  const [copiedId, setCopiedId] = useState<number | null>(null)

  useEffect(() => {
    let mounted = true
    setLoading(true)

    fetch("/api/changelog")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then((json) => {
        if (!mounted) return
        if (Array.isArray(json)) setData({ changes: json })
        else if (json.changes) setData(json)
        else if (json.updates) setData({ changes: json.updates })
        else setData({ changes: [] })
      })
      .catch((e) => setError(e.message))
      .finally(() => mounted && setLoading(false))

    return () => {
      mounted = false
    }
  }, [])

  function filteredChanges() {
    if (!data) return []
    const q = query.trim().toLowerCase()

    let filtered = [...data.changes]

    if (q) {
      filtered = filtered.filter((c) => {
        const text = `${c.version ?? ""} ${c.message ?? c.changes?.join(" ") ?? ""}`.toLowerCase()
        return text.includes(q)
      })
    }

    return filtered.sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0
      const dateB = b.date ? new Date(b.date).getTime() : 0
      return dateB - dateA
    })
  }

  function downloadJSON() {
    if (!data) return
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "CHANGELOG.json"
    a.click()
    URL.revokeObjectURL(url)
  }

  function copyToClipboard(entry: object, idx: number) {
    navigator.clipboard?.writeText(JSON.stringify(entry, null, 2))
    setCopiedId(idx)
    setTimeout(() => setCopiedId(null), 2000)
  }

  function formatDate(dateString?: string) {
    if (!dateString) return "No date"
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return "Today"
    if (diffDays === 1) return "Yesterday"
    if (diffDays < 7) return `${diffDays}d ago`

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    })
  }

  function getFullDate(dateString?: string) {
    if (!dateString) return ""
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const changes = filteredChanges()

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-3xl mx-auto px-4 py-16 sm:px-6">
        <div className="mb-12">
          <h1 className="text-[32px] font-semibold text-white tracking-tight mb-2">Changelog</h1>
          <p className="text-[15px] text-neutral-500">New updates and improvements</p>
        </div>
        <div className="flex items-center gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
            <input
              type="text"
              placeholder="Search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full h-10 pl-9 pr-4 bg-transparent border border-neutral-800 rounded-lg text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-600 transition-colors"
            />
          </div>
          <button
            onClick={downloadJSON}
            disabled={!data}
            className="h-10 px-4 flex items-center gap-2 text-sm text-neutral-400 border border-neutral-800 rounded-lg hover:bg-neutral-900 hover:text-white hover:border-neutral-700 transition-all disabled:opacity-40 disabled:pointer-events-none"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>

        {loading && (
          <div className="py-20">
            <div className="flex items-center justify-center gap-3">
              <div className="w-5 h-5 border-2 border-neutral-800 border-t-white rounded-full animate-spin" />
              <span className="text-sm text-neutral-500">Loading...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="py-12 text-center">
            <p className="text-red-500 text-sm mb-1">Failed to load</p>
            <p className="text-neutral-600 text-xs">{error}</p>
          </div>
        )}
        {!loading && !error && (
          <div className="relative">
            <div className="absolute left-[7px] top-3 bottom-3 w-px bg-neutral-800" />

            {changes.length === 0 ? (
              <div className="py-20 text-center">
                <p className="text-neutral-500 text-sm">{query ? "No results found" : "No changelog entries"}</p>
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className="mt-3 text-xs text-neutral-600 hover:text-white transition-colors"
                  >
                    Clear search
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-0">
                {changes.map((entry, idx) => {
                  const version = entry.version ?? `v${idx + 1}`
                  const messages = entry.message ? [entry.message] : (entry.changes ?? [])
                  const isLatest = idx === 0

                  return (
                    <div key={`${version}-${idx}`} className="relative pl-8">
    
                      <div className="absolute left-0 top-[18px]">
                        {isLatest ? (
                          <div className="w-[15px] h-[15px] rounded-full bg-emerald-500 ring-4 ring-black" />
                        ) : (
                          <Circle className="w-[15px] h-[15px] text-neutral-700 fill-black" />
                        )}
                      </div>

                      <div className="py-5 border-b border-neutral-900">
        
                        <div className="flex items-start gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-1">
                              <span className="text-[15px] font-medium text-white">{version}</span>
                              {isLatest && (
                                <span className="px-2 py-0.5 text-[11px] font-medium text-emerald-500 bg-emerald-500/10 rounded-full">
                                  Latest
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-neutral-500">
                              <span title={getFullDate(entry.date)}>{formatDate(entry.date)}</span>
                              <span className="text-neutral-700">·</span>
                              <span>
                                {messages.length} change{messages.length !== 1 ? "s" : ""}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => copyToClipboard(entry, idx)}
                            className={`flex items-center gap-1.5 text-xs transition-colors ${
                              copiedId === idx ? "text-emerald-500" : "text-neutral-600 hover:text-white"
                            }`}
                          >
                            {copiedId === idx ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                Copied
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                Copy
                              </>
                            )}
                          </button>
                        </div>

                        <div className="mt-4">
                          {messages.length === 0 ? (
                            <p className="text-sm text-neutral-600 italic">No details</p>
                          ) : (
                            <ul className="space-y-2">
                              {messages.map((m, i) => (
                                <li
                                  key={i}
                                  className="flex items-start gap-2.5 text-[14px] text-neutral-300 leading-relaxed"
                                >
                                  <span className="mt-2 w-1 h-1 rounded-full bg-neutral-600 shrink-0" />
                                  <span>{m}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {!loading && !error && data && data.changes.length > 0 && (
          <div className="mt-8 pt-6 border-t border-neutral-900">
            <p className="text-xs text-neutral-600 text-center">
              {changes.length} of {data.changes.length} releases
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
