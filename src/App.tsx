import { useState, useEffect } from 'react';
import AgentPrep from './components/AgentPrep';
import { auth } from './firebase/config';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';

function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Auto sign-in anonymously for demo purposes
    // In production, implement proper authentication
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        // Sign in anonymously if no user
        try {
          const result = await signInAnonymously(auth);
          setUser(result.user);
        } catch (error) {
          console.error('Error signing in:', error);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

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

  return <AgentPrep />;
}

export default App;
