# View Transitions - Официальное решение

Проект использует **официальный React ViewTransition API** с интеграцией Next.js.

---

## 🎯 Текущая реализация

### Технологии:
- **React 19.2** с `ViewTransition` компонентом (Experimental)
- **Next.js 16.1.6** с флагом `experimental.viewTransition`
- **Нативный View Transitions API** (браузерный)

### Без сторонних библиотек:
- ❌ Не используется `next-view-transitions`
- ✅ Только официальные API от React/Next.js

---

## 📦 Конфигурация

### `next.config.ts`
```typescript
const config: NextConfig = {
  experimental: {
    viewTransition: true, // Включает интеграцию Next.js
  },
}
```

**Что это дает:**
- Автоматические Transition Types для навигации
- Глубокая интеграция с React Concurrent Features
- Правильная обработка Suspense
- Автоматический респект `prefers-reduced-motion`

---

## 🔧 Как используется

### Подход: Обертка каждой страницы

**По примеру официального Next.js demo** (vercel/next-view-transition-example):

```tsx
// app/page.tsx
import { ViewTransition } from 'react'

export default function Home() {
  return (
    <MediaProvider>
      <ViewTransition>
        <main className="min-h-screen bg-background">
          {/* Контент страницы */}
        </main>
      </ViewTransition>
    </MediaProvider>
  )
}
```

```tsx
// app/cases/watchface/page-client.tsx
'use client'
import { ViewTransition } from 'react'

export default function PageClient({ title, blocks, footnotes }) {
  return (
    <ViewTransition>
      <main className="min-h-screen bg-background">
        {/* Контент статьи */}
      </main>
    </ViewTransition>
  )
}
```

**Ключевые моменты:**
1. Каждая **страница** оборачивается в `<ViewTransition>` (не layout)
2. **Без props** — используется дефолтный crossfade браузера
3. Server Components рендерят данные, Client Components оборачивают в ViewTransition
4. Next.js автоматически активирует transitions при навигации

---

## 🎨 Анимация

### Текущая реализация:
- **Дефолтный crossfade браузера** — без кастомизации
- **Длительность:** ~250ms (браузерный дефолт)
- **Timing:** ease (плавное начало и конец)

### Почему без кастомных CSS?

**По примеру официального Next.js demo:**
- Нет кастомных `::view-transition-old/new` стилей в globals.css
- Браузер сам управляет анимацией
- Плавные переходы без вспышек и артефактов

**Что убрали из globals.css:**
```css
/* ❌ Убрали - вызывало проблемы */
html {
  scroll-behavior: smooth; /* Конфликтовало с transitions */
  overflow-x: hidden; /* Не нужно для transitions */
}

::view-transition-old(root) { /* Кастомизация не нужна */
  animation-duration: 0.4s;
}
```

---

## 📱 Мобильная оптимизация

### Viewport конфигурация (`layout.tsx`):
```typescript
export const viewport: Viewport = {
  interactiveWidget: 'resizes-visual',
}
```

**Зачем:** Предотвращает InvalidStateError при скрытии/показе URL bar на мобильных.

---

## ✅ Преимущества официального решения

### 1. Без workarounds:
- ❌ Не нужен error handler для InvalidStateError
- ❌ Не нужны CSS хаки (`overflow: clip`, `lvh`)
- ❌ Не нужны обертки над Link компонентом

### 2. По спецификации:
- ✅ Следует официальной View Transitions API
- ✅ Совместим с браузерными стандартами
- ✅ Progressive enhancement из коробки

### 3. Глубокая интеграция:
- ✅ Работает с React Suspense
- ✅ Работает с React Concurrent Features
- ✅ Автоматическая обработка ошибок
- ✅ Респектит accessibility (`prefers-reduced-motion`)

---

## 🌐 Поддержка браузеров

**View Transitions API:**
- ✅ Chrome 111+
- ✅ Edge 111+
- ✅ Safari 18+ (macOS/iOS)
- ✅ Opera 97+
- ⏳ Firefox 144+ (планируется октябрь 2025)

**Fallback:** Graceful degradation - переходы без анимации в неподдерживаемых браузерах.

---

## 📚 Документация

### Официальные источники:
- [React ViewTransition](https://react.dev/reference/react/ViewTransition)
- [Next.js viewTransition Config](https://nextjs.org/docs/app/api-reference/config/next-config-js/viewTransition)
- [React Labs Blog](https://react.dev/blog/2025/04/23/react-labs-view-transitions-activity-and-more)
- [Vercel Example](https://github.com/vercel/next-view-transition-example)

### Browser API:
- [MDN View Transitions](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API)
- [Chrome Developers Guide](https://developer.chrome.com/docs/web-platform/view-transitions)
- [View Transitions 2025 Update](https://developer.chrome.com/blog/view-transitions-in-2025)

---

## 🔍 Troubleshooting

### ViewTransition не активируется?

**Проверьте:**
1. `experimental.viewTransition: true` в next.config.ts
2. Каждая **страница** обернута в `<ViewTransition>` (не layout!)
3. Навигация происходит через Next.js `<Link>` компоненты
4. ViewTransition импортирован из `'react'`, не из библиотеки

### Нужны ли props для ViewTransition?

**Нет** — для простого crossfade достаточно:
```tsx
<ViewTransition>
  <main>...</main>
</ViewTransition>
```

**Да** — только если нужны shared element transitions:
```tsx
<ViewTransition name="avatar-123">
  <Avatar />
</ViewTransition>
```

### Ошибка "ViewTransition must wrap DOM nodes"?

```tsx
// ❌ Неправильно
<div>
  <ViewTransition>Text</ViewTransition>
</div>

// ✅ Правильно
<ViewTransition>
  <div>Text</div>
</ViewTransition>
```

### Transitions не работают в Safari?

Проверьте версию Safari (нужна 18+). Для старых версий - graceful degradation.

---

## 🚀 Что дальше?

### Можно добавить:

1. **Кастомные анимации:**
```tsx
<ViewTransition enter="slide-in" exit="slide-out">
  <Component />
</ViewTransition>
```

2. **Shared element transitions:**
```tsx
<ViewTransition name="hero-image">
  <img src="..." />
</ViewTransition>
```

3. **Transition types:**
```tsx
import { addTransitionType } from 'react'

startTransition(() => {
  addTransitionType('navigate-forward')
  router.push('/next')
})
```

---

**Дата миграции:** 2026-02-06
**Версии:** React 19.2, Next.js 16.1.6
**Статус:** Production-ready с экспериментальным флагом
