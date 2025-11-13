# Change: Setup CineSwipe Architecture

## Why

Проект CineSwipe инициализирован с базовой структурой Expo Router, но не хватает ключевых архитектурных элементов для реализации MVP согласно PRD:

1. Отсутствуют папки для бизнес-логики (services/, types/, stores/)
2. Не настроена интеграция с TMDB API
3. Не установлены библиотеки для видео-плеера и локального хранилища
4. Не настроены переменные окружения для API ключей
5. project.md содержит устаревшую структуру папок (src/)

Нужно дополнить существующую архитектуру недостающими элементами, чтобы начать разработку основных фич (видео-лента, TMDB интеграция, избранное).

## What Changes

- **Добавить папки для архитектуры:**
  - `services/` - для API клиентов (TMDB, хранилище)
  - `types/` - для TypeScript типов и интерфейсов
  - `stores/` - для state management (Context API)
  - `utils/` - для вспомогательных функций

- **Установить зависимости:**
  - `expo-av` - видео плеер для трейлеров
  - `@react-native-async-storage/async-storage` - локальное хранилище
  - `axios` - HTTP клиент для TMDB API
  - `react-native-dotenv` - управление env переменными

- **Настроить конфигурацию:**
  - Создать `.env.example` с шаблоном переменных
  - Обновить `tsconfig.json` для импорта типов
  - Обновить `.gitignore` для `.env`
  - Создать базовые типы для Movie, Video, Genre

- **Обновить документацию:**
  - Исправить структуру папок в `openspec/project.md` (убрать src/, отразить реальную структуру)
  - Добавить README с инструкциями по настройке TMDB API

## Impact

- **Affected specs:**
  - `project-structure` (NEW) - структура папок проекта
  - `dependency-management` (NEW) - управление зависимостями
  - `environment-config` (NEW) - конфигурация окружения
  - `typescript-configuration` (NEW) - настройка TypeScript

- **Affected code:**
  - `openspec/project.md` - обновление структуры папок
  - `package.json` - новые зависимости
  - `tsconfig.json` - настройки компиляции
  - `.gitignore` - игнорирование .env
  - Новые папки: `services/`, `types/`, `stores/`, `utils/`

- **Breaking changes:** Нет
