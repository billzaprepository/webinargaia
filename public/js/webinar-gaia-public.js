(function($) {
    'use strict';

    class WebinarGaia {
        constructor(container) {
            this.container = container;
            this.webinarId = container.data('webinar-id');
            this.viewerCount = container.find('.webinar-gaia-viewer-count');
            this.chatContainer = container.find('.webinar-gaia-chat');
            this.video = container.find('video')[0];
            
            this.init();
        }

        init() {
            this.setupViewerCounter();
            this.setupChatSystem();
            this.setupCTASystem();
        }

        setupViewerCounter() {
            let count = 208;
            setInterval(() => {
                const change = Math.floor(Math.random() * 20) - 10;
                count = Math.max(208, Math.min(698, count + change));
                this.viewerCount.text(count + ' assistindo');
            }, 3000);
        }

        setupChatSystem() {
            // Chat system implementation
        }

        setupCTASystem() {
            // CTA system implementation
        }
    }

    $(document).ready(function() {
        $('.webinar-gaia-container').each(function() {
            new WebinarGaia($(this));
        });
    });
})(jQuery);