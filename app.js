const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const port = 3000;

// Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

// Set up Nodemailer for sending emails
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'gpoquendo4@gmail.com',
    pass: 'ecmq fzek doqo cgdu',
  },
});

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/upload', upload.single('file'), (req, res) => {
    const recipientEmail = req.body.recipient;
    const message = req.body.message || '';

  if (!recipientEmail) {
    return res.status(400).send('Recipient\'s email is required.');
  }
  // The file is uploaded, you can send an email here
  const mailOptions = {
    from: 'gpoquendo4@gmail.com', // Replace with your Gmail email
    to: recipientEmail, // Replace with the recipient's email
    subject: 'File Uploaded',
    text: message || 'A file has been uploaded.',
    attachments: [
      {
        filename: req.file.filename,
        path: req.file.path,
      },
    ],
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.error('Error sending email:', error);
        return res.status(500).send('Error sending email');
      }
    console.log('Email sent: ' + info.response);
  });

  res.send('File uploaded and email sent!');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
