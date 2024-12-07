<div id="webinar-container" class="webinar-simulator" data-webinar-id="<?php echo esc_attr($webinar_id); ?>">
    <div class="webinar-video">
        <video id="webinar-video" playsinline>
            <source src="<?php echo esc_url($webinar['video_url']); ?>" type="video/mp4">
        </video>
        <div class="webinar-overlay">
            <div class="viewer-count">
                <span id="viewer-count">0</span> assistindo
            </div>
        </div>
    </div>
    
    <div class="webinar-chat">
        <div id="chat-messages" class="chat-messages"></div>
    </div>
</div>