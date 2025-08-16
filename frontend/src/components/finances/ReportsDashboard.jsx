'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Loader } from '@/components/ui/Loader';

const ReportsDashboard = ({ timeRange = '7d' }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  
  useEffect(() => {
    // Simulate API call to fetch reports
    const fetchReports = async () => {
      setIsLoading(true);
      try {
        // Replace with actual API call
        const response = await new Promise(resolve => {
          setTimeout(() => {
            resolve({
              success: true,
              data: [
                {
                  id: 'rep-001',
                  name: 'Revenue Summary',
                  description: 'Overview of revenue for the selected period',
                  lastRun: '2023-10-15T14:30:00Z',
                  category: 'financial',
                  type: 'summary'
                },
                {
                  id: 'rep-002',
                  name: 'Transaction Analysis',
                  description: 'Detailed analysis of transactions',
                  lastRun: '2023-10-14T09:15:00Z',
                  category: 'financial',
                  type: 'detailed'
                },
                {
                  id: 'rep-003',
                  name: 'Payment Methods',
                  description: 'Analysis of payment methods used',
                  lastRun: '2023-10-13T16:45:00Z',
                  category: 'financial',
                  type: 'summary'
                },
                {
                  id: 'rep-004',
                  name: 'Refund Report',
                  description: 'Summary of refunds processed',
                  lastRun: '2023-10-12T11:20:00Z',
                  category: 'financial',
                  type: 'detailed'
                },
                {
                  id: 'rep-005',
                  name: 'Discount Usage',
                  description: 'Analysis of discount code usage',
                  lastRun: '2023-10-11T13:10:00Z',
                  category: 'financial',
                  type: 'summary'
                }
              ]
            });
          }, 1000);
        });
        
        if (response.success) {
          setReports(response.data);
        }
      } catch (error) {
        console.error('Error fetching reports:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchReports();
  }, [timeRange]);
  
  const handleReportSelect = (report) => {
    setSelectedReport(report);
  };
  
  const handleRunReport = (reportId) => {
    // In a real app, this would trigger the report to run
    console.log(`Running report: ${reportId}`);
    // Update the lastRun timestamp
    const updatedReports = reports.map(report => {
      if (report.id === reportId) {
        return {
          ...report,
          lastRun: new Date().toISOString()
        };
      }
      return report;
    });
    setReports(updatedReports);
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader size="lg" />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reports.map((report) => (
          <Card key={report.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <div 
              className="p-4" 
              onClick={() => handleReportSelect(report)}
            >
              <h3 className="text-lg font-medium">{report.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{report.description}</p>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-xs text-gray-500">
                  Last run: {formatDate(report.lastRun)}
                </span>
                <Button 
                  size="sm" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRunReport(report.id);
                  }}
                >
                  Run Report
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      {selectedReport && (
        <Card className="mt-6">
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{selectedReport.name}</h2>
              <Button size="sm" variant="outline">
                Export
              </Button>
            </div>
            <p className="text-gray-600 mb-4">{selectedReport.description}</p>
            <div className="p-4 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-500 mb-2">Report details will be displayed here.</p>
              <p className="text-sm text-gray-500">Last run: {formatDate(selectedReport.lastRun)}</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ReportsDashboard;