/**
 * Placeholder home page — replace this with the app's real home.
 *
 * This is intentionally unstyled scaffolding, not a design to build on.
 * Design the app's own look (layout, theme tokens, typography) from your
 * product's point of view instead of extending this page.
 */


import { useAuthProfileReady, useMutations, useQuery } from 'deepspace'
import { useState } from 'react'
import type { SubmitEvent } from 'react'
import hljs from 'highlight.js/lib/core'
import java from 'highlight.js/lib/languages/java'
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import python from 'highlight.js/lib/languages/python'
import sql from 'highlight.js/lib/languages/sql'
import 'highlight.js/styles/github-dark.css'

hljs.registerLanguage('java', java)
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('python', python)
hljs.registerLanguage('sql', sql)

type SnippetData = {
  title: string
  language: string
  code: string
  ownerId: string
}

type VersionData = {
  snippetId: string
  title: string
  language: string
  code: string
  ownerId: string
}

type SnippetRecord = {
  recordId: string
  data: SnippetData
  updatedAt: string
}

const languages = ['Java', 'JavaScript', 'TypeScript', 'Python', 'SQL']

function HighlightedCode({ code, language }: {
  code: string
  language: string
}) {
  const name = language.toLowerCase()

  let highlighted: string

  try {
    highlighted = hljs.highlight(code, { language: name }).value
  } catch {
    highlighted = hljs.highlightAuto(code).value
  }

  return (
    <pre className="overflow-x-auto rounded-lg bg-[#0d1117] p-4 text-sm">
      <code
        className="hljs"
        dangerouslySetInnerHTML={{ __html: highlighted }}
      />
    </pre>
  )
}

export default function HomePage() {
  const { isSignedIn, user } = useAuthProfileReady({ requireUser: true })

  const {
    ready,
    createConfirmed,
    putConfirmed,
    removeConfirmed,
  } = useMutations<SnippetData>('snippets')

  const {
    ready: versionsReady,
    createConfirmed: createVersion,
  } = useMutations<VersionData>('snippet_versions')

  const { records, status, error } = useQuery<SnippetData>('snippets')
  const { records: versions, status: versionStatus } =
    useQuery<VersionData>('snippet_versions')

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const [title, setTitle] = useState('')
  const [language, setLanguage] = useState('Java')
  const [code, setCode] = useState('')

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState('All')
  const [viewingHistoryId, setViewingHistoryId] = useState<string | null>(null)

  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [messageIsError, setMessageIsError] = useState(false)

  const mySnippets = records.filter(
    record => isSignedIn && record.data.ownerId === user?.id
  )

  const filteredSnippets = mySnippets.filter(record => {
    const search = searchTerm.trim().toLowerCase()

    const matchesSearch =
      record.data.title.toLowerCase().includes(search) ||
      record.data.code.toLowerCase().includes(search) ||
      record.data.language.toLowerCase().includes(search)

    const matchesLanguage =
      selectedLanguage === 'All' ||
      record.data.language === selectedLanguage

    return matchesSearch && matchesLanguage
  })

  function notify(text: string, isError = false) {
    setMessage(text)
    setMessageIsError(isError)
  }

  function resetForm() {
    setTitle('')
    setLanguage('Java')
    setCode('')
    setEditingId(null)
    setShowForm(false)
  }

  function startCreate() {
    resetForm()
    setMessage('')
    setShowForm(true)
  }

  function startEdit(record: SnippetRecord) {
    setEditingId(record.recordId)
    setTitle(record.data.title)
    setLanguage(record.data.language)
    setCode(record.data.code)
    setShowForm(true)
    setMessage('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function saveRevision(record: SnippetRecord) {
    if (!user) throw new Error('Not signed in')

    await createVersion({
      snippetId: record.recordId,
      title: record.data.title,
      language: record.data.language,
      code: record.data.code,
      ownerId: user.id,
    })
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!isSignedIn || !user) {
      notify('Please sign in first.', true)
      return
    }

    if (!ready || !versionsReady || busy) {
      notify('Database is not ready.', true)
      return
    }

    if (!title.trim() || !code.trim()) {
      notify('Title and code are required.', true)
      return
    }

    setBusy(true)

    try {
      const data: SnippetData = {
        title: title.trim(),
        language,
        code,
        ownerId: user.id,
      }

      if (editingId) {
        const existing = mySnippets.find(
          record => record.recordId === editingId
        )

        if (!existing) throw new Error('Snippet not found')

        await saveRevision(existing)
        await putConfirmed(editingId, {
          title: data.title,
          language: data.language,
          code: data.code,
        })

        notify('Snippet updated successfully.')
      } else {
        await createConfirmed(data)
        notify('Snippet created successfully.')
      }

      resetForm()
    } catch (error) {
      console.error(error)
      notify('Unable to save snippet. Check the console.', true)
    } finally {
      setBusy(false)
    }
  }

  async function handleDelete(record: SnippetRecord) {
    if (!ready || busy) return

    if (!window.confirm(
      `Permanently delete "${record.data.title}"?`
    )) return

    setBusy(true)

    try {
      await removeConfirmed(record.recordId)

      if (viewingHistoryId === record.recordId) {
        setViewingHistoryId(null)
      }

      notify('Snippet deleted successfully.')
    } catch (error) {
      console.error(error)
      notify('Unable to delete snippet.', true)
    } finally {
      setBusy(false)
    }
  }

  async function handleCopy(codeText: string) {
    try {
      await navigator.clipboard.writeText(codeText)
      notify('Code copied to clipboard.')
    } catch {
      notify('Unable to copy code.', true)
    }
  }

  async function handleRestore(
    record: SnippetRecord,
    version: VersionData
  ) {
    if (!ready || !versionsReady || busy) return

    if (!window.confirm('Restore this previous version?')) return

    setBusy(true)

    try {
      // Preserve the current version before restoring an older one.
      await saveRevision(record)

      await putConfirmed(record.recordId, {
        title: version.title,
        language: version.language,
        code: version.code,
      })

      setViewingHistoryId(null)
      notify('Previous version restored successfully.')
    } catch (error) {
      console.error(error)
      notify('Unable to restore version.', true)
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-10 text-foreground">

      <header>
        <h1 className="text-3xl font-bold">DevSnippet</h1>
        <p className="mt-2 text-muted-foreground">
          Save, organize, search, and reuse your code snippets.
        </p>

        {isSignedIn && user && (
          <p className="mt-4 text-sm text-muted-foreground">
            Signed in as {user.name ?? user.email}
          </p>
        )}
      </header>

      {message && (
        <div
          role="status"
          className={`rounded-lg border p-4 ${
            messageIsError
              ? 'border-red-500 text-red-400'
              : 'border-border'
          }`}
        >
          {message}
        </div>
      )}

      <div>
        <button
          type="button"
          onClick={() => showForm ? resetForm() : startCreate()}
          className="rounded-lg bg-primary px-5 py-3 text-primary-foreground"
        >
          {showForm ? 'Cancel' : 'Add Snippet'}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 rounded-xl border p-6"
        >
          <h2 className="text-xl font-semibold">
            {editingId ? 'Edit Snippet' : 'Create Snippet'}
          </h2>

          <div className="flex flex-col gap-2">
            <label htmlFor="snippet-title">Title</label>
            <input
              id="snippet-title"
              type="text"
              value={title}
              onChange={event => setTitle(event.target.value)}
              placeholder="Example: Binary Search"
              className="rounded-lg border bg-background p-3"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="snippet-language">Language</label>
            <select
              id="snippet-language"
              value={language}
              onChange={event => setLanguage(event.target.value)}
              className="rounded-lg border bg-background p-3"
            >
              {languages.map(item => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="snippet-code">Code</label>
            <textarea
              id="snippet-code"
              value={code}
              onChange={event => setCode(event.target.value)}
              placeholder="Paste your code here..."
              rows={12}
              className="rounded-lg border bg-background p-3 font-mono text-sm"
              required
            />
          </div>

          <button
            type="submit"
            disabled={!ready || !versionsReady || busy}
            className="self-start rounded-lg bg-primary px-5 py-3 text-primary-foreground disabled:opacity-50"
          >
            {busy
              ? 'Saving...'
              : editingId
                ? 'Update Snippet'
                : 'Save Snippet'}
          </button>
        </form>
      )}

      <section className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-semibold">My Snippets</h2>
          <span className="text-sm text-muted-foreground">
            {filteredSnippets.length} snippets
          </span>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label htmlFor="search-snippets">Search snippets</label>
            <input
              id="search-snippets"
              type="search"
              value={searchTerm}
              onChange={event => setSearchTerm(event.target.value)}
              placeholder="Search title, code, or language..."
              className="rounded-lg border bg-background p-3"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="filter-language">Filter by language</label>
            <select
              id="filter-language"
              value={selectedLanguage}
              onChange={event => setSelectedLanguage(event.target.value)}
              className="rounded-lg border bg-background p-3"
            >
              <option value="All">All Languages</option>
              {languages.map(item => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </div>
        </div>

        {status === 'loading' ? (
          <p>Loading snippets...</p>
        ) : status === 'error' ? (
          <p className="text-red-400">
            Failed to load snippets: {error}
          </p>
        ) : filteredSnippets.length === 0 ? (
          <p className="text-muted-foreground">
            {mySnippets.length === 0
              ? 'No snippets yet. Add your first snippet.'
              : 'No snippets match your search or filter.'}
          </p>
        ) : (
          filteredSnippets.map(record => {
            const history = versions
              .filter(version =>
                version.data.ownerId === user?.id &&
                version.data.snippetId === record.recordId
              )
              .sort((a, b) =>
                b.createdAt.localeCompare(a.createdAt)
              )

            const historyOpen =
              viewingHistoryId === record.recordId

            return (
              <article
                key={record.recordId}
                className="flex flex-col gap-4 rounded-xl border p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {record.data.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {record.data.language}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopy(record.data.code)}
                      className="rounded-lg border px-3 py-2 text-sm"
                    >
                      Copy
                    </button>

                    <button
                      type="button"
                      onClick={() => startEdit(record)}
                      className="rounded-lg border px-3 py-2 text-sm"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setViewingHistoryId(
                          historyOpen ? null : record.recordId
                        )
                      }
                      className="rounded-lg border px-3 py-2 text-sm"
                    >
                      History
                    </button>

                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => handleDelete(record)}
                      className="rounded-lg border border-red-500 px-3 py-2 text-sm text-red-400 disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <HighlightedCode
                  code={record.data.code}
                  language={record.data.language}
                />

                <p className="text-xs text-muted-foreground">
                  Updated: {new Date(record.updatedAt).toLocaleString()}
                </p>

                {historyOpen && (
                  <div className="flex flex-col gap-4 border-t pt-4">
                    <h4 className="font-semibold">Version History</h4>

                    {versionStatus === 'loading' ? (
                      <p>Loading history...</p>
                    ) : versionStatus === 'error' ? (
                      <p className="text-red-400">
                        Unable to load version history.
                      </p>
                    ) : history.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        No previous versions yet. Edit this snippet
                        to create its first saved revision.
                      </p>
                    ) : (
                      history.map((version, index) => (
                        <div
                          key={version.recordId}
                          className="flex flex-col gap-3 rounded-lg border p-4"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                              <p className="font-medium">
                                Previous version {history.length - index}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(version.createdAt).toLocaleString()}
                              </p>
                              <p className="text-sm">
                                {version.data.title} · {version.data.language}
                              </p>
                            </div>

                            <button
                              type="button"
                              disabled={busy || !versionsReady}
                              onClick={() =>
                                handleRestore(record, version.data)
                              }
                              className="rounded-lg border px-3 py-2 text-sm disabled:opacity-50"
                            >
                              Restore
                            </button>
                          </div>

                          <HighlightedCode
                            code={version.data.code}
                            language={version.data.language}
                          />
                        </div>
                      ))
                    )}
                  </div>
                )}
              </article>
            )
          })
        )}
      </section>
    </main>
  )
}
