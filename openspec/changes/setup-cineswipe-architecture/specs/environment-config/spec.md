# Capability: Environment Configuration

## ADDED Requirements

### Requirement: Environment Template File

The project SHALL contain a `.env.example` file with a template of all required environment variables.

#### Scenario: .env.example существует

- **GIVEN** корневая директория проекта
- **WHEN** разработчик проверяет наличие `.env.example`
- **THEN** файл существует и содержит все необходимые переменные с описаниями

#### Scenario: Новый разработчик настраивает окружение

- **GIVEN** файл `.env.example` с переменными
- **WHEN** разработчик копирует `.env.example` в `.env`
- **AND** заполняет значения переменных
- **THEN** приложение может использовать эти переменные

### Requirement: TMDB API Key Configuration

The `.env.example` file SHALL contain the `TMDB_API_KEY` variable with instructions on how to obtain the key.

#### Scenario: TMDB_API_KEY присутствует в шаблоне

- **GIVEN** файл `.env.example`
- **WHEN** разработчик открывает файл
- **THEN** присутствует строка `TMDB_API_KEY=your_api_key_here`
- **AND** есть комментарий с ссылкой на получение ключа

#### Scenario: TMDB клиент использует API key

- **GIVEN** файл `.env` с заполненным `TMDB_API_KEY`
- **WHEN** `services/tmdb/client.ts` импортирует `TMDB_API_KEY` из `@env`
- **THEN** переменная доступна и имеет правильное значение

### Requirement: Git Ignore for Environment Files

The `.env` file SHALL be added to `.gitignore` to prevent committing sensitive data.

#### Scenario: .env игнорируется git

- **GIVEN** файл `.gitignore`
- **WHEN** разработчик проверяет содержимое
- **THEN** присутствует строка `.env`
- **AND** `.env.example` НЕ игнорируется

#### Scenario: Попытка закоммитить .env

- **GIVEN** `.env` в `.gitignore`
- **WHEN** разработчик выполняет `git status`
- **THEN** `.env` не отображается в untracked/modified файлах

### Requirement: Babel Configuration for dotenv

The `babel.config.js` file SHALL be configured to support `react-native-dotenv`.

#### Scenario: Babel плагин настроен

- **GIVEN** файл `babel.config.js`
- **WHEN** разработчик проверяет plugins
- **THEN** присутствует плагин `module:react-native-dotenv`
- **AND** настроены пути для .env файлов

#### Scenario: Environment переменные доступны в runtime

- **GIVEN** настроенный babel и `.env` файл
- **WHEN** приложение запускается
- **AND** компонент импортирует переменную из `@env`
- **THEN** переменная доступна в runtime

### Requirement: TypeScript Definitions for Environment

The project SHALL have type definitions for environment variables in `types/env.d.ts`.

#### Scenario: env.d.ts существует

- **GIVEN** папка `types/`
- **WHEN** разработчик проверяет файлы
- **THEN** существует `types/env.d.ts`

#### Scenario: TMDB_API_KEY типизирован

- **GIVEN** файл `types/env.d.ts`
- **WHEN** разработчик импортирует `TMDB_API_KEY` из `@env`
- **THEN** TypeScript распознает тип как `string`
- **AND** нет ошибок компиляции

### Requirement: Documentation for Environment Setup

The README.md file SHALL contain instructions for setting up environment variables.

#### Scenario: Инструкции в README

- **GIVEN** файл `README.md`
- **WHEN** разработчик ищет секцию "Environment Setup" или "Getting Started"
- **THEN** присутствуют инструкции:
  - Как скопировать `.env.example` в `.env`
  - Как получить TMDB API key
  - Ссылка на TMDB документацию

#### Scenario: Новый разработчик следует инструкциям

- **GIVEN** README с инструкциями
- **WHEN** новый разработчик выполняет шаги из README
- **THEN** он успешно настраивает `.env`
- **AND** приложение запускается с правильными переменными
