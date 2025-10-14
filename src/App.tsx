import { useState, useEffect, FormEvent } from 'react';
import AgentPrep from './components/AgentPrep';
import { auth } from './firebase/config';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from 'firebase/auth';

function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [credentials, setCredentials] = useState({ email: '', password: '' });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setAuthError(null);

    if (!credentials.email || !credentials.password) {
      setAuthError('Email and password are required');
      return;
    }

    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, credentials.email, credentials.password);
      } else {
        await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
      }
    } catch (error) {
      if (error instanceof Error) {
        setAuthError(error.message);
      } else {
        setAuthError('Authentication failed');
      }
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <div className="text-gray-600">Loading AgentPrep...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg border border-gray-200 p-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2 text-center">
            Sign {isRegistering ? 'Up' : 'In'} to AgentPrep
          </h1>
          <p className="text-sm text-gray-500 mb-6 text-center">
            Use your organization credentials to access saved use cases.
          </p>
          {authError && (
            <div className="mb-4 rounded-lg bg-red-50 text-red-700 px-4 py-2 text-sm">
              {authError}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={credentials.email}
                onChange={(event) => setCredentials((prev) => ({ ...prev, email: event.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={credentials.password}
                onChange={(event) => setCredentials((prev) => ({ ...prev, password: event.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter your password"
                required
                minLength={6}
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-lg bg-indigo-600 text-white py-2 font-medium hover:bg-indigo-700 transition"
            >
              {isRegistering ? 'Create account' : 'Sign in'}
            </button>
          </form>
          <div className="mt-6 text-center text-sm text-gray-600">
            {isRegistering ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={() => setIsRegistering((prev) => !prev)}
              className="font-medium text-indigo-600 hover:text-indigo-700"
              type="button"
            >
              {isRegistering ? 'Sign in' : 'Create one'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <div className="text-sm text-gray-500">Signed in as</div>
            <div className="text-base font-medium text-gray-900">{user.email || 'Authenticated user'}</div>
          </div>
          <button
            onClick={handleSignOut}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
            type="button"
          >
            Sign out
          </button>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-6">
        <AgentPrep ownerId={user.uid} />
      </main>
    </div>
  );
}

export default App;
