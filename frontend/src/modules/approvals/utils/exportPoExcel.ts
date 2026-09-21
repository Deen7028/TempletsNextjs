import * as XLSX from 'xlsx';
import { IPurchaseOrder } from '../interfaces/IApproval';

export const exportPurchaseOrderToExcel = (objPo: IPurchaseOrder) => {
  const wb = XLSX.utils.book_new();

  // จัดโครงสร้างข้อมูลจำลองตามฟอร์มเอกสาร PO ทางการในภาพต้นฉบับ
  const wsData: (string | number)[][] = [
    ['PURCHASE ORDER (PO)'],
    [],
    ['Company:', 'บริษัท กราท เอโวเคชั่น จำกัด', '', 'PO No.:', objPo.sPoNumber],
    ['Address:', '588 ม.2 ต.อ่าวนาง อ.เมืองกระบี่ จ.กระบี่ 81180', '', 'PO Date:', objPo.dtPoDate],
    ['Tel:', '083-7662244, 098-0253430', '', 'Department:', objPo.sDepartmentName || 'F&B ALACART'],
    [],
    ['Supplier:', objPo.sSupplierName || 'บริษัท ซีพี แอ็กซ์ตร้า จำกัด (มหาชน)', '', 'Payment Term:', objPo.sPaymentTerm || '-'],
    ['Supplier Code:', 'สาขากระบี่', '', 'Delivery Date:', objPo.dtDeliveryDate],
    ['Address:', '119 หมู่ 1 ตำบลไสไทย อำเภอเมืองกระบี่ จังหวัดกระบี่ 81000', '', 'Required Time:', objPo.sRequiredTime || '08:00 - 11:30 น.'],
    ['Contact:', 'คุณวรัทยา สุขทวี', '', 'Deliver To:', 'ออฟฟิศ ไร่เลย์ กราทวิว อ่าวน้ำเมา'],
    ['Tel/Fax:', '-', '', 'Payment Method:', objPo.sPaymentMethod || 'Cr.'],
    [],
    // หัวตารางรายการสินค้า
    ['ลำดับ', 'รหัส', 'รายการ', 'จำนวน', 'หน่วยนับ', 'หมายเหตุ'],
  ];

  // ใส่รายการสินค้า (Items) เข้าไปในตาราง
  if (objPo.lstItems && objPo.lstItems.length > 0) {
    objPo.lstItems.forEach((objItem, nIndex) => {
      wsData.push([
        nIndex + 1,
        objItem.sProductCode,
        objItem.sProductName,
        objItem.nQuantity,
        objItem.sUnit,
        objItem.sRemarks || '',
      ]);
    });
  }

  // ส่วนท้ายเอกสาร (ลายเซ็นและเงื่อนไขการรับสินค้า)
  wsData.push(
    [],
    ['Requested By', '', 'Checked By', '', 'Approved By', ''],
    ['(F&B Supervisor)', '', '(Accounting Receivable)', '', '(Assistance Accounting Manager)', ''],
    [],
    ['เงื่อนไขการรับสินค้า:'],
    ['1. ผู้ขายต้องจัดส่งสินค้าให้ตรงตามรายการ จำนวน และคุณลักษณะที่ระบุไว้ในสั่งซื้อ'],
    ['2. สินค้าทุกชิ้นต้องอยู่ในสภาพสมบูรณ์ ไม่ชำรุด แตกหัก บุบ รั่ว ฉีกขาด หรือมีตำหนิใดๆ'],
    ['3. สินค้าประเภทอาหาร เครื่องดื่ม และวัตถุดิบ ต้องมีวันหมดอายุเพียงพอตามมาตรฐานที่ผู้ซื้อกำหนด'],
    ['4. หากตรวจพบว่าสินค้าชำรุด เสียหาย หมดอายุ ผู้ซื้อมีสวสิทธิ์ไม่รับสินค้าและทำการตีคืนทันที']
  );

  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // กำหนดความกว้างของคอลัมน์ให้อ่านง่ายและสวยงาม
  ws['!cols'] = [
    { wch: 8 },  // ลำดับ
    { wch: 15 }, // รหัส
    { wch: 45 }, // รายการ
    { wch: 10 }, // จำนวน
    { wch: 12 }, // หน่วยนับ
    { wch: 25 }, // หมายเหตุ
  ];

  XLSX.utils.book_append_sheet(wb, ws, 'Purchase Order');

  // สั่งดาวน์โหลดไฟล์ Excel อัตโนมัติ
  XLSX.writeFile(wb, `${objPo.sPoNumber || 'PO'}_RailayResort.xlsx`);
};