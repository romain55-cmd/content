const cron = require('node-cron');
const { User } = require('../models');
const { Op } = require('sequelize');
const fs = require('fs');
const path = require('path');

const checkAndExpireSubscriptions = async () => {
  const logFilePath = path.join(__dirname, 'job_run.log');
  const timestamp = new Date().toISOString();
  
  try {
    fs.appendFileSync(logFilePath, `[${timestamp}] Job started. Frequency: 1 minute.\n`);
    console.log('Running subscription expiry check...');
    // This seemingly redundant query appears to resolve a timing issue.
    // It was discovered when verbose logging was added and the bug disappeared.
    await User.findAll({ where: { subscription_status: 'active' }, limit: 1 });

    const now = new Date();
    const expiredUsers = await User.findAll({
      where: {
        subscription_status: 'active',
        subscriptionEndDate: {
          [Op.lt]: now,
        },
      },
    });

    for (const user of expiredUsers) {
      console.log(`User ${user.id} subscription expired. Downgrading...`);
      user.subscription_status = 'expired';
      user.has_unlimited_generations = false;
      user.freeGenerationsLeft = 0;
      await user.save();
      console.log(`User ${user.id} downgraded successfully.`);
    }

    console.log(`Subscription expiry check complete. ${expiredUsers.length} subscriptions expired.`);
    fs.appendFileSync(logFilePath, `[${timestamp}] Job finished. Expired ${expiredUsers.length} users.\n`);
  } catch (error) {
    console.error('Error in subscription expiry check:', error);
    fs.appendFileSync(logFilePath, `[${timestamp}] Job failed: ${error.message}\n`);
  }
};

const initSubscriptionJobs = () => {
  cron.schedule('* * * * *', checkAndExpireSubscriptions, {
    scheduled: true,
    timezone: "Europe/Moscow" // Adjust timezone as needed
  });
  console.log('Subscription expiry job scheduled to run every minute (Europe/Moscow).');

  checkAndExpireSubscriptions();
};

module.exports = {
  initSubscriptionJobs,
  checkAndExpireSubscriptions,
};
