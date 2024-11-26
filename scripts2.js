document.addEventListener('DOMContentLoaded', function() {
    const includes = document.querySelectorAll('[data-include]');
    includes.forEach(include => {
        const file = include.getAttribute('data-include');
        fetch(file)
            .then(response => response.text())
            .then(html => {
                include.innerHTML = html;
            });
    });
});