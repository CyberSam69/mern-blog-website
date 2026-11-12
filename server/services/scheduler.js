const Post = require('../models/Post');

let schedulerInterval = null;

/**
 * Checks for past-due scheduled posts and transitions them to published
 */
const publishScheduledPosts = async () => {
  try {
    const { getStatus } = require('../config/db');
    if (!getStatus().connected) {
      // Database not connected; skip check silently
      return;
    }

    const now = new Date();
    const scheduledPosts = await Post.find({
      status: 'scheduled',
      scheduledFor: { $lte: now },
    });

    if (scheduledPosts.length > 0) {
      for (const post of scheduledPosts) {
        post.status = 'published';
        post.publishedAt = post.scheduledFor || now;
        await post.save();
        console.log(`[Scheduler] Auto-published post: "${post.title}" (Scheduled for: ${post.scheduledFor})`);
      }
    }
  } catch (error) {
    // Fail silently without crashing the server if DB is temporarily disconnected
    console.warn('[Scheduler] Notice during check:', error.message);
  }
};

/**
 * Start the recurring scheduler daemon (runs every 60 seconds)
 */
const startScheduler = (intervalMs = 60000) => {
  if (schedulerInterval) clearInterval(schedulerInterval);
  // Initial check
  publishScheduledPosts();
  // Periodic check
  schedulerInterval = setInterval(publishScheduledPosts, intervalMs);
  console.log(`[Scheduler] Background post publication scheduler active (interval: ${intervalMs / 1000}s)`);
};

const stopScheduler = () => {
  if (schedulerInterval) {
    clearInterval(schedulerInterval);
    schedulerInterval = null;
  }
};

module.exports = { startScheduler, stopScheduler, publishScheduledPosts };

