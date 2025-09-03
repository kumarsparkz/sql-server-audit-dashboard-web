// ============================================================================
// SIGNALR SERVICE (src/services/signalrService.ts)
// ============================================================================

import * as signalR from '@microsoft/signalr';
import { ActiveAlert, ServerOverview } from '../types';
import { environment } from '../config/environment';

class SignalRService {
  private connection: signalR.HubConnection | null = null;
  private baseURL = environment.signalrHubUrl;

  async startConnection(): Promise<void> {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No authentication token found');
    }

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(this.baseURL, {
        accessTokenFactory: () => token
      })
      .withAutomaticReconnect()
      .build();

    try {
      await this.connection.start();
      console.log('SignalR connection started');
    } catch (error) {
      console.error('Error starting SignalR connection:', error);
      throw error;
    }
  }

  async stopConnection(): Promise<void> {
    if (this.connection) {
      await this.connection.stop();
      console.log('SignalR connection stopped');
    }
  }

  onDashboardUpdate(callback: (data: any) => void): void {
    if (this.connection) {
      this.connection.on('DashboardUpdate', callback);
    }
  }

  onAlertUpdate(callback: (alert: ActiveAlert) => void): void {
    if (this.connection) {
      this.connection.on('AlertUpdate', callback);
    }
  }

  onServerStatusUpdate(callback: (serverStatus: ServerOverview) => void): void {
    if (this.connection) {
      this.connection.on('ServerStatusUpdate', callback);
    }
  }

  async joinGroup(groupName: string): Promise<void> {
    if (this.connection) {
      await this.connection.invoke('JoinGroup', groupName);
    }
  }

  async leaveGroup(groupName: string): Promise<void> {
    if (this.connection) {
      await this.connection.invoke('LeaveGroup', groupName);
    }
  }
}

export const signalrService = new SignalRService();
