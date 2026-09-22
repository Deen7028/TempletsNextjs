import ExcelJS from 'exceljs';
import { IPurchaseOrder } from '../interfaces/IApproval';

export const exportPurchaseOrderToExcel = async (objPo: IPurchaseOrder) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Purchase Order');

  worksheet.views = [{ showGridLines: true }];

  // 1. เพิ่มข้อมูลส่วนหัว
  worksheet.addRow(['PURCHASE ORDER (PO)']);
  worksheet.addRow([]);
  worksheet.addRow(['Company:', 'บริษัท กราท เอโวเคชั่น จำกัด', '', 'PO No.:', objPo.sPoNumber]);
  worksheet.addRow(['Address:', '588 ม.2 ต.อ่าวนาง อ.เมืองกระบี่ จ.กระบี่ 81180', '', 'PO Date:', objPo.dtPoDate]);
  worksheet.addRow(['Tel:', '083-7662244, 098-0253430', '', 'Department:', objPo.sDepartmentName || 'F&B ALACART']);
  worksheet.addRow([]);
  worksheet.addRow(['Supplier:', 'บริษัท ซีพี แอ็กซ์ตร้า จำกัด (มหาชน)', '', 'Payment Term:', '-']);
  worksheet.addRow(['Supplier Code:', 'สาขากระบี่', '', 'Delivery Date:', objPo.dtDeliveryDate]);
  worksheet.addRow(['Address:', '119 หมู่ 1 ตำบลไสไทย อำเภอเมืองกระบี่ จังหวัดกระบี่ 81000', '', 'Required Time:', '08:00 - 11:30 น.']);
  worksheet.addRow(['Contact:', 'คุณวรัทยา สุขทวี', '', 'Deliver To:', 'ออฟฟิศ ไร่เลย์ กราทวิว อ่าวน้ำเมา']);
  worksheet.addRow(['Tel/Fax:', '-', '', 'Payment Method:', 'Cr.']);
  worksheet.addRow([]);

  // 2. หัวตารางรายการสินค้า (แถวที่ 13)
  const headerRow = worksheet.addRow([]);
  headerRow.height = 24;
  const headerValues = ['ลำดับ', 'รหัส', 'รายการ', 'จำนวน', 'หน่วยนับ', 'หมายเหตุ'];
  headerValues.forEach((val, idx) => {
    const cell = headerRow.getCell(idx + 1);
    cell.value = val;
    cell.font = { bold: true, color: { argb: 'FFFFFF' }, name: 'Calibri', size: 11 };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '174785' }, // สีน้ำเงินตามธีม
    };
    cell.border = {
      top: { style: 'thin', color: { argb: '174785' } },
      left: { style: 'thin', color: { argb: '174785' } },
      bottom: { style: 'thin', color: { argb: '174785' } },
      right: { style: 'thin', color: { argb: '174785' } },
    };
  });

  // 3. เพิ่มรายการสินค้า (Dynamic Rows) แบบกำหนดค่าทีละเซลล์ ป้องกันข้อมูลเพี้ยน
  const tableDataStartIndex = headerRow.number + 1; // แถวที่ 14 (รายการแรก)
  let nextRowIndex = tableDataStartIndex;

  if (objPo.lstItems && objPo.lstItems.length > 0) {
    objPo.lstItems.forEach((objItem, nIndex) => {
      const row = worksheet.addRow([]);
      row.height = 20;

      row.getCell(1).value = nIndex + 1;                                // ลำดับ
      row.getCell(2).value = objItem.sProductCode || '';                // รหัส
      row.getCell(3).value = objItem.sProductName || '';                // รายการ
      row.getCell(4).value = objItem.nQuantity || 0;                    // จำนวน
      row.getCell(5).value = objItem.sUnit || '';                       // หน่วยนับ
      row.getCell(6).value = objItem.sRemarks || '';                    // หมายเหตุ

      nextRowIndex++;
    });
  }
  const tableEndIndex = nextRowIndex - 1;

  // 4. เพิ่มส่วนท้าย (ลายเซ็นและเงื่อนไข)
  const sigRow1 = nextRowIndex + 2;
  const sigRow2 = sigRow1 + 1;
  const conditionStartIndex = sigRow2 + 2;

  worksheet.addRow([]);
  worksheet.addRow(['Requested By', '', 'Checked By', '', 'Approved By', '']);
  worksheet.addRow(['(F&B Supervisor)', '', '(Accounting Receivable)', '', '(Assistance Accounting Manager)']);
  worksheet.addRow([]);
  worksheet.addRow(['เงื่อนไขการรับสินค้า:']);
  worksheet.addRow(['1. ผู้ขายต้องจัดส่งสินค้าให้ตรงตามรายการ จำนวน และคุณลักษณะที่ระบุไว้ในสั่งซื้อ']);
  worksheet.addRow(['2. สินค้าทุกชิ้นต้องอยู่ในสภาพสมบูรณ์ ไม่ชำรุด แตกหัก บุบ รั่ว ฉีกขาด หรือมีตำหนิใดๆ']);
  worksheet.addRow(['3. สินค้าประเภทอาหาร เครื่องดื่ม และวัตถุดิบ ต้องมีวันหมดอายุเพียงพอตามมาตรฐานที่ผู้ซื้อกำหนด']);
  worksheet.addRow(['4. หากตรวจพบว่าสินค้าชำรุด เสียหาย หมดอายุ ผู้ซื้อมีสิทธิ์ไม่รับสินค้าและทำการตีคืนทันที']);

  // 5. กำหนดความกว้างคอลัมน์ (Columns Width) เฉพาะ A ถึง F
  worksheet.columns = [
    { width: 15 }, // A: ลำดับ
    { width: 16 }, // B: รหัส
    { width: 42 }, // C: รายการ
    { width: 16 }, // D: จำนวน
    { width: 14 }, // E: หน่วยนับ
    { width: 25 }, // F: หมายเหตุ
  ];

  // 6. ตีเส้นขอบและจัดตำแหน่งในตารางสินค้า (ครอบคลุมทุกแถวรายการ)
  for (let r = tableDataStartIndex; r <= tableEndIndex; r++) {
    const row = worksheet.getRow(r);
    for (let c = 1; c <= 6; c++) {
      const cell = row.getCell(c);

      // ใส่เส้นขอบ (Borders) ให้ตารางสินค้า
      cell.border = {
        top: { style: 'thin', color: { argb: 'BFBFBF' } },
        left: { style: 'thin', color: { argb: 'BFBFBF' } },
        bottom: { style: 'thin', color: { argb: 'BFBFBF' } },
        right: { style: 'thin', color: { argb: 'BFBFBF' } },
      };

      // จัดตำแหน่งข้อความในข้อมูลสินค้า (c=1 ลำดับ, c=2 รหัส, c=4 จำนวน, c=5 หน่วยนับ -> กึ่งกลาง | c=3 รายการ, c=6 หมายเหตุ -> ชิดซ้าย)
      if (c === 1 || c === 2 || c === 4 || c === 5) {
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
      } else {
        cell.alignment = { horizontal: 'left', vertical: 'middle' };
      }
    }
  }

  // 7. กำหนดการผสานเซลล์ (Merges)
  worksheet.mergeCells('A1:F1'); // หัวข้อหลัก
  
  // รวมเซลล์ข้อมูลส่วนหัว (B-C และ E-F ในแถว 3, 4, 5 และ 7, 8, 9, 10, 11)
  [3, 4, 5, 7, 8, 9, 10, 11].forEach((r) => {
    worksheet.mergeCells(`B${r}:C${r}`);
    worksheet.mergeCells(`E${r}:F${r}`);
  });

  worksheet.mergeCells(`A${sigRow1}:B${sigRow1}`);
  worksheet.mergeCells(`C${sigRow1}:D${sigRow1}`);
  worksheet.mergeCells(`E${sigRow1}:F${sigRow1}`);
  worksheet.mergeCells(`A${sigRow2}:B${sigRow2}`);
  worksheet.mergeCells(`C${sigRow2}:D${sigRow2}`);
  worksheet.mergeCells(`E${sigRow2}:F${sigRow2}`);

  for (let r = conditionStartIndex; r <= conditionStartIndex + 4; r++) {
    worksheet.mergeCells(`A${r}:F${r}`);
  }

  // 8. สร้างไฟล์และดาวน์โหลด
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${objPo.sPoNumber || 'PO'}_RailayResort.xlsx`;
  anchor.click();
  window.URL.revokeObjectURL(url);
};