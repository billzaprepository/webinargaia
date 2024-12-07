(function($) {
    'use strict';

    $(document).ready(function() {
        // Admin panel functionality
        $('.webinar-gaia-save').on('click', function(e) {
            e.preventDefault();
            
            const formData = new FormData($('#webinar-gaia-form')[0]);
            formData.append('action', 'save_webinar');
            formData.append('nonce', webinarGaiaAdmin.nonce);

            $.ajax({
                url: webinarGaiaAdmin.ajaxurl,
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function(response) {
                    if (response.success) {
                        alert('Webinar salvo com sucesso!');
                    } else {
                        alert('Erro ao salvar o webinar.');
                    }
                }
            });
        });
    });
})(jQuery);