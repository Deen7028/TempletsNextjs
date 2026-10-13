export const ApiMessages: Record<number, string> = {
  400: "ข้อมูลคำขอไม่ถูกต้อง (Bad Request)",
  401: "เซสชันหมดอายุหรือไม่ได้รับอนุญาต (Unauthorized)",
  403: "ไม่มีสิทธิ์ในการเข้าถึงทรัพยากรนี้ (Forbidden)",
  404: "ไม่พบข้อมูลที่ต้องการ (Not Found)",
  408: "การเชื่อมต่อหมดเวลา (Request Timeout)",
  429: "ส่งคำขอถี่เกินไป โปรดลองใหม่อีกครั้งในภายหลัง (Too Many Requests)",
  500: "เกิดข้อผิดพลาดที่เซิร์ฟเวอร์ (Internal Server Error)",
  502: "เกตเวย์ขัดข้อง (Bad Gateway)",
  503: "บริการไม่พร้อมใช้งานชั่วคราว (Service Unavailable)",
  504: "เกตเวย์หมดเวลาการเชื่อมต่อ (Gateway Timeout)",
};

export const getApiErrorMessage = (status: number, customMessage?: string): string => {
  if (customMessage) return customMessage;
  return ApiMessages[status] || `เกิดข้อผิดพลาดรหัส ${status}`;
};
