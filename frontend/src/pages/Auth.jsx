import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import useAuthStore from '../store/authStore'
import { registerUser, loginUser } from '../api/auth'
import '../styles/Auth.css'

function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()

  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    setLoading(true)
    setError('')
    try {
      let response
      if (isLogin) {
        response = await loginUser({ email: data.email, password: data.password })
      } else {
        response = await registerUser(data)
      }
      setAuth(response.user, response.access_token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.detail || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    setError('')
    reset()
  }

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-brand">
          <div className="auth-brand-icon">🌿</div>
          <h1>MindfulSpace</h1>
          <p>Your personal mental wellness journal. Reflect, track, and grow every day.</p>
        </div>
        <div className="auth-features">
          <div className="auth-feature">
            <span>📝</span>
            <span>Private daily journaling</span>
          </div>
          <div className="auth-feature">
            <span>📊</span>
            <span>Mood trend tracking</span>
          </div>
          <div className="auth-feature">
            <span>🤖</span>
            <span>AI powered insights</span>
          </div>
          <div className="auth-feature">
            <span>🔒</span>
            <span>Secure and private</span>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-header">
            <h2>{isLogin ? 'Welcome back' : 'Create account'}</h2>
            <p>{isLogin ? 'Sign in to continue your journey' : 'Start your wellness journey today'}</p>
          </div>

          {error && (
            <div className="auth-error">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
            {!isLogin && (
              <div className="form-group">
                <label className="form-label">Username</label>
                <input
                  className="form-input"
                  placeholder="Choose a username"
                  {...register('username', { required: 'Username is required' })}
                />
                {errors.username && (
                  <span className="form-error">{errors.username.message}</span>
                )}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                className="form-input"
                type="email"
                placeholder="Enter your email"
                {...register('email', { required: 'Email is required' })}
              />
              {errors.email && (
                <span className="form-error">{errors.email.message}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                className="form-input"
                type="password"
                placeholder="Enter your password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Password must be at least 6 characters' }
                })}
              />
              {errors.password && (
                <span className="form-error">{errors.password.message}</span>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-small"></span>
                  {isLogin ? 'Signing in...' : 'Creating account...'}
                </>
              ) : (
                isLogin ? 'Sign in' : 'Create account'
              )}
            </button>
          </form>

          <div className="auth-toggle">
            <p>
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
              <button onClick={toggleMode} className="auth-toggle-btn">
                {isLogin ? ' Register' : ' Sign in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Auth