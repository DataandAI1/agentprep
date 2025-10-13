import { useEffect, useState } from 'react';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  DocumentData,
  QueryConstraint,
} from 'firebase/firestore';
import { db } from './config';

export function useFirestoreCollection<T = DocumentData>(
  collectionName: string,
  constraints: QueryConstraint[] = []
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      const q = query(collection(db, collectionName), ...constraints);

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const items = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as T[];
          setData(items);
          setLoading(false);
        },
        (err) => {
          console.error('Error fetching collection:', err);
          setError(err as Error);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error('Error setting up listener:', err);
      setError(err as Error);
      setLoading(false);
    }
  }, [collectionName, JSON.stringify(constraints)]);

  return { data, loading, error };
}

export function useUseCases(userId: string) {
  return useFirestoreCollection(
    'useCases',
    userId ? [where('ownerId', '==', userId), orderBy('updatedAt', 'desc')] : []
  );
}
