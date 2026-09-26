import { IApiResponse } from '@/shared';

type ApiClientFunction = <T = IApiResponse>(endpoint: string, options?: RequestInit) => Promise<T>;

interface ApiClient extends ApiClientFunction {
    get: <T = IApiResponse>(endpoint: string, options?: RequestInit) => Promise<T>;
    post: <T = IApiResponse>(endpoint: string, data?: object | string | number | boolean, options?: RequestInit) => Promise<T>;
    delete: <T = IApiResponse>(endpoint: string, options?: RequestInit) => Promise<T>;
}

// ตัวเรียกขอข้อมูล HTTP API พื้นฐาน (Core fetch wrapper)
const apiCall = async <T = IApiResponse>(endpoint: string, options: RequestInit = {}): Promise<T> => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const url = `${baseUrl}${endpoint}`;

    const defaultHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    const config = {
        ...options,
        credentials: 'include' as RequestCredentials, // ส่งและรับ Cookie ใน CORS
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    };

    try {
        const response = await fetch(url, config);
        
        const responseText = await response.text();
        let objData: T = {} as T;
        try {
            objData = (responseText ? JSON.parse(responseText) : {}) as T;
        } catch {
            console.error('ไม่สามารถแยกวิเคราะห์ (Parse) ผลลัพธ์ JSON ได้', responseText);
        }

        // หากผลตอบกลับไม่ใช่รหัส 2xx (สำเร็จ) ให้ทำการโยน Error ออกไป
        if (!response.ok) {
            console.warn('ผลตอบรับข้อผิดพลาดจาก API:', responseText || `(ไม่มีเนื้อหา, รหัสสถานะ: ${response.status})`);
            
            // ตรวจสอบสิทธิ์การเข้าถึง หาก Token หมดอายุ (401 Unauthorized) ให้เคลียร์ข้อมูลผู้ใช้และพาไปหน้า Login
            if (response.status === 401) {
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('user');
                    if (!window.location.pathname.includes('/login')) {
                        window.location.href = '/login';
                    }
                }
            }

            const sErrorMsg = (objData as IApiResponse).message || `การเรียกขอข้อมูล API ล้มเหลวด้วยรหัสสถานะ ${response.status}`;
            throw new Error(sErrorMsg);
        }

        return objData;
    } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
            throw error;
        }
        console.warn('เกิดข้อผิดพลาดที่ตัวไคลเอนต์ API:', error);
        throw error;
    }
};

export const apiClient: ApiClient = Object.assign(apiCall, {
    // ส่งข้อมูลแบบ GET
    get: <T = IApiResponse>(endpoint: string, options: RequestInit = {}) => 
        apiCall<T>(endpoint, { ...options, method: 'GET' }),
    // ส่งข้อมูลแบบ POST
    post: <T = IApiResponse>(endpoint: string, data?: object | string | number | boolean, options: RequestInit = {}) => 
        apiCall<T>(endpoint, { ...options, method: 'POST', body: data !== undefined ? JSON.stringify(data) : undefined }),
    delete: <T = IApiResponse>(endpoint: string, options: RequestInit = {}) => 
        apiCall<T>(endpoint, { ...options, method: 'DELETE' }),
});
