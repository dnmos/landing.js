<?php
/**
 * Add landing page meta tag
 */

// Добавляем мета-тег с URL посадочной страницы из ACF
function add_landing_page_meta_tag() {
    // Проверяем, что установлен и активен плагин ACF
    if (function_exists('get_field') && !is_front_page() && !is_home() && is_single()) {
        // Получаем значение поля ACF для URL посадочной страницы текущей записи
        $landing_page_url = get_field('landing_page_url');
        $landing_page_mobile = get_field('landing_page_mobile'); // Получаем значение поля true/false

        // Если значение существует, выводим мета-тег
        if ($landing_page_url) {
            $mobile_attr = $landing_page_mobile ? 'data-mobile="true"' : 'data-mobile="false"';
            echo '<meta name="landing-page-url" content="' . esc_url($landing_page_url) . '" ' . $mobile_attr . '>' . "\n";
        }
    }
}
add_action('wp_head', 'add_landing_page_meta_tag');