import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { format } from 'date-fns'
import {
  getAllEntries,
  createEntry,
  updateEntry,
  deleteEntry
} from '../api/journal'
import '../styles/Journal.css'

const MOOD_OPTIONS = [
  { score: 1, emoji: '😞' },
  { score: 2, emoji: '😟' },
  { score: 3, emoji: '😕' },
  { score: 4, emoji: '😐' },
  { score: 5, emoji: '🙂' },
  { score: 6, emoji: '😊' },
  { score: 7, emoji: '😄' },
  { score: 8, emoji: '😁' },
  { score: 9, emoji: '🤩' },
  { score: 10, emoji: '🌟' }
]

function Journal() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingEntry, setEditingEntry] = useState(null)
  const [selectedEntry, setSelectedEntry] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [deleting, setDeleting] = useState(null)
  const [selectedMood, setSelectedMood] = useState(null)
  const [error, setError] = useState('')

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm()

  useEffect(() => {
    fetchEntries()
  }, [])

  const fetchEntries = async () => {
    try {
      const data = await getAllEntries()
      setEntries(data)
    } catch (err) {
      console.error('Failed to fetch entries', err)
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data) => {
    setSubmitting(true)
    setError('')
    try {
      if (editingEntry) {
        const updated = await updateEntry(editingEntry.id, {
          ...data,
          mood_score: selectedMood
        })
        setEntries(entries.map(e => e.id === updated.id ? updated : e))
        setSelectedEntry(updated)
      } else {
        const newEntry = await createEntry({
          ...data,
          mood_score: selectedMood
        })
        setEntries([newEntry, ...entries])
        setSelectedEntry(newEntry)
      }
      closeForm()
    } catch (err) {
      setError('Failed to save entry. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (entry) => {
    setEditingEntry(entry)
    setValue('title', entry.title)
    setValue('content', entry.content)
    setSelectedMood(entry.mood_score)
    setShowForm(true)
    setSelectedEntry(null)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this entry?')) return
    setDeleting(id)
    try {
      await deleteEntry(id)
      setEntries(entries.filter(e => e.id !== id))
      if (selectedEntry?.id === id) setSelectedEntry(null)
    } catch (err) {
      console.error('Failed to delete entry', err)
    } finally {
      setDeleting(null)
    }
  }

  const closeForm = () => {
    setShowForm(false)
    setEditingEntry(null)
    setSelectedMood(null)
    setError('')
    reset()
  }

  const openNewForm = () => {
    closeForm()
    setShowForm(true)
    setSelectedEntry(null)
  }

  if (loading) {
    return (
      <div className="journal-loading">
        <div className="spinner"></div>
        <p>Loading your journal...</p>
      </div>
    )
  }

  return (
    <div className="journal">
      {/* Header */}
      <div className="journal-header">
        <div>
          <h1>My Journal</h1>
          <p className="text-muted">{entries.length} {entries.length === 1 ? 'entry' : 'entries'}</p>
        </div>
        <button className="btn btn-primary" onClick={openNewForm}>
          ✏️ New Entry
        </button>
      </div>

      <div className="journal-layout">
        {/* Entries List */}
        <div className="journal-list">
          {entries.length === 0 ? (
            <div className="journal-empty">
              <p>📖</p>
              <p>No entries yet.</p>
              <button className="btn btn-primary" onClick={openNewForm}>
                Write your first entry
              </button>
            </div>
          ) : (
            entries.map((entry) => (
              <div
                key={entry.id}
                className={`journal-entry-card ${selectedEntry?.id === entry.id ? 'journal-entry-active' : ''}`}
                onClick={() => { setSelectedEntry(entry); setShowForm(false) }}
              >
                <div className="journal-entry-card-header">
                  <h4>{entry.title}</h4>
                  {entry.mood_score && (
                    <span className="mood-badge">
                      {MOOD_OPTIONS.find(m => m.score === entry.mood_score)?.emoji}
                    </span>
                  )}
                </div>
                <p className="journal-entry-preview">
                  {entry.content.substring(0, 80)}
                  {entry.content.length > 80 ? '...' : ''}
                </p>
                <span className="journal-entry-date">
                  {format(new Date(entry.created_at), 'MMM d, yyyy')}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Right Panel — Form or Entry Detail */}
        <div className="journal-panel">
          {/* New / Edit Form */}
          {showForm && (
            <div className="card journal-form-card">
              <div className="journal-form-header">
                <h3>{editingEntry ? 'Edit entry' : 'New entry'}</h3>
                <button className="btn btn-ghost" onClick={closeForm}>✕ Cancel</button>
              </div>

              {error && <div className="auth-error"><span>⚠️</span> {error}</div>}

              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group">
                  <label className="form-label">Title</label>
                  <input
                    className="form-input"
                    placeholder="Give your entry a title..."
                    {...register('title', { required: 'Title is required' })}
                  />
                  {errors.title && <span className="form-error">{errors.title.message}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">How are you feeling? (optional)</label>
                  <div className="mood-row">
                    {MOOD_OPTIONS.map((mood) => (
                      <button
                        key={mood.score}
                        type="button"
                        className={`mood-btn-sm ${selectedMood === mood.score ? 'mood-btn-sm-active' : ''}`}
                        onClick={() => setSelectedMood(
                          selectedMood === mood.score ? null : mood.score
                        )}
                        title={`${mood.score}/10`}
                      >
                        {mood.emoji}
                      </button>
                    ))}
                  </div>
                  {selectedMood && (
                    <span className="text-small text-muted">
                      Mood: {selectedMood}/10
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Write your thoughts</label>
                  <textarea
                    className="form-input journal-textarea"
                    placeholder="What's on your mind today?..."
                    {...register('content', { required: 'Content is required' })}
                  />
                  {errors.content && <span className="form-error">{errors.content.message}</span>}
                </div>

                <div className="journal-form-hint">
                  💡 An AI insight will be generated automatically when you save.
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-full"
                  disabled={submitting}
                >
                  {submitting ? 'Saving...' : editingEntry ? 'Update entry' : 'Save entry'}
                </button>
              </form>
            </div>
          )}

          {/* Entry Detail View */}
          {selectedEntry && !showForm && (
            <div className="card journal-detail-card">
              <div className="journal-detail-header">
                <div>
                  <h2>{selectedEntry.title}</h2>
                  <span className="journal-detail-date">
                    {format(new Date(selectedEntry.created_at), 'MMMM d, yyyy • h:mm a')}
                  </span>
                </div>
                <div className="journal-detail-actions">
                  <button
                    className="btn btn-secondary"
                    onClick={() => handleEdit(selectedEntry)}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(selectedEntry.id)}
                    disabled={deleting === selectedEntry.id}
                  >
                    {deleting === selectedEntry.id ? 'Deleting...' : '🗑️ Delete'}
                  </button>
                </div>
              </div>

              {selectedEntry.mood_score && (
                <div className="journal-detail-mood">
                  <span>
                    {MOOD_OPTIONS.find(m => m.score === selectedEntry.mood_score)?.emoji}
                  </span>
                  <span>Mood: {selectedEntry.mood_score}/10</span>
                </div>
              )}

              <div className="journal-detail-content">
                <p>{selectedEntry.content}</p>
              </div>

              {selectedEntry.ai_insight && (
                <div className="journal-ai-insight">
                  <div className="insight-header">
                    <span>🤖</span>
                    <h4>AI Insight</h4>
                  </div>
                  <p>{selectedEntry.ai_insight}</p>
                </div>
              )}
            </div>
          )}

          {/* Empty State */}
          {!showForm && !selectedEntry && (
            <div className="journal-panel-empty">
              <p>📖</p>
              <p>Select an entry to read it or write a new one</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Journal