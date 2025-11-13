# Capability: Dependency Management

## ADDED Requirements

### Requirement: Video Player Dependency

The project SHALL use `expo-av` for video playback (trailers from TMDB).

#### Scenario: Expo AV установлен

- **GIVEN** файл `package.json`
- **WHEN** разработчик проверяет dependencies
- **THEN** `expo-av` присутствует в списке зависимостей

#### Scenario: Видео компонент импортирует Video

- **GIVEN** установленный `expo-av`
- **WHEN** разработчик импортирует `import { Video } from 'expo-av'`
- **THEN** импорт работает без ошибок

### Requirement: Local Storage Dependency

The project SHALL use `@react-native-async-storage/async-storage` for local data storage (favorites, preferences).

#### Scenario: AsyncStorage установлен

- **GIVEN** файл `package.json`
- **WHEN** разработчик проверяет dependencies
- **THEN** `@react-native-async-storage/async-storage` присутствует в списке

#### Scenario: Storage сервис импортирует AsyncStorage

- **GIVEN** установленный AsyncStorage
- **WHEN** разработчик импортирует `import AsyncStorage from '@react-native-async-storage/async-storage'`
- **THEN** импорт работает без ошибок

### Requirement: HTTP Client Dependency

The project SHALL use `axios` for making HTTP requests to TMDB API.

#### Scenario: Axios установлен

- **GIVEN** файл `package.json`
- **WHEN** разработчик проверяет dependencies
- **THEN** `axios` присутствует в списке зависимостей

#### Scenario: TMDB клиент использует axios

- **GIVEN** установленный axios
- **WHEN** разработчик импортирует `import axios from 'axios'` в `services/tmdb/client.ts`
- **THEN** импорт работает без ошибок

### Requirement: Environment Variables Dependency

The project SHALL use `react-native-dotenv` for managing environment variables (TMDB API key).

#### Scenario: react-native-dotenv установлен

- **GIVEN** файл `package.json`
- **WHEN** разработчик проверяет devDependencies
- **THEN** `react-native-dotenv` присутствует в списке

#### Scenario: Environment переменные импортируются

- **GIVEN** установленный react-native-dotenv и настроенный babel
- **WHEN** разработчик импортирует `import { TMDB_API_KEY } from '@env'`
- **THEN** импорт работает и переменная доступна

### Requirement: TypeScript Type Definitions

The project SHALL have type definitions for all dependencies that require them.

#### Scenario: Types для dotenv установлены

- **GIVEN** файл `package.json`
- **WHEN** разработчик проверяет devDependencies
- **THEN** присутствует пакет с типами для используемых библиотек (если требуется)

### Requirement: Dependency Installation Validation

All dependencies SHALL install without errors or version conflicts.

#### Scenario: npm install успешно выполняется

- **GIVEN** обновленный `package.json` с новыми зависимостями
- **WHEN** разработчик выполняет `npm install`
- **THEN** команда завершается успешно без ошибок
- **AND** создается актуальный `package-lock.json`

#### Scenario: Проект запускается после установки

- **GIVEN** все зависимости установлены
- **WHEN** разработчик запускает `npm start`
- **THEN** Expo dev server запускается без ошибок
- **AND** приложение собирается успешно
