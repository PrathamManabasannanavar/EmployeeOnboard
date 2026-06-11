const cron = require('node-cron')
const nodemailer = require('nodemailer');
const EmpProgress = require('./EmpProgressSchema')
const dayjs = require('dayjs')
require('dotenv').config();

cron.schedule('06 12 * * *', async (req, resp) => {
    console.log("inside schedule");
    const today = new Date()
    const users = await EmpProgress.find({dueDate: { $gte: today.getDate() - 2 } })
    // console.log(users);
    const userHTML = generateUserListHTML(users)
    sendNotificationEmail(process.env.TO_EMAIL, userHTML)
})

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_PASS
    }
});


async function sendNotificationEmail(toEmail, userHTML) {
    const mailOptions = {
        from: process.env.ADMIN_EMAIL,
        to: toEmail,
        subject: "Notification to admin",
        text: `List of Employees approaching the deadend to complete the tasks at given amount of time`,
        html: userHTML
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent: ${info.response}`);
    } catch (err) {
        console.error(`Failed to send email:`, err);
    }
}


function generateUserListHTML(users) {
    if (users.length === 0) {
        return '<p>No employees are currently approaching the deadline.</p>';
    }

    let rows = users.map(user => `
    <tr>
      <td>${user.username}</td>
      <td>${user.taskId}</td>
      <td>${dayjs(user.dueDate).format('YYYY-MM-DD')}</td>
      <td style="color: red;">Approaching / Approached Deadline</td>
    </tr>
  `).join('');

    return `
    <p>Hello Admin,</p>
    <p>The following employees are approaching their onboarding deadline:</p>
    <table border="1" cellpadding="6" cellspacing="0">
      <thead>
        <tr>
          <th>Name</th>
          <th>Project ID</th>
          <th>Due Date</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
    <p>Please follow up with them accordingly.</p>
    <p>Regards,<br/>HR Team</p>
  `;
}
