# 🚀 Оптимизация производительности (Vercel)

Документация по оптимизациям для production на Vercel.

> **Note:** Проект использует официальный React ViewTransition API. Подробности в [VIEW_TRANSITIONS.md](./VIEW_TRANSITIONS.md)

---

## ⚠️ Важно: Full Next.js на Vercel

Проект развёрнут на **Vercel** и использует **все возможности Next.js**:

1. **Server Components** — выполняются на сервере при каждом запросе
2. **Automatic Image Optimization** — изображения оптимизируются автоматически
3. **Edge Network** — контент кешируется в 270+ городах мира
4. **Prefetching** — работает в полную силу в production

---

## ✅ Применённые оптимизации

### 1. Prefetch для мгновенных переходов
**Файл:** `components/cases-grid.tsx`

**Что добавлено:**
```tsx
<Link href={href} prefetch={true} className="block h-full w-full">
  {content}
</Link>
```

**Как работает на Vercel:**
- При попадании Link в viewport → **автоматически загружается HTML + данные**
- При клике → **переход мгновенный** (0ms задержка)
- Prefetch работает **только в production** (после деплоя)

**В development режиме:** Prefetch отключен (не тестируйте локально!)

---

### 2. View Transitions для плавной анимации
**Файл:** `app/globals.css`

**Настройки:**
```css
/* Старая страница исчезает мгновенно */
::view-transition-old(root) {
  animation: none;
  opacity: 0;
}

/* Новая страница плавно появляется */
::view-transition-new(root) {
  animation: fade-in 0.4s ease;
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

**Параметры:**
- **Длительность:** 0.4s
- **Timing:** ease (плавное начало и конец)
- **Эффект:** только fade-in новой страницы

---

### 3. Client-side навигация (SPA режим)
**Файл:** `app/layout.tsx`

**Что используется:**
```tsx
import { ViewTransitions } from 'next-view-transitions'
import { Link } from 'next-view-transitions'
```

**Как работает:**
- После первой загрузки сайт работает как **SPA**
- Переходы между страницами **не перезагружают** всю страницу
- Загружается только новый контент
- **Намного быстрее** обычных переходов

---

## 🎯 Итоговая производительность

### Что происходит на Vercel:

1. **Первая загрузка:**
   - Vercel Edge Network (270+ городов)
   - Brotli/Gzip компрессия
   - HTTP/3 протокол
   - **Очень быстро!** ⚡️

2. **Клик на Link с prefetch={true}:**
   - HTML + данные **уже загружены** в фоне
   - Переход **мгновенный** (0ms)
   - View Transitions показывает fade-in (0.4s)

3. **Визуально:**
   - **Моментальный переход**
   - Плавное появление контента
   - Нет "белого экрана"

---

## 🚀 Дополнительные возможности Vercel

### Automatic Image Optimization

Next.js автоматически оптимизирует изображения:

```tsx
import Image from 'next/image'

<Image
  src="/photo.jpg"
  width={800}
  height={600}
  alt="Optimized"
  // Vercel автоматически:
  // - Генерирует WebP/AVIF
  // - Подбирает размер под устройство
  // - Кеширует на CDN
/>
```

### ISR (Incremental Static Regeneration)

Можно кешировать Server Components:

```tsx
export const revalidate = 60 // Обновлять каждые 60 секунд

export default async function Page() {
  const data = await fetch('https://api.example.com/data')
  return <div>{data}</div>
}
```

### API Routes

Можно создать API прямо в проекте:

```tsx
// app/api/hello/route.ts
export async function GET() {
  return Response.json({ message: 'Hello!' })
}
```

---

## 🔧 Настройка анимации переходов

Если нужно изменить скорость или стиль:

**Файл:** `app/globals.css`

```css
/* Быстрее (0.2s) */
::view-transition-new(root) {
  animation: fade-in 0.2s ease;
}

/* Медленнее (0.6s) */
::view-transition-new(root) {
  animation: fade-in 0.6s ease;
}

/* Другой timing */
::view-transition-new(root) {
  animation: fade-in 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
```

**Популярные timing functions:**
- `ease` — плавное начало и конец (текущая)
- `ease-in` — медленное начало
- `ease-out` — медленный конец
- `linear` — постоянная скорость

---

## 📌 Чеклист для новых страниц

При добавлении новой страницы:

1. ✅ Используйте `Link` из `next-view-transitions`
2. ✅ Добавьте `prefetch={true}` для важных ссылок
3. ✅ Server Components — используйте для данных с сервера
4. ✅ Client Components — только когда нужна интерактивность

**Пример:**

```tsx
import { Link } from 'next-view-transitions'

// ✅ Правильно - с prefetch
<Link href="/page" prefetch={true}>
  Перейти
</Link>

// Server Component - данные с сервера
export default async function Page() {
  const data = await fetch('https://api.example.com/data')
  return <div>{data}</div>
}
```

---

## 📊 Мониторинг производительности

### Vercel Analytics

Включите в Project Settings → Analytics:
- **Real User Monitoring**
- **Web Vitals** (LCP, FID, CLS)
- **Core Web Vitals Score**

### Локальное тестирование production

```bash
# Build локально
npm run build

# Запустить production сервер
npm start
```

**Важно:** Prefetch работает только в production!

---

## 🎨 View Transitions Browser Support

**Поддержка браузерами:**
- ✅ Chrome 111+
- ✅ Edge 111+
- ✅ Opera 97+
- ⏳ Firefox (в разработке)
- ⏳ Safari (в разработке)

**Fallback:** В неподдерживаемых браузерах переходы работают без анимации (graceful degradation).

---

## 📚 Документация

- [Next.js Performance](https://nextjs.org/docs/app/building-your-application/optimizing)
- [Vercel Edge Network](https://vercel.com/docs/edge-network/overview)
- [View Transitions API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API)
- [next-view-transitions](https://github.com/shuding/next-view-transitions)
- [Vercel Analytics](https://vercel.com/docs/analytics)

---

**Дата:** 2026-02-06
**Next.js:** 16.1.6
**Platform:** Vercel
**Режим:** Full Next.js (все возможности)
