/**
 * useBloodRequests — Firestore real-time listener for the blood_requests collection.
 *
 * Returns { requests, newAlert } where:
 *   - requests: current active requests sorted newest-first (live updates)
 *   - newAlert: the most-recently added request doc (triggers popup), or null
 *   - clearAlert: call this to dismiss the popup
 */
import { useEffect, useRef, useState } from 'react';
import { collection, query, where, orderBy, onSnapshot, limit } from 'firebase/firestore';
import { db } from '../firebase';

export function useBloodRequests(maxDocs = 30) {
  const [requests, setRequests] = useState([]);
  const [newAlert, setNewAlert] = useState(null);
  const seenIds = useRef(new Set());
  const isFirstLoad = useRef(true);

  useEffect(() => {
    // Query: active requests sorted by created_at desc
    const q = query(
      collection(db, 'blood_requests'),
      where('status', '==', 'active'),
      orderBy('created_at', 'desc'),
      limit(maxDocs)
    );

    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        // On the very first load, mark all existing docs as "seen" and don't alert
        if (isFirstLoad.current) {
          isFirstLoad.current = false;
          docs.forEach((d) => seenIds.current.add(d.id));
          setRequests(docs);
          return;
        }

        // Find any genuinely NEW documents (not seen before)
        let latestNew = null;
        for (const doc of docs) {
          if (!seenIds.current.has(doc.id)) {
            seenIds.current.add(doc.id);
            // Use the newest one (docs are already sorted newest-first)
            if (!latestNew) latestNew = doc;
          }
        }

        setRequests(docs);
        if (latestNew) {
          setNewAlert(latestNew);
        }
      },
      (err) => {
        console.warn('[useBloodRequests] Firestore listener error:', err.message);
        // Fallback: just ignore — page will still load via REST API
      }
    );

    return () => unsub();
  }, [maxDocs]);

  const clearAlert = () => setNewAlert(null);

  return { requests, newAlert, clearAlert };
}
