<?php
/*
Plugin Name: Webinar Gaia
Plugin URI: https://bizsmart.com.br
Description: Plataforma de webinar simulado com chat e CTA programados
Version: 1.0
Author: Gaia Systems
Author URI: https://bizsmart.com.br
Text Domain: webinar-gaia
Domain Path: /languages
Requires PHP: 7.4
Requires at least: 5.0
*/

if (!defined('ABSPATH')) exit;

// Define plugin constants
define('WEBINAR_GAIA_VERSION', '1.0.0');
define('WEBINAR_GAIA_PATH', plugin_dir_path(__FILE__));
define('WEBINAR_GAIA_URL', plugin_dir_url(__FILE__));

// Include required files
require_once WEBINAR_GAIA_PATH . 'includes/class-webinar-gaia.php';
require_once WEBINAR_GAIA_PATH . 'includes/class-webinar-gaia-admin.php';
require_once WEBINAR_GAIA_PATH . 'includes/class-webinar-gaia-public.php';

// Initialize the plugin
function webinar_gaia_init() {
    $plugin = new Webinar_Gaia();
    $plugin->run();
}
add_action('plugins_loaded', 'webinar_gaia_init');

// Activation hook
function webinar_gaia_activate() {
    require_once WEBINAR_GAIA_PATH . 'includes/class-webinar-gaia-activator.php';
    Webinar_Gaia_Activator::activate();
}
register_activation_hook(__FILE__, 'webinar_gaia_activate');

// Deactivation hook
function webinar_gaia_deactivate() {
    require_once WEBINAR_GAIA_PATH . 'includes/class-webinar-gaia-deactivator.php';
    Webinar_Gaia_Deactivator::deactivate();
}
register_deactivation_hook(__FILE__, 'webinar_gaia_deactivate');