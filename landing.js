(() => {
    // Функции для работы с localStorage
    const getLastVisit = () => {
        try {
            const lastVisit = localStorage.getItem('landingPageLastVisit');
            return lastVisit ? new Date(lastVisit) : null;
        } catch (error) {
            console.error('Ошибка при получении даты визита из localStorage:', error);
            return null;
        }
    };

    const saveLastVisit = (date) => {
        try {
            localStorage.setItem('landingPageLastVisit', date.toISOString());
        } catch (error) {
            console.error('Ошибка при сохранении даты визита в localStorage:', error);
        }
    };

    const clearLocalStorageIfNeeded = () => {
        try {
            const lastClearDate = localStorage.getItem('lastStorageClearDate');
            const currentDate = new Date();

            if (!lastClearDate || currentDate - new Date(lastClearDate) > 60 * 24 * 60 * 60 * 1000) { // 2 месяца
                localStorage.clear();
                localStorage.setItem('lastStorageClearDate', currentDate.toISOString());
                console.log('localStorage очищен.');
            }
        } catch (error) {
            console.error('Ошибка при работе с localStorage (очистка):', error);
        }
    };

    // Проверка наличия мета-записи с адресом посадочной страницы
    const landingPageMetaTag = document.querySelector('meta[name="landing-page-url"]');
    const landingPageUrl = landingPageMetaTag?.getAttribute('content');
    const isMobileEnabled = landingPageMetaTag?.dataset.mobile === 'true'; // Получаем значение data-mobile

    if (!landingPageUrl) {
        console.error('Мета-тег с адресом посадочной страницы не найден или не содержит контента.');
        return;
    }

    // Расширенная проверка URL
    try {
        new URL(landingPageUrl);
    } catch (e) {
        console.error('Некорректный URL посадочной страницы:', landingPageUrl);
        return;
    }

    console.log('Адрес посадочной страницы извлечен:', landingPageUrl);
    console.log('Поддержка мобильных устройств:', isMobileEnabled);

    // Проверка устройства
    if (/Mobi|Android/i.test(navigator.userAgent) && !isMobileEnabled) {
        console.log('Скрипт не активируется на мобильных устройствах (и поддержка не включена).');
        return;
    }

    console.log('Скрипт активирован на десктопном устройстве (или поддержка мобильных устройств включена).');

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
            console.log('Клик!'); // <--- Добавлено для отладки

            console.log('event.target:', event.target); // <--- Добавлено для отладки

            if (event.target.closest('.site-container') || event.target.matches('img, picture')) {
                console.log('Клик по элементу, открываем посадочную страницу...');

                const openLandingPage = () => {
                    try {
                        console.log('Попытка открыть посадочную страницу'); // <--- Добавлено для отладки
                        console.log('URL:', landingPageUrl); // <--- Добавлено для отладки
                        window.open(landingPageUrl, '_blank');
                        saveLastVisit(currentDate); // Сохраняем новую дату визита
                        console.log('Посадочная страница открыта. Дата визита сохранена.');
                    } catch (error) {
                        console.error('Ошибка при открытии посадочной страницы:', error);
                    }
                };
                openLandingPage();
                // Удаляем обработчик после первого клика
                document.removeEventListener('click', eventHandler);
            }
        };

        document.addEventListener('click', eventHandler);
    } else {
        console.log('Посадочная страница уже была открыта в этом месяце. Никаких действий не предпринимается.');
    }
})();