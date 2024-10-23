const express = require('express');
const router = express.Router();
const announcementController = require('../controllers/announcementController');

// Get all announcements
router.get('/', announcementController.getAllAnnouncements);

// Get a specific announcement
router.get('/:id', announcementController.getAnnouncementById);

// Create a new announcement
router.post('/', announcementController.createAnnouncement);

// Update an announcement
router.put('/:id', announcementController.updateAnnouncement);

// Delete an announcement
router.delete('/:id', announcementController.deleteAnnouncement);

module.exports = router;
