# Tasks: Setup CineSwipe Architecture

## 1. Структура папок

- [x] 1.1 Создать папку `services/` в корне проекта
- [x] 1.2 Создать папку `types/` в корне проекта
- [x] 1.3 Создать папку `stores/` в корне проекта
- [x] 1.4 Создать папку `utils/` в корне проекта
- [x] 1.5 Создать структуру для TMDB сервиса: `services/tmdb/`
- [x] 1.6 Создать структуру для storage сервиса: `services/storage/`

## 2. Зависимости

- [x] 2.1 Установить `expo-av` для видео плеера
- [x] 2.2 Установить `@react-native-async-storage/async-storage` для локального хранилища
- [x] 2.3 Установить `axios` для HTTP запросов
- [x] 2.4 Установить `react-native-dotenv` для env переменных
- [x] 2.5 Установить типы: `@types/react-native-dotenv`
- [x] 2.6 Проверить установку: `npm install` без ошибок

## 3. Конфигурация окружения

- [x] 3.1 Создать `.env.example` с шаблоном переменных
- [x] 3.2 Добавить `.env` в `.gitignore` (если еще не добавлено)
- [x] 3.3 Настроить `babel.config.js` для react-native-dotenv
- [x] 3.4 Создать `types/env.d.ts` для типизации env переменных
- [x] 3.5 Добавить инструкции по получению TMDB API key в README

## 4. TypeScript конфигурация

- [x] 4.1 Создать базовые типы в `types/tmdb.ts` (Movie, Video, Genre)
- [x] 4.2 Создать типы для хранилища в `types/storage.ts` (Favorite, UserPreferences)
- [x] 4.3 Создать `types/index.ts` для экспорта всех типов
- [x] 4.4 Обновить `tsconfig.json` если необходимо (проверить paths)

## 5. Базовые сервисы (структура, без реализации)

- [x] 5.1 Создать `services/tmdb/client.ts` (пустой файл с TODO)
- [x] 5.2 Создать `services/tmdb/types.ts` (импорты из types/)
- [x] 5.3 Создать `services/storage/favorites.ts` (пустой файл с TODO)
- [x] 5.4 Создать `services/storage/preferences.ts` (пустой файл с TODO)
- [x] 5.5 Создать `services/index.ts` для экспорта сервисов

## 6. Утилиты

- [x] 6.1 Создать `utils/logger.ts` для логирования (console wrapper)
- [x] 6.2 Создать `utils/constants.ts` для API endpoints
- [x] 6.3 Создать `utils/index.ts` для экспорта

## 7. Документация

- [x] 7.1 Обновить `openspec/project.md` - исправить структуру папок (убрать src/)
- [x] 7.2 Добавить секцию в README.md с инструкциями по настройке .env
- [x] 7.3 Добавить комментарии в .env.example с описанием каждой переменной

## 8. Валидация

- [x] 8.1 Запустить `npm run lint` - нет ошибок
- [x] 8.2 Запустить TypeScript проверку: `npx tsc --noEmit` - нет ошибок
- [x] 8.3 Запустить проект: `npm start` - запускается без ошибок
- [x] 8.4 Проверить импорты типов работают корректно
- [x] 8.5 Запустить `openspec validate setup-cineswipe-architecture --strict`
