import React from "react";
import { Download } from "lucide-react";
import { RiFileExcel2Fill } from "react-icons/ri";

/**
 * Reusable component to download data as a CSV file.
 * @param {Array} data - Array of objects to export.
 * @param {string} fileName - Name of the file to download (without extension).
 * @param {string} buttonLabel - Optional label for the button.
 */
const DownloadExcel = ({
  data,
  fileName = "export",
  buttonLabel = "Export to Excel",
}) => {
  const convertToCSV = (objArray) => {
    const array =
      typeof objArray !== "object" ? JSON.parse(objArray) : objArray;
    if (array.length === 0) {
      return "";
    }

    const header = Object.keys(array[0]).join(",");
    const rows = array.map((obj) => {
      return Object.values(obj)
        .map((value) => {
          // Handle string values that might contain commas or newlines
          let result =
            value === null || value === undefined ? "" : value.toString();
          if (
            result.includes(",") ||
            result.includes("\n") ||
            result.includes('"')
          ) {
            result = `"${result.replace(/"/g, '""')}"`;
          }
          return result;
        })
        .join(",");
    });

    return [header, ...rows].join("\n");
  };

  const downloadCSV = () => {
    if (!data || data.length === 0) {
      alert("No data to export.");
      return;
    }

    const csvData = convertToCSV(data);
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${fileName}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={downloadCSV}
      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-sm font-medium hover:bg-gray-200 text-black bg-white border border-gray-100 rounded-lg transition-colors whitespace-nowrap"
    >
      <RiFileExcel2Fill className="w-4 h-4" />
      {buttonLabel}
    </button>
  );
};

export default DownloadExcel;
