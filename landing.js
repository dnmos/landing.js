(() => {
  // Функции для работы с localStorage
  const getLastVisit = () => {
    const lastVisit = localStorage.getItem('landingPageLastVisit');
    return lastVisit ? new Date(lastVisit) : null;
  };

  const saveLastVisit = (date) => {
    localStorage.setItem('landingPageLastVisit', date.toISOString());
  };

  const clearLocalStorageIfNeeded = () => {
    const lastClearDate = localStorage.getItem('lastStorageClearDate');
    const currentDate = new Date();

    if (!lastClearDate || currentDate - new Date(lastClearDate) > 60 * 24 * 60 * 60 * 1000) { // 2 месяца
      localStorage.clear();
      localStorage.setItem('lastStorageClearDate', currentDate.toISOString());
      console.log('localStorage очищен.');
    }
  };

  // Проверка наличия мета-записи с адресом посадочной страницы
  const landingPageMetaTag = document.querySelector('meta[name="landing-page-url"]');
  const landingPageUrl = landingPageMetaTag?.getAttribute('content');

  if (!landingPageUrl) {
    console.error('Мета-тег с адресом посадочной страницы не найден или не содержит контента.');
    return;
  }

  console.log('Адрес посадочной страницы извлечен:', landingPageUrl);

  // Проверка устройства
  if (/Mobi|Android/i.test(navigator.userAgent)) {
    console.log('Скрипт не активируется на мобильных устройствах.');
    return;
  }

  console.log('Скрипт активирован на десктопном устройстве.');

  // Очистка localStorage раз в два месяца
  clearLocalStorageIfNeeded();

  const currentDate = new Date();
  const lastVisitDate = getLastVisit();

  // Проверка времени с последнего визита
  const isFirstVisit = !lastVisitDate;
  const shouldOpenLandingPage = !lastVisitDate || currentDate - lastVisitDate >= 30 * 24 * 60 * 60 * 1000; // 30 дней в миллисекундах

  // Если это первый визит или прошло больше 30 дней
  if (shouldOpenLandingPage) {
    console.log('Проверка прошла. Скрипт ожидает клик пользователя для открытия посадочной страницы...');

    // Обработчик кликов по нужным элементам
    const eventHandler = (event) => {
      // Проверяем клик по .site-container, img или picture
      if (event.target.closest('.site-container') || event.target.matches('img, picture')) {
        console.log('Клик по элементу, открываем посадочную страницу...');
        openLandingPage();
        // Удаляем обработчик после первого клика
        document.removeEventListener('click', eventHandler);
      }
    };

    document.addEventListener('click', eventHandler);
  } else {
    console.log('Посадочная страница уже была открыта в этом месяце. Никаких действий не предпринимается.');
  }

  // Открытие посадочной страницы
  const openLandingPage = () => {
    try {
      window.open(landingPageUrl, '_blank');
      saveLastVisit(currentDate); // Сохраняем новую дату визита
      console.log('Посадочная страница открыта. Дата визита сохранена.');
    } catch (error) {
      console.error('Ошибка при открытии посадочной страницы:', error);
    }
  };
})();
