// playwright.config.js
module.exports = {
  // Папка, в которой находятся ваши тесты
  testDir: './tests',

  // Ожидаемое поведение тестов
  timeout: 30000, // Время ожидания для каждого теста (30 секунд)

  // Глобальная настройка для каждого теста
  use: {
    headless: true, // Запускать браузер в фоновом режиме (без графического интерфейса)
    viewport: { width: 1280, height: 720 }, // Устанавливаем размер экрана
    video: 'on-first-retry', // Сохранять видео только при первом неудачном запуске
    actionTimeout: 10000, // Время ожидания для каждого действия (например, клики или заполнение форм)
    ignoreHTTPSErrors: true, // Игнорировать ошибки SSL/TLS
    screenshot: 'only-on-failure', // Делаем скриншоты только при ошибке теста
    baseURL: 'https://www.saucedemo.com', // Базовый URL для вашего приложения
  },

  // Настройки тестов
  projects: [
    {
      name: 'Chromium', // Используем браузер Chromium
      use: { 
        browserName: 'chromium', 
      },
    },
    {
      name: 'Firefox', // Используем браузер Firefox
      use: { 
        browserName: 'firefox', 
      },
    },
    {
      name: 'WebKit', // Используем браузер WebKit (Safari)
      use: { 
        browserName: 'webkit', 
      },
    },
  ],

  // Местоположение для отчетов о тестах
  reporter: [['html', { outputFolder: 'playwright-report', open: 'never' }]],

  // Логирование ошибок
  expect: {
    timeout: 5000, // Тайм-аут для ожидания в `expect` (например, ожидание элемента)
  },

  // Прочие настройки
  retries: 2, // Число попыток перезапуска теста при его сбое
  workers: 2, // Количество одновременных процессов
};


