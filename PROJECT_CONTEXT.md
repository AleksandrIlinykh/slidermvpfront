# Project Context - Slider MVP Front

## Последнее обновление: 2025-10-02

## Описание проекта
React + TypeScript + Vite приложение для создания видео слайд-шоу с использованием Shotstack API.

## Текущая конфигурация

### Изображения (src/mock.ts)
Проект использует 3 изображения RV/автодомов:
- `2013_Thor_Motor_Coach_TUSCANY_XTE_40EX.jpg`
- `2016_Jayco_North_Point_377RLBH.jpg`
- `2022_Prime_Time_AVENGER_25_FLS.jpg`

Файлы переименованы без пробелов для корректной работы.

### Настройки видео (src/utils/transformer.ts)

**Формат вывода:**
- Формат: MP4
- Разрешение: SD (стандартное разрешение)
- Длительность клипа: 4 секунды

**Текстовые оверлеи:**
- Тип: HTML asset (не text/title!)
- Позиция: bottomLeft
- Offset: `x: 0.03, y: 0.135`
- Анимация: slideRight (вход), slideLeft (выход)

**Стилизация текста:**
```css
- Шрифт: Arial, sans-serif, bold
- Размер: 46px
- Цвет текста: белый (#ffffff)
- Фон: rgba(0, 0, 0, 0.7) - полупрозрачный черный
- Padding: 10px 20px
- Border-radius: 6px
- display: inline-block - ВАЖНО! Фон подстраивается под размер текста
```

**HTML структура:**
```html
<p>Текст заголовка</p>
```

**Размеры контейнера:**
- width: 960px
- height: 120px

## Ключевые решения

### Проблема с фоном текста
**Проблема:** При использовании `text` asset фон занимал фиксированную высоту (2 строки), даже если текст короче.

**Решение:** Переход на `html` asset с CSS `display: inline-block` - теперь фон точно подстраивается под контент.

### Позиционирование
- Текст внизу слева с отступами
- Анимация синхронизирована с изображениями
- Offset values в Shotstack: от -1 до 1 (относительные координаты)
- Отрицательные Y значения = вниз

## Документация Shotstack

### Основные ссылки
- API Reference: https://shotstack.io/docs/api/
- Text Positioning: https://shotstack.io/learn/how-to-position-clips/
- Add Text to Video: https://shotstack.io/learn/add-text-to-video/

### Offset система
- Диапазон: -1 to 1 (относительно viewport)
- Negative Y = downward
- Positive Y = upward

## Структура проекта

```
src/
├── App.tsx - Главный компонент с формой и интеграцией Shotstack
├── mock.ts - Конфигурация с изображениями
├── types.ts - TypeScript интерфейсы
├── services/
│   └── shotstack.ts - API клиент Shotstack
└── utils/
    └── transformer.ts - Трансформация конфига в Shotstack payload
```

## Следующие шаги / TODO

- [ ] Проверить работу с длинными текстами (3+ строки)
- [ ] Возможно, настроить адаптивный размер шрифта
- [ ] Рассмотреть добавление фоновой музыки
- [ ] Оптимизация разрешения (сейчас SD)

## Git Status
```
Branch: master
Modified: .claude/settings.local.json
Untracked: переименованные файлы изображений
```

## Environment
- Platform: Windows (win32)
- Package manager: npm/pnpm
- Shotstack API: используется через VITE_SHOTSTACK_API_KEY
