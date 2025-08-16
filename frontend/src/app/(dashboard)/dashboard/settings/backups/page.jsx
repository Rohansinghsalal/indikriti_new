'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/Dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Checkbox } from '@/components/ui/Checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';

export default function BackupManagementPage() {
  const [backups, setBackups] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('backups');
  const [showCreateBackupDialog, setShowCreateBackupDialog] = useState(false);
  const [showRestoreDialog, setShowRestoreDialog] = useState(false);
  const [showCreateScheduleDialog, setShowCreateScheduleDialog] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState(null);
  const [backupInProgress, setBackupInProgress] = useState(false);
  const [restoreInProgress, setRestoreInProgress] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateRangeFilter, setDateRangeFilter] = useState({ start: '', end: '' });
  
  // Mock data for backups
  const mockBackups = [
    {
      id: 'backup-001',
      name: 'Full System Backup',
      type: 'full',
      status: 'completed',
      size: '1.2 GB',
      createdAt: '2023-06-15 08:30:45',
      completedAt: '2023-06-15 08:45:12',
      duration: '14m 27s',
      createdBy: 'System',
      description: 'Scheduled full system backup',
      location: 'cloud',
      storageProvider: 'AWS S3',
      retentionPeriod: '30 days',
      expiresAt: '2023-07-15',
      compressionLevel: 'high',
      encrypted: true,
      encryptionType: 'AES-256',
      verificationStatus: 'verified',
      contents: [
        { module: 'Database', size: '850 MB', tables: 42, records: '1.2M' },
        { module: 'Files', size: '320 MB', files: 1240 },
        { module: 'Configurations', size: '30 MB', files: 85 }
      ]
    },
    {
      id: 'backup-002',
      name: 'Database Only Backup',
      type: 'database',
      status: 'completed',
      size: '850 MB',
      createdAt: '2023-06-14 12:15:30',
      completedAt: '2023-06-14 12:22:45',
      duration: '7m 15s',
      createdBy: 'admin@example.com',
      description: 'Manual database backup before schema update',
      location: 'local',
      storageProvider: 'Local Storage',
      retentionPeriod: '15 days',
      expiresAt: '2023-06-29',
      compressionLevel: 'medium',
      encrypted: true,
      encryptionType: 'AES-256',
      verificationStatus: 'verified',
      contents: [
        { module: 'Database', size: '850 MB', tables: 42, records: '1.2M' }
      ]
    },
    {
      id: 'backup-003',
      name: 'Files Only Backup',
      type: 'files',
      status: 'completed',
      size: '320 MB',
      createdAt: '2023-06-13 18:45:10',
      completedAt: '2023-06-13 18:48:22',
      duration: '3m 12s',
      createdBy: 'System',
      description: 'Scheduled files backup',
      location: 'cloud',
      storageProvider: 'Google Cloud Storage',
      retentionPeriod: '30 days',
      expiresAt: '2023-07-13',
      compressionLevel: 'high',
      encrypted: true,
      encryptionType: 'AES-256',
      verificationStatus: 'verified',
      contents: [
        { module: 'Files', size: '320 MB', files: 1240 }
      ]
    },
    {
      id: 'backup-004',
      name: 'Configuration Backup',
      type: 'config',
      status: 'completed',
      size: '30 MB',
      createdAt: '2023-06-12 09:10:05',
      completedAt: '2023-06-12 09:10:45',
      duration: '40s',
      createdBy: 'admin@example.com',
      description: 'Manual configuration backup before system update',
      location: 'local',
      storageProvider: 'Local Storage',
      retentionPeriod: '60 days',
      expiresAt: '2023-08-11',
      compressionLevel: 'low',
      encrypted: true,
      encryptionType: 'AES-256',
      verificationStatus: 'verified',
      contents: [
        { module: 'Configurations', size: '30 MB', files: 85 }
      ]
    },
    {
      id: 'backup-005',
      name: 'Full System Backup',
      type: 'full',
      status: 'in_progress',
      size: '0 MB',
      createdAt: '2023-06-16 10:30:00',
      completedAt: null,
      duration: 'In progress',
      createdBy: 'System',
      description: 'Scheduled full system backup',
      location: 'cloud',
      storageProvider: 'AWS S3',
      retentionPeriod: '30 days',
      expiresAt: null,
      compressionLevel: 'high',
      encrypted: true,
      encryptionType: 'AES-256',
      verificationStatus: 'pending',
      progress: 45,
      contents: []
    },
    {
      id: 'backup-006',
      name: 'Database Only Backup',
      type: 'database',
      status: 'failed',
      size: '0 MB',
      createdAt: '2023-06-15 22:15:30',
      completedAt: '2023-06-15 22:18:45',
      duration: '3m 15s',
      createdBy: 'System',
      description: 'Scheduled database backup',
      location: 'cloud',
      storageProvider: 'AWS S3',
      retentionPeriod: '30 days',
      expiresAt: null,
      compressionLevel: 'high',
      encrypted: true,
      encryptionType: 'AES-256',
      verificationStatus: 'failed',
      error: 'Database connection timeout',
      contents: []
    }
  ];
  
  // Mock data for backup schedules
  const mockSchedules = [
    {
      id: 'schedule-001',
      name: 'Daily Full Backup',
      type: 'full',
      frequency: 'daily',
      time: '01:00',
      daysOfWeek: [],
      dayOfMonth: null,
      lastRun: '2023-06-15 01:00:00',
      nextRun: '2023-06-16 01:00:00',
      status: 'active',
      retention: '30 days',
      storageLocation: 'cloud',
      storageProvider: 'AWS S3',
      compressionLevel: 'high',
      encrypted: true,
      createdBy: 'admin@example.com',
      createdAt: '2023-05-01 10:15:30'
    },
    {
      id: 'schedule-002',
      name: 'Weekly Database Backup',
      type: 'database',
      frequency: 'weekly',
      time: '02:30',
      daysOfWeek: ['sunday'],
      dayOfMonth: null,
      lastRun: '2023-06-11 02:30:00',
      nextRun: '2023-06-18 02:30:00',
      status: 'active',
      retention: '60 days',
      storageLocation: 'cloud',
      storageProvider: 'Google Cloud Storage',
      compressionLevel: 'medium',
      encrypted: true,
      createdBy: 'admin@example.com',
      createdAt: '2023-05-05 14:22:10'
    },
    {
      id: 'schedule-003',
      name: 'Monthly Configuration Backup',
      type: 'config',
      frequency: 'monthly',
      time: '03:15',
      daysOfWeek: [],
      dayOfMonth: 1,
      lastRun: '2023-06-01 03:15:00',
      nextRun: '2023-07-01 03:15:00',
      status: 'active',
      retention: '365 days',
      storageLocation: 'local',
      storageProvider: 'Local Storage',
      compressionLevel: 'low',
      encrypted: true,
      createdBy: 'admin@example.com',
      createdAt: '2023-05-10 09:45:20'
    },
    {
      id: 'schedule-004',
      name: 'Weekly Files Backup',
      type: 'files',
      frequency: 'weekly',
      time: '04:00',
      daysOfWeek: ['wednesday'],
      dayOfMonth: null,
      lastRun: '2023-06-14 04:00:00',
      nextRun: '2023-06-21 04:00:00',
      status: 'paused',
      retention: '90 days',
      storageLocation: 'cloud',
      storageProvider: 'AWS S3',
      compressionLevel: 'high',
      encrypted: true,
      createdBy: 'admin@example.com',
      createdAt: '2023-05-15 11:30:45'
    }
  ];
  
  // Simulate fetching data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real application, this would be API calls
        // const backupsResponse = await fetch('/api/backups');
        // const schedulesResponse = await fetch('/api/backup-schedules');
        // const backupsData = await backupsResponse.json();
        // const schedulesData = await schedulesResponse.json();
        
        // Simulate API delay
        setTimeout(() => {
          setBackups(mockBackups);
          setSchedules(mockSchedules);
          setLoading(false);
        }, 500);
      } catch (err) {
        console.error('Failed to fetch backup data:', err);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Filter backups based on search and filters
  const filteredBackups = backups.filter(backup => {
    // Search query filter
    const matchesSearch = searchQuery === '' || 
      backup.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      backup.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      backup.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Status filter
    const matchesStatus = statusFilter === 'all' || backup.status === statusFilter;
    
    // Type filter
    const matchesType = typeFilter === 'all' || backup.type === typeFilter;
    
    // Date range filter
    let matchesDateRange = true;
    if (dateRangeFilter.start && dateRangeFilter.end) {
      const backupDate = new Date(backup.createdAt);
      const startDate = new Date(dateRangeFilter.start);
      const endDate = new Date(dateRangeFilter.end);
      endDate.setHours(23, 59, 59, 999); // Set to end of day
      
      matchesDateRange = backupDate >= startDate && backupDate <= endDate;
    }
    
    return matchesSearch && matchesStatus && matchesType && matchesDateRange;
  });
  
  // Handle creating a new backup
  const handleCreateBackup = () => {
    setBackupInProgress(true);
    
    // Simulate backup process
    setTimeout(() => {
      setBackupInProgress(false);
      setShowCreateBackupDialog(false);
      
      // Add new backup to the list
      const newBackup = {
        id: `backup-${(backups.length + 1).toString().padStart(3, '0')}`,
        name: 'New Manual Backup',
        type: 'full',
        status: 'completed',
        size: '1.1 GB',
        createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
        completedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
        duration: '12m 45s',
        createdBy: 'admin@example.com',
        description: 'Manual backup created by user',
        location: 'cloud',
        storageProvider: 'AWS S3',
        retentionPeriod: '30 days',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        compressionLevel: 'high',
        encrypted: true,
        encryptionType: 'AES-256',
        verificationStatus: 'verified',
        contents: [
          { module: 'Database', size: '750 MB', tables: 42, records: '1.2M' },
          { module: 'Files', size: '320 MB', files: 1240 },
          { module: 'Configurations', size: '30 MB', files: 85 }
        ]
      };
      
      setBackups([newBackup, ...backups]);
    }, 3000);
  };
  
  // Handle restoring from backup
  const handleRestoreBackup = () => {
    if (!selectedBackup) return;
    
    setRestoreInProgress(true);
    
    // Simulate restore process
    setTimeout(() => {
      setRestoreInProgress(false);
      setShowRestoreDialog(false);
      setSelectedBackup(null);
      
      // Show success message (in a real app)
    }, 5000);
  };
  
  // Handle creating a new backup schedule
  const handleCreateSchedule = () => {
    setShowCreateScheduleDialog(false);
    
    // Add new schedule to the list
    const newSchedule = {
      id: `schedule-${(schedules.length + 1).toString().padStart(3, '0')}`,
      name: 'New Backup Schedule',
      type: 'full',
      frequency: 'daily',
      time: '03:00',
      daysOfWeek: [],
      dayOfMonth: null,
      lastRun: null,
      nextRun: '2023-06-17 03:00:00',
      status: 'active',
      retention: '30 days',
      storageLocation: 'cloud',
      storageProvider: 'AWS S3',
      compressionLevel: 'high',
      encrypted: true,
      createdBy: 'admin@example.com',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    
    setSchedules([newSchedule, ...schedules]);
  };
  
  // Get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Get type badge color
  const getTypeBadgeColor = (type) => {
    switch (type) {
      case 'full':
        return 'bg-purple-100 text-purple-800';
      case 'database':
        return 'bg-blue-100 text-blue-800';
      case 'files':
        return 'bg-green-100 text-green-800';
      case 'config':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return dateString;
  };
  
  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading backup data...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold">Backup Management</h1>
          <p className="text-gray-500 mt-1">Manage system backups and restore points</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button onClick={() => setShowCreateBackupDialog(true)}>
            <svg className="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Backup
          </Button>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-800">
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500">Total Backups</h2>
              <p className="text-2xl font-semibold text-gray-900">{backups.length}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-800">
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500">Successful Backups</h2>
              <p className="text-2xl font-semibold text-gray-900">
                {backups.filter(b => b.status === 'completed').length}
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-800">
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500">In Progress</h2>
              <p className="text-2xl font-semibold text-gray-900">
                {backups.filter(b => b.status === 'in_progress').length}
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 text-red-800">
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500">Failed Backups</h2>
              <p className="text-2xl font-semibold text-gray-900">
                {backups.filter(b => b.status === 'failed').length}
              </p>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Tabs */}
      <Tabs defaultValue="backups" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full md:w-auto grid-cols-2 md:inline-flex">
          <TabsTrigger value="backups">Backup History</TabsTrigger>
          <TabsTrigger value="schedules">Backup Schedules</TabsTrigger>
        </TabsList>
        
        {/* Backups Tab Content */}
        <TabsContent value="backups" className="space-y-4">
          {/* Filters */}
          <Card className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="search">Search</Label>
                <Input
                  id="search"
                  placeholder="Search backups..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="status-filter">Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger id="status-filter">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="type-filter">Type</Label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger id="type-filter">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="full">Full System</SelectItem>
                    <SelectItem value="database">Database Only</SelectItem>
                    <SelectItem value="files">Files Only</SelectItem>
                    <SelectItem value="config">Configuration</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="date-start">Start Date</Label>
                  <Input
                    id="date-start"
                    type="date"
                    value={dateRangeFilter.start}
                    onChange={(e) => setDateRangeFilter({...dateRangeFilter, start: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="date-end">End Date</Label>
                  <Input
                    id="date-end"
                    type="date"
                    value={dateRangeFilter.end}
                    onChange={(e) => setDateRangeFilter({...dateRangeFilter, end: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </Card>
          
          {/* Backups Table */}
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Size
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Storage
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBackups.length > 0 ? (
                    filteredBackups.map((backup) => (
                      <tr key={backup.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-gray-100">
                              <svg className="h-6 w-6 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                              </svg>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{backup.name}</div>
                              <div className="text-sm text-gray-500">{backup.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeBadgeColor(backup.type)}`}>
                            {backup.type === 'full' ? 'Full System' :
                             backup.type === 'database' ? 'Database Only' :
                             backup.type === 'files' ? 'Files Only' :
                             backup.type === 'config' ? 'Configuration' : backup.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {backup.status === 'in_progress' ? (
                            <div className="flex items-center">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(backup.status)}`}>
                                In Progress
                              </span>
                              <div className="ml-2 w-16 bg-gray-200 rounded-full h-2.5">
                                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${backup.progress}%` }}></div>
                              </div>
                              <span className="ml-2 text-xs text-gray-500">{backup.progress}%</span>
                            </div>
                          ) : (
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(backup.status)}`}>
                              {backup.status === 'completed' ? 'Completed' :
                               backup.status === 'failed' ? 'Failed' : backup.status}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {backup.size}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(backup.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {backup.storageProvider}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => {
                                setSelectedBackup(backup);
                                setShowRestoreDialog(true);
                              }}
                              disabled={backup.status !== 'completed'}
                            >
                              Restore
                            </Button>
                            <Button variant="ghost" size="sm">
                              Download
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-800 hover:bg-red-50">
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                        No backups found matching the current filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>
        
        {/* Schedules Tab Content */}
        <TabsContent value="schedules" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => setShowCreateScheduleDialog(true)}>
              <svg className="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Schedule
            </Button>
          </div>
          
          {/* Schedules Table */}
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Frequency
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Next Run
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Storage
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {schedules.length > 0 ? (
                    schedules.map((schedule) => (
                      <tr key={schedule.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-gray-100">
                              <svg className="h-6 w-6 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{schedule.name}</div>
                              <div className="text-sm text-gray-500">{schedule.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeBadgeColor(schedule.type)}`}>
                            {schedule.type === 'full' ? 'Full System' :
                             schedule.type === 'database' ? 'Database Only' :
                             schedule.type === 'files' ? 'Files Only' :
                             schedule.type === 'config' ? 'Configuration' : schedule.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {schedule.frequency === 'daily' ? 'Daily' :
                           schedule.frequency === 'weekly' ? `Weekly (${schedule.daysOfWeek.map(d => d.charAt(0).toUpperCase() + d.slice(1)).join(', ')})` :
                           schedule.frequency === 'monthly' ? `Monthly (Day ${schedule.dayOfMonth})` : schedule.frequency}
                          <div className="text-xs text-gray-400">
                            at {schedule.time}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(schedule.nextRun)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(schedule.status)}`}>
                            {schedule.status === 'active' ? 'Active' :
                             schedule.status === 'paused' ? 'Paused' : schedule.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {schedule.storageProvider}
                          <div className="text-xs text-gray-400">
                            Retention: {schedule.retention}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => {
                                // Toggle schedule status
                                const updatedSchedules = schedules.map(s => {
                                  if (s.id === schedule.id) {
                                    return {
                                      ...s,
                                      status: s.status === 'active' ? 'paused' : 'active'
                                    };
                                  }
                                  return s;
                                });
                                setSchedules(updatedSchedules);
                              }}
                            >
                              {schedule.status === 'active' ? 'Pause' : 'Activate'}
                            </Button>
                            <Button variant="ghost" size="sm">
                              Edit
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-800 hover:bg-red-50">
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                        No backup schedules found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Create Backup Dialog */}
      <Dialog open={showCreateBackupDialog} onOpenChange={setShowCreateBackupDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Backup</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="backup-name">Backup Name</Label>
              <Input id="backup-name" placeholder="Enter backup name" defaultValue="Manual Backup" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="backup-type">Backup Type</Label>
              <Select defaultValue="full">
                <SelectTrigger id="backup-type">
                  <SelectValue placeholder="Select backup type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full">Full System Backup</SelectItem>
                  <SelectItem value="database">Database Only</SelectItem>
                  <SelectItem value="files">Files Only</SelectItem>
                  <SelectItem value="config">Configuration Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="backup-description">Description (Optional)</Label>
              <Input id="backup-description" placeholder="Enter backup description" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="storage-location">Storage Location</Label>
              <Select defaultValue="cloud">
                <SelectTrigger id="storage-location">
                  <SelectValue placeholder="Select storage location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cloud">Cloud Storage (AWS S3)</SelectItem>
                  <SelectItem value="cloud-gcp">Cloud Storage (Google Cloud)</SelectItem>
                  <SelectItem value="local">Local Storage</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="encrypt-backup" defaultChecked />
                <Label htmlFor="encrypt-backup">Encrypt Backup</Label>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="retention-period">Retention Period</Label>
              <Select defaultValue="30">
                <SelectTrigger id="retention-period">
                  <SelectValue placeholder="Select retention period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 Days</SelectItem>
                  <SelectItem value="30">30 Days</SelectItem>
                  <SelectItem value="90">90 Days</SelectItem>
                  <SelectItem value="365">1 Year</SelectItem>
                  <SelectItem value="0">Forever</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateBackupDialog(false)}>Cancel</Button>
            <Button onClick={handleCreateBackup} disabled={backupInProgress}>
              {backupInProgress ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Backup...
                </>
              ) : 'Create Backup'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Restore Backup Dialog */}
      <Dialog open={showRestoreDialog} onOpenChange={setShowRestoreDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Restore from Backup</DialogTitle>
          </DialogHeader>
          
          {selectedBackup && (
            <div className="space-y-4 py-4">
              <div className="bg-yellow-50 p-4 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">Warning</h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>
                        Restoring from a backup will replace all current data with the data from the selected backup. This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Selected Backup</Label>
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-gray-200">
                      <svg className="h-6 w-6 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{selectedBackup.name}</div>
                      <div className="text-sm text-gray-500">{selectedBackup.id}</div>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500">Type:</span>
                      <span className="ml-2 text-gray-900">
                        {selectedBackup.type === 'full' ? 'Full System' :
                         selectedBackup.type === 'database' ? 'Database Only' :
                         selectedBackup.type === 'files' ? 'Files Only' :
                         selectedBackup.type === 'config' ? 'Configuration' : selectedBackup.type}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Size:</span>
                      <span className="ml-2 text-gray-900">{selectedBackup.size}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Created:</span>
                      <span className="ml-2 text-gray-900">{formatDate(selectedBackup.createdAt)}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Storage:</span>
                      <span className="ml-2 text-gray-900">{selectedBackup.storageProvider}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="confirm-restore" />
                  <Label htmlFor="confirm-restore" className="text-sm text-gray-900">
                    I understand that this will overwrite current data and cannot be undone.
                  </Label>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRestoreDialog(false)}>Cancel</Button>
            <Button 
              variant="destructive" 
              onClick={handleRestoreBackup} 
              disabled={restoreInProgress}
            >
              {restoreInProgress ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Restoring...
                </>
              ) : 'Restore System'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Create Schedule Dialog */}
      <Dialog open={showCreateScheduleDialog} onOpenChange={setShowCreateScheduleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Backup Schedule</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="schedule-name">Schedule Name</Label>
              <Input id="schedule-name" placeholder="Enter schedule name" defaultValue="New Backup Schedule" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="backup-type">Backup Type</Label>
              <Select defaultValue="full">
                <SelectTrigger id="backup-type">
                  <SelectValue placeholder="Select backup type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full">Full System Backup</SelectItem>
                  <SelectItem value="database">Database Only</SelectItem>
                  <SelectItem value="files">Files Only</SelectItem>
                  <SelectItem value="config">Configuration Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="frequency">Frequency</Label>
              <Select defaultValue="daily">
                <SelectTrigger id="frequency">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input id="time" type="time" defaultValue="03:00" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="storage-location">Storage Location</Label>
              <Select defaultValue="cloud">
                <SelectTrigger id="storage-location">
                  <SelectValue placeholder="Select storage location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cloud">Cloud Storage (AWS S3)</SelectItem>
                  <SelectItem value="cloud-gcp">Cloud Storage (Google Cloud)</SelectItem>
                  <SelectItem value="local">Local Storage</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="retention-period">Retention Period</Label>
              <Select defaultValue="30">
                <SelectTrigger id="retention-period">
                  <SelectValue placeholder="Select retention period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 Days</SelectItem>
                  <SelectItem value="30">30 Days</SelectItem>
                  <SelectItem value="90">90 Days</SelectItem>
                  <SelectItem value="365">1 Year</SelectItem>
                  <SelectItem value="0">Forever</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="encrypt-backup" defaultChecked />
                <Label htmlFor="encrypt-backup">Encrypt Backup</Label>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateScheduleDialog(false)}>Cancel</Button>
            <Button onClick={handleCreateSchedule}>Create Schedule</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}