import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [inventoryUpdates, setInventoryUpdates] = useState([]);

  useEffect(() => {
    // Initialize socket connection with enhanced configuration
    const socketUrl = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:5001';

    const socketInstance = io(socketUrl, {
      transports: ['websocket', 'polling'],
      timeout: 20000,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      maxReconnectionAttempts: 5,
      forceNew: false,
      withCredentials: true
    });

    socketInstance.on('connect', () => {
      console.log('✅ Socket.IO: Connected successfully - ID:', socketInstance.id);
      console.log('🔄 Socket.IO: Transport:', socketInstance.io.engine.transport.name);
      setConnected(true);
      setSocket(socketInstance);

      // Join inventory and POS rooms using proper client-side emit
      socketInstance.emit('join', 'inventory');
      socketInstance.emit('join', 'pos');

      toast.success('Real-time connection established');
    });

    socketInstance.on('disconnect', (reason) => {
      console.log('❌ Socket.IO: Disconnected - Reason:', reason);
      setConnected(false);

      if (reason === 'io server disconnect') {
        // Server initiated disconnect, reconnect manually
        socketInstance.connect();
      }

      toast.error('Real-time connection lost');
    });

    socketInstance.on('connect_error', (error) => {
      console.error('🚨 Socket.IO: Connection error:', error);
      setConnected(false);
      toast.error(`Connection failed: ${error.message || 'Unknown error'}`);
    });

    socketInstance.on('reconnect', (attemptNumber) => {
      console.log('🔄 Socket.IO: Reconnected after', attemptNumber, 'attempts');
      toast.success('Real-time connection restored');
    });

    socketInstance.on('reconnect_attempt', (attemptNumber) => {
      console.log('🔄 Socket.IO: Reconnection attempt', attemptNumber);
    });

    socketInstance.on('reconnect_error', (error) => {
      console.error('🚨 Socket.IO: Reconnection error:', error);
    });

    socketInstance.on('reconnect_failed', () => {
      console.error('❌ Socket.IO: Reconnection failed');
      toast.error('Failed to restore real-time connection');
    });

    // Handle room join confirmations
    socketInstance.on('joined-room', (data) => {
      console.log('🏠 Socket.IO: Successfully joined room:', data.room);
    });

    socketInstance.on('left-room', (data) => {
      console.log('🚪 Socket.IO: Successfully left room:', data.room);
    });

    // Handle server errors
    socketInstance.on('error', (error) => {
      console.error('🚨 Socket.IO: Server error:', error);
      toast.error(`Server error: ${error.message || 'Unknown error'}`);
    });

    // Listen for inventory updates
    socketInstance.on('inventory-updated', (data) => {
      console.log('Inventory update received:', data);
      
      setInventoryUpdates(prev => [data, ...prev.slice(0, 49)]); // Keep last 50 updates
      
      // Show toast notification based on update type
      switch (data.type) {
        case 'stock-addition':
          toast.success(`Stock added: ${data.product_name} (+${data.quantity_added})`);
          break;
        case 'stock-removal':
          toast.warning(`Stock removed: ${data.product_name} (-${data.quantity_removed})`);
          break;
        case 'stock-reduction':
          toast.info(`Stock sold: ${data.product_name} (-${data.quantity_sold})`);
          break;
        case 'stock-update':
          toast.info(`Stock updated: ${data.product_name} (${data.new_quantity})`);
          break;
        default:
          toast.info(`Inventory updated: ${data.product_name}`);
      }
    });

    // Listen for transaction updates
    socketInstance.on('transaction-completed', (data) => {
      console.log('Transaction completed:', data);
      toast.success(`Transaction completed: ${data.transaction.transaction_number}`);
    });

    // Cleanup on unmount
    return () => {
      socketInstance.emit('leave', 'inventory');
      socketInstance.emit('leave', 'pos');
      socketInstance.disconnect();
    };
  }, []);

  const emitInventoryUpdate = (data) => {
    if (socket && connected) {
      socket.emit('inventory-update', data);
    }
  };

  const emitPOSEvent = (event, data) => {
    if (socket && connected) {
      socket.emit(event, data);
    }
  };

  const joinRoom = (room) => {
    if (socket && connected) {
      socket.emit('join', room);
    }
  };

  const leaveRoom = (room) => {
    if (socket && connected) {
      socket.emit('leave', room);
    }
  };

  const clearInventoryUpdates = () => {
    setInventoryUpdates([]);
  };

  const value = {
    socket,
    connected,
    inventoryUpdates,
    emitInventoryUpdate,
    emitPOSEvent,
    joinRoom,
    leaveRoom,
    clearInventoryUpdates
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
