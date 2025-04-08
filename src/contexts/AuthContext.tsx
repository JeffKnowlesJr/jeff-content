import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode
} from 'react'

// Define the structure of a user
interface User {
  id: string
  email: string
  name: string
  role: string
}

// Define the authentication context shape
interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  error: string | null
}

// Create the auth context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => false,
  logout: () => {},
  error: null
})

// Export a hook to use the auth context
export const useAuth = () => useContext(AuthContext)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Check if the user is logged in on component mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Check for a token in localStorage
        const token = localStorage.getItem('auth_token')

        if (!token) {
          setIsLoading(false)
          return
        }

        // In a real app, you would validate the token with your API
        // For now, we'll just simulate this with mock data
        const mockUser = {
          id: '1',
          email: 'admin@example.com',
          name: 'Admin User',
          role: 'admin'
        }

        setUser(mockUser)
        setError(null)
      } catch (err) {
        console.error('Auth error:', err)
        setError('Authentication failed. Please log in again.')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuthStatus()
  }, [])

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    setError(null)

    try {
      // In a real app, send a request to your authentication API
      // For demonstration, we'll simulate this with mock credentials

      // Check if the email and password match our mock data
      if (email === 'admin@example.com' && password === 'password123') {
        const mockUser = {
          id: '1',
          email,
          name: 'Admin User',
          role: 'admin'
        }

        // Store the token in localStorage
        localStorage.setItem('auth_token', 'mock_jwt_token')

        setUser(mockUser)
        setIsLoading(false)
        return true
      } else {
        setError('Invalid email or password')
        setIsLoading(false)
        return false
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('Login failed. Please try again.')
      setIsLoading(false)
      return false
    }
  }

  // Logout function
  const logout = () => {
    localStorage.removeItem('auth_token')
    setUser(null)
  }

  // Create the context value
  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    error
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
