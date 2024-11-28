import pandas as pd
import logging

# Укажите путь к файлу
file_path = "landing_pages.csv"
output_file_path = "modified_landing_pages.csv"

# Настройка логирования
logging.basicConfig(
    filename='modify_landing_pages.log',  # Имя файла для логирования
    level=logging.INFO,  # Уровень логирования (INFO, ERROR, и т.д.)
    format='%(asctime)s - %(levelname)s - %(message)s'  # Формат сообщения (с микросекундами)
)

# Функция для модификации ссылки
def insert_bb_before_ampersand(link):
    if '&' in link:
        index = link.find('&')  # Найти индекс первого символа '&'
        return link[:index] + "_bb" + link[index:]  # Вставить '_bb' перед '&'
    return link  # Если '&' нет, вернуть исходную ссылку

def modify_landing_pages(file_path, output_file_path):
    try:
        logging.info(f"Начинаю чтение файла: {file_path}")
        
        # Чтение файла CSV
        df = pd.read_csv(file_path)
        logging.info(f"Файл {file_path} успешно загружен.")
        
        # Проверка наличия столбца "посадочная страница"
        if "посадочная страница" not in df.columns:
            raise ValueError("Отсутствует обязательный столбец: 'посадочная страница'")
        
        logging.info("Применяю модификацию ссылок для столбца 'посадочная страница'.")

        # Применяем функцию ко всем строкам в столбце "посадочная страница"
        df["посадочная страница"] = df["посадочная страница"].apply(insert_bb_before_ampersand)
        
        # Сохраняем результат в новый CSV
        df.to_csv(output_file_path, index=False)
        logging.info(f"Модифицированные данные успешно сохранены в {output_file_path}")
    
    except FileNotFoundError:
        logging.error(f"Файл {file_path} не найден. Убедитесь, что он находится в указанной папке.")
    except ValueError as ve:
        logging.error(f"Ошибка валидации: {ve}")
    except Exception as e:
        logging.error(f"Произошла ошибка: {e}")

# Выполнение функции
if __name__ == "__main__":
    logging.info("Запуск скрипта для модификации посадочных страниц.")
    modify_landing_pages(file_path, output_file_path)
    logging.info("Завершение работы скрипта.")
