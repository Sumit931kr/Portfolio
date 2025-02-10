import nodemailer from 'nodemailer'

const sendEmail = async (name, email, message) => {
    // Create a transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        service: 'gmail', // You can use other services like 'yahoo', 'outlook', etc.
        auth: {
            user: process.env.EMAIL, // Your email address
            pass: process.env.PASSWORD   // Your email password or app-specific password
        },
  //      debug: true,  // Enable debug logs
//        logger: true  // Log SMTP communication
    
    });


    // Email options
    let mailOptionsForUser = {
        from: process.env.EMAIL, // Sender address
        to: email, // List of recipients
        subject: 'Thanks for reaching out', // Subject line
        text: 'Thanks for reaching out', // Plain text body
        html: `<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thank You!</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            text-align: center;
            padding: 50px;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            max-width: 500px;
            margin: auto;
        }
        h1 {
            color: #333;
        }
        p {
            color: #666;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Thank You!</h1>
        <p>We appreciate you reaching out. Your message has been received, and we will get back to you as soon as possible.</p>
    </div>
</body>
</html>
`
    };

    let mailOptionsForMe = {
        from: process.env.EMAIL, // Sender address
        to: 'sumit931kumar@gmail.com', // List of recipients
        subject: 'Thanks for reaching out', // Subject line
        text: 'Thanks for reaching out', // Plain text body
        html: `<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contact Details</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            text-align: center;
            padding: 50px;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            max-width: 500px;
            margin: auto;
        }
        h1 {
            color: #333;
        }
        p {
            color: #666;
            font-size: 18px;
        }
        .info {
            text-align: left;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>A new User has reached out!</h1>
        <p>We appreciate you reaching out. Here are the details you provided:</p>
        <div class="info">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong> ${message}</p>
        </div>
    </div>
</body>
</html>`
    }

    try {
        const mailForUser = await transporter.sendMail(mailOptionsForUser)
        const mailForMe = await transporter.sendMail(mailOptionsForMe)

        // console.log('Email sent: ', mailForUser.messageId);
        // console.log('Email sent: ', mailForMe.messageId)
    } catch (error) {
        console.log('Error occurred: ', error);
    }


    console.log("sendEmail function finished")

}

export default sendEmail;