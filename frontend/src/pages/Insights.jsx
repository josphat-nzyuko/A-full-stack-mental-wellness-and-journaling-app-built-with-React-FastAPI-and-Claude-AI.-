
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell
} from 'recharts'
import { format } from 'date-fns'
import { getInsightsSummary } from '../api/insights'
import { getMoodHistory } from '../api/mood'
import '../styles/Insights.css'

const MOOD_COLORS = {
  low: '#ff6584',
  medium: '#ffb347',
  high: '#43d9a2'
}

const getMoodColor = (score) => {
  if (score <= 3) return MOOD_COLORS.low
  if (score <= 6) return MOOD_COLORS.medium
  return MOOD_COLORS.high
}

const getMoodLabel = (avg) => {
  if (!avg) return { label: 'No data', emoji: '—' }
  if (avg <= 3) return { label: 'Struggling', emoji: '😟' }
  if (avg <= 5) return { label: 'Getting by', emoji: '😐' }
  if (avg <= 7) return { label: 'Doing well', emoji: '😊' }
  return { label: 'Thriving', emoji: '🌟' }
}

function Insights() {
  const navigate = useNavigate()
  const [summary, setSummary] = useState(null)
  const [moodHistory, setMoodHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchInsights()
  }, [])

  const fetchInsights = async () => {
    setLoading(true)
    setError('')
    try {
      const [summaryData, moodData] = await Promise.all([
        getInsightsSummary(),
        getMoodHistory(30)
      ])
      setSummary(summaryData)
      setMoodHistory(moodData)
    } catch (err) {
      setError('Failed to load insights. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Build bar chart data from mood history
  const chartData = moodHistory.map((log) => ({
    date: format(new Date(log.logged_at), 'MMM d'),
    score: log.mood_score,
    label: log.mood_label
  }))

  // Mood distribution breakdown
  const moodDistribution = [
    {
      range: 'Low (1-3)',
      count: moodHistory.filter(m => m.mood_score <= 3).length,
      color: MOOD_COLORS.low
    },
    {
      range: 'Medium (4-6)',
      count: moodHistory.filter(m => m.mood_score >= 4 && m.mood_score <= 6).length,
      color: MOOD_COLORS.medium
    },
    {
      range: 'High (7-10)',
      count: moodHistory.filter(m => m.mood_score >= 7).length,
      color: MOOD_COLORS.high
    }
  ]

  const overallMood = summary?.average_mood
  const moodStatus = getMoodLabel(overallMood)

  if (loading) {
    return (
      <div className="insights-loading">
        <div className="spinner"></div>
        <p>Generating your insights...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="insights-error">
        <p>⚠️ {error}</p>
        <button className="btn btn-primary" onClick={fetchInsights}>
          Try again
        </button>
      </div>
    )
  }

  return (
    <div className="insights">
      {/* Header */}
      <div className="insights-header">
        <div>
          <h1>Your Insights</h1>
          <p className="text-muted">A personalised look at your wellness journey</p>
        </div>
        <button className="btn btn-ghost" onClick={fetchInsights}>
          🔄 Refresh
        </button>
      </div>

      {/* No data state */}
      {summary?.total_entries === 0 && summary?.total_mood_logs === 0 ? (
        <div className="insights-empty">
          <div className="insights-empty-icon">✨</div>
          <h2>No data yet</h2>
          <p>Start writing journal entries and logging your mood to unlock personalised AI insights.</p>
          <div className="insights-empty-actions">
            <button className="btn btn-primary" onClick={() => navigate('/journal')}>
              Write first entry
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>
              Log mood
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Stats Overview */}
          <div className="insights-stats">
            <div className="insight-stat-card insight-stat-primary">
              <div className="insight-stat-emoji">{moodStatus.emoji}</div>
              <div>
                <h3>{overallMood ? `${overallMood}/10` : '—'}</h3>
                <p>Average mood</p>
                <span className="insight-stat-label">{moodStatus.label}</span>
              </div>
            </div>
            <div className="insight-stat-card">
              <div className="insight-stat-emoji">📝</div>
              <div>
                <h3>{summary?.total_entries || 0}</h3>
                <p>Journal entries</p>
              </div>
            </div>
            <div className="insight-stat-card">
              <div className="insight-stat-emoji">📊</div>
              <div>
                <h3>{summary?.total_mood_logs || 0}</h3>
                <p>Mood check-ins</p>
              </div>
            </div>
            <div className="insight-stat-card">
              <div className="insight-stat-emoji">🔥</div>
              <div>
                <h3>{moodHistory.filter(m => m.mood_score >= 7).length}</h3>
                <p>Good days</p>
              </div>
            </div>
          </div>

          <div className="insights-grid">
            {/* AI Summary */}
            <div className="card ai-summary-card">
              <div className="ai-summary-header">
                <span>🤖</span>
                <h3>AI Wellness Summary</h3>
              </div>
              <p className="ai-summary-text">
                {summary?.summary || 'No summary available yet.'}
              </p>
              <div className="ai-summary-footer">
                <span>Based on your last 30 days</span>
                <span>Powered by Claude AI</span>
              </div>
            </div>

            {/* Mood Distribution */}
            <div className="card mood-distribution-card">
              <h3 className="card-title">Mood distribution</h3>
              <div className="mood-distribution-list">
                {moodDistribution.map((item) => (
                  <div key={item.range} className="mood-distribution-item">
                    <div className="mood-distribution-label">
                      <span style={{ color: item.color }}>●</span>
                      <span>{item.range}</span>
                    </div>
                    <div className="mood-distribution-bar-wrap">
                      <div
                        className="mood-distribution-bar"
                        style={{
                          width: moodHistory.length
                            ? `${(item.count / moodHistory.length) * 100}%`
                            : '0%',
                          background: item.color
                        }}
                      />
                    </div>
                    <span className="mood-distribution-count">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mood Bar Chart */}
            <div className="card mood-bar-chart-card">
              <h3 className="card-title">Daily mood — last 30 days</h3>
              {chartData.length === 0 ? (
                <div className="empty-chart">
                  <p>No mood data yet. Start logging daily!</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={chartData} barSize={14}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 11, fill: '#9ca3af' }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      domain={[0, 10]}
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
                      formatter={(value, name, props) => [
                        `${value}/10 — ${props.payload.label}`, 'Mood'
                      ]}
                    />
                    <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={getMoodColor(entry.score)}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Tips Card */}
            <div className="card tips-card">
              <h3 className="card-title">💡 Wellness tips</h3>
              <div className="tips-list">
                <div className="tip-item">
                  <span className="tip-icon">🌅</span>
                  <div>
                    <h4>Journal in the morning</h4>
                    <p>Starting your day with reflection sets a positive tone and clears mental clutter.</p>
                  </div>
                </div>
                <div className="tip-item">
                  <span className="tip-icon">📈</span>
                  <div>
                    <h4>Track consistently</h4>
                    <p>Daily mood logs give you the most accurate picture of your emotional patterns.</p>
                  </div>
                </div>
                <div className="tip-item">
                  <span className="tip-icon">🧘</span>
                  <div>
                    <h4>Be honest with yourself</h4>
                    <p>Your journal is private. The more authentic your entries, the better your insights.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Insights