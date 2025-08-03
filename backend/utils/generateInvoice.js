const path = require("path");
const fs = require("fs");
const PDFDocument = require("pdfkit");
const moment = require("moment");

const generateInvoice = (order, res) => {
  const doc = new PDFDocument({ margin: 50 });

  // === Centered Text Helper
  const centerText = (text, y, options = {}) => {
    const textWidth = doc.widthOfString(text, options);
    const x = (doc.page.width - textWidth) / 2;
    doc.text(text, x, y, options);
  };

  // === Font
  const fontPath = path.join(__dirname, "../assets/fonts/NotoSans-Regular.ttf");
  const hasFont = fs.existsSync(fontPath);
  if (hasFont) {
    doc.registerFont("Noto", fontPath);
    doc.font("Noto");
  } else {
    console.warn("⚠️ Custom font not found. Using default.");
    doc.font("Helvetica");
  }

  const filename = `invoice_${order._id}.pdf`;
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
    .text("INVOICE", 400, 50, { align: "right" })
    .fontSize(10)
    .fillColor("#444")
    .text(`Invoice #: ${order._id}`, { align: "right" })
    .text(`Date: ${moment(order.createdAt).format("DD/MM/YYYY")}`, {
      align: "right",
    });

  doc.moveDown(2);

  // === Billing Info
  const topY = doc.y;
  const addr = order.deliveryAddress || {};
  doc
    .fontSize(11)
    .fillColor("#111827")
    .text("Billed To:", 50, topY)
    .fontSize(10)
    .fillColor("#444")
    .text(addr.label || "Customer", 50)
    .text(addr.addressLine || "N/A", 50)
    .text(addr.landmark || "", 50)
    .text(
      `${addr.city || "City"}, ${addr.state || "State"} - ${
        addr.pincode || ""
      }`,
      50
    );

  const paymentX = 350;
  doc
    .fontSize(11)
    .fillColor("#111827")
    .text("Payment Details:", paymentX, topY)
    .fontSize(10)
    .fillColor("#444")
    .text(`Method: ${order.paymentMethod}`, paymentX)
    .text(`Status: ${order.paymentStatus}`, paymentX)
    .text(
      `Payment ID: ${order.paymentDetails?.razorpay_payment_id || "N/A"}`,
      paymentX
    )
    .text(`Order ID: ${order._id}`, paymentX);

  doc.moveDown();
  doc.strokeColor("#E5E7EB").moveTo(50, doc.y).lineTo(550, doc.y).stroke();
  doc.moveDown();

  // === Offer (optional)
  if (order.offerId && order.offerTitle) {
    doc
      .fillColor("#0d9488")
      .fontSize(11)
      .text(`Offer Applied: ${order.offerTitle}`, { underline: true });
    doc.moveDown();
  }

  // === Table Header
  const tableTopY = doc.y + 5;
  doc
    .fontSize(10.5)
    .fillColor("#111827")
    .text("Item", 50, tableTopY)
    .text("Qty", 280, tableTopY, { width: 50, align: "right" })
    .text("Unit Price", 360, tableTopY, { width: 90, align: "right" })
    .text("Total", 470, tableTopY, { width: 80, align: "right" });

  doc
    .strokeColor("#D1D5DB")
    .moveTo(50, tableTopY + 15)
    .lineTo(550, tableTopY + 15)
    .stroke();

  let y = tableTopY + 25;

  // === Items
  order.items.forEach((item) => {
    const name = item.name || "Item";
    const quantity = item.quantity ?? 1;
    const price = item.price ?? 0;
    const total = price * quantity;

    doc
      .fontSize(10)
      .fillColor("#333")
      .text(name, 50, y)
      .text(quantity.toString(), 280, y, { width: 50, align: "right" })
      .text(`₹${price.toFixed(2)}`, 360, y, { width: 90, align: "right" })
      .text(`₹${total.toFixed(2)}`, 470, y, { width: 80, align: "right" });

    y += 20;
  });

  doc.moveDown(2);

  // === Summary
  const summaryData = [
    { label: "Subtotal", value: order.subtotal ?? 0 },
    { label: "Tax (GST)", value: order.tax ?? 0 },
    { label: "Delivery Fee", value: order.deliveryFee ?? 0 },
    { label: "Discount", value: -(order.discount ?? 0) },
  ];

  summaryData.forEach(({ label, value }) => {
    doc
      .fontSize(10.5)
      .fillColor("#444")
      .text(label, 360, doc.y, { continued: true })
      .text(`₹${value.toFixed(2)}`, { align: "right" });
  });

  doc
    .fontSize(11.5)
    .fillColor("#000000")
    .text("Total Paid", 360, doc.y + 5, { continued: true })
    .text(`₹${(order.totalAmount ?? 0).toFixed(2)}`, { align: "right" });

  doc.moveDown(3);

  // === Footer
  doc.strokeColor("#E5E7EB").moveTo(50, doc.y).lineTo(550, doc.y).stroke();
  doc.moveDown(1.2);

  const footerY = doc.y;

  centerText(
    "QuickBite is a registered brand of QuickBite Food Pvt. Ltd.",
    footerY,
    { fontSize: 9, fillColor: "#444" }
  );
  centerText(
    "This invoice is system-generated and valid without a signature.",
    footerY + 12,
    { fontSize: 9, fillColor: "#444" }
  );
  centerText("Thank you for ordering with QuickBite!", footerY + 28, {
    fontSize: 11,
    fillColor: "#444",
  });

  doc.end();
};

module.exports = generateInvoice;
