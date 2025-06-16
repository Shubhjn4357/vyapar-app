import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { useAuth } from './AuthContext';

interface SyncOperation {
    id: string;
    tableName: string;
    recordId: string;
    operation: 'create' | 'update' | 'delete';
    data: any;
    timestamp: number;
    synced: boolean;
    deviceId?: string;
}

interface SyncStatus {
    isOnline: boolean;
    isSyncing: boolean;
    pendingOperations: number;
    lastSyncTime: Date | null;
    syncErrors: string[];
}

interface OfflineSyncContextType {
    syncStatus: SyncStatus;
    addSyncOperation: (tableName: string, recordId: string, operation: 'create' | 'update' | 'delete', data: any) => Promise<void>;
    syncPendingOperations: () => Promise<void>;
    getPendingOperations: () => Promise<SyncOperation[]>;
    clearSyncErrors: () => void;
    forceSyncAll: () => Promise<void>;
}

const OfflineSyncContext = createContext<OfflineSyncContextType | undefined>(undefined);

export const OfflineSyncProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { token, company } = useAuth();
    const [syncStatus, setSyncStatus] = useState<SyncStatus>({
        isOnline: false,
        isSyncing: false,
        pendingOperations: 0,
        lastSyncTime: null,
        syncErrors: []
    });

    // Monitor network connectivity
    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setSyncStatus(prev => ({ ...prev, isOnline: state.isConnected || false }));
            
            // Auto-sync when coming back online
            if (state.isConnected && prev.pendingOperations > 0) {
                syncPendingOperations();
            }
        });

        return unsubscribe;
    }, []);

    // Load pending operations count on mount
    useEffect(() => {
        loadPendingOperationsCount();
    }, []);

    const loadPendingOperationsCount = async () => {
        try {
            const operations = await getPendingOperations();
            setSyncStatus(prev => ({ ...prev, pendingOperations: operations.length }));
        } catch (error) {
            console.error('Failed to load pending operations count:', error);
        }
    };

    const addSyncOperation = useCallback(async (
        tableName: string,
        recordId: string,
        operation: 'create' | 'update' | 'delete',
        data: any
    ) => {
        try {
            const syncOperation: SyncOperation = {
                id: `${tableName}_${recordId}_${Date.now()}`,
                tableName,
                recordId,
                operation,
                data,
                timestamp: Date.now(),
                synced: false,
                deviceId: await getDeviceId()
            };

            // Store in AsyncStorage
            const existingOperations = await getPendingOperations();
            const updatedOperations = [...existingOperations, syncOperation];
            await AsyncStorage.setItem('pendingSyncOperations', JSON.stringify(updatedOperations));

            setSyncStatus(prev => ({ 
                ...prev, 
                pendingOperations: updatedOperations.length 
            }));

            // Try to sync immediately if online
            if (syncStatus.isOnline && !syncStatus.isSyncing) {
                syncPendingOperations();
            }
        } catch (error) {
            console.error('Failed to add sync operation:', error);
        }
    }, [syncStatus.isOnline, syncStatus.isSyncing]);

    const getPendingOperations = useCallback(async (): Promise<SyncOperation[]> => {
        try {
            const stored = await AsyncStorage.getItem('pendingSyncOperations');
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Failed to get pending operations:', error);
            return [];
        }
    }, []);

    const syncPendingOperations = useCallback(async () => {
        if (!token || !company || syncStatus.isSyncing || !syncStatus.isOnline) {
            return;
        }

        setSyncStatus(prev => ({ ...prev, isSyncing: true, syncErrors: [] }));

        try {
            const pendingOperations = await getPendingOperations();
            const errors: string[] = [];

            for (const operation of pendingOperations) {
                try {
                    await syncSingleOperation(operation);
                } catch (error) {
                    errors.push(`Failed to sync ${operation.tableName}:${operation.recordId} - ${error}`);
                }
            }

            // Remove successfully synced operations
            const remainingOperations = await getPendingOperations();
            const unsyncedOperations = remainingOperations.filter(op => !op.synced);
            await AsyncStorage.setItem('pendingSyncOperations', JSON.stringify(unsyncedOperations));

            setSyncStatus(prev => ({
                ...prev,
                isSyncing: false,
                pendingOperations: unsyncedOperations.length,
                lastSyncTime: new Date(),
                syncErrors: errors
            }));
        } catch (error) {
            setSyncStatus(prev => ({
                ...prev,
                isSyncing: false,
                syncErrors: [...prev.syncErrors, `Sync failed: ${error}`]
            }));
        }
    }, [token, company, syncStatus.isSyncing, syncStatus.isOnline]);

    const syncSingleOperation = async (operation: SyncOperation) => {
        if (!token || !company) throw new Error('No authentication token or company');

        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/sync/operations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                companyId: company.id,
                tableName: operation.tableName,
                recordId: operation.recordId,
                operation: operation.operation,
                data: operation.data,
                deviceId: operation.deviceId
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Sync operation failed');
        }

        // Mark as synced
        operation.synced = true;
    };

    const forceSyncAll = useCallback(async () => {
        if (!token || !company) return;

        setSyncStatus(prev => ({ ...prev, isSyncing: true, syncErrors: [] }));

        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/sync/sync`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ companyId: company.id })
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Force sync failed');
            }

            // Clear all pending operations on successful sync
            await AsyncStorage.removeItem('pendingSyncOperations');

            setSyncStatus(prev => ({
                ...prev,
                isSyncing: false,
                pendingOperations: 0,
                lastSyncTime: new Date(),
                syncErrors: data.data.errors || []
            }));
        } catch (error) {
            setSyncStatus(prev => ({
                ...prev,
                isSyncing: false,
                syncErrors: [...prev.syncErrors, `Force sync failed: ${error}`]
            }));
        }
    }, [token, company]);

    const clearSyncErrors = useCallback(() => {
        setSyncStatus(prev => ({ ...prev, syncErrors: [] }));
    }, []);

    const getDeviceId = async (): Promise<string> => {
        try {
            let deviceId = await AsyncStorage.getItem('deviceId');
            if (!deviceId) {
                deviceId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                await AsyncStorage.setItem('deviceId', deviceId);
            }
            return deviceId;
        } catch (error) {
            return `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        }
    };

    return (
        <OfflineSyncContext.Provider value={{
            syncStatus,
            addSyncOperation,
            syncPendingOperations,
            getPendingOperations,
            clearSyncErrors,
            forceSyncAll
        }}>
            {children}
        </OfflineSyncContext.Provider>
    );
};

export const useOfflineSync = () => {
    const context = useContext(OfflineSyncContext);
    if (!context) {
        throw new Error('useOfflineSync must be used within OfflineSyncProvider');
    }
    return context;
};