export type SystemHealthStatus = 'HEALTHY' | 'DEGRADED' | 'DOWN';

export interface SystemHealthResponse {
  status: SystemHealthStatus;
  issues?: string[];
  lastCheck: Date;
  metrics?: SystemHealthMetrics;
}

export interface SystemHealthMetrics {
  cpuUsage: number;
  memoryUsage: number;
  activeUsers: number;
  responseTime: number;
}

export interface QuickActionPayload {
  actionId: string;
  type: 'USER_ACTION' | 'SYSTEM_ACTION';
  timestamp: Date;
  params?: Record<string, unknown>;
}
