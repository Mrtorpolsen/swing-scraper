import ExcelJS from "exceljs";
import { Product } from "../interfaces/product.js";
import { UnknownDataName } from "../interfaces/dataName.js";

export async function exportProductsToExcel(
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
    { header: "Product number", key: "productNumber", width: 20 },
    { header: "Product line", key: "productLine", width: 20 },
    { header: "Product category", key: "productCategory", width: 20 },
    { header: "Age group", key: "ageGroup", width: 15 },
    { header: "Min age", key: "minAge", width: 15 },
    { header: "Number of users", key: "numberOfUsers", width: 20 },
    { header: "Inclusive", key: "inclusive", width: 15 },
    { header: "Length", key: "length", width: 15 },
    { header: "Width", key: "width", width: 15 },
    { header: "Height", key: "height", width: 15 },
    {
      header: "Length of security zone",
      key: "lengthOfSecurityZone",
      width: 25,
    },
    { header: "Width of security zone", key: "widthOfSecurityZone", width: 25 },
    { header: "Free fall height", key: "freeFallHeight", width: 20 },
    { header: "Safety zone m²", key: "safetyZoneM2", width: 20 },
    { header: "Product Data", key: "productData", width: 100 },
  ];

  data.forEach((product) => {
    worksheet.addRow({
      company: product.company,
      title: product.title,
      url: product.url,
      imgSrc: product.imgSrc,
      productNumber: product.productNumber,
      productLine: product.productLine,
      productCategory: product.productCategory,
      ageGroup: product.ageGroup,
      minAge: product.minAge,
      numberOfUsers: product.numberOfUsers,
      inclusive: product.inclusive,
      length: product.length,
      width: product.width,
      height: product.height,
      lengthOfSecurityZone: product.lengthOfSecurityZone,
      widthOfSecurityZone: product.widthOfSecurityZone,
      freeFallHeight: product.freeFallHeight,
      safetyZoneM2: product.safetyZoneM2,
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

export async function exportUnknownDataNameToExcel(
  unkownData: UnknownDataName[],
  filepath: string
) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Unkown Data");

  worksheet.columns = [
    { header: "Data", key: "data", width: 30 },
    { header: "Source", key: "source", width: 30 },
    { header: "URL", key: "url", width: 30 },
  ];

  unkownData.forEach((data) => {
    worksheet.addRow({
      data: data.dataName,
      source: data.source,
      url: data.url,
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
