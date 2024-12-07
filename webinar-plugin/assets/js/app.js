class WebinarSimulator {
    constructor(container) {
        this.container = container;
        this.webinarId = container.dataset.webinarId;
        this.viewerCount = this.container.querySelector('#viewer-count');
        this.chatMessages = this.container.querySelector('#chat-messages');
        this.video = this.container.querySelector('#webinar-video');
        
        this.init();
    }

    init() {
        this.loadWebinarData();
        this.setupViewerCounter();
        this.setupChatSystem();
    }

    async loadWebinarData() {
        const response = await fetch(webinarData.ajaxUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                action: 'get_webinar_data',
                nonce: webinarData.nonce,
                webinar_id: this.webinarId
            })
        });
        
        const data = await response.json();
        if (data.success) {
            this.startWebinar(data.data);
        }
    }

    setupViewerCounter() {
        let baseCount = 208;
        setInterval(() => {
            const randomChange = Math.floor(Math.random() * 20) - 10;
            baseCount = Math.max(208, Math.min(698, baseCount + randomChange));
            this.viewerCount.textContent = baseCount.toLocaleString();
        }, 3000);
    }

    setupChatSystem() {
        // Implementar sistema de chat programado
    }

    startWebinar(data) {
        // Iniciar webinar com dados carregados
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const containers = document.querySelectorAll('.webinar-simulator');
    containers.forEach(container => new WebinarSimulator(container));
});