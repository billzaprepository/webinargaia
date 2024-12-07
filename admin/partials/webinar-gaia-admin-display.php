<?php if (!defined('ABSPATH')) exit; ?>

<div class="wrap webinar-gaia-admin">
    <h1><?php echo esc_html(get_admin_page_title()); ?></h1>
    
    <div class="nav-tab-wrapper">
        <a href="?page=webinar-gaia" class="nav-tab <?php echo !isset($_GET['action']) ? 'nav-tab-active' : ''; ?>">
            <?php _e('Webinars', 'webinar-gaia'); ?>
        </a>
        <a href="?page=webinar-gaia&action=new" class="nav-tab <?php echo isset($_GET['action']) && $_GET['action'] === 'new' ? 'nav-tab-active' : ''; ?>">
            <?php _e('Novo Webinar', 'webinar-gaia'); ?>
        </a>
    </div>
    
    <div class="tab-content">
        <?php
        if (isset($_GET['action'])) {
            switch ($_GET['action']) {
                case 'new':
                    include WEBINAR_GAIA_PATH . 'admin/partials/webinar-form.php';
                    break;
                case 'edit':
                    include WEBINAR_GAIA_PATH . 'admin/partials/webinar-form.php';
                    break;
                default:
                    include WEBINAR_GAIA_PATH . 'admin/partials/webinar-list.php';
            }
        } else {
            include WEBINAR_GAIA_PATH . 'admin/partials/webinar-list.php';
        }
        ?>
    </div>
</div>