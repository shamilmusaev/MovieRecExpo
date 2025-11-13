# Capability: TypeScript Configuration

## ADDED Requirements

### Requirement: Base Type Definitions for TMDB

The project SHALL contain TypeScript types for core TMDB API entities in `types/tmdb.ts`.

Необходимые типы:
- `Movie` - фильм с полями (id, title, overview, poster_path, release_date, vote_average, genre_ids)
- `Video` - видео/трейлер с полями (id, key, name, site, type)
- `Genre` - жанр с полями (id, name)

#### Scenario: Movie тип определен

- **GIVEN** файл `types/tmdb.ts`
- **WHEN** разработчик импортирует `import { Movie } from '@/types'`
- **THEN** TypeScript распознает тип `Movie`
- **AND** все поля типизированы (id: number, title: string, и т.д.)

#### Scenario: Video тип используется для трейлеров

- **GIVEN** тип `Video` в `types/tmdb.ts`
- **WHEN** компонент использует `const video: Video = { ... }`
- **THEN** TypeScript валидирует структуру объекта
- **AND** автодополнение работает для полей Video

#### Scenario: Genre тип используется для фильтрации

- **GIVEN** тип `Genre` в `types/tmdb.ts`
- **WHEN** разработчик создает массив `const genres: Genre[] = []`
- **THEN** TypeScript проверяет, что элементы соответствуют типу Genre

### Requirement: Storage Type Definitions

The project SHALL contain types for local storage in `types/storage.ts`.

Необходимые типы:
- `Favorite` - избранный фильм
- `UserPreferences` - предпочтения пользователя (любимые жанры)

#### Scenario: Favorite тип определен

- **GIVEN** файл `types/storage.ts`
- **WHEN** разработчик импортирует `import { Favorite } from '@/types'`
- **THEN** TypeScript распознает тип
- **AND** тип содержит поля movieId, addedAt

#### Scenario: UserPreferences тип используется

- **GIVEN** тип `UserPreferences` в `types/storage.ts`
- **WHEN** Context хранит `preferences: UserPreferences`
- **THEN** TypeScript валидирует структуру
- **AND** поля favoriteGenres типизированы как number[]

### Requirement: Barrel Export for Types

The `types/` directory SHALL contain an `index.ts` file for centralized export of all types.

#### Scenario: Типы экспортируются из index

- **GIVEN** файл `types/index.ts`
- **WHEN** файл экспортирует `export * from './tmdb'` и `export * from './storage'`
- **THEN** разработчик может импортировать любой тип через `import { Movie, Favorite } from '@/types'`

#### Scenario: Одиночный импорт для всех типов

- **GIVEN** `types/index.ts` с barrel exports
- **WHEN** разработчик импортирует `import { Movie, Video, Favorite } from '@/types'`
- **THEN** все типы доступны из одного import statement

### Requirement: Path Alias Configuration

The `tsconfig.json` file SHALL contain the path alias `@/*` to simplify imports.

#### Scenario: Path alias настроен

- **GIVEN** файл `tsconfig.json`
- **WHEN** разработчик проверяет `compilerOptions.paths`
- **THEN** присутствует `"@/*": ["./*"]`

#### Scenario: Импорты используют alias

- **GIVEN** настроенный path alias
- **WHEN** разработчик импортирует `import { Movie } from '@/types'`
- **THEN** TypeScript корректно резолвит путь
- **AND** IDE автодополнение работает

### Requirement: Strict Mode Enabled

TypeScript SHALL be configured in strict mode for maximum type safety.

#### Scenario: Strict mode включен

- **GIVEN** файл `tsconfig.json`
- **WHEN** разработчик проверяет `compilerOptions.strict`
- **THEN** значение установлено в `true`

#### Scenario: TypeScript проверка без ошибок

- **GIVEN** проект с созданными типами
- **WHEN** разработчик запускает `npx tsc --noEmit`
- **THEN** команда завершается без ошибок компиляции
- **AND** все типы корректно валидируются

### Requirement: Environment Types Declaration

The project SHALL contain type declarations for environment variables in `types/env.d.ts`.

#### Scenario: env.d.ts объявляет модуль @env

- **GIVEN** файл `types/env.d.ts`
- **WHEN** разработчик проверяет содержимое
- **THEN** присутствует `declare module '@env'`
- **AND** экспортированы типы для всех env переменных

#### Scenario: TMDB_API_KEY типизирован

- **GIVEN** declaration в `types/env.d.ts`
- **WHEN** разработчик импортирует `import { TMDB_API_KEY } from '@env'`
- **THEN** TypeScript знает, что `TMDB_API_KEY` имеет тип `string`
- **AND** нет ошибки "Cannot find module '@env'"
