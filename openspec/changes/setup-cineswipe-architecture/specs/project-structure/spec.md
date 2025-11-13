# Capability: Project Structure

## ADDED Requirements

### Requirement: Core Directory Layout

The project SHALL contain the following directory structure in the root for code organization:

- `app/` - Expo Router файлы (экраны и навигация)
- `components/` - Переиспользуемые UI компоненты
- `hooks/` - Кастомные React hooks
- `constants/` - Константы приложения
- `services/` - API клиенты и бизнес-логика
- `types/` - TypeScript типы и интерфейсы
- `stores/` - State management (Context API провайдеры)
- `utils/` - Вспомогательные функции
- `assets/` - Статические файлы (изображения, шрифты)

#### Scenario: Разработчик импортирует сервис

- **GIVEN** проект с установленной структурой
- **WHEN** разработчик импортирует `import { tmdbClient } from '@/services'`
- **THEN** импорт работает без ошибок

#### Scenario: Структура соответствует Expo Router конвенциям

- **GIVEN** проект инициализирован с Expo Router
- **WHEN** разработчик добавляет новый экран в `app/`
- **THEN** Expo Router автоматически регистрирует роут

### Requirement: Services Directory Organization

The `services/` directory SHALL contain subdirectories for each external service or data source:

- `services/tmdb/` - TMDB API клиент и mappers
- `services/storage/` - Локальное хранилище (AsyncStorage обертки)

#### Scenario: TMDB сервис организован

- **GIVEN** папка `services/tmdb/`
- **WHEN** разработчик создает файлы `client.ts`, `types.ts`, `mappers.ts`
- **THEN** все файлы находятся в `services/tmdb/`

#### Scenario: Storage сервис изолирован

- **GIVEN** папка `services/storage/`
- **WHEN** разработчик создает `favorites.ts` и `preferences.ts`
- **THEN** файлы находятся в `services/storage/`

### Requirement: Types Directory Organization

The `types/` directory SHALL contain TypeScript type definitions and interfaces for:

- `types/tmdb.ts` - Типы для TMDB API (Movie, Video, Genre)
- `types/storage.ts` - Типы для локального хранилища (Favorite, UserPreferences)
- `types/navigation.ts` - Типы для навигации (опционально)
- `types/env.d.ts` - Типы для environment variables
- `types/index.ts` - Barrel export для всех типов

#### Scenario: Типы TMDB импортируются

- **GIVEN** файл `types/tmdb.ts` с типом `Movie`
- **WHEN** разработчик импортирует `import { Movie } from '@/types'`
- **THEN** TypeScript распознает тип `Movie`

#### Scenario: Environment переменные типизированы

- **GIVEN** файл `types/env.d.ts` с декларацией `TMDB_API_KEY`
- **WHEN** разработчик использует `process.env.TMDB_API_KEY`
- **THEN** TypeScript знает тип переменной (string)

### Requirement: Utilities Directory

The `utils/` directory SHALL contain utility functions:

- `utils/logger.ts` - Обертка над console для логирования
- `utils/constants.ts` - API endpoints и другие константы
- `utils/index.ts` - Barrel export

#### Scenario: Logger используется в приложении

- **GIVEN** файл `utils/logger.ts` с функцией `log`
- **WHEN** разработчик вызывает `logger.log('message')`
- **THEN** сообщение выводится в консоль

### Requirement: Stores Directory

The `stores/` directory SHALL contain React Context providers for state management:

- `stores/FavoritesContext.tsx` - Context для избранных фильмов
- `stores/PreferencesContext.tsx` - Context для пользовательских предпочтений

#### Scenario: Favorites context создан

- **GIVEN** файл `stores/FavoritesContext.tsx`
- **WHEN** разработчик оборачивает приложение в `<FavoritesProvider>`
- **THEN** все дочерние компоненты имеют доступ к favorites state
