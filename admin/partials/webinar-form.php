<?php
if (!defined('ABSPATH')) exit;

$webinar_id = isset($_GET['id']) ? intval($_GET['id']) : 0;
$webinar = $webinar_id ? get_webinar($webinar_id) : null;
?>

<div class="webinar-form-container">
    <form id="webinar-gaia-form" method="post" enctype="multipart/form-data">
        <?php wp_nonce_field('webinar_gaia_nonce', 'webinar_gaia_nonce'); ?>
        <input type="hidden" name="webinar_id" value="<?php echo $webinar_id; ?>">
        
        <div class="form-group">
            <label for="title"><?php _e('Título do Webinar', 'webinar-gaia'); ?></label>
            <input type="text" id="title" name="title" class="regular-text" value="<?php echo esc_attr($webinar ? $webinar->title : ''); ?>" required>
        </div>
        
        <div class="form-group">
            <label for="description"><?php _e('Descrição', 'webinar-gaia'); ?></label>
            <textarea id="description" name="description" rows="5" class="large-text"><?php echo esc_textarea($webinar ? $webinar->description : ''); ?></textarea>
        </div>
        
        <div class="form-group">
            <label for="start_time"><?php _e('Data e Hora de Início', 'webinar-gaia'); ?></label>
            <input type="datetime-local" id="start_time" name="start_time" value="<?php echo esc_attr($webinar ? date('Y-m-d\TH:i', strtotime($webinar->start_time)) : ''); ?>" required>
        </div>
        
        <div class="form-group">
            <label for="end_time"><?php _e('Data e Hora de Término', 'webinar-gaia'); ?></label>
            <input type="datetime-local" id="end_time" name="end_time" value="<?php echo esc_attr($webinar ? date('Y-m-d\TH:i', strtotime($webinar->end_time)) : ''); ?>" required>
        </div>
        
        <div class="form-group">
            <label for="video"><?php _e('Vídeo do Webinar', 'webinar-gaia'); ?></label>
            <input type="file" id="video" name="video" accept="video/*">
            <?php if ($webinar && $webinar->video_url): ?>
                <p class="description"><?php _e('Vídeo atual:', 'webinar-gaia'); ?> <?php echo esc_html(basename($webinar->video_url)); ?></p>
            <?php endif; ?>
        </div>
        
        <div class="form-group">
            <label for="thumbnail"><?php _e('Thumbnail', 'webinar-gaia'); ?></label>
            <input type="file" id="thumbnail" name="thumbnail" accept="image/*">
            <?php if ($webinar && $webinar->thumbnail_url): ?>
                <p class="description"><?php _e('Thumbnail atual:', 'webinar-gaia'); ?> <?php echo esc_html(basename($webinar->thumbnail_url)); ?></p>
            <?php endif; ?>
        </div>
        
        <p class="submit">
            <button type="submit" class="button button-primary webinar-gaia-save">
                <?php _e('Salvar Webinar', 'webinar-gaia'); ?>
            </button>
        </p>
    </form>
</div>