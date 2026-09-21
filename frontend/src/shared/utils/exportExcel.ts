import * as XLSX from 'xlsx';

/**
 * Exports headers and rows to a real Excel (.xlsx) file.
 * @param filename Name of the file to be downloaded (e.g. 'export.xlsx')
 * @param headers Array of header strings
 * @param rows 2D array representing rows of data
 */
export const exportToExcel = (filename: string, headers: string[], rows: (string | number)[][]) => {
    // Create a new workbook
    const wb = XLSX.utils.book_new();
    
    // Combine headers and rows
    const data = [headers, ...rows];
    
    // Create a worksheet from the 2D array
    const ws = XLSX.utils.aoa_to_sheet(data);

    // Auto-fit column widths based on maximum content length
    const colWidths = headers.map((header, colIndex) => {
        let maxLen = header.length;
        rows.forEach(row => {
            const cellValue = row[colIndex];
            if (cellValue !== undefined && cellValue !== null) {
                // Handle Thai characters length properly
                const strLen = String(cellValue).length;
                if (strLen > maxLen) {
                    maxLen = strLen;
                }
            }
        });
        // Add a padding of 4 characters, set minimum width to 12, maximum width to 50
        return { wch: Math.min(Math.max(maxLen + 4, 12), 50) };
    });
    ws['!cols'] = colWidths;
    
    // Append the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    
    // Generate Excel file in binary format (in-memory)
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
    
    // Helper to convert binary string to ArrayBuffer for 100% robust MIME type detection
    const s2ab = (s: string) => {
        const buf = new ArrayBuffer(s.length);
        const view = new Uint8Array(buf);
        for (let i = 0; i < s.length; i++) {
            view[i] = s.charCodeAt(i) & 0xFF;
        }
        return buf;
    };
    
    // Create a standard browser Blob with the official XLSX MIME type to bypass Windows/Chrome SmartScreen blocks
    const blob = new Blob([s2ab(wbout)], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    // Trigger standard browser download via secure URL object
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};
