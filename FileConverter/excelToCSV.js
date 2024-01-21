const ExcelJS = require("exceljs");
const fs = require("fs");
const path = require("path");

async function convertExcelToCSV() {
  try {
    const inputFolder = "./Files";
    const outputFolder = "./Files";
    const inputFiles = await fs.promises.readdir(inputFolder);

    for (const inputFile of inputFiles) {
      if (inputFile.endsWith(".xlsx")) {
        const inputFilePath = path.join(inputFolder, inputFile);
        const outputFilePath = path.join(
          outputFolder,
          inputFile.replace(".xlsx", ".csv")
        );

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(inputFilePath);
        const csvBuffer = await workbook.csv.writeBuffer();
        await fs.promises.writeFile(outputFilePath, csvBuffer);

        console.log(`${inputFile} converted to CSV successfully!`);
      }
    }

    console.log("All XLSX files converted to CSV!");
  } catch (error) {
    console.error("Error converting XLSX files:", error);
    // Handle the error appropriately, e.g., log details, notify user, etc.
  }
}

// convertExcelToCSV();

module.exports.convertExcelToCSV = convertExcelToCSV;

