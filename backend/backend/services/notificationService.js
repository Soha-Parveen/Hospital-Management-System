const Notification = require("../models/Notification");

/**
 * Create a notification for a specific User document (by userId).
 * Fails silently (logs only) so a notification error never breaks the
 * primary request (e.g. creating an appointment should still succeed
 * even if the notification write fails).
 */
const notify = async ({ userId, type, title, message, link }) => {
  try {
    if (!userId) return null;

    return await Notification.create({
      user: userId,
      type: type || "General",
      title,
      message: message || "",
      link: link || "",
    });
  } catch (error) {
    console.log("Notification creation failed:", error.message);
    return null;
  }
};

module.exports = { notify };
