# SMS Forwarder MVP

Una aplicación Android que intercepta SMS entrantes, los evalúa contra reglas configuradas por el usuario y los reenvía automáticamente a Telegram.

## Características

- **Intercepción de SMS**: Corre en segundo plano como servicio foreground.
- **Reglas de filtrado**: Soporta texto plano y expresiones regulares.
- **Reenvío a Telegram**: Usa Bot API para enviar mensajes.
- **Interfaz intuitiva**: Pantallas para configurar reglas, ver logs y probar conexión.
- **Almacenamiento local**: Persistencia con AsyncStorage.

## Arquitectura

Clean Architecture con capas:
- **Domain**: Entidades y repositorios.
- **Application**: Casos de uso.
- **Infrastructure**: Implementaciones (AsyncStorage, servicios).
- **Presentation**: Componentes React Native.

## Requisitos

- Node.js >= 22.11.0
- React Native CLI
- Android SDK
- Dispositivo/emulador Android

## Instalación

1. Clona el repositorio:
   ```bash
   git clone <repo-url>
   cd SMSForwarder
   ```

2. Instala dependencias:
   ```bash
   npm install
   ```

3. Configura bot de Telegram:
   - Crea un bot con @BotFather en Telegram.
   - Obtén el token del bot.
   - Crea un chat privado o grupo.
   - Obtén el chat ID (envía mensaje al bot y usa getUpdates).

4. Ejecuta en emulador/dispositivo:
   ```bash
   npx react-native run-android
   ```

## Configuración

1. Abre la app.
2. Ve a "Configuración".
3. Ingresa token del bot y chat ID.
4. Presiona "Enviar prueba" para verificar.
5. Ve a "Reglas" para crear filtros.
6. Ve a "Home" y activa el servicio.

## Uso

- **Home**: Ver logs de SMS procesados, iniciar/detener servicio.
- **Reglas**: Crear/editar/eliminar reglas de filtrado.
- **Config**: Configurar Telegram y probar conexión.

## Tests

```bash
npm test
npx jest --coverage
```

Cobertura >70% en casos de uso.

## Permisos

- RECEIVE_SMS: Para interceptar mensajes.
- FOREGROUND_SERVICE: Para correr en background.

## Notas

- Solo Android.
- Requiere conexión a internet para reenvío.
- Logs limitados a 50 mensajes.

## Supuestos

- Usuario tiene conocimientos básicos de Telegram bots.
- Dispositivo tiene permisos concedidos.
- Configuración de bot es correcta.

# OR using Yarn
yarn start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [docs](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
