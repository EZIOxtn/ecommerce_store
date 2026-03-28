import express from 'express';
import { getAllAnnouncements } from '../controllers/AnnouncementController.js';

const router = express.Router();

// Get all announcements
router.get('/', getAllAnnouncements);

export default router;