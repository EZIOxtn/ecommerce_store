import { Announcement } from '../models/index.js';
import Cache from '../utils/cache.js';

// Create specific cache for announcements (5-minute TTL)
const announcementCache = new Cache(300000); // 5 minutes in milliseconds
const CACHE_KEY = 'all_announcements';

// Get all announcements with caching
export const getAllAnnouncements = async (req, res) => {
  try {
    // Check cache first
    let announcements = announcementCache.get(CACHE_KEY);
    
    if (!announcements) {
      // Cache miss - fetch from database
      announcements = await Announcement.findAll({
        order: [['id', 'DESC']]
      });
      
      // Update cache
      announcementCache.set(CACHE_KEY, announcements);
      console.log('✅ Announcement cache refreshed on request');
    }
    
    res.status(200).json({
      statusCode: 200,
      message: 'Announcements fetched successfully',
      data: announcements
    });
  } catch (error) {
    console.error('Error fetching announcements:', error);
    res.status(500).json({
      statusCode: 500,
      message: 'Internal server error',
      data: []
    });
  }
};

// Function to refresh cache every 5 minutes
export const startAnnouncementCacheRefresh = () => {
  // Initial cache population
  refreshAnnouncementCache();
  
  // Set up periodic refresh
  setInterval(refreshAnnouncementCache, 300000); // 5 minutes
};

// Helper to refresh the cache
const refreshAnnouncementCache = async () => {
  try {
    const announcements = await Announcement.findAll({
      order: [['id', 'DESC']]
    });
    
    announcementCache.set(CACHE_KEY, announcements);
    console.log('✅ Announcement cache refreshed automatically');
  } catch (error) {
    console.error('❌ Failed to refresh announcement cache:', error);
  }
};