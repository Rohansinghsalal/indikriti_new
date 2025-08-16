/**
 * Analytics Routes
 */
const express = require('express');
const router = express.Router();
const DashboardController = require('../../../controllers/analytics/DashboardController');
const ReportController = require('../../../controllers/analytics/ReportController');
const SalesController = require('../../../controllers/analytics/SalesController');
const permissionMiddleware = require('../../../middleware/permissionCheck');
const { validateRequest } = require('../../../middleware/validation');

// Dashboard analytics
router.get('/dashboard/stats', permissionMiddleware('analytics:view'), DashboardController.getDashboardSummary);
router.get('/dashboard/stats', permissionMiddleware('analytics:view'), DashboardController.getDashboardStats);
router.get('/dashboard/charts', permissionMiddleware('analytics:view'), DashboardController.getDashboardCharts);
router.get('/dashboard/performance', permissionMiddleware('analytics:view'), DashboardController.getPerformanceMetrics);
router.get('/dashboard/activity', permissionMiddleware('analytics:view'), DashboardController.getRecentActivity);
router.get('/dashboard/notifications', permissionMiddleware('analytics:view'), DashboardController.getNotifications);
router.post('/dashboard/customize', permissionMiddleware('analytics:customize'), validateRequest(), DashboardController.customizeDashboard);
router.get('/dashboard/custom', permissionMiddleware('analytics:view'), DashboardController.getCustomDashboard);

// Sales analytics
router.get('/sales/summary', permissionMiddleware('analytics:view'), SalesController.getSalesSummary);
router.get('/sales/trends', permissionMiddleware('analytics:view'), SalesController.getSalesTrends);
router.get('/sales/products', permissionMiddleware('analytics:view'), SalesController.getProductSales);
router.get('/sales/customers', permissionMiddleware('analytics:view'), SalesController.getCustomerSales);
router.get('/sales/channels', permissionMiddleware('analytics:view'), SalesController.getSalesByChannel);
router.get('/sales/geography', permissionMiddleware('analytics:view'), SalesController.getSalesByGeography);
router.get('/sales/periods', permissionMiddleware('analytics:view'), SalesController.getSalesByPeriod);
router.get('/sales/staff', permissionMiddleware('analytics:view'), SalesController.getSalesByStaff);
router.get('/sales/forecasts', permissionMiddleware('analytics:view'), SalesController.getSalesForecasts);

// Custom reports
router.get('/reports', permissionMiddleware('analytics:view'), ReportController.getAllReports);
router.get('/reports/:id', permissionMiddleware('analytics:view'), ReportController.getReportById);
router.post('/reports', permissionMiddleware('analytics:create'), validateRequest(), ReportController.createReport);
router.put('/reports/:id', permissionMiddleware('analytics:update'), validateRequest(), ReportController.updateReport);
router.delete('/reports/:id', permissionMiddleware('analytics:delete'), ReportController.deleteReport);
router.get('/reports/:id/generate', permissionMiddleware('analytics:view'), ReportController.generateReport);
router.get('/reports/:id/export/:format', permissionMiddleware('analytics:view'), ReportController.exportReport);
router.post('/reports/schedule', permissionMiddleware('analytics:schedule'), validateRequest(), ReportController.scheduleReport);
router.put('/reports/schedule/:id', permissionMiddleware('analytics:schedule'), validateRequest(), ReportController.updateReportSchedule);
router.delete('/reports/schedule/:id', permissionMiddleware('analytics:schedule'), ReportController.deleteReportSchedule);

// Real-time analytics
router.get('/realtime/overview', permissionMiddleware('analytics:view'), DashboardController.getRealtimeOverview);
router.get('/realtime/sales', permissionMiddleware('analytics:view'), SalesController.getRealtimeSales);
router.get('/realtime/visitors', permissionMiddleware('analytics:view'), DashboardController.getRealtimeVisitors);

// Customer analytics
router.get('/customers/segments', permissionMiddleware('analytics:view'), ReportController.getCustomerSegments);
router.get('/customers/lifetime-value', permissionMiddleware('analytics:view'), ReportController.getCustomerLifetimeValue);
router.get('/customers/retention', permissionMiddleware('analytics:view'), ReportController.getCustomerRetention);
router.get('/customers/acquisition', permissionMiddleware('analytics:view'), ReportController.getCustomerAcquisition);
router.get('/customers/churn', permissionMiddleware('analytics:view'), ReportController.getCustomerChurn);

// Inventory analytics
router.get('/inventory/performance', permissionMiddleware('analytics:view'), ReportController.getInventoryPerformance);
router.get('/inventory/turnover', permissionMiddleware('analytics:view'), ReportController.getInventoryTurnover);
router.get('/inventory/forecasts', permissionMiddleware('analytics:view'), ReportController.getInventoryForecasts);
router.get('/inventory/slow-moving', permissionMiddleware('analytics:view'), ReportController.getSlowMovingInventory);

// Export functionality
router.post('/export/custom', permissionMiddleware('analytics:export'), validateRequest(), ReportController.exportCustomData);
router.get('/export/templates', permissionMiddleware('analytics:view'), ReportController.getExportTemplates);

module.exports = router;