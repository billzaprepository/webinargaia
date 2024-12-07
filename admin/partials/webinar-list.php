<?php
if (!defined('ABSPATH')) exit;

global $wpdb;
$table_name = $wpdb->prefix . 'webinar_gaia';
$webinars = $wpdb->get_results("SELECT * FROM $table_name ORDER BY created_at DESC");
?>

<div class="webinar-list-container">
    <?php if ($webinars): ?>
        <table class="wp-list-table widefat fixed striped">
            <thead>
                <tr>
                    <th><?php _e('Título', 'webinar-gaia'); ?></th>
                    <th><?php _e('Data', 'webinar-gaia'); ?></th>
                    <th><?php _e('Status', 'webinar-gaia'); ?></th>
                    <th><?php _e('Shortcode', 'webinar-gaia'); ?></th>
                    <th><?php _e('Ações', 'webinar-gaia'); ?></th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($webinars as $webinar): ?>
                    <tr>
                        <td><?php echo esc_html($webinar->title); ?></td>
                        <td><?php echo esc_html(date_i18n('d/m/Y H:i', strtotime($webinar->start_time))); ?></td>
                        <td>
                            <?php
                            $now = current_time('mysql');
                            if ($now < $webinar->start_time) {
                                echo '<span class="status-scheduled">Agendado</span>';
                            } elseif ($now >= $webinar->start_time && $now <= $webinar->end_time) {
                                echo '<span class="status-live">Ao Vivo</span>';
                            } else {
                                echo '<span class="status-ended">Finalizado</span>';
                            }
                            ?>
                        </td>
                        <td>
                            <code>[webinar id="<?php echo esc_attr($webinar->id); ?>"]</code>
                            <button class="button-link copy-shortcode" data-shortcode='[webinar id="<?php echo esc_attr($webinar->id); ?>"]'>
                                <?php _e('Copiar', 'webinar-gaia'); ?>
                            </button>
                        </td>
                        <td>
                            <a href="?page=webinar-gaia&action=edit&id=<?php echo esc_attr($webinar->id); ?>" class="button">
                                <?php _e('Editar', 'webinar-gaia'); ?>
                            </a>
                            <a href="#" class="button delete-webinar" data-id="<?php echo esc_attr($webinar->id); ?>">
                                <?php _e('Excluir', 'webinar-gaia'); ?>
                            </a>
                        </td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    <?php else: ?>
        <div class="no-webinars">
            <p><?php _e('Nenhum webinar encontrado.', 'webinar-gaia'); ?></p>
            <a href="?page=webinar-gaia&action=new" class="button button-primary">
                <?php _e('Criar Novo Webinar', 'webinar-gaia'); ?>
            </a>
        </div>
    <?php endif; ?>
</div>