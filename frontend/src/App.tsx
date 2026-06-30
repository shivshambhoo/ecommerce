import { useEffect } from 'react'
import { useAuthStore } from './shared/stores/authStore'
import { api } from './shared/services/api'

function App() {
  const { user, setUser, isAuthenticated } = useAuthStore()

  useEffect(() => {
    // Check if user is still logged in on app load
    const checkAuth = async () => {
      try {
        const response = await api.get('/api/auth/me')
        if (response.data.success) {
          setUser(response.data.data.user)
        }
      } catch (error) {
        // Not authenticated, that's okay
      }
    }

    const token = localStorage.getItem('accessToken')
    if (token) {
      checkAuth()
    }
  }, [setUser])

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">E-Commerce</h1>
          <div>
            {isAuthenticated ? (
              <div>
                <span className="text-gray-700 mr-4">{user?.name}</span>
                <button
                  onClick={() => useAuthStore.getState().logout()}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Logout
                </button>
              </div>
            ) : (
              <a href="/login" className="text-blue-500">
                Login
              </a>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-4xl font-bold mb-4">Welcome to E-Commerce</h2>
        <p className="text-gray-600">
          This is your starting point. Frontend and backend are connected!
        </p>

        {/* Test API Connection */}
        <button
          onClick={async () => {
            try {
              const response = await api.get('/api/health')
              alert('✅ Backend connected: ' + JSON.stringify(response.data))
            } catch (error) {
              alert('❌ Backend error: ' + (error as Error).message)
            }
          }}
          className="mt-4 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          Test Backend Connection
        </button>
      </main>
    </div>
  )
}
export default App
