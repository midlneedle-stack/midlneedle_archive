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

### Компонент: `app/layout.tsx`

```tsx
import { ViewTransition } from 'react'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ScrollManager />
        <ScrollGradientOverlay />
        <ViewTransition default="page-fade">
          {children}
        </ViewTransition>
        <SpacingControls />
        <Analytics />
      </body>
    </html>
  )
}
```

**Ключевые моменты:**
1. `<ViewTransition>` оборачивает `{children}` — контент который меняется между страницами
2. `default="page-fade"` — CSS класс для кастомной анимации
3. Next.js автоматически активирует transitions при навигации через `<Link>` компоненты

---

## 🎨 Анимация

### Текущая реализация:
- **Старая страница:** исчезает мгновенно (`opacity: 0`, без анимации)
- **Новая страница:** fade-in анимация (0 → 100% opacity)
- **Длительность:** 0.4s
- **Timing:** ease (плавное начало и конец)

### Кастомизация через CSS:

**Файл:** `app/globals.css`

```css
/* Старая страница исчезает мгновенно */
::view-transition-old(.page-fade) {
  animation: none;
  opacity: 0;
}

/* Новая страница плавно появляется */
::view-transition-new(.page-fade) {
  animation: fade-in 0.4s ease;
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

**Важно:** Класс `.page-fade` соответствует prop `default="page-fade"` в компоненте ViewTransition.

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
2. `ViewTransition` оборачивает `{children}` в layout.tsx
3. Используется prop `default="page-fade"` (или другое имя класса)
4. CSS селекторы используют тот же класс: `::view-transition-old(.page-fade)`

### Анимация не применяется?

**Частая ошибка:** использование селектора `::view-transition-old(root)` вместо `::view-transition-old(.page-fade)`

```css
/* ❌ Неправильно - root не работает с React ViewTransition */
::view-transition-old(root) {
  animation: none;
}

/* ✅ Правильно - используем класс из default prop */
::view-transition-old(.page-fade) {
  animation: none;
}
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
