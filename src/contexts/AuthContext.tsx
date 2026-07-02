"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Role, Criterion, HistoryEntry } from "@/lib/types";
import { USERS, INITIAL_CRITERIA, DEPARTMENTS } from "@/lib/data";
import { db } from "@/firebase/config";
import { collection, doc, onSnapshot, updateDoc, writeBatch, getDocs, addDoc, query, orderBy, limit, setDoc } from "firebase/firestore";

interface AuthUser {
  role: Role;
  name: string;
  department: string;
}

interface AppContextType {
  // Auth
  user: AuthUser | null;
  login: (username: string, password: string) => string | null; // returns error or null
  logout: () => void;

  // Criteria
  criteria: Criterion[];
  updateCriterionStatus: (id: string, status: Criterion["status"], remarks: string) => void;
  addCriterion: (criterion: Criterion) => void;
  deleteCriterion: (id: string) => void;
  updateCriterionDueDate: (id: string, newDate: string) => void;
  updateChairmanFeedback: (id: string, feedback: string) => void;

  // Activity log
  activityLog: HistoryEntry[];
}

const AppContext = createContext<AppContextType>({
  user: null,
  login: () => "Not initialized",
  logout: () => {},
  criteria: [],
  updateCriterionStatus: () => {},
  addCriterion: () => {},
  deleteCriterion: () => {},
  updateCriterionDueDate: () => {},
  updateChairmanFeedback: () => {},
  activityLog: [],
});

export const useApp = () => useContext(AppContext);

const STORAGE_KEY_USER = "cptms_user";

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [criteria, setCriteria] = useState<Criterion[]>([]);
  const [activityLog, setActivityLog] = useState<HistoryEntry[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate Auth from localStorage on mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(STORAGE_KEY_USER);
      if (savedUser) setUser(JSON.parse(savedUser));
    } catch {
      // Ignore
    }
  }, []);

  // Firebase Real-time Sync & Seeding
  useEffect(() => {
    const seedDatabaseIfEmpty = async () => {
      try {
        const criteriaRef = collection(db, "criteria");
        const snapshot = await getDocs(criteriaRef);
        if (snapshot.empty) {
          console.log("Firestore is empty. Seeding initial criteria...");
          const batch = writeBatch(db);
          INITIAL_CRITERIA.forEach((criterion) => {
            const docRef = doc(criteriaRef, criterion.id);
            batch.set(docRef, criterion);
          });
          await batch.commit();
          console.log("Seeding complete!");
        }
      } catch (err) {
        console.error("Error seeding database:", err);
      }
    };

    seedDatabaseIfEmpty();

    // Listen to criteria collection
    const unsubCriteria = onSnapshot(collection(db, "criteria"), (snapshot) => {
      const liveCriteria: Criterion[] = [];
      snapshot.forEach((doc) => {
        liveCriteria.push(doc.data() as Criterion);
      });
      setCriteria(liveCriteria);
      setHydrated(true);
    }, (error) => {
      console.error("Error fetching criteria:", error);
      setHydrated(true); // Don't block UI on error
    });

    // Listen to activity log collection
    const logsQuery = query(collection(db, "logs"), orderBy("timestamp", "desc"), limit(200));
    const unsubLogs = onSnapshot(logsQuery, (snapshot) => {
      const liveLogs: HistoryEntry[] = [];
      snapshot.forEach((doc) => {
        liveLogs.push(doc.data() as HistoryEntry);
      });
      setActivityLog(liveLogs);
    });

    return () => {
      unsubCriteria();
      unsubLogs();
    };
  }, []);

  const login = useCallback((username: string, password: string): string | null => {
    const found = USERS.find((u) => u.username === username.toLowerCase().trim() && u.password === password);
    if (!found) return "Invalid username or password";
    const authUser: AuthUser = { role: found.role, name: found.name, department: found.department };
    setUser(authUser);
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(authUser));
    return null;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY_USER);
  }, []);

  const addLogEntry = useCallback(async (action: string, userName: string, oldVal?: string, newVal?: string) => {
    const entry: HistoryEntry = {
      timestamp: new Date().toISOString(),
      user: userName,
      action,
      previousValue: oldVal,
      newValue: newVal,
    };
    try {
      await addDoc(collection(db, "logs"), entry);
    } catch (err) {
      console.error("Error adding log:", err);
    }
  }, []);

  const updateCriterionStatus = useCallback(
    async (id: string, status: Criterion["status"], remarks: string) => {
      const c = criteria.find(c => c.id === id);
      if (!c) return;

      const historyEntry: HistoryEntry = {
        timestamp: new Date().toISOString(),
        user: user?.name || "Unknown",
        action: `Changed status from "${c.status}" to "${status}"`,
        previousValue: c.status,
        newValue: status,
      };

      const dept = DEPARTMENTS.find((d) => d.id === c.department);
      addLogEntry(
        `${user?.name} updated "${c.title}" in ${dept?.shortName || c.department} — ${c.status} → ${status}`,
        user?.name || "Unknown",
        c.status,
        status
      );

      try {
        const docRef = doc(db, "criteria", id);
        await updateDoc(docRef, {
          status,
          remarks: remarks || c.remarks,
          lastUpdated: new Date().toISOString(),
          updatedBy: user?.name,
          completionDate: status === "Completed" ? new Date().toISOString() : c.completionDate,
          history: [...(c.history || []), historyEntry],
        });
      } catch (err) {
        console.error("Error updating status:", err);
      }
    },
    [user, addLogEntry, criteria]
  );

  const updateCriterionDueDate = useCallback(
    async (id: string, newDate: string) => {
      const c = criteria.find(c => c.id === id);
      if (!c) return;

      const historyEntry: HistoryEntry = {
        timestamp: new Date().toISOString(),
        user: user?.name || "Unknown",
        action: `Changed due date from "${c.dueDate}" to "${newDate}"`,
        previousValue: c.dueDate,
        newValue: newDate,
      };

      const dept = DEPARTMENTS.find((d) => d.id === c.department);
      addLogEntry(
        `${user?.name} updated due date for "${c.title}" in ${dept?.shortName || c.department}`,
        user?.name || "Unknown",
        c.dueDate,
        newDate
      );

      try {
        const docRef = doc(db, "criteria", id);
        await updateDoc(docRef, {
          dueDate: newDate,
          lastUpdated: new Date().toISOString(),
          updatedBy: user?.name,
          history: [...(c.history || []), historyEntry],
        });
      } catch (err) {
        console.error("Error updating due date:", err);
      }
    },
    [user, addLogEntry, criteria]
  );

  const updateChairmanFeedback = useCallback(
    async (id: string, feedback: string) => {
      const c = criteria.find(c => c.id === id);
      if (!c) return;

      const historyEntry: HistoryEntry = {
        timestamp: new Date().toISOString(),
        user: user?.name || "Unknown",
        action: `Chairman added/updated feedback`,
        newValue: feedback,
      };

      const dept = DEPARTMENTS.find((d) => d.id === c.department);
      addLogEntry(
        `Chairman added feedback to "${c.title}" in ${dept?.shortName || c.department}`,
        user?.name || "Unknown",
        c.chairmanFeedback,
        feedback
      );

      try {
        const docRef = doc(db, "criteria", id);
        await updateDoc(docRef, {
          chairmanFeedback: feedback,
          lastUpdated: new Date().toISOString(),
          updatedBy: user?.name,
          history: [...(c.history || []), historyEntry],
        });
      } catch (err) {
        console.error("Error updating feedback:", err);
      }
    },
    [user, addLogEntry, criteria]
  );

  const addCriterion = useCallback(
    async (criterion: Criterion) => {
      const dept = DEPARTMENTS.find((d) => d.id === criterion.department);
      addLogEntry(
        `${user?.name} added new criterion "${criterion.title}" to ${dept?.shortName || criterion.department}`,
        user?.name || "Unknown"
      );

      try {
        const docRef = doc(db, "criteria", criterion.id);
        await setDoc(docRef, criterion);
      } catch (err) {
        console.error("Error adding criterion:", err);
      }
    },
    [user, addLogEntry]
  );

  const deleteCriterion = useCallback(
    async (id: string) => {
      // NOTE: For full functionality you would need deleteDoc here, but not currently used in UI.
      const target = criteria.find((c) => c.id === id);
      if (target) {
        const dept = DEPARTMENTS.find((d) => d.id === target.department);
        addLogEntry(
          `${user?.name} deleted criterion "${target.title}" from ${dept?.shortName || target.department}`,
          user?.name || "Unknown"
        );
        // ... deleteDoc(doc(db, "criteria", id)) ...
      }
    },
    [user, addLogEntry, criteria]
  );

  if (!hydrated) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <AppContext.Provider
      value={{ user, login, logout, criteria, updateCriterionStatus, addCriterion, deleteCriterion, updateCriterionDueDate, updateChairmanFeedback, activityLog }}
    >
      {children}
    </AppContext.Provider>
  );
}
