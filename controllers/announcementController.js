const db = require('../models');
const { Announcement,Sequelize } = db;

// Get all announcements
exports.getAllAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.findAll();
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve announcements' });
  }
};

// Get a specific announcement
exports.getAnnouncementById = async (req, res) => {
  try {
    const announcement = await Announcement.findByPk(req.params.id);
    if (announcement) {
      res.json(announcement);
    } else {
      res.status(404).json({ error: 'Announcement not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve announcement' });
  }
};

// Create a new announcement
exports.createAnnouncement = async (req, res) => {
  try {
    const { title, content, date } = req.body;
    const newAnnouncement = await Announcement.create({ title, content, date });
    res.status(201).json(newAnnouncement);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create announcement' });
  }
};

// Update an announcement
exports.updateAnnouncement = async (req, res) => {
  try {
    const { title, content, date } = req.body;
    const announcement = await Announcement.findByPk(req.params.id);
    if (announcement) {
      await announcement.update({ title, content, date });
      res.json(announcement);
    } else {
      res.status(404).json({ error: 'Announcement not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update announcement' });
  }
};

// Delete an announcement
exports.deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findByPk(req.params.id);
    if (announcement) {
      await announcement.destroy();
      res.json({ message: 'Announcement deleted' });
    } else {
      res.status(404).json({ error: 'Announcement not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete announcement' });
  }
};
