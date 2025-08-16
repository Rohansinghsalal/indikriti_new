/**
 * Support Routes
 */
const express = require('express');
const router = express.Router();
const TicketController = require('../../../controllers/support/TicketController');
const FAQController = require('../../../controllers/support/FAQController');
const ContactController = require('../../../controllers/support/ContactController');
const permissionMiddleware = require('../../../middleware/permissionCheck');
const { validateRequest } = require('../../../middleware/validation');

// Support ticket routes
router.get('/tickets', permissionMiddleware('tickets:view'), TicketController.getAllTickets);
router.get('/tickets/:id', permissionMiddleware('tickets:view'), TicketController.getTicketById);
router.post('/tickets', validateRequest(), TicketController.createTicket);
router.put('/tickets/:id', permissionMiddleware('tickets:update'), validateRequest(), TicketController.updateTicket);
router.delete('/tickets/:id', permissionMiddleware('tickets:delete'), TicketController.deleteTicket);
router.put('/tickets/:id/status', permissionMiddleware('tickets:update'), validateRequest(), TicketController.updateTicketStatus);
router.put('/tickets/:id/priority', permissionMiddleware('tickets:update'), validateRequest(), TicketController.updateTicketPriority);
router.put('/tickets/:id/assign', permissionMiddleware('tickets:assign'), validateRequest(), TicketController.assignTicket);

// Ticket replies
router.get('/tickets/:id/replies', permissionMiddleware('tickets:view'), TicketController.getTicketReplies);
router.post('/tickets/:id/replies', permissionMiddleware('tickets:update'), validateRequest(), TicketController.addTicketReply);
router.put('/tickets/:id/replies/:replyId', permissionMiddleware('tickets:update'), validateRequest(), TicketController.updateTicketReply);
router.delete('/tickets/:id/replies/:replyId', permissionMiddleware('tickets:delete'), TicketController.deleteTicketReply);

// Ticket attachments
router.get('/tickets/:id/attachments', permissionMiddleware('tickets:view'), TicketController.getTicketAttachments);
router.post('/tickets/:id/attachments', permissionMiddleware('tickets:update'), TicketController.uploadTicketAttachment);
router.delete('/tickets/:id/attachments/:attachmentId', permissionMiddleware('tickets:delete'), TicketController.deleteTicketAttachment);

// FAQ routes
router.get('/faqs', FAQController.getAllFAQs);
router.get('/faqs/categories', FAQController.getFAQCategories);
router.get('/faqs/categories/:id', FAQController.getFAQsByCategory);
router.get('/faqs/:id', FAQController.getFAQById);
router.post('/faqs', permissionMiddleware('content:create'), validateRequest(), FAQController.createFAQ);
router.put('/faqs/:id', permissionMiddleware('content:update'), validateRequest(), FAQController.updateFAQ);
router.delete('/faqs/:id', permissionMiddleware('content:delete'), FAQController.deleteFAQ);
router.put('/faqs/:id/status', permissionMiddleware('content:update'), FAQController.toggleFAQStatus);

// FAQ categories
router.post('/faqs/categories', permissionMiddleware('content:create'), validateRequest(), FAQController.createFAQCategory);
router.put('/faqs/categories/:id', permissionMiddleware('content:update'), validateRequest(), FAQController.updateFAQCategory);
router.delete('/faqs/categories/:id', permissionMiddleware('content:delete'), FAQController.deleteFAQCategory);

// Contact form
router.post('/contact', validateRequest(), ContactController.submitContactForm);
router.get('/contact/submissions', permissionMiddleware('contact:view'), ContactController.getContactSubmissions);
router.get('/contact/submissions/:id', permissionMiddleware('contact:view'), ContactController.getContactSubmissionById);
router.put('/contact/submissions/:id/status', permissionMiddleware('contact:update'), validateRequest(), ContactController.updateContactSubmissionStatus);
router.delete('/contact/submissions/:id', permissionMiddleware('contact:delete'), ContactController.deleteContactSubmission);
router.post('/contact/submissions/:id/reply', permissionMiddleware('contact:update'), validateRequest(), ContactController.replyToContactSubmission);

module.exports = router;