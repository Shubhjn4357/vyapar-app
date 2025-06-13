import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import OfflineService from '../services/OfflineService';

interface OfflineContextType {
  isOnline: boolean;
  pendingActionsCount: number;
  addPendingAction: (action: {
    type: 'CREATE' | 'UPDATE' | 'DELETE';
    endpoint: string;
    method: 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    data?: any;
    maxRetries?: number;
  }) => Promise<void>;
  cacheData: (key: string, data: any, expirationMinutes?: number) => Promise<void>;
  getCachedData: (key: string) => any | null;
  clearCache: (key?: string) => Promise<void>;
  clearAllOfflineData: () => Promise<void>;
}

const OfflineContext = createContext<OfflineContextType | undefined>(undefined);

interface OfflineProviderProps {
  children: ReactNode;
}

export const OfflineProvider: React.FC<OfflineProviderProps> = ({ children }) => {
  const [isOnline, setIsOnline] = useState(true);
  const [pendingActionsCount, setPendingActionsCount] = useState(0);
  const offlineService = OfflineService.getInstance();

  useEffect(() => {
    // Set initial state
    setIsOnline(offlineService.getNetworkStatus());
    setPendingActionsCount(offlineService.getPendingActionsCount());

    // Listen for network changes
    const unsubscribe = offlineService.addNetworkListener((online) => {
      setIsOnline(online);
      setPendingActionsCount(offlineService.getPendingActionsCount());
    });

    return unsubscribe;
  }, [offlineService]);

  const addPendingAction = async (action: {
    type: 'CREATE' | 'UPDATE' | 'DELETE';
    endpoint: string;
    method: 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    data?: any;
    maxRetries?: number;
  }) => {
    await offlineService.addPendingAction({
      ...action,
      maxRetries: action.maxRetries || 3,
    });
    setPendingActionsCount(offlineService.getPendingActionsCount());
  };

  const cacheData = async (key: string, data: any, expirationMinutes?: number) => {
    await offlineService.cacheData(key, data, expirationMinutes);
  };

  const getCachedData = (key: string) => {
    return offlineService.getCachedData(key);
  };

  const clearCache = async (key?: string) => {
    await offlineService.clearCachedData(key);
  };

  const clearAllOfflineData = async () => {
    await offlineService.clearAllOfflineData();
    setPendingActionsCount(0);
  };

  const value: OfflineContextType = {
    isOnline,
    pendingActionsCount,
    addPendingAction,
    cacheData,
    getCachedData,
    clearCache,
    clearAllOfflineData,
  };

  return (
    <OfflineContext.Provider value={value}>
      {children}
    </OfflineContext.Provider>
  );
};

export const useOffline = (): OfflineContextType => {
  const context = useContext(OfflineContext);
  if (context === undefined) {
    throw new Error('useOffline must be used within an OfflineProvider');
  }
  return context;
};