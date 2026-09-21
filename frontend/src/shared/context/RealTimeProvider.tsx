'use client';
import React, { createContext, useContext, useEffect, useRef } from 'react';
import * as signalR from '@microsoft/signalr';

interface IRealTimeContext {
  sLastUpdateType: string | null;
}

const RealTimeContext = createContext<IRealTimeContext>({ sLastUpdateType: null });

export const useRealTime = () => useContext(RealTimeContext);

export const RealTimeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const objConnectionRef = useRef<signalR.HubConnection | null>(null);

  useEffect(() => {
    // Get base URL without /api
    const sApiUrl = process.env.NEXT_PUBLIC_API_URL || "";
    const sBaseUrl = sApiUrl.replace(/\/api$/, '');
    const sHubUrl = `${sBaseUrl}/hubs/update`;


    // Create connection
    let isActive = true;
    const objNewConnection = new signalR.HubConnectionBuilder()
      .withUrl(sHubUrl, {
        withCredentials: true 
      })
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: retryContext => {
          if (retryContext.elapsedMilliseconds < 60000) {
            return Math.random() * 5000;
          } else {
            return null;
          }
        }
      })
      .configureLogging(signalR.LogLevel.Warning)
      .build();

    objConnectionRef.current = objNewConnection;

    const startConnection = async () => {
      if (!isActive) return;
      
      try {
        if (objNewConnection.state === signalR.HubConnectionState.Disconnected) {
          await objNewConnection.start();
          
          if (!isActive) {
            await objNewConnection.stop();
            return;
          }
          
        }

        objNewConnection.on('ReceiveUpdate', (sEntityType: string) => {
          if (!isActive) return;
          
          const event = new CustomEvent('api-update', { detail: { sEntityType } });
          window.dispatchEvent(event);

          window.dispatchEvent(new CustomEvent('refreshTransactions'));
          window.dispatchEvent(new CustomEvent('refreshDashboard'));
          window.dispatchEvent(new CustomEvent('refreshTags'));
          window.dispatchEvent(new CustomEvent('refreshAnomalyCount'));
          window.dispatchEvent(new CustomEvent('refreshAnomalies'));
          window.dispatchEvent(new CustomEvent('refreshRecurringRules'));
        });

        objNewConnection.onreconnecting(error => {
          if (isActive) console.warn('[RealTime] กำลังเชื่อมต่อ SignalR ใหม่อีกครั้ง...', error);
        });

        objNewConnection.onreconnected(() => {
        });

        objNewConnection.onclose(error => {
          if (isActive) console.error('[RealTime] การเชื่อมต่อ SignalR ถูกปิดตัวลง.', error);
        });

      } catch (err) {
        if (isActive) {
          console.error('[RealTime] เกิดข้อผิดพลาดในการเชื่อมต่อ SignalR: ', err);
          setTimeout(startConnection, 5000);
        }
      }
    };

    startConnection();

    return () => {
      isActive = false;
      if (objConnectionRef.current) {
        objConnectionRef.current.stop().catch(err => console.error('[RealTime] เกิดข้อผิดพลาดในการหยุดการเชื่อมต่อ:', err));
        objConnectionRef.current = null;
      }
    };

  }, []);

  return (
    <RealTimeContext.Provider value={{ sLastUpdateType: null }}>
      {children}
    </RealTimeContext.Provider>
  );
};
