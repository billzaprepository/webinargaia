<?php
class Webinar_Gaia {
    protected $loader;
    protected $plugin_name;
    protected $version;

    public function __construct() {
        $this->version = WEBINAR_GAIA_VERSION;
        $this->plugin_name = 'webinar-gaia';
        
        $this->load_dependencies();
        $this->define_admin_hooks();
        $this->define_public_hooks();
    }

    private function load_dependencies() {
        require_once WEBINAR_GAIA_PATH . 'includes/class-webinar-gaia-loader.php';
        $this->loader = new Webinar_Gaia_Loader();
    }

    private function define_admin_hooks() {
        $plugin_admin = new Webinar_Gaia_Admin($this->get_plugin_name(), $this->get_version());
        $this->loader->add_action('admin_enqueue_scripts', $plugin_admin, 'enqueue_styles');
        $this->loader->add_action('admin_enqueue_scripts', $plugin_admin, 'enqueue_scripts');
        $this->loader->add_action('admin_menu', $plugin_admin, 'add_plugin_admin_menu');
    }

    private function define_public_hooks() {
        $plugin_public = new Webinar_Gaia_Public($this->get_plugin_name(), $this->get_version());
        $this->loader->add_action('wp_enqueue_scripts', $plugin_public, 'enqueue_styles');
        $this->loader->add_action('wp_enqueue_scripts', $plugin_public, 'enqueue_scripts');
        $this->loader->add_shortcode('webinar_gaia', $plugin_public, 'display_webinar');
    }

    public function run() {
        $this->loader->run();
    }

    public function get_plugin_name() {
        return $this->plugin_name;
    }

    public function get_version() {
        return $this->version;
    }
}