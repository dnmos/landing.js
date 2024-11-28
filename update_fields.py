import os
import logging
import base64
import requests
from dotenv import load_dotenv
import pandas as pd

# Настройка логирования
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger()

# Загружаем переменные окружения из файла .env
load_dotenv()

# Получаем значения из переменных окружения
csv_file_path = os.getenv('CSV_FILE_PATH')
wp_url = os.getenv('WP_URL')
wp_username = os.getenv('WP_USERNAME')
wp_application_password = os.getenv('WP_APPLICATION_PASSWORD')
custom_body_class = os.getenv('CUSTOM_BODY_CLASS')

# Логируем загрузку данных
logger.info(f"Загружаем данные из CSV файла: {csv_file_path}")

# Проверяем, существует ли CSV файл
if not os.path.exists(csv_file_path):
    logger.error(f"Файл CSV не найден: {csv_file_path}")
    exit()

# Загрузка данных из CSV
try:
    df = pd.read_csv(csv_file_path)
    logger.info(f"CSV файл '{csv_file_path}' успешно загружен.")
except Exception as e:
    logger.error(f"Ошибка при загрузке CSV файла: {e}")
    exit()

# Функция для создания заголовка авторизации
def create_auth_header(username, app_password):
    # Формируем строку с учётом базовой аутентификации
    credentials = f"{username}:{app_password}"
    token = base64.b64encode(credentials.encode())
    return {'Authorization': 'Basic ' + token.decode('utf-8')}

# Заголовок для авторизации
auth_header = create_auth_header(wp_username, wp_application_password)

# Проходим по всем строкам и обновляем ACF поле
for index, row in df.iterrows():
    page_url = row['страница сайта']
    landing_page_url = row['посадочная страница']
    
    logger.info(f"Обрабатываем пост с slug: {page_url} -> Посадочная страница: {landing_page_url}")
    
    # Получаем ID поста на основе slug
    try:
        # Запрос к API для получения поста по slug
        response = requests.get(f"{wp_url}/wp-json/wp/v2/posts?slug={page_url}", headers=auth_header)
        
        # Логируем запрос и статус ответа
        logger.info(f"API запрос: {wp_url}/wp-json/wp/v2/posts?slug={page_url}")
        logger.info(f"Статус ответа от API: {response.status_code}")
        
        if response.status_code == 200:
            post_data = response.json()
            if post_data:
                post_id = post_data[0]['id']
                logger.info(f"Найден пост с ID: {post_id}")
                
                # Чтение текущего значения ACF поля 'landing_page_url'
                landing_page_url_initial = post_data[0]['acf']['landing_page_url']
                logger.info(f"Найдено ACF поле landing_page_url: {landing_page_url_initial}")

                # Обновляем ACF поле для поста
                acf_data = {
                    'acf': {
                        'landing_page_url': landing_page_url  # Используем новое название поля
                    },
                    'meta': {
                        '_genesis_custom_body_class': custom_body_class
                    }
                }
                
                # Логируем запрос на обновление
                logger.info(f"Обновляем поле 'landing_page_url' для поста {page_url}.")
                
                update_response = requests.post(f"{wp_url}/wp-json/wp/v2/posts/{post_id}", headers=auth_header, json=acf_data)
                
                # Логируем ответ на запрос обновления
                if update_response.status_code == 200:
                    logger.info(f"Пост с slug {page_url} успешно обновлен.")
                else:
                    logger.error(f"Не удалось обновить пост {page_url}: {update_response.status_code} - {update_response.text[:100]}...")  # Печатаем первые 100 символов ответа
            else:
                logger.warning(f"Пост с slug {page_url} не найден.")
        else:
            logger.error(f"Ошибка при получении поста с slug {page_url}: {response.status_code} - {response.text[:100]}...")  # Печатаем первые 100 символов ответа

    except Exception as e:
        logger.error(f"Ошибка при обработке поста с slug {page_url}: {e}")
