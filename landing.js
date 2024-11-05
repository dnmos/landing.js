
// landing.js
// Скрипт для открытия посадочной страницы в новой вкладке на основе класса body
// Отслеживает, была ли открыта посадочная страница с помощью куки, чтобы избежать повторного открытия в течение месяца

// Словарь посадочных страниц
const landingPages = {
    "lp-landing1": "https://example.com/landing1",
    "lp-landing2": "https://example.com/landing2",
    "lp-landing3": "https://example.com/landing3",
    "lp-landing4": "https://example.com/landing4",
    "lp-landing5": "https://example.com/landing5",
};

// Получаем классы body
const bodyClasses = document.body.classList;
console.log("Классы body:", Array.from(bodyClasses));

// Проверяем наличие класса для открытия посадочной страницы
let landingPageUrl = null;
bodyClasses.forEach(className => {
    console.log(`Проверяем класс: ${className}`);
    if (landingPages[className]) {
        landingPageUrl = landingPages[className];
        console.log(`Найдено соответствие для класса "${className}": ${landingPageUrl}`);
    }
});

// Проверяем куки, чтобы не открывать страницу больше одного раза в месяц
const cookieName = "landingPageOpened";
const cookieValue = getCookie(cookieName);

// Если посадочная страница найдена и страница еще не была открыта
if (landingPageUrl && !cookieValue) {
    console.log(`Открываем посадочную страницу: ${landingPageUrl}`);
    window.open(landingPageUrl, "_blank");
    // Установка куки на 30 дней
    setCookie(cookieName, "true", 30);
} else if (cookieValue) {
    console.log("Посадочная страница уже была открыта в этом месяце.");
} else {
    console.log("Для этой страницы не задана посадочная страница.");
}

// Функция для получения значения куки
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

// Функция для установки куки
function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = `${name}=${value}; ${expires}; path=/`;
}
