const cron = require('node-cron');
const Activity = require('./models/Activity');
const { sendReminderEmail } = require('./services/emailService');

const scheduleEmailReminders = () => {
  cron.schedule('0 0 * * *', async () => {
    try {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const activities = await Activity.find({
        deadline: {
          $gte: tomorrow.setHours(0, 0, 0, 0),
          $lt: tomorrow.setHours(23, 59, 59, 999),
        },
      });

      activities.forEach(activity => {
        sendReminderEmail(activity.email, activity.title, activity.deadline);
      });
    } catch (error) {
      console.error('Errore durante il controllo delle attività:', error);
    }
  });
};

module.exports = { scheduleEmailReminders };
