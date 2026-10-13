1–2. Tech Stack และ Setup
Stack: Next.js 16 (App Router), TypeScript 6 (strict), TailwindCSS 4 + Emotion + CSS Modules, Zustand 5, react-hook-form, apiClient (custom fetch wrapper), Jest 30 + RTL 16, Node 20+ / NPM 11+
Setup: git clone → npm install → cp .env.example .env.local → npm run dev
Env:
    ห้ามใส่ secret ใน NEXT_PUBLIC_
    ALLOW_INSECURE_SSL=true ใช้เฉพาะ local dev กับ self-signed cert
    SENTRY_DSN ใส่หรือไม่ก็ได้

3. Folder Structure
โฟลเดอร์	หน้าที่
app/	 pages และ layouts ของ App Router ((admin)/, api/internal/[...path] เป็น proxy, error.tsx, loading.tsx, not-found.tsx)
layout/	 shell ของแต่ละระบบ (header, sidebar, navbar)
modules/	 feature แยกตาม domain ภายในมี components/ hooks/ services(actions)/ interface/ css/
shared/	 ของที่ใช้ร่วมทั้งแอป (components, hooks, services, i18n, interface, providers, config, utils)
shared-app/	 กรณีพิเศษเฉพาะโปรเจกต์ (โครงสร้างเหมือน shared)
stores/	 Zustand global stores และ index.ts สำหรับ re-export
locales/	 ไฟล์แปลภาษา th/ และ en/
styles/	 global CSS และ tokens.css
types/	 global TS declarations

4. Architecture
Module page: page.tsx (Server) เรียก Server Action getFormInitial แล้วส่ง options เป็น props ให้ Client Component และใช้ dynamic import เพื่อ lazy load
ListPage: ใช้ hook จัดการ form, dataRow, handleSearch/Clear/Delete, lstHeaderColumn และเรียก onPageLoad
FormPage: ห่อด้วย <FormProvider> ใช้ Grid กับ inputs และปุ่ม action
Zustand flow: component ใช้ selector เฉพาะ field → store → persist ลง cookie
i18n: useI18nStore มี locale (persist ลง cookie), messages (lazy-load ตาม namespace), loadNamespace, changeLocale, t(key, params)

5. Rendering Strategy
Server Component (default): ใช้เมื่อไม่มี interaction, ไม่ใช้ state/hook, ไม่ใช้ browser API
Client Component: ใส่ "use client" เมื่อมี state, hooks, event handler หรือ browser API
Hybrid (Best Practice): Server fetch ข้อมูลแล้วส่งเป็น props ให้ Client ทำ interaction

6. State Management (Zustand)
กฎหลัก: select เฉพาะ field ที่ใช้เสมอ
✅ useUIStore((s) => s.theme)
❌ const { theme, sidebar } = useUIStore()
Persist:
useAuthStore เก็บเฉพาะ token และ refreshToken ใน cookie
useUIStore เก็บใน cookie
useI18nStore เก็บเฉพาะ locale
Menu, Page, Popup, BlockUI, Session ไม่ persist
วิธีเขียน store: create<State>()(persist(..., { name, partialize, storage: createJSONStorage(() => cookieStorage) }))
การใช้: อ่านค่าและเรียก action ผ่าน selector แยกกันทีละตัว

7. API / Data Fetching
ใช้ apiClient ทั้งโปรเจกต์
apiClientExternal สำหรับ host ภายนอกที่อยู่ใน whitelist
ถ้าชี้ host อื่น ให้สร้าง instance ใหม่และกำหนด baseUrl, timeout, authTokenCookieName, xsrfCookieName, xsrfHeaderName, allowedHosts, onAlert
Built-in (ไม่ต้องทำเอง):
URL whitelist
Bearer token อัตโนมัติ (จาก cookie accessToken)
CSRF อัตโนมัติ (XSRF-TOKEN → X-Csrf-Token)
GET dedup
Retry 502/503/504 จำนวน 3 ครั้งแบบ exponential
จำกัด request พร้อมกันที่ 30
Hard timeout 300 วินาที
รองรับ SSR
File download (base64 → Blob)
Mutation: ใช้ Server Action ("use server"), ห่อด้วย try/catch และ return {status, message, data}
Client GET: ใช้ apiClient.get<T>() ใน useEffect
Server Component: เรียก apiClient.get ตรงๆ ได้
กฎ:
ห้าม fetch() ตรงใน component
ห้าม call backend ตรงจาก client ต้องผ่าน Server Action หรือ /api/internal/*
handle error เสมอ

8. Module Page Pattern (List)
โครงสร้าง: interface/IMyFeature.d.ts, actions/myFeatureAction.ts, hooks/useXxxList.tsx กับ useXxxForm.tsx, components/XxxListPage.tsx กับ XxxFormPage.tsx
Route: app/(admin)/my-feature/page.tsx และ [section]/page.tsx (add | edit | view)
Action: รวม endpoint เป็นค่าคงที่ใน object เดียว (ApiMyFeature) แล้วเขียนแต่ละ action เป็น apiClient.get/post
List hook:
useForm({ shouldUnregister: true, mode: "all", defaultValues })
state dataRow เริ่มจาก initRows พร้อม nPageIndex, nPageSize, sSortExpression, sSortDirection
handleSearch ครอบด้วย BlockUI.Show() และ BlockUI.Close()
handleClear ทำ form.reset() แล้ว search ใหม่
handleDelete ใช้ PopupDelete
lstHeaderColumn ใช้ useMemo
useEffect เรียก search ตอนโหลด
List component: "use client" + dynamic(() => import(Table), { ssr: false }) + FormProvider + Grid + TextBoxItem/SelectItem + BtnSearch/BtnClear/BtnAdd + Table
Route page: เป็น Server Component เรียก getFormInitial() แล้วส่ง options เป็น props

9. Form Pattern
ใช้ hook useXxxForm(section) กับ useRouter, useSearchParams (?str=<id> = edit mode)
state: isSkeleton, isViewForm (section === "view"), keyID, option
Effect 1: โหลด dropdown options
Effect 2: ถ้ามี keyId ให้โหลดข้อมูลมา form.setValue
Submit: BlockUI.Show → onSubmitFeature({...dataForm, sKeyId}) → BlockUI.Close → router.push
Component: ทุก input ส่ง isSkeleton และ disabled={isViewForm}, ปุ่มบันทึกซ่อนเมื่อเป็น view mode
URL: /add, /edit?str=<id>, /view?str=<id>

10. Custom Components
ห้ามใช้ <input>, <button>, <a> ตรงๆ ให้ใช้ component ของโปรเจกต์
Inputs: TextBoxItem, TextAreaItem, InputNumberItem, SelectItem, CheckBoxItem, CheckBoxListItem, RadioListItem, DatePickerItem, DateRangePickerItem, TimePickerItem, SwitchItem, TabColorPickerItem
Base UI: BaseButton, LinkCustom, ImageCustom, Card, Grid, Modal, Table, Pagination, Tabs, Accordion, Tooltip, Skeleton, Empty, BlockUI, Icon, UploadFile, TextEditor (TextEditorLazy), AnimatedNumber
Render helpers: <Show when fallback> แทน ternary ที่ซับซ้อน และ <Each of render> แทน .map()
ตัวอย่าง LoginForm: FormProvider + Grid + ImageCustom + TextBoxItem กับ label จาก t() และกด Enter เพื่อ login

11. i18n
ใช้ useTranslation(["common","auth"]) ซึ่งได้ {t, locale}
รูปแบบ t("common.save"), t("key", fallback), t("key", {param})
ไฟล์แปลอยู่ที่ src/locales/{th,en}/*.json และ param ใช้รูปแบบ {{name}}
เปลี่ยนภาษา: await useI18nStore((s) => s.changeLocale)("en")
กฎ: ทุกข้อความที่แสดงผลต้องใช้ t() ห้าม hardcode
Namespace: common, auth, component, dashboard, popup

12. Styling
Server Component: CSS Module + Tailwind
Client Component: Emotion (styled) + Tailwind
Conditional class: ใช้ helper cn = twMerge(clsx(...))
Design tokens: ใช้ CSS variable จาก tokens.css เสมอ เช่น var(--color-primary) ห้าม hardcode สี hex

13. Coding Standards
ประเภท	รูปแบบ	ตัวอย่าง
Component	PascalCase	UserListPage
Hook	useXxx	useMyFeatureList
Variable	camelCase	dataRow
Boolean	is/has/can	isAuthenticated
Constant	SCREAMING_SNAKE	MENU_STALE_MS
Interface	IPascalCase	ITableRows
Type	PascalCase	Theme
Folder	kebab-case	my-feature/
Enum	EPascalCase	EStatusFlow
Prefix ของ field จาก Backend: string = s, number = n, array = lst, bool = is, object = obj
TypeScript:
ใช้ optional chaining + ??
ให้ type inference ทำงาน
ใช้ interface IProps สำหรับ props
ห้ามใช้ any
React:
ห้ามใส่ "use client" ทุกไฟล์ ให้ใส่เมื่อจำเป็นเท่านั้น
ห้ามเขียน inline function ใน JSX loop ให้ extract handler ออกมา
14. Security (ห้ามละเมิด)

sanitize ด้วย DOMPurify.sanitize() ก่อนใช้ dangerouslySetInnerHTML
ห้ามใส่ secret ใน NEXT_PUBLIC_
API call จาก client ต้องผ่าน Server Action หรือ /api/internal/* เท่านั้น
ห้าม verify JWT signature ที่ client ให้ server validate
Cookie ต้องเป็น HttpOnly + Secure + SameSite=Lax
validate hostname ของ external URL ก่อน redirect หรือ fetch
ห้าม console.log ข้อมูล sensitive (token, password) ใน production

15. Performance
ใช้ useMemo/useCallback เฉพาะที่จำเป็น (งานหนัก หรือต้องการ reference คงที่) ไม่ต้อง memo ทุก function
component หนักอย่าง Table และ TextEditor ต้อง lazy load ด้วย dynamic(..., { ssr: false })
component เกิน 200 บรรทัดให้แยก sub-component
logic เกิน 50 บรรทัดให้ย้ายไปไว้ใน hook

16. Testing
ตำแหน่งไฟล์: __tests__/ โดย mirror โครงสร้างของ src/
กฎ:
เขียน test ทุก component ใหม่ ไม่มีข้อยกเว้น
ใช้ getByRole ก่อน getByTestId
mock ที่ jest.setup.ts เท่านั้น ห้าม mock ใน test file โดยไม่จำเป็น
ต้อง test 4 อย่าง: render ปกติ, skeleton state, error state, user interaction

17. Git
Commit: <type>(<scope>): <subject>
Types: feat, fix, refactor, test, docs, style, chore, perf
Checklist ก่อนเปิด PR:
npm run ci:check ต้องผ่าน
ไม่มี console.log
เขียน WHY ใน PR description
ไม่มีข้อความ hardcode (ใช้ t())
ไม่มีสี hex hardcode

18. Scripts

dev, build, start, lint, lint:fix, type-check, test, test:watch, test:coverage, i18n:check, ci:check (lint + type-check + test ให้รันก่อน push ทุกครั้ง)

19. Anti-Patterns
❌ ห้าม	                            ✅ ให้ทำ
x: any	                            ใช้ type จริงหรือ unknown
state.items.push()	                setState(prev => [...prev, item])
<input>	                            TextBoxItem
<button>	                        BaseButton
const {theme} = useUIStore()	    useUIStore(s => s.theme)
fetch(url) ใน component	            apiClient.get(url)
hardcode ข้อความไทยใน JSX		      t("common.save")
hardcode สี hex		                 var(--color-primary)
dangerouslySetInnerHTML ไม่ sanitize   ผ่าน DOMPurify.sanitize()
console.log(token)	                 ห้าม log ข้อมูล sensitive
NEXT_PUBLIC_SECRET_KEY	             ใช้ server-only env var
ข้าม ci:check	                       รันก่อน push ทุกครั้ง

หลักการสรุปท้ายเอกสาร: โค้ดที่ดี = อ่านง่าย + แก้ไขง่าย + พังยาก ถ้าต้องอธิบายว่าโค้ดทำอะไรให้ตั้งชื่อใหม่ 
ถ้า function ยาวเกิน 50 บรรทัดให้แยก 
ถ้าเขียน any ให้หา type จริง