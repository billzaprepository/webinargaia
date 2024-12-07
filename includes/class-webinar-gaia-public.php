<?php
class Webinar_Gaia_Public {
    private $plugin_name;
    private $version;

    public function __construct($plugin_name, $version) {
        $this->plugin_name = $plugin_name;
        $this->version = $version;
    }

    public function enqueue_styles() {
        wp_enqueue_style(
            $this->plugin_name,
            WEBINAR_GAIA_URL . 'public/css/webinar-gaia-public.css',
            array(),
            $this->version,
            'all'
        );
    }

    public function enqueue_scripts() {
        wp_enqueue_script(
            $this->plugin_name,
            WEBINAR_GAIA_URL . 'public/js/webinar-gaia-public.js',
            array('jquery'),
            $this->version,
            false
        );

        wp_localize_script($this->plugin_name, 'webinarGaiaPublic', array(
            'ajaxurl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('webinar_gaia_nonce')
        ));
    }

    public function display_webinar($atts) {
        $attributes = shortcode_atts(array(
            'id' => '',
        ), $atts);

        ob_start();
        include WEBINAR_GAIA_PATH . 'public/partials/webinar-gaia-public-display.php';
        return ob_get_clean();
    }
}