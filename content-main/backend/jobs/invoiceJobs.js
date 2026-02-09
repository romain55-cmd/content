const cron = require('node-cron');
const { Op } = require('sequelize');
const { Invoice } = require('../models'); // Import from the central models index

// This job runs every day at 1:00 AM.
const scheduleOverdueCheck = () => {
  cron.schedule('0 1 * * *', async () => {
    console.log('Running a daily check for overdue invoices...');
    
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to the beginning of the day

    try {
      const [updatedCount] = await Invoice.update(
        { status: 'overdue' },
        {
          where: {
            status: 'sent',
            dueDate: { [Op.lt]: today },
          },
        }
      );

      if (updatedCount > 0) {
        console.log(`Updated ${updatedCount} invoices to overdue.`);
        // Here you could add more complex logic, like sending notifications for each updated invoice.
      } else {
        console.log('No overdue invoices found to update.');
      }
      
    } catch (error) {
      console.error('Error checking for overdue invoices:', error);
    }
  });
};

module.exports = { scheduleOverdueCheck };