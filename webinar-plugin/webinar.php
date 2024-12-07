<?php
/*
Plugin Name: Webinar Simulator
Plugin URI: https://seu-site.com/webinar-simulator
Description: Simulador de webinar ao vivo com chat e CTA programados
Version: 1.0
Author: Seu Nome
*/

if (!defined('ABSPATH')) exit;

// Registrar scripts e estilos
function webinar_enqueue_scripts() {
    wp_enqueue_style('webinar-styles', plugins_url('assets/css/styles.css', __FILE__));
    wp_enqueue_script('webinar-app', plugins_url('assets/js/app.js', __FILE__), array(), '1.0', true);
    wp_localize_script('webinar-app', 'webinarData', array(
        'ajaxUrl' => admin_url('admin-ajax.php'),
        'nonce' => wp_create_nonce('webinar_nonce')
    ));
}
add_action('wp_enqueue_scripts', 'webinar_enqueue_scripts');

// Criar página de administração
function webinar_admin_menu() {
    add_menu_page(
        'Webinar Simulator',
        'Webinar Simulator',
        'manage_options',
        'webinar-simulator',
        'webinar_admin_page',
        'dashicons-video-alt3'
    );
}
add_action('admin_menu', 'webinar_admin_menu');

// Shortcode para exibir o webinar
function webinar_shortcode($atts) {
    $webinar_id = isset($atts['id']) ? $atts['id'] : '';
    $webinar = get_webinar_data($webinar_id);
    
    ob_start();
    include plugin_dir_path(__FILE__) . 'templates/webinar-display.php';
    return ob_get_clean();
}
add_shortcode('webinar', 'webinar_shortcode');

// Funções auxiliares
function get_webinar_data($webinar_id) {
    return get_option('webinar_' . $webinar_id, array());
}

function save_webinar_data($webinar_id, $data) {
    update_option('webinar_' . $webinar_id, $data);
}