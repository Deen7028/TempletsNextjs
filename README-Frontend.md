# Frontend Engineering Handbook — SoftthaiMaster

> Version: 2.0
> Audience: Frontend Developers (Junior → Senior)
> Stack: Next.js 16 · React 19 · TypeScript 6 · TailwindCSS 4 · Zustand 5

---

## สารบัญ

1. [Tech Stack](#1-tech-stack)
2. [Project Setup](#2-project-setup)
3. [Folder Structure](#3-folder-structure)
4. [Architecture Diagram](#4-architecture-diagram)
5. [Rendering Strategy](#5-rendering-strategy)
6. [State Management — Zustand](#6-state-management--zustand)
7. [API / Data Fetching](#7-api--data-fetching)
8. [Module Page Pattern](#8-module-page-pattern)
9. [Form Pattern](#9-form-pattern)
10. [Custom Components](#10-custom-components)
11. [i18n — Translation](#11-i18n--translation)
12. [Styling Convention](#12-styling-convention)
13. [Coding Standards](#13-coding-standards)
14. [Security Rules](#14-security-rules)
15. [Performance](#15-performance)
16. [Testing Convention](#16-testing-convention)
17. [Git Standards](#17-git-standards)
18. [Scripts](#18-scripts)
19. [Anti-Patterns](#19-anti-patterns)

---

## 1. Tech Stack

| Category      | Technology                          | Version    |
| ------------- | ----------------------------------- | ---------- |
| Framework     | Next.js (App Router)                | ^16.2      |
| Language      | TypeScript (strict mode)            | ^6.0       |
| Styling       | TailwindCSS + Emotion + CSS Modules | 4.x / 11.x |
| State         | Zustand + persist middleware        | ^5.0       |
| Forms         | react-hook-form                     | ^7.72      |
| Data Fetching | apiClient (custom fetch wrapper)    | internal   |
| Auth          | JWT (HttpOnly cookies) + Azure MSAL | —          |
| i18n          | Custom (Zustand-based)              | internal   |
| Testing       | Jest 30 + React Testing Library 16  | —          |
| Node          | 20+ / NPM 11+                       | —          |

---

## 2. Project Setup

```bash
git clone <repo>
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

### Environment Variables

```bash
NEXT_PUBLIC_API_URL=https://api.pea.co.th   # Backend URL (ห้ามใส่ secret ใน NEXT_PUBLIC_)
ALLOW_INSECURE_SSL=true                      # local dev กับ self-signed cert เท่านั้น
SENTRY_DSN=...                               # Error monitoring (optional)
```

### Available Scripts

```bash
npm run dev          # Dev server (HTTPS)
npm run build        # Production build
npm run lint         # ESLint
npm run type-check   # TypeScript strict check
npm run test         # Jest + coverage
npm run i18n:check   # Validate translation keys
npm run ci:check     # lint + type-check + test (run ก่อน push ทุกครั้ง)
```

---


## 3. Folder Structure

```
src/
├── app/                  # Next.js App Router pages & layouts
│   ├── (admin)/          # Admin routes group
│   ├── api/
│   │   └── internal/
│   │       └── [...path]/ # Internal API proxy (client → server → backend)
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home (redirect)
│   ├── error.tsx          # Global error boundary
│   ├── loading.tsx        # Global loading state
│   └── not-found.tsx      # 404 page
│
├── layout/               # Shell layouts (header, sidebar, navbar per system)
│   ├── admin/
│   └── services/
│       └── menuService.ts # Fetch menu from API
│
├── modules/              # Feature modules (แยกตาม domain)
│   ├── auth/
│   │   └── login/
│   │       ├── components/LoginForm.tsx
│   │       ├── hooks/useLoginForm.ts
│   │       ├── services/loginAction.ts   ("use server")
│   │       ├── interface/type.d.ts
│   │       └── css/LoginForm.module.css
│   └── other/
│
├── shared/               # Shared across the entire app
│   ├── components/       # Reusable UI components (40+)
│   │   ├── Input/        # Form inputs (TextBox, Select, DatePicker, ...)
│   │   ├── Table/        # Data table with pagination + sort
│   │   ├── Modal/
│   │   ├── BaseButton/
│   │   ├── Card/
│   │   ├── Grid/
│   │   ├── Icon/         # SVG icons (50+)
│   │   ├── Skeleton/
│   │   ├── Pagination/
│   │   ├── Tabs/
│   │   ├── Accordion/
│   │   ├── Tooltip/
│   │   ├── BlockUI/
│   │   ├── UploadFile/
│   │   ├── TextEditor/   # WYSIWYG (lazy-loaded)
│   │   └── common/       #
│   ├── hooks/
│   ├── services/
│   │   ├── apiClient.ts  # Main API client (retry, dedup, auth, whitelist)
│   │   └── apiMessage.ts # HTTP error messages
│   ├── i18n/
│   │   └── translate.ts  # Core translation engine
│   ├── interface/        # Shared type definitions
│   ├── providers/        # React context providers
│   ├── config/           # App config & env validation
│   └── utils/            # Utility functions (auth, security, storage, ui, a11y)
│
├── shared-app/           # Case Special in Project
│   ├── components/
│   ├── hooks/
│   ├── services/
│   ├── interface/
│   ├── providers/
│   ├── config/
│   └── utils/
│
├── stores/               # Zustand global stores
│   ├── index.ts          # Re-export all stores
│   ├── useAuthStore.ts
│   ├── useUIStore.ts
│   ├── useI18nStore.ts
│   ├── useMenuStore.ts
│   ├── usePageStore.ts
│   ├── usePopupStore.ts
│   ├── useBlockUIStore.ts
│   ├── useSessionStore.ts
│   └── useRouteStore.ts
│
├── locales/              # Translation files
│   ├── th/ (auth | common | component | dashboard | popup)
│   └── en/ (same)
│
├── styles/               # Global CSS, design tokens
│   └── tokens.css        # CSS variables (--color-primary, ...)
│
└── types/                # Global TypeScript declarations
    ├── react-global.d.ts
    ├── css.d.ts
    └── ga.d.ts
```

---

## 4. Architecture Diagram

### Module Page Architecture (List + Form)

```
src/app/(admin)/my-feature/
│
└── page.tsx
    (Server Component)
    1. เรียก Server Action (getFormInitial)
    2. Pass options → Client Component via props
    3. dynamic import เพื่อ lazy load


src/modules/my-feature/
├── interface/IMyFeature.d.ts    (types)
├── actions/myFeatureAction.ts   ("use server" apiClient calls)
├── hooks/useMyFeatureList.tsx   (logic + state)
└── components/
    ├── MyFeatureListPage.tsx
    │    (Client Component - "use client")
    │    │
    │    ├── useMyFeatureList() hook
    │    │   - form (react-hook-form)
    │    │   - dataRow (ITableRows state)
    │    │   - handleSearch / handleClear / handleDelete
    │    │   - lstHeaderColumn (ITableHeader[])
    │    │   └── calls Server Action: onPageLoad(param)
    │    │
    │    └── Renders:
    │        <FormProvider {...form}>
    │          <Grid> + (search inputs)
    │          <BtnSearch> <BtnClear>
    │          <Table rows={dataRow} header={lstHeaderColumn} />
    │        </FormProvider>
    └── MyFeatureFormPage.tsx
        (Client Component - "use client")
        └── Renders:
            <FormProvider {...form}>
              <Grid> + (from inputs)
              <Grid> + (button action)
           </FormProvider>

```

### Zustand Store Flow

```
Component renders
      │
      ▼
useXxxStore((s) => s.fieldName)   ← selector เฉพาะ field
      │
      ▼
Zustand Store  ─── persist middleware ──► Cookie Storage
  ├── useAuthStore      (token, user, isAuthenticated)
  ├── useUIStore        (theme, sidebar, collapse)
  ├── useI18nStore      (locale, messages, t())
  ├── useMenuStore      (menu items, stale 5min cache)
  ├── usePageStore      (breadcrumbs, permissions)
  ├── usePopupStore     (popup open/close state)
  ├── useBlockUIStore   (global loading overlay)
  └── useSessionStore   (session data)
```

### i18n Architecture

```
src/locales/
├── th/                    ← default locale
│   ├── common.json
│   ├── auth.json
│   ├── component.json
│   ├── dashboard.json
│   └── popup.json
└── en/
    └── (same namespaces)

useI18nStore
  ├── locale: "th" | "en"   (persisted to cookie)
  ├── messages: {}           (lazy-loaded per namespace)
  ├── loadNamespace(ns)      (dynamic import)
  ├── changeLocale(locale)   (reload all loaded namespaces)
  └── t(key, params)         (translate with fallback)
```

---


## 5. Rendering Strategy

### Server Component (default)

ใช้เมื่อ: ไม่มี interaction, ไม่ใช้ state/hook, ไม่ใช้ browser API

```tsx
// src/app/(admin)/users/page.tsx
import { getFormInitial } from "./actions/userAction";
const UserListPage from "./components/UserListPage"ว

export default async function Page() {
  const options = await getFormInitial(); // ← fetch ที่ server
  return <UserListPage options={options} />;
}
```

### Client Component

ใช้เมื่อ: มี state, hooks, event handler, browser API

```tsx
"use client";

import { useState } from "react";

export function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount((c) => c + 1)}>{count}</button>;
}
```

### Hybrid Pattern (Best Practice)

```tsx
// ✅ Server fetches data → passes to Client for interaction
// page.tsx (Server)
export default async function Page() {
  const data = await fetchUsers();
  return <UserTable initialData={data} />;   // Client Component
}

// UserTable.tsx (Client)
"use client";
export function UserTable({ initialData }) {
  const [filter, setFilter] = useState("");
  const filtered = initialData.filter(u => u.name.includes(filter));
  return (/* ... */);
}
```

---

## 6. State Management — Zustand

### กฎสำคัญ: Select เฉพาะ field ที่ใช้เสมอ

```tsx
// ✅ ถูก — re-render เฉพาะเมื่อ theme เปลี่ยน
const theme = useUIStore((s) => s.theme);

// ❌ ผิด — re-render ทุกครั้งที่ store เปลี่ยน แม้จะไม่ได้ใช้ field นั้น
const { theme, sidebar } = useUIStore();
```

### Stores ที่มีในโปรเจกต์

| Store             | ใช้สำหรับ                                      | Persist                  |
| ----------------- | ---------------------------------------------- | ------------------------ |
| `useAuthStore`    | token, refreshToken, dataUser, isAuthenticated | Cookie (token เท่านั้น)  |
| `useUIStore`      | theme, sidebarOpen, isCollapsed, themeSize     | Cookie                   |
| `useI18nStore`    | locale, messages, t(), changeLocale            | Cookie (locale เท่านั้น) |
| `useMenuStore`    | menu items, fetch status, stale 5min cache     | ไม่ persist              |
| `usePageStore`    | breadcrumbs, permissions, page title           | ไม่ persist              |
| `usePopupStore`   | popup/modal open state                         | ไม่ persist              |
| `useBlockUIStore` | global loading overlay                         | ไม่ persist              |
| `useSessionStore` | session data                                   | ไม่ persist              |

### ตัวอย่างจริง: useAuthStore

```ts
// src/stores/useAuthStore.ts
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      refreshToken: null,
      dataUser: null,
      isAuthenticated: false,

      setAuth: (token, refreshToken, user) =>
        set({ token, refreshToken, dataUser: user, isAuthenticated: true }),

      setUser: (user) =>
        set((s) => ({
          dataUser: s.dataUser ? { ...s.dataUser, ...user } : null,
        })),

      logout: () =>
        set({
          token: null,
          refreshToken: null,
          dataUser: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "auth-storage",
      partialize: (s) => ({ token: s.token, refreshToken: s.refreshToken }),
      storage: createJSONStorage(() => cookieStorage),
    },
  ),
);
```

### การใช้งานใน Component

```tsx
// อ่านค่า
const theme = useUIStore((s) => s.theme);
const isCollapsed = useUIStore((s) => s.isCollapsed);

// เรียก action
const toggleCollapsed = useUIStore((s) => s.toggleCollapsed);
const setTheme = useUIStore((s) => s.setTheme);

// Auth
const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
const dataUser = useAuthStore((s) => s.dataUser);
const logout = useAuthStore((s) => s.logout);
```

---

## 7. API / Data Fetching

### apiClient — ตัวหลักที่ใช้ทั้งโปรเจกต์

```ts
// src/shared/services/apiClient.ts
export const apiClient = new ApiClient();

export const apiClientExternal = new ApiClient({
  allowedHosts: ["localhost", "api.pea.co.th", "*.internal.pea.co.th"],
});

export const apiClientPTT = new ApiClient({
  baseUrl: "https://api.ptt.co.th", // ชี้ไป host อื่น
  timeout: 30000, // 30 วินาที
  authTokenCookieName: "ptt_token", // ชื่อ cookie ต่างออกไป
  xsrfCookieName: "PTT-XSRF",
  xsrfHeaderName: "X-PTT-Csrf-Token",
  allowedHosts: ["api.ptt.co.th"], // whitelist
  onAlert: (status, msg) => {
    // hook error แบบ custom
    console.error(`[PTT API] ${status}: ${msg}`);
  },
});
```

Features ที่ built-in อยู่แล้ว (ไม่ต้องทำเอง):

| Feature               | รายละเอียด                                    |
| --------------------- | --------------------------------------------- |
| URL Whitelist         | Block request ไป host ที่ไม่อยู่ในรายการ      |
| Auto Bearer Token     | ดึงจาก cookie `accessToken` → `Authorization` |
| Auto CSRF Token       | ดึงจาก cookie `XSRF-TOKEN` → `X-Csrf-Token`   |
| Request Deduplication | GET ซ้ำกัน → share promise เดียว              |
| Retry                 | 502/503/504 → retry 3 ครั้ง (exponential)     |
| Concurrent Limit      | max 30 requests พร้อมกัน                      |
| Hard Timeout          | 300s สูงสุด                                   |
| SSR Support           | อ่าน cookie จาก `next/headers`                |
| File Download         | base64 decode → Blob → trigger download       |

### Server Action (Mutation / Form Submit)

```ts
// src/modules/auth/login/services/loginAction.ts
"use server";
import { apiClient } from "@/shared/services/apiClient";

export async function onLoginAction(
  payload: ILoginRequest,
): Promise<ILoginResponse> {
  try {
    const result = await apiClient.post<any>(
      "api/Authentication/onLogin",
      payload,
    );
    return { status: 200, message: "Success", data: result };
  } catch (error: any) {
    return { status: 500, message: error.message || "Internal Server Error" };
  }
}

export async function onInit(): Promise<void> {
  await apiClient.get("api/Authentication/onInit");
}
```

### Client Component (GET)

```tsx
"use client";
import { apiClient } from "@/shared/services/apiClient";
import { useEffect, useState } from "react";

const [data, setData] = useState<User[]>([]);

useEffect(() => {
  apiClient.get<User[]>("api/v1/users/list").then(setData);
}, []);
```

### Server Component (SSR)

```tsx
// ใน Server Component ใช้ fetch โดยตรง (หรือ apiClient ก็ได้)
export default async function Page() {
  const data = await apiClient.get<User[]>("api/v1/users/list");
  return <UserListPage initialData={data} />;
}
```

### กฎ

- ห้าม `fetch()` ตรงใน component — ใช้ `apiClient` เสมอ
- ห้าม call backend โดยตรงจาก client — ต้องผ่าน Server Action หรือ `/api/internal/*` proxy
- handle error เสมอ

---

## 8. Module Page Pattern

Pattern หลักสำหรับหน้า List (Search + Table) และหน้า Form (CRUD)

### Folder Structure

```
src/modules/myFeature/
├── interface/IMyFeature.d.ts        # types ทั้งหมด
├── actions/myFeatureAction.ts       # "use server" — apiClient calls
├── hooks/
│   ├── useMyFeatureList.tsx          # logic: search, delete, table
│   └── useMyFeatureForm.tsx          # logic: getOption, getById, submit
└── components/
    ├── MyFeatureListPage.tsx         # UI: FormProvider + Grid + Table
    └── MyFeatureFormPage.tsx         # UI: FormProvider + Grid + form inputs

src/app/(admin)/my-feature/
├── page.tsx                          # Server Component → SSR options → import ListPage
└── [section]/page.tsx                # form route (add | edit | view)
```

### Interface (IMyFeature.d.ts)

```ts
// src/modules/myFeature/interface/IMyFeature.d.ts
export interface IMyFeatureForm {
  sName: string;
  sDescription: string;
  sStatus: string;
  sStartDate: string;
}

export interface IMyFeatureItem {
  sFeatureID: string;
  sName: string;
  sDescription: string;
  sStatus: string;
  nSortOrder: number;
}

export interface IMyFeatureOption {
  lstStatus: { label: string; value: string }[];
}
```

### Action

```ts
// src/modules/myFeature/actions/myFeatureAction.ts
"use server";
import { apiClient } from "@/shared/services/apiClient";

const ApiMyFeature = {
  GetFormInitial: "/api/v1/my-feature/initial",
  OnPageLoad: "/api/v1/my-feature/list",
  GetById: "/api/v1/my-feature/get-by-id",
  Submit: "/api/v1/my-feature/submit",
  Delete: "/api/v1/my-feature/delete",
};

export async function getFormInitial() {
  return apiClient.get<IMyFeatureOption>(ApiMyFeature.GetFormInitial);
}

export async function onPageLoad(param: Record<string, unknown>) {
  return apiClient.post<IAPIResult>(ApiMyFeature.OnPageLoad, param);
}

export async function onGetFeatureById(param: { sKeyId: string }) {
  return apiClient.post<IAPIResult>(ApiMyFeature.GetById, param);
}

export async function onSubmitFeature(param: Record<string, unknown>) {
  return apiClient.post<IAPIResult>(ApiMyFeature.Submit, param);
}
```

### List Hook (useMyFeatureList)

```tsx
// src/modules/myFeature/hooks/useMyFeatureList.tsx
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { initRows } from "@/shared/components/Table/hooks/useTable";
import type { ITableRows, ITableHeader } from "@/shared/components/Table";
import { BlockUI } from "@/shared/components/BlockUI";
import { PopupDelete } from "@/shared/components/Popup";
import { onPageLoad } from "../actions/myFeatureAction";
import type { IMyFeatureForm } from "../interface/IMyFeature";

export const useMyFeatureList = () => {
  const form = useForm<IMyFeatureForm>({
    shouldUnregister: true,
    mode: "all",
    defaultValues: { sName: "", sStatus: "" },
  });

  const [isLoadding, setIsLoadding] = useState(false);
  const [dataRow, setDataRow] = useState<ITableRows>({
    ...initRows,
    nPageIndex: 1,
    nPageSize: 10,
    sSortExpression: "sName",
    sSortDirection: "asc",
  });

  const handleSearch = useCallback(
    async (paramTable: ITableRows = dataRow) => {
      BlockUI.Show();
      const param = { ...paramTable, arrRows: [], ...form.getValues() };
      const result = await onPageLoad(param);
      if (result?.objResult) {
        const t = result.objResult.ObjTable;
        setDataRow((prev) => ({
          ...prev,
          arrRows: t.lstData,
          nDataLength: t.nDataLength,
          nPageIndex: t.nPageIndex,
        }));
      }
      BlockUI.Close();
    },
    [dataRow],
  );

  const handleClear = () => {
    form.reset();
    handleSearch({ ...initRows, nPageIndex: 1, nPageSize: 10 });
  };

  const handleDelete = (ids: string[]) => {
    PopupDelete("ยืนยันการลบข้อมูล?", "", () => console.log("delete", ids));
  };

  const lstHeaderColumn: ITableHeader[] = useMemo(
    () => [
      { id: "sName", label: "ชื่อ", isSortable: true },
      { id: "sDescription", label: "รายละเอียด", isSortable: false },
      { id: "sStatus", label: "สถานะ", isSortable: true },
      { id: "action", label: "", isAction: true },
    ],
    [],
  );

  useEffect(() => {
    handleSearch();
  }, []);

  return {
    form,
    dataRow,
    isLoadding,
    handleSearch,
    handleClear,
    handleDelete,
    lstHeaderColumn,
  };
};
```

### List Page Component

```tsx
// src/modules/myFeature/components/MyFeatureListPage.tsx
"use client";

import dynamic from "next/dynamic";
import { FormProvider } from "react-hook-form";
import Grid from "@/shared/components/Grid";
import { TextBoxItem, SelectItem } from "@/shared/components/Input";
import { BtnSearch, BtnClear, BtnAdd } from "@/shared/components/BaseButton";
import { useMyFeatureList } from "../hooks/useMyFeatureList";
import type { IMyFeatureOption } from "../interface/IMyFeature";

const Table = dynamic(() => import("@/shared/components/Table"), {
  ssr: false,
});

interface IProps {
  options: IMyFeatureOption;
  isManage?: boolean;
}

export default function MyFeatureListPage({
  options,
  isManage = false,
}: IProps) {
  const {
    form,
    dataRow,
    isLoadding,
    handleSearch,
    handleClear,
    handleDelete,
    lstHeaderColumn,
  } = useMyFeatureList();

  return (
    <FormProvider {...form}>
      <Grid container spacing={2}>
        {/* Search Inputs */}
        <Grid item size={{ xs: 12 }}>
          <Grid
            container
            spacing={1}
            justifyContent="flex-end"
            alignItems="center"
          >
            <Grid item size={{ xs: 12, md: "grow" }}>
              <TextBoxItem name="sName" label="ชื่อ" isSkeleton={isLoadding} />
            </Grid>
            <Grid item size={{ xs: 12, md: 3 }}>
              <SelectItem
                name="sStatus"
                label="สถานะ"
                options={options.lstStatus}
                isSkeleton={isLoadding}
              />
            </Grid>
            <Grid item size={{ xs: "auto" }}>
              <BtnSearch
                id="btn-search"
                isIconOnly
                onClick={() => handleSearch()}
              />
            </Grid>
            <Grid item size={{ xs: "auto" }}>
              <BtnClear id="btn-clear" isIconOnly onClick={handleClear} />
            </Grid>
            {isManage && (
              <Grid item size={{ xs: "auto" }}>
                <BtnAdd id="btn-add" href="/admin/my-feature/add" />
              </Grid>
            )}
          </Grid>
        </Grid>

        {/* Table */}
        <Grid size={{ xs: 12 }}>
          <Table
            id="table-my-feature"
            header={lstHeaderColumn}
            rows={dataRow}
            isLoading={isLoadding}
            onLoadData={handleSearch}
            isPage
            isShowCheckBox={isManage}
            onDelete={handleDelete}
          />
        </Grid>
      </Grid>
    </FormProvider>
  );
}
```

### Route Page (Server Component)

```tsx
// src/app/(admin)/my-feature/page.tsx
import dynamic from "next/dynamic";
import { getFormInitial } from "./actions/myFeatureAction";

const MyFeatureListPage = dynamic(
  () => import("./components/MyFeatureListPage"),
  { ssr: false },
);

export default async function Page() {
  const options = await getFormInitial();
  return <MyFeatureListPage options={options} isManage />;
}
```

---

## 9. Form Pattern

### Form Hook (useMyFeatureForm)

```ts
// src/modules/myFeature/hooks/useMyFeatureForm.ts
"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { BlockUI } from "@/shared/components/BlockUI";
import {
  getFormInitial,
  onGetFeatureById,
  onSubmitFeature,
} from "../actions/myFeatureAction";
import type { IMyFeatureForm, IMyFeatureOption } from "../interface/IMyFeature";

export function useMyFeatureForm(section: string) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const keyId = searchParams.get("str") ?? ""; // ?str=<id> → edit mode

  const [isSkeleton, setIsSkeleton] = useState(false);
  const [isViewForm, setIsViewForm] = useState(section === "view");
  const [keyID, setKeyID] = useState("");
  const [option, setOption] = useState<IMyFeatureOption>({ lstStatus: [] });

  const form = useForm<IMyFeatureForm>({
    shouldUnregister: true,
    mode: "all",
    defaultValues: { sName: "", sDescription: "", sStatus: "", sStartDate: "" },
  });

  // Effect 1: load dropdown options
  useEffect(() => {
    const getOption = async () => {
      BlockUI.Show();
      const result = await getFormInitial();
      setOption(result ?? { lstStatus: [] });
      BlockUI.Close();
    };
    getOption();
  }, []);

  // Effect 2: load data for edit/view
  useEffect(() => {
    if (!keyId) return;
    const getDataById = async () => {
      BlockUI.Show();
      setIsSkeleton(true);
      const result = await onGetFeatureById({ sKeyId: keyId });
      if (result?.objResult) {
        const d = result.objResult;
        setKeyID(d.sFeatureID);
        form.setValue("sName", d.sName);
        form.setValue("sDescription", d.sDescription);
        form.setValue("sStatus", d.sStatus);
        form.setValue("sStartDate", d.sStartDate);
      }
      setIsSkeleton(false);
      BlockUI.Close();
    };
    getDataById();
  }, [keyId]);

  const handleSubmit = async (dataForm: IMyFeatureForm) => {
    BlockUI.Show();
    const param = { ...dataForm, sKeyId: keyID };
    await onSubmitFeature(param);
    BlockUI.Close();
    router.push("/admin/my-feature");
  };

  const handleBack = () => router.push("/admin/my-feature");

  return {
    form,
    handleSubmit,
    handleBack,
    isSkeleton,
    isViewForm,
    option,
    keyID,
  };
}
```

### Form Page Component

```tsx
// src/modules/myFeature/components/MyFeatureFormPage.tsx
"use client";

import { FormProvider } from "react-hook-form";
import Grid from "@/shared/components/Grid";
import {
  TextBoxItem,
  TextAreaItem,
  SelectItem,
  DatePickerItem,
} from "@/shared/components/Input";
import { useMyFeatureForm } from "../hooks/useMyFeatureForm";

interface IProps {
  section: string;
  nMenuID: number;
}

export default function MyFeatureFormPage({ section, nMenuID }: IProps) {
  const { form, handleSubmit, handleBack, isSkeleton, isViewForm, option } =
    useMyFeatureForm(section);

  return (
    <FormProvider {...form}>
      <Grid container spacing={2}>
        <Grid item size={{ xs: 12 }}>
          <TextBoxItem
            name="sName"
            label="ชื่อ"
            required
            isSkeleton={isSkeleton}
            disabled={isViewForm}
          />
        </Grid>

        <Grid item size={{ xs: 12 }}>
          <TextAreaItem
            name="sDescription"
            label="รายละเอียด"
            isSkeleton={isSkeleton}
            disabled={isViewForm}
          />
        </Grid>

        <Grid item size={{ xs: 12, md: 6 }}>
          <SelectItem
            name="sStatus"
            label="สถานะ"
            options={option.lstStatus}
            isSkeleton={isSkeleton}
            disabled={isViewForm}
          />
        </Grid>

        <Grid item size={{ xs: 12, md: 6 }}>
          <DatePickerItem
            name="sStartDate"
            label="วันที่เริ่มต้น"
            required
            isSkeleton={isSkeleton}
            disabled={isViewForm}
          />
        </Grid>

        <Grid item size={{ xs: 12 }}>
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={handleBack}>
              ย้อนกลับ
            </button>
            {!isViewForm && (
              <button type="button" onClick={form.handleSubmit(handleSubmit)}>
                บันทึก
              </button>
            )}
          </div>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
```

### Form Route

```tsx
// src/app/(admin)/my-feature/[section]/page.tsx
import dynamic from "next/dynamic";

const MyFeatureFormPage = dynamic(
  () => import("../components/MyFeatureFormPage"),
  { ssr: false },
);

export default async function Page({
  params,
}: {
  params: { section: string };
}) {
  return <MyFeatureFormPage section={params.section} nMenuID={42} />;
}
// URL: /admin/my-feature/add
// URL: /admin/my-feature/edit?str=<id>
// URL: /admin/my-feature/view?str=<id>
```

---

## 10. Custom Components

ใช้ component เหล่านี้เสมอ **ห้าม** สร้าง `<input>`, `<button>`, `<a>` ตรงๆ

### Form Inputs (`src/shared/components/Input/`)

| Component             | แทน                       | Import                                          |
| --------------------- | ------------------------- | ----------------------------------------------- |
| `TextBoxItem`         | `<input type="text">`     | `@/shared/components/Input/TextBoxItem`         |
| `TextAreaItem`        | `<textarea>`              | `@/shared/components/Input/TextAreaItem`        |
| `InputNumberItem`     | numeric input             | `@/shared/components/Input/InputNumberItem`     |
| `SelectItem`          | `<select>`                | `@/shared/components/Input/SelectItem`          |
| `CheckBoxItem`        | `<input type="checkbox">` | `@/shared/components/Input/CheckBoxItem`        |
| `CheckBoxListItem`    | checkbox group            | `@/shared/components/Input/CheckBoxListItem`    |
| `RadioListItem`       | radio group               | `@/shared/components/Input/RadioListItem`       |
| `DatePickerItem`      | date picker               | `@/shared/components/Input/DatePickerItem`      |
| `DateRangePickerItem` | date range                | `@/shared/components/Input/DateRangePickerItem` |
| `TimePickerItem`      | time picker               | `@/shared/components/Input/TimePickerItem`      |
| `SwitchItem`          | toggle                    | `@/shared/components/Input/SwitchItem`          |
| `TabColorPickerItem`  | color selection           | `@/shared/components/Input/TabColorPickerItem`  |

### Base UI (`src/shared/components/`)

| Component        | แทน / ใช้สำหรับ          | Import                               |
| ---------------- | ------------------------ | ------------------------------------ |
| `BaseButton`     | `<button>`               | `@/shared/components/BaseButton`     |
| `LinkCustom`     | `<a>` / `<Link>`         | `@/shared/components/LinkCustom`     |
| `ImageCustom`    | `<img>` / `<Image>`      | `@/shared/components/ImageCustom`    |
| `Card`           | content container        | `@/shared/components/Card`           |
| `Grid`           | layout grid              | `@/shared/components/Grid`           |
| `Modal`          | dialog                   | `@/shared/components/Modal`          |
| `Table`          | data table               | `@/shared/components/Table`          |
| `Pagination`     | page navigation          | `@/shared/components/Pagination`     |
| `Tabs`           | tab UI                   | `@/shared/components/Tabs`           |
| `Accordion`      | collapsible section      | `@/shared/components/Accordion`      |
| `Tooltip`        | tooltip                  | `@/shared/components/Tooltip`        |
| `Skeleton`       | loading placeholder      | `@/shared/components/Skeleton`       |
| `Empty`          | empty state              | `@/shared/components/Empty`          |
| `BlockUI`        | loading overlay (global) | `@/shared/components/BlockUI`        |
| `Icon`           | SVG icons (50+)          | `@/shared/components/Icon`           |
| `UploadFile`     | file upload + crop       | `@/shared/components/UploadFile`     |
| `TextEditor`     | WYSIWYG rich text        | `@/shared/components/TextEditorLazy` |
| `AnimatedNumber` | animated counter         | `@/shared/components/AnimatedNumber` |

### Render Helpers

```tsx
import { Show, Each } from "@/shared/components/common";

// Conditional render — แทน ternary ที่ซับซ้อน
<Show when={isLoggedIn}>
  <Dashboard />
</Show>

<Show when={isLoggedIn} fallback={<LoginPage />}>
  <Dashboard />
</Show>

// List render — แทน .map()
<Each
  of={items}
  render={(item) => <Card key={item.id} data={item} />}
/>
```

### ตัวอย่างการใช้ Login Form จริง

```tsx
// src/modules/auth/login/components/LoginForm.tsx
"use client";
import { FormProvider } from "react-hook-form";
import Grid from "@/shared/components/Grid";
import { TextBoxItem } from "@/shared/components/Input";
import ImageCustom from "@/shared/components/ImageCustom";
import { useLoginForm } from "../hooks/useLoginForm";

export const LoginForm = () => {
  const { form, handleLogin, t } = useLoginForm();

  return (
    <FormProvider {...form}>
      <Grid container spacing={3}>
        <Grid item size={{ xs: 12 }}>
          <ImageCustom
            src="/assets/images/logo/logoApp.png"
            alt="Logo"
            width={180}
            height={80}
          />
        </Grid>

        <Grid item size={{ xs: 12 }}>
          <TextBoxItem
            label={t("auth.login.email")}
            name="sUsername"
            placeholder="Enter your username"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleLogin();
            }}
          />
        </Grid>

        <Grid item size={{ xs: 12 }}>
          <TextBoxItem
            label={t("auth.login.password")}
            name="sAccessCode"
            type="password"
            placeholder="••••••••"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleLogin();
            }}
          />
        </Grid>
      </Grid>
    </FormProvider>
  );
};
```

---

## 11. i18n — Translation

### ใช้งาน

```tsx
import { useTranslation } from "@/shared/hooks/useTranslation";

// โหลด namespace ที่ต้องการ
const { t, locale } = useTranslation(["common", "auth"]);

// Basic key
t("common.save"); // → "บันทึก"

// With fallback (ถ้า key หายไป)
t("common.save", "บันทึก");

// With params
t("common.welcome", { name: "สมชาย" }); // → "ยินดีต้อนรับ สมชาย"
```

### Translation Files

```json
// src/locales/th/common.json
{
  "save": "บันทึก",
  "cancel": "ยกเลิก",
  "search": "ค้นหา",
  "clear": "ล้างข้อมูล",
  "delete": "ลบ",
  "edit": "แก้ไข",
  "view": "ดูรายละเอียด",
  "add": "เพิ่ม",
  "welcome": "ยินดีต้อนรับ {{name}}"
}

// src/locales/th/auth.json
{
  "login": {
    "title": "เข้าสู่ระบบ",
    "email": "ชื่อผู้ใช้",
    "password": "รหัสผ่าน",
    "button": "เข้าสู่ระบบ",
    "forgot": "ลืมรหัสผ่าน?"
  }
}
```

### เปลี่ยนภาษา

```tsx
const changeLocale = useI18nStore((s) => s.changeLocale);

await changeLocale("en"); // โหลด namespace ทั้งหมดที่ใช้อยู่ใหม่ด้วยภาษา en
```

### กฎ

- ทุก string ที่แสดงผลต้องใช้ `t()` เสมอ **ห้าม hardcode** ข้อความ
- namespace ที่มี: `common`, `auth`, `component`, `dashboard`, `popup`

---

## 12. Styling Convention

### Server Component — CSS Module + Tailwind

```tsx
import styles from "./css/MyComponent.module.css";

<div className={`${styles.container} flex items-center gap-2`}>
```

### Client Component — Emotion + Tailwind

```tsx
import styled from "@emotion/styled";

const Box = styled.div`
  display: flex;
  align-items: center;
`;
```

### Conditional Classes — clsx + tailwind-merge

```tsx
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const cn = (...args: Parameters<typeof clsx>) => twMerge(clsx(...args));

<div
  className={cn(
    "flex items-center p-4",
    isActive && "bg-blue-500 text-white",
    isDisabled && "opacity-50 cursor-not-allowed",
  )}
/>;
```

### Design Tokens

ใช้ CSS variable จาก `src/styles/tokens.css` เสมอ **ห้าม hardcode สี hex**

```css
/* ✅ ถูก */
color: var(--color-primary);
background: var(--color-surface);

/* ❌ ผิด */
color: #1a73e8;
background: #ffffff;
```

---

## 13. Coding Standards

### Naming Convention

| Type      | Format          | Example                       |
| --------- | --------------- | ----------------------------- |
| Component | PascalCase      | `UserListPage`                |
| Hook      | useSomething    | `useMyFeatureList`            |
| Variable  | camelCase       | `isLoadding`, `dataRow`       |
| Boolean   | is / has / can  | `isAuthenticated`, `hasRole`  |
| Constant  | SCREAMING_SNAKE | `MENU_STALE_MS`               |
| Interface | IPascalCase     | `IMyFeature`, `ITableRows`    |
| Type      | PascalCase      | `Theme`, `MenuFetchStatus`    |
| Folder    | kebab-case      | `my-feature/`, `base-button/` |
| Enum      | EPascalCase     | `EStatusFlow`                 |

### API Naming (รับจาก Backend)

| Type   | Prefix | Example                 | status |
| ------ | ------ | ----------------------- | ------ |
| string | `s`    | `sUsername`, `sName`    | ❌     |
| number | `n`    | `nAge`, `nPageIndex`    | ❌     |
| array  | `lst`  | `lstUsers`, `lstStatus` | ✅     |
| bool   | `is`   | `isManage`              | ✅     |
| object | `obj`  | `objResult`, `ObjTable` | ✅     |

### TypeScript Rules

```ts
// ✅ ใช้ optional chaining + nullish coalescing
const name = user?.profile?.name ?? "-";
const count = data?.total ?? 0;

// ✅ ใช้ type inference
const [count, setCount] = useState(0);       // number ถูก infer อัตโนมัติ

// ✅ Interface สำหรับ props
interface IProps {
  label: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
}

// ❌ ห้ามใช้ any
const data: any = ...;   // ❌ ห้าม
```

### React Rules

```tsx
// ❌ ห้ามใช้ "use client" ทุกไฟล์ — default เป็น Server Component
// เพิ่มเฉพาะเมื่อต้องการ hooks, event, browser API จริงๆ

// ❌ ห้าม inline function ใน JSX loop
{items.map(item => (
  <button onClick={() => handleClick(item.id)}>  {/* ❌ */}
))}

// ✅ ถูก — extract handler
const handleItemClick = useCallback((id: string) => () => {
  handleClick(id);
}, []);
```

---

## 14. Security Rules

ห้ามละเมิดเด็ดขาด:

| Rule                 | รายละเอียด                                                          |
| -------------------- | ------------------------------------------------------------------- |
| Sanitize HTML Input  | ต้องผ่าน `DOMPurify.sanitize()` ก่อน `dangerouslySetInnerHTML` เสมอ |
| Secret env vars      | ห้ามใส่ `NEXT_PUBLIC_` prefix ใน secret — จะ expose ไปที่ client    |
| API calls จาก client | ต้องผ่าน Server Action หรือ `/api/internal/*` proxy เท่านั้น        |
| JWT validation       | อย่า verify signature ที่ client — ให้ server validate เสมอ         |
| Cookie               | ต้องเป็น HttpOnly + Secure + SameSite=Lax                           |
| External URL         | ต้อง validate hostname ก่อน redirect หรือ fetch                     |
| Log                  | ห้าม `console.log` sensitive data (token, password) ใน production   |

---

## 15. Performance

### ใช้ `useMemo` / `useCallback` เฉพาะเมื่อจำเป็น

```tsx
// ✅ ใช้กับ expensive computation หรือ reference ที่ต้อง stable
const lstHeaderColumn = useMemo(() => [...], []);
const handleSearch    = useCallback(async (param) => {...}, [dataRow]);

// ❌ ไม่ต้อง memo ทุก function — overhead เปล่า
const handleClick = useCallback(() => setOpen(true), []); // ❌ ไม่จำเป็น
```

### Lazy Load Components

```tsx
// ✅ Table, TextEditor — heavy components ต้อง lazy load เสมอ
const Table = dynamic(() => import("@/shared/components/Table"), {
  ssr: false,
});
const TextEditor = dynamic(() => import("@/shared/components/TextEditorLazy"), {
  ssr: false,
});
```

### Split Components

```
ถ้า component > 200 บรรทัด → แยก sub-component
ถ้า logic > 50 บรรทัด → ย้ายไป hook
```

---

## 16. Testing Convention

```tsx
// __tests__/shared/components/MyComponent/MyComponent.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MyComponent from "@/shared/components/MyComponent";

describe("MyComponent", () => {
  it("renders label correctly", () => {
    render(<MyComponent label="ชื่อ" />);
    expect(screen.getByText("ชื่อ")).toBeInTheDocument();
  });

  it("calls onChange when value changes", async () => {
    const onChange = jest.fn();
    render(<MyComponent onChange={onChange} />);
    await userEvent.type(screen.getByRole("textbox"), "test");
    expect(onChange).toHaveBeenCalled();
  });

  it("shows skeleton when isSkeleton is true", () => {
    render(<MyComponent isSkeleton />);
    expect(screen.getByTestId("skeleton")).toBeInTheDocument();
  });
});
```

### กฎ

- เขียน test ทุก component ใหม่ (ไม่มีข้อยกเว้น)
- Test file อยู่ใน `__tests__/` mirror structure ของ `src/`
- ใช้ `screen.getByRole` ก่อน `getByTestId` (accessibility-first)
- Mock ที่ `jest.setup.ts` เท่านั้น ห้าม mock ใน test file เองโดยไม่จำเป็น
- ต้อง test: render ปกติ, skeleton state, error state, user interaction

---

## 17. Git Standards

### Commit Message

```
<type>(<scope>): <subject>

Types:
  feat      เพิ่ม feature ใหม่
  fix       แก้ bug
  refactor  refactor โดยไม่เปลี่ยน behavior
  test      เพิ่ม/แก้ test
  docs      แก้ไข documentation
  style     format, naming (ไม่เปลี่ยน logic)
  chore     เปลี่ยน config, dependency
  perf      performance improvement
```

```bash
# ตัวอย่าง
feat(auth): add forgot password flow
fix(table): fix pagination reset on filter change
refactor(button): extract size variants to CSS module
test(select): add unit tests for multi-select
docs(readme): update module pattern examples
```

### Before PR(Pull Request) Checklist

- [ ] `npm run ci:check` ผ่าน (lint + type-check + test)
- [ ] ไม่มี `console.log` ใน production code
- [ ] เขียน WHY ใน PR(Pull Request) description
- [ ] ไม่มี hardcoded text (ใช้ `t()`)
- [ ] ไม่มี hardcoded color hex (ใช้ CSS variable)

---

## 18. Scripts

```bash
npm run dev          # Dev server (HTTPS, port 3000)
npm run build        # Production build
npm run start        # Start production server
npm run lint         # ESLint check
npm run lint:fix     # ESLint auto-fix
npm run type-check   # TypeScript strict check
npm run test         # Jest all tests
npm run test:watch   # Jest watch mode
npm run test:coverage # Jest with coverage report
npm run i18n:check   # Validate all translation keys exist
npm run ci:check     # lint + type-check + test (run ก่อน push ทุกครั้ง)
```

---

## 19. Anti-Patterns

| Anti-Pattern                              | ทำไมผิด                                   | วิธีที่ถูก                               |
| ----------------------------------------- | ----------------------------------------- | ---------------------------------------- |
| `const x: any = ...`                      | ทำลาย type safety ทั้งหมด                 | ใช้ type จริง หรือ `unknown`             |
| `state.items.push(item)`                  | mutate state โดยตรง → React ไม่ re-render | `setState(prev => [...prev, item])`      |
| `<input type="text" />`                   | ไม่ integrate กับ form system             | ใช้ `TextBoxItem`                        |
| `<button onClick={...} />`                | ไม่มี design system                       | ใช้ `BaseButton`                         |
| `const { theme } = useUIStore()`          | re-render ทุกครั้งที่ store เปลี่ยน       | `const theme = useUIStore(s => s.theme)` |
| `fetch(url)` ใน component                 | ไม่มี auth, retry, dedup                  | ใช้ `apiClient.get(url)`                 |
| hardcode `"บันทึก"` ใน JSX                | ไม่รองรับ i18n                            | ใช้ `t("common.save")`                   |
| hardcode `color: "#1a73e8"`               | ไม่ follow design system                  | ใช้ `var(--color-primary)`               |
| `dangerouslySetInnerHTML` โดยไม่ sanitize | XSS vulnerability                         | ผ่าน `DOMPurify.sanitize()` ก่อน         |
| `console.log(token)`                      | leak sensitive data ใน logs               | ห้าม log sensitive data                  |
| `NEXT_PUBLIC_SECRET_KEY`                  | expose secret ไปที่ client bundle         | ใช้ server-only env var                  |
| skip `npm run ci:check`                   | push code ที่ lint/type/test fail         | run ก่อน push ทุกครั้ง                   |

---

> **หลักการสำคัญที่สุด:**
>
> "Code ที่ดี = อ่านง่าย + เปลี่ยนง่าย + พังยาก"
>
> ถ้าต้องอธิบายว่า code ทำอะไร → ตั้งชื่อใหม่
> ถ้า function ยาวกว่า 50 บรรทัด → แยก
> ถ้าเขียน `any` → หา type จริง
