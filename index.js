const express = require('express');
const nodemailer = require('nodemailer');
const cron = require('node-cron');
const { generatePDF } = require("./pdfGenerator");
const path = require("path");
const { queryDatabase } = require('./db');
const config = require('./config');
const app = express();

// Email Configuration
const transporter = nodemailer.createTransport({
    service: config.email.service,
    auth: {
        user: config.email.user,
        pass: config.email.pass,
    },
});

// Sample Data for PDF (optional, you can fetch it from the database)
const data = [
    { ID: 1, Name: "John Doe", Age: 30, City: "New York", Profession: "Engineer" },
    { ID: 2, Name: "Jane Smith", Age: 25, City: "Los Angeles", Profession: "Designer" },
];

// Fetch data from SQL Server (example query)
const fetchDataFromDB = async () => {
    const query = 'SELECT * FROM c.company';
    return await queryDatabase(query);
};

// Schedule Email Sending with PDF Attachment
cron.schedule('32 12 * * *', async () => {
    const headers = Object.keys(data[0]);
    const outputPath = path.join(__dirname, "output.pdf");

    try {
        // Generate the PDF
        await generatePDF(outputPath, headers, data);
        console.log('PDF generated successfully');

        // Send the Email with the PDF as an attachment
        await transporter.sendMail({
            from: `"Your App" <${config.email.user}>`,
            to: config.email.user,
            subject: 'Scheduled Email with PDF',
            text: 'This is an automated email with the generated PDF attached.',
            attachments: [
                {
                    filename: 'table.pdf',
                    path: outputPath,
                },
            ],
        });

        console.log('Email sent successfully with PDF attachment');
    } catch (error) {
        console.error('Error sending email with PDF:', error.message);
    }
});

// Endpoint to Generate and Download PDF
app.get("/generate-pdf", async (req, res) => {
    const headers = Object.keys(data[0]);
    const outputPath = path.join(__dirname, "output.pdf");

    try {
        await generatePDF(outputPath, headers, data);
        res.download(outputPath, "table.pdf", (err) => {
            if (err) {
                console.error("Error during file download:", err?.message);
                res.status(500).send("Failed to generate PDF");
            }
        });
    } catch (error) {
        console.error("Error generating PDF:", error?.message);
        res.status(500).send("Error generating PDF");
    }
});
app.get('/fetchValues',async(req,res)=>{
    try{
        const data = await fetchDataFromDB();
        
        res.status(200).json({
            msg:"Hitted successfully",
            data
        })
    }catch(error){
        res.status(500).send("Something went error");
    }
})

app.listen(8000, () => {
    console.log('Server running on port 8000');
});
