import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts'
import { format } from 'date-fns'
import useAuthStore from '../store/authStore'
import { getAllEntries } from '../api/journal'
import { logMood, getMoodHistory } from '../api/mood'
import '../styles/Dashboard.css'

const MOOD_OPTIONS = [
  { score: 1, label: 'Terrible', emoji: '😞' },
  { score: 2, label: 'Very Bad', emoji: '😟' },
  { score: 3, label: 'Bad', emoji: '😕' },
  { score: 4, label: 'Low', emoji: '😐' },
  { score: 5, label: 'Okay', emoji: '🙂' },
  { score: 6, label: 'Fine', emoji: '😊' },
  { score: 7, label: 'Good', emoji: '😄' },
  { score: 8, label: 'Great', emoji: '😁' },
  { score: 9, label: 'Excellent', emoji: '🤩' },
  { score: 10, label: 'Amazing', emoji: '🌟' }
]

function Dashboard() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [entries, setEntries] = useState([])
  const [moodHistory, setMoodHistory] = useState([])
  const [selectedMood, setSelectedMood] = useState(null)
  const [moodNote, setMoodNote] = useState('')
  const [loggingMood, setLoggingMood] = useState(false)
  const [moodLogged, setMoodLogged] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [entriesData, moodData] = await Promise.all([
        getAllEntries(),
        getMoodHistory(30)
      ])
      setEntries(entriesData)
      setMoodHistory(moodData)
    } catch (err) {
      console.error('Failed to fetch dashboard data', err)
    } finally {
      setLoading(false)
    }
  }

  const handleMoodLog = async () => {
    if (!selectedMood) return
    setLoggingMood(true)
    try {
      await logMood({
        mood_score: selectedMood.score,
        mood_label: selectedMood.label,
        note: moodNote
      })
      setMoodLogged(true)
      setMoodNote('')
      fetchData()
    } catch (err) {
      console.error('Failed to log mood', err)
    } finally {
      setLoggingMood(false)
    }
  }

  const chartData = moodHistory.map((log) => ({
    date: format(new Date(log.logged_at), 'MMM d'),
    mood: log.mood_score
  }))

  const averageMood = moodHistory.length
    ? (moodHistory.reduce((sum, m) => sum + m.mood_score, 0) / moodHistory.length).toFixed(1)
    : null

  const recentEntries = entries.slice(0, 3)

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    )
  }

  return (
    <div className="dashboard">
      {/* Welcome Header */}
      <div className="dashboard-header">
        <div>
          <h1>Good {getTimeOfDay()}, {user?.username} 👋</h1>
          <p className="text-muted">How are you feeling today?</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => navigate('/journal')}
        >
          ✏️ New Entry
        </button>
      </div>

      {/* Stats Row */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div>
            <h3>{entries.length}</h3>
            <p>Total entries</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div>
            <h3>{averageMood || '—'}</h3>
            <p>Average mood</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🔥</div>
          <div>
            <h3>{moodHistory.length}</h3>
            <p>Mood check-ins</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✨</div>
          <div>
            <h3>{entries.filter(e => e.ai_insight).length}</h3>
            <p>AI insights</p>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Mood Logger */}
        <div className="card mood-logger">
          <h3 className="card-title">Log today's mood</h3>
          {moodLogged ? (
            <div className="mood-logged-success">
              <span>✅</span>
              <p>Mood logged successfully!</p>
              <button
                className="btn btn-secondary"
                onClick={() => { setMoodLogged(false); setSelectedMood(null) }}
              >
                Log again
              </button>
            </div>
          ) : (
            <>
              <div className="mood-grid">
                {MOOD_OPTIONS.map((mood) => (
                  <button
                    key={mood.score}
                    className={`mood-btn ${selectedMood?.score === mood.score ? 'mood-btn-active' : ''}`}
                    onClick={() => setSelectedMood(mood)}
                    title={mood.label}
                  >
                    <span className="mood-emoji">{mood.emoji}</span>
                    <span className="mood-score">{mood.score}</span>
                  </button>
                ))}
              </div>
              {selectedMood && (
                <div className="mood-selected-label">
                  Feeling <strong>{selectedMood.label}</strong>
                </div>
              )}
              <textarea
                className="form-input mood-note"
                placeholder="Add a short note (optional)..."
                value={moodNote}
                onChange={(e) => setMoodNote(e.target.value)}
                rows={2}
              />
              <button
                className="btn btn-primary w-full"
                onClick={handleMoodLog}
                disabled={!selectedMood || loggingMood}
              >
                {loggingMood ? 'Saving...' : 'Save mood'}
              </button>
            </>
          )}
        </div>

        {/* Mood Chart */}
        <div className="card mood-chart-card">
          <h3 className="card-title">Mood over last 30 days</h3>
          {moodHistory.length === 0 ? (
            <div className="empty-chart">
              <p>No mood data yet. Start logging your mood daily!</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: '#9ca3af' }}
                  tickLine={false}
                />
                <YAxis
                  domain={[1, 10]}
                  tick={{ fontSize: 11, fill: '#9ca3af' }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    fontSize: '13px'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="mood"
                  stroke="#6c63ff"
                  strokeWidth={2.5}
                  dot={{ fill: '#6c63ff', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Recent Journal Entries */}
        <div className="card recent-entries">
          <div className="card-header">
            <h3 className="card-title">Recent entries</h3>
            <button
              className="btn btn-secondary"
              onClick={() => navigate('/journal')}
            >
              View all
            </button>
          </div>
          {recentEntries.length === 0 ? (
            <div className="empty-entries">
              <p>No journal entries yet.</p>
              <button
                className="btn btn-primary"
                onClick={() => navigate('/journal')}
              >
                Write your first entry
              </button>
            </div>
          ) : (
            <div className="entries-list">
              {recentEntries.map((entry) => (
                <div key={entry.id} className="entry-preview">
                  <div className="entry-preview-header">
                    <h4>{entry.title}</h4>
                    {entry.mood_score && (
                      <span className="badge badge-purple">
                        Mood {entry.mood_score}/10
                      </span>
                    )}
                  </div>
                  <p className="entry-preview-content">
                    {entry.content.substring(0, 100)}
                    {entry.content.length > 100 ? '...' : ''}
                  </p>
                  <span className="entry-preview-date">
                    {format(new Date(entry.created_at), 'MMM d, yyyy')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function getTimeOfDay() {
  const hour = new Date().getHours()
  if (hour < 12) return 'morning'
  if (hour < 17) return 'afternoon'
  return 'evening'
}

export default Dashboard