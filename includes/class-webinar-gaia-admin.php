<?php
class Webinar_Gaia_Admin {
    private $plugin_name;
    private $version;

    public function __construct($plugin_name, $version) {
        $this->plugin_name = $plugin_name;
        $this->version = $version;
    }

    public function enqueue_styles() {
        wp_enqueue_style(
            $this->plugin_name,
            WEBINAR_GAIA_URL . 'admin/css/webinar-gaia-admin.css',
            array(),
            $this->version,
            'all'
        );
    }

    public function enqueue_scripts() {
        wp_enqueue_script(
            $this->plugin_name,
            WEBINAR_GAIA_URL . 'admin/js/webinar-gaia-admin.js',
            array('jquery'),
            $this->version,
            false
        );

        wp_localize_script($this->plugin_name, 'webinarGaiaAdmin', array(
            'ajaxurl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('webinar_gaia_nonce')
        ));
    }

    public function add_plugin_admin_menu() {
        add_menu_page(
            'Webinar Gaia',
            'Webinar Gaia',
            'manage_options',
            $this->plugin_name,
            array($this, 'display_plugin_admin_page'),
            'dashicons-video-alt3',
            20
        );
    }

    public function display_plugin_admin_page() {
        include_once WEBINAR_GAIA_PATH . 'admin/partials/webinar-gaia-admin-display.php';
    }
}