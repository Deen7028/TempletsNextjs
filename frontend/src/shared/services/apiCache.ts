interface ICacheEntry<T> {
    objData: T;
    dExpiresAt: number; // timestamp ms
}

const objCacheStore = new Map<string, ICacheEntry<unknown>>();
const objInflightStore = new Map<string, Promise<unknown>>();

// TTL default 60 วินาที
const nDefaultTTLMs = 60_000;

export const apiCache = {
    /* ดึงข้อมูลจาก Cache (คืน null ถ้าไม่มีหรือหมดอายุ) */
    get<T>(sKey: string): T | null {
        const objEntry = objCacheStore.get(sKey) as ICacheEntry<T> | undefined;
        if (!objEntry) return null;
        if (Date.now() > objEntry.dExpiresAt) {
            objCacheStore.delete(sKey);
            return null;
        }
        return objEntry.objData;
    },

    /* บันทึกข้อมูลลง Cache พร้อมกำหนด TTL */
    set<T>(sKey: string, objData: T, nTTLMs: number = nDefaultTTLMs): void {
        objCacheStore.set(sKey, {
            objData,
            dExpiresAt: Date.now() + nTTLMs,
        });
    },

    /* ล้าง Cache ตาม key เฉพาะ */
    invalidate(sKey: string): void {
        objCacheStore.delete(sKey);
        objInflightStore.delete(sKey);
    },

    /* ล้าง Cache ทุก key ที่ขึ้นต้นด้วย prefix */
    invalidateByPrefix(sPrefix: string): void {
        for (const sKey of objCacheStore.keys()) {
            if (sKey.startsWith(sPrefix)) {
                objCacheStore.delete(sKey);
            }
        }
        for (const sKey of objInflightStore.keys()) {
            if (sKey.startsWith(sPrefix)) {
                objInflightStore.delete(sKey);
            }
        }
    },

    /* ล้าง Cache ทั้งหมด */
    clear(): void {
        objCacheStore.clear();
        objInflightStore.clear();
    },

    /* Fetch ข้อมูลพร้อม Cache + Deduplication อัตโนมัติ */
    async fetch<T>(
        sKey: string,
        fnFetcher: () => Promise<T>,
        isForceRefresh: boolean = false,
        nTTLMs: number = nDefaultTTLMs,
    ): Promise<T> {
        // Force refresh: ล้าง cache เก่าออก
        if (isForceRefresh) {
            objCacheStore.delete(sKey);
            objInflightStore.delete(sKey);
        }

        // ตรวจสอบ Cache ก่อน
        const objCached = this.get<T>(sKey);
        if (objCached !== null) return objCached;

        // Deduplication: ถ้ามี in-flight อยู่ให้รอ promise เดิม
        const objExistingInflight = objInflightStore.get(sKey) as Promise<T> | undefined;
        if (objExistingInflight) return objExistingInflight;

        // สร้าง request ใหม่และเก็บใน inflight store
        const objPromise = fnFetcher().then((objResult) => {
            this.set(sKey, objResult, nTTLMs);
            objInflightStore.delete(sKey);
            return objResult;
        }).catch((objError: unknown) => {
            objInflightStore.delete(sKey);
            throw objError;
        });

        objInflightStore.set(sKey, objPromise as Promise<unknown>);
        return objPromise;
    },
};
