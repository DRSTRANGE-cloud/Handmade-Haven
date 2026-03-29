import express from 'express';
import nodemailer from 'nodemailer';

const router = express.Router();

router.post('/', async (req, res) => {
  const { name, email, subject, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'deepakyadav887900@gmail.com',
        pass: process.env.EMAIL_PASS, // app password
      },
    });

    await transporter.sendMail({
      from: email,
      to: 'deepakyadav887900@gmail.com',
      subject: `Contact Form: ${subject}`,
      text: `
Name: ${name}
Email: ${email}

Message:
${message}
      `,
    });

    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to send email' });
  }
});

export default router;