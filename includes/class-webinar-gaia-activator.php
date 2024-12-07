<?php
class Webinar_Gaia_Activator {
    public static function activate() {
        global $wpdb;
        
        $charset_collate = $wpdb->get_charset_collate();
        
        // Create webinars table
        $table_name = $wpdb->prefix . 'webinar_gaia';
        $sql = "CREATE TABLE IF NOT EXISTS $table_name (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            title varchar(255) NOT NULL,
            description text,
            slug varchar(255) NOT NULL,
            video_url text,
            thumbnail_url text,
            start_time datetime NOT NULL,
            end_time datetime NOT NULL,
            created_by bigint(20) NOT NULL,
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            settings longtext,
            PRIMARY KEY  (id),
            UNIQUE KEY slug (slug)
        ) $charset_collate;";
        
        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        dbDelta($sql);
        
        // Create messages table
        $table_name = $wpdb->prefix . 'webinar_gaia_messages';
        $sql = "CREATE TABLE IF NOT EXISTS $table_name (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            webinar_id bigint(20) NOT NULL,
            username varchar(255) NOT NULL,
            message text NOT NULL,
            scheduled_time int NOT NULL,
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY  (id),
            KEY webinar_id (webinar_id)
        ) $charset_collate;";
        
        dbDelta($sql);
        
        // Create CTA buttons table
        $table_name = $wpdb->prefix . 'webinar_gaia_cta';
        $sql = "CREATE TABLE IF NOT EXISTS $table_name (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            webinar_id bigint(20) NOT NULL,
            text varchar(255) NOT NULL,
            url text NOT NULL,
            color varchar(20) NOT NULL,
            show_at int NOT NULL,
            duration int NOT NULL,
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY  (id),
            KEY webinar_id (webinar_id)
        ) $charset_collate;";
        
        dbDelta($sql);
        
        // Set version
        add_option('webinar_gaia_version', WEBINAR_GAIA_VERSION);
    }
}