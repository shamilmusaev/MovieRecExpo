# CineSwipe 🎬

CineSwipe - это мобильное приложение для iOS, которое помогает пользователям открывать новые фильмы, сериалы и аниме через короткие видео в формате вертикальной ленты (как TikTok).

## Get started

### 1. Install dependencies

```bash
npm install
```

### 2. Настройка переменных окружения

Для работы приложения необходим API ключ от TMDB (The Movie Database):

1. Зарегистрируйтесь на [TMDB](https://www.themoviedb.org/)
2. Получите API ключ в [настройках API](https://www.themoviedb.org/settings/api)
3. Создайте файл `.env` в корне проекта на основе `.env.example`:

```bash
cp .env.example .env
```

4. Отредактируйте `.env` файл, заменив `your_tmdb_api_key_here` на ваш API ключ:

```
EXPO_PUBLIC_TMDB_API_KEY=ваш_api_ключ_здесь
EXPO_PUBLIC_TMDB_BASE_URL=https://api.themoviedb.org/3
EXPO_PUBLIC_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p
EXPO_PUBLIC_ENV=development
```

### 3. Start the app

```bash
npx expo start
```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
