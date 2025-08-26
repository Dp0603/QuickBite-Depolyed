const path = require("path");
const fs = require("fs");
const PDFDocument = require("pdfkit");
const moment = require("moment");

const generatePayoutInvoice = (payout, res) => {
  const doc = new PDFDocument({ margin: 50 });

  // === Center Text Helper
  const centerText = (text, y, options = {}) => {
    const textWidth = doc.widthOfString(text, options);
    const x = (doc.page.width - textWidth) / 2;
    doc.text(text, x, y, options);
  };

  // === Font
  const fontPath = path.join(__dirname, "../assets/fonts/NotoSans-Regular.ttf");
  if (fs.existsSync(fontPath)) {
    doc.registerFont("Noto", fontPath);
    doc.font("Noto");
  } else {
    doc.font("Helvetica");
  }

  const filename = `payout_invoice_${payout._id}.pdf`;
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
  doc.pipe(res);

  // === Header
  doc.image(path.join(__dirname, "../assets/Quickbite.png"), 50, 40, {
    width: 60,
  });
  doc
    .fontSize(22)
    .fillColor("#f97316")
    .text("QuickBite", 120, 45)
    .fontSize(10)
    .fillColor("#666")
    .text("QuickBite Food Pvt. Ltd.", 120, 72)
    .text("Ahmedabad, India", 120, 85)
    .text("support@quickbite.com", 120, 98);

  // === Invoice title
  doc
    .fontSize(20)
    .fillColor("#111827")
    .text("PAYOUT INVOICE", 400, 50, { align: "right" })
    .fontSize(10)
    .fillColor("#444")
    .text(`Invoice #: ${payout._id}`, { align: "right" })
    .text(`Date: ${moment(payout.createdAt).format("DD/MM/YYYY")}`, {
      align: "right",
    });

  doc.moveDown(2);

  // === Payee Info (fallback since name/email aren’t in schema yet)
  const topY = doc.y;
  doc
    .fontSize(11)
    .fillColor("#111827")
    .text("Payout To:", 50, topY)
    .fontSize(10)
    .fillColor("#444")
    .text(`${payout.payeeType?.toUpperCase()} - ${payout.payeeId}`, 50);

  const paymentX = 350;
  doc
    .fontSize(11)
    .fillColor("#111827")
    .text("Payout Details:", paymentX, topY)
    .fontSize(10)
    .fillColor("#444")
    .text(`Method: ${payout.bankDetails?.method || "Bank Transfer"}`, paymentX)
    .text(`Status: ${payout.status || "Processed"}`, paymentX)
    .text(`Reference ID: ${payout.referenceId || "N/A"}`, paymentX)
    .text(`Payout ID: ${payout._id}`, paymentX);

  doc.moveDown();
  doc.strokeColor("#E5E7EB").moveTo(50, doc.y).lineTo(550, doc.y).stroke();
  doc.moveDown();

  // === Amount
  doc
    .fontSize(14)
    .fillColor("#111827")
    .text("Amount Paid", 50, doc.y + 20)
    .fontSize(18)
    .fillColor("#000")
    .text(`₹${(payout.payoutAmount ?? 0).toFixed(2)}`, 50, doc.y + 5);

  // === Bank Account Snapshot (extra transparency)
  if (payout.bankDetails) {
    doc.moveDown(2);
    doc
      .fontSize(11)
      .fillColor("#111827")
      .text("Bank Details (at payout time):", 50, doc.y)
      .fontSize(10)
      .fillColor("#444")
      .text(`Account: ${payout.bankDetails.bankAccount || "N/A"}`, 50)
      .text(`IFSC: ${payout.bankDetails.ifsc || "N/A"}`, 50)
      .text(`UPI: ${payout.bankDetails.upiId || "N/A"}`, 50);
  }

  doc.moveDown(3);

  // === Footer
  doc.strokeColor("#E5E7EB").moveTo(50, doc.y).lineTo(550, doc.y).stroke();
  doc.moveDown(1.2);

  const footerY = doc.y;
  centerText(
    "QuickBite is a registered brand of QuickBite Food Pvt. Ltd.",
    footerY,
    { fontSize: 9 }
  );
  centerText(
    "This invoice is system-generated and valid without a signature.",
    footerY + 12,
    { fontSize: 9 }
  );
  centerText("Thank you for partnering with QuickBite!", footerY + 28, {
    fontSize: 11,
  });

  doc.end();
};

module.exports = generatePayoutInvoice;
