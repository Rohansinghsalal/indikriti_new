/**
 * CMS API Routes
 */
const express = require('express');
const router = express.Router();
const { validateRequest } = require('../../../middleware/validation');
const permissionCheck = require('../../../middleware/permissionCheck');
const ContentController = require('../../../controllers/cms/ContentController');
const PageController = require('../../../controllers/cms/PageController');
const SEOController = require('../../../controllers/cms/SEOController');

// Page routes
router.get('/pages', permissionCheck('View CMS'), PageController.getAllPages);
router.post('/pages', permissionCheck('Create CMS Pages'), validateRequest(), PageController.createPage);
router.get('/pages/:id', permissionCheck('View CMS'), PageController.getPageById);
router.put('/pages/:id', permissionCheck('Update CMS Pages'), validateRequest(), PageController.updatePage);
router.delete('/pages/:id', permissionCheck('Delete CMS Pages'), PageController.deletePage);
router.post('/pages/:id/publish', permissionCheck('Publish CMS Pages'), PageController.publishPage);
router.get('/pages/slug/:slug', permissionCheck('View CMS'), PageController.getPageBySlug);

// Content block routes
router.get('/blocks', permissionCheck('View Content'), ContentController.getAllBlocks);
router.post('/blocks', permissionCheck('Create Content'), validateRequest(), ContentController.createBlock);
router.get('/blocks/:id', permissionCheck('View Content'), ContentController.getBlockById);
router.put('/blocks/:id', permissionCheck('Update Content'), validateRequest(), ContentController.updateBlock);
router.delete('/blocks/:id', permissionCheck('Delete Content'), ContentController.deleteBlock);
router.get('/blocks/key/:key', permissionCheck('View Content'), ContentController.getBlockByKey);

// Media routes
router.get('/media', permissionCheck('View Content'), ContentController.getAllMedia);
router.post('/media/upload', permissionCheck('Create Content'), ContentController.uploadMedia);
router.delete('/media/:id', permissionCheck('Delete Content'), ContentController.deleteMedia);
router.post('/media/folder', permissionCheck('Create Content'), validateRequest(), ContentController.createFolder);
router.get('/media/folders', permissionCheck('View Content'), ContentController.getAllFolders);

// Menu routes
router.get('/menus', permissionCheck('View Content'), ContentController.getAllMenus);
router.post('/menus', permissionCheck('Create Content'), validateRequest(), ContentController.createMenu);
router.get('/menus/:id', permissionCheck('View Content'), ContentController.getMenuById);
router.put('/menus/:id', permissionCheck('Update Content'), validateRequest(), ContentController.updateMenu);
router.delete('/menus/:id', permissionCheck('Delete Content'), ContentController.deleteMenu);
router.get('/menus/location/:location', permissionCheck('View Content'), ContentController.getMenuByLocation);

// SEO routes
router.get('/seo', permissionCheck('View Content'), SEOController.getAllSEOSettings);
router.put('/seo', permissionCheck('Update Content'), validateRequest(), SEOController.updateSEOSettings);
router.get('/seo/:page', permissionCheck('View Content'), SEOController.getSEOByPage);
router.put('/seo/:page', permissionCheck('Update Content'), validateRequest(), SEOController.updateSEOByPage);

module.exports = router; 