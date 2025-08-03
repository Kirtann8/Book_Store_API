const nodemailer = require('nodemailer');

class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `BookStore <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      return nodemailer.createTransporter({
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD
        }
      });
    }

    return nodemailer.createTransporter({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  async send(template, subject) {
    const html = `
      <h1>Welcome ${this.firstName}!</h1>
      <p>${template}</p>
      <a href="${this.url}">Click here</a>
    `;

    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html
    };

    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to BookStore!');
  }

  async sendPasswordReset() {
    await this.send('passwordReset', 'Password Reset Token (valid for 10 minutes)');
  }
}

module.exports = Email;