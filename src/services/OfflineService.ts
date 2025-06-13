import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

export interface OfflineAction {
  id: string;
  type: 'CREATE' | 'UPDATE' | 'DELETE';
  endpoint: string;
  method: 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  data?: any;
  timestamp: number;
  retryCount: number;
  maxRetries: number;
}

export interface OfflineData {
  key: string;
  data: any;
  timestamp: number;
  expiresAt?: number;
}

class OfflineService {
  private static instance: OfflineService;
  private isOnline: boolean = true;
  private pendingActions: OfflineAction[] = [];
  private cachedData: Map<string, OfflineData> = new Map();
  private listeners: ((isOnline: boolean) => void)[] = [];

  private constructor() {
    this.initializeNetworkListener();
    this.loadPendingActions();
    this.loadCachedData();
  }

  static getInstance(): OfflineService {
    if (!OfflineService.instance) {
      OfflineService.instance = new OfflineService();
    }
    return OfflineService.instance;
  }

  private async initializeNetworkListener() {
    // Get initial network state
    const netInfo = await NetInfo.fetch();
    this.isOnline = netInfo.isConnected ?? false;

    // Listen for network changes
    NetInfo.addEventListener(state => {
      const wasOnline = this.isOnline;
      this.isOnline = state.isConnected ?? false;
      
      // Notify listeners
      this.listeners.forEach(listener => listener(this.isOnline));

      // If we just came back online, process pending actions
      if (!wasOnline && this.isOnline) {
        this.processPendingActions();
      }
    });
  }

  // Network status methods
  getNetworkStatus(): boolean {
    return this.isOnline;
  }

  addNetworkListener(listener: (isOnline: boolean) => void): () => void {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  // Offline actions management
  async addPendingAction(action: Omit<OfflineAction, 'id' | 'timestamp' | 'retryCount'>): Promise<void> {
    const pendingAction: OfflineAction = {
      ...action,
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      retryCount: 0,
    };

    this.pendingActions.push(pendingAction);
    await this.savePendingActions();
  }

  async removePendingAction(actionId: string): Promise<void> {
    this.pendingActions = this.pendingActions.filter(action => action.id !== actionId);
    await this.savePendingActions();
  }

  private async processPendingActions(): Promise<void> {
    if (!this.isOnline || this.pendingActions.length === 0) {
      return;
    }

    const actionsToProcess = [...this.pendingActions];
    
    for (const action of actionsToProcess) {
      try {
        await this.executeAction(action);
        await this.removePendingAction(action.id);
      } catch (error) {
        console.error('Failed to execute pending action:', error);
        
        // Increment retry count
        action.retryCount++;
        
        if (action.retryCount >= action.maxRetries) {
          // Remove action if max retries exceeded
          await this.removePendingAction(action.id);
          console.error('Max retries exceeded for action:', action.id);
        } else {
          // Update the action with new retry count
          await this.savePendingActions();
        }
      }
    }
  }

  private async executeAction(action: OfflineAction): Promise<void> {
    const response = await fetch(action.endpoint, {
      method: action.method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: action.data ? JSON.stringify(action.data) : undefined,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  // Data caching methods
  async cacheData(key: string, data: any, expirationMinutes?: number): Promise<void> {
    const cacheItem: OfflineData = {
      key,
      data,
      timestamp: Date.now(),
      expiresAt: expirationMinutes ? Date.now() + (expirationMinutes * 60 * 1000) : undefined,
    };

    this.cachedData.set(key, cacheItem);
    await this.saveCachedData();
  }

  getCachedData(key: string): any | null {
    const cacheItem = this.cachedData.get(key);
    
    if (!cacheItem) {
      return null;
    }

    // Check if data has expired
    if (cacheItem.expiresAt && Date.now() > cacheItem.expiresAt) {
      this.cachedData.delete(key);
      this.saveCachedData();
      return null;
    }

    return cacheItem.data;
  }

  async clearCachedData(key?: string): Promise<void> {
    if (key) {
      this.cachedData.delete(key);
    } else {
      this.cachedData.clear();
    }
    await this.saveCachedData();
  }

  // Storage methods
  private async savePendingActions(): Promise<void> {
    try {
      await AsyncStorage.setItem('offline_pending_actions', JSON.stringify(this.pendingActions));
    } catch (error) {
      console.error('Failed to save pending actions:', error);
    }
  }

  private async loadPendingActions(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem('offline_pending_actions');
      if (stored) {
        this.pendingActions = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load pending actions:', error);
    }
  }

  private async saveCachedData(): Promise<void> {
    try {
      const dataArray = Array.from(this.cachedData.entries());
      await AsyncStorage.setItem('offline_cached_data', JSON.stringify(dataArray));
    } catch (error) {
      console.error('Failed to save cached data:', error);
    }
  }

  private async loadCachedData(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem('offline_cached_data');
      if (stored) {
        const dataArray = JSON.parse(stored);
        this.cachedData = new Map(dataArray);
      }
    } catch (error) {
      console.error('Failed to load cached data:', error);
    }
  }

  // Utility methods
  getPendingActionsCount(): number {
    return this.pendingActions.length;
  }

  getCachedDataKeys(): string[] {
    return Array.from(this.cachedData.keys());
  }

  async clearAllOfflineData(): Promise<void> {
    this.pendingActions = [];
    this.cachedData.clear();
    await Promise.all([
      this.savePendingActions(),
      this.saveCachedData(),
    ]);
  }
}

export default OfflineService;