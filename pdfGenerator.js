const PDFDocument = require("pdfkit");
const fs = require("fs");

const drawTable = (doc, headers, data, startX, startY, rowHeight) => {
  let currentY = startY;

  const pageHeight = doc.page.height;
  const bottomMargin = 50;

  doc.fontSize(12).font("Helvetica-Bold");
  headers.forEach((header, i) => {
    doc.text(header, startX + i * 100, currentY, { width: 100, align: "center" });
  });

  currentY += rowHeight;
  doc.fontSize(10).font("Helvetica");

  data.forEach((row) => {
    if (currentY + rowHeight > pageHeight - bottomMargin) {
      doc.addPage();
      currentY = 50;

      doc.fontSize(12).font("Helvetica-Bold");
      headers.forEach((header, i) => {
        doc.text(header, startX + i * 100, currentY, { width: 100, align: "center" });
      });

      currentY += rowHeight;
      doc.fontSize(10).font("Helvetica");
    }

    headers.forEach((header, i) => {
      doc.text(row[header], startX + i * 100, currentY, { width: 100, align: "center" });
    });

    currentY += rowHeight;
  });
};

const generatePDF = (filePath, headers, data) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();

    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    doc.fontSize(20).text("Generated Table", { align: "center" });
    doc.moveDown();

    drawTable(doc, headers, data, 50, 100, 25);

    doc.end();

    writeStream.on("finish", () => resolve(filePath));
    writeStream.on("error", reject);
  });
};

module.exports = { generatePDF };
