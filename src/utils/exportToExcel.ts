import ExcelJS from "exceljs";
import { Product } from "../interfaces/product.js";

export async function exportToExcel(
  data: Product[],
  filepath: string,
  source: string
) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(source);

  worksheet.columns = [
    { header: "Company", key: "company", width: 30 },
    { header: "Title", key: "title", width: 30 },
    { header: "URL", key: "url", width: 30 },
    { header: "Image", key: "imgSrc", width: 30 },
    { header: "Product Data", key: "productData", width: 100 },
  ];

  data.forEach((product) => {
    worksheet.addRow({
      company: product.company,
      title: product.title,
      url: product.url,
      imgSrc: product.imgSrc,
      productData: JSON.stringify(product.productData)
        .replace(/},{/g, " ")
        .replace(/[\[\]{"}]/g, ""),
    });
  });

  worksheet.getRow(1).font = { bold: true, color: { argb: "FF0000FF" } };
  worksheet.getRow(1).alignment = { horizontal: "center" };

  worksheet.columns
    .filter((column): column is ExcelJS.Column => column !== undefined)
    .forEach((column) => {
      let maxLength = 0;
      column.eachCell({ includeEmpty: true }, (cell) => {
        const cellLength = String(cell.value || "").length;
        maxLength = Math.max(maxLength, cellLength);
      });
      column.width = maxLength + 2;
    });

  await workbook.xlsx.writeFile(filepath);
  console.log(`Data successfully written to ${filepath}`);
}
