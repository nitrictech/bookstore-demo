import PDFDocument from "pdfkit";
import { Invoice } from "./model";

function hr(doc: PDFKit.PDFDocument, y: number, margin: number = 0) {
  const pageWidth = doc.page.width; // Get the width of the page
  doc
    .moveTo(0 + margin, y) // Starting point of the line (left edge of the page)
    .lineTo(pageWidth - margin, y) // End point of the line (right edge of the page)
    .stroke(); // Draw the line
}

// Function to create a fake shipping label PDF
export async function createInvoice(invoice: Invoice): Promise<Buffer> {
  return new Promise(async (resolve, reject) => {
    const { customer, shippingAddress, orderNumber, items } = invoice;
    // Create a PDF document
    const doc = new PDFDocument();

    const buffers: Buffer[] = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => {
      const pdfData = Buffer.concat(buffers);
      // return the buffer data
      resolve(pdfData);
    });
    doc.on("error", reject);

    const margin = 50;
    const padding = 20;
    const fullOffset = margin + padding;

    const logoWidth = 80;
    doc.image(
      "assets/sendhub.png",
      doc.page.width / 2 - logoWidth / 2,
      fullOffset - 40,
      { width: logoWidth }
    );

    doc
      .fontSize(24)
      .font("Helvetica-Bold")
      .text(`TAX INVOICE`, doc.page.width - fullOffset - 200, fullOffset, {
        align: "right",
        width: 200,
      });

    // SENDER INFORMATION
    const fromOffset = fullOffset + 40;

    doc
      .fontSize(12)
      .font("Helvetica-Bold")
      .text(`Ship From:`, fullOffset, fromOffset, {
        continued: true,
      })
      .font("Helvetica")
      .text(`\n1234 Example Avenue\nReal, AC, 6543`);

    doc
      .fontSize(12)
      .font("Helvetica")
      .text(
        `Acme Export Sales\n1234 Example Avenue\nReal, AC, 6543`,
        doc.page.width - fullOffset - 200,
        fromOffset,
        { align: "right", width: 200 }
      );

    // RECIPIENT INFORMATION
    const toOffset = fromOffset + 60;

    doc
      .fontSize(12)
      .font("Helvetica-Bold")
      .text(`Shipping Address:`, fullOffset, toOffset, {
        continued: true,
      })
      .font("Helvetica")
      .text(
        `\n${customer}\n${
          shippingAddress.line1
        }\n${shippingAddress.city.toUpperCase()}, ${shippingAddress.state.toUpperCase()}, ${
          shippingAddress.postalCode
        }`
      );

    const orderDetailsOffset = toOffset + 80;

    doc
      .fontSize(12)
      .font("Helvetica-Bold")
      .text(`Order Number:`, fullOffset, orderDetailsOffset, {
        continued: true,
      })
      .font("Helvetica")
      .text(`\n${orderNumber}`)
      .font("Helvetica-Bold")
      .text(`\nOrder Date:`)
      .font("Helvetica")
      .text(` ${new Date().toLocaleDateString()}`);

    const invoiceNumber = Math.round(Math.random() * 9999);

    doc
      .fontSize(12)
      .font("Helvetica-Bold")
      .text(`Invoice Number:`, doc.page.width / 2, orderDetailsOffset, {
        continued: true,
      })
      .font("Helvetica")
      .text(`\n${invoiceNumber}`)
      .font("Helvetica-Bold")
      .text(`\nInvoice Date:`)
      .font("Helvetica")
      .text(`${new Date().toLocaleDateString()}`);

    hr(doc, orderDetailsOffset + 100, margin);

    const itemsOffset = orderDetailsOffset + 120;

    items.forEach((item, index) => {
      const itemOffset = itemsOffset + index * 20;
      doc
        .fontSize(12)
        .font("Helvetica-Bold")
        .text(`Qty`, fullOffset, itemOffset, {
          continued: true,
        })
        .font("Helvetica")
        .text(` ${item.quantity}`, {
          continued: true,
        })
        .font("Helvetica-Bold")
        .text(`  -  ${item.name}`, fullOffset, itemOffset, {
          continued: true,
        })
        .font("Helvetica-Bold")
        .text(`  -  Unit Price:`, fullOffset, itemOffset, {
          continued: true,
        })
        .font("Helvetica")
        .text(` $${item.unitPrice}`, {
          continued: true,
        })
        .font("Helvetica-Bold")
        .text(`  -  Total:`, {
          continued: true,
        })
        .font("Helvetica")
        .text(` $${item.quantity * item.unitPrice}`);
    });

    doc.end();
  });
}
