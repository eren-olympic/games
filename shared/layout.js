document.addEventListener("DOMContentLoaded", () => {
    const headerHtml = `
        <div id="global-header">
            <a href="/" class="global-logo">LGT.WTF</a>
            <div class="global-nav">
                <a href="/" class="global-link">Home</a>
                <a href="https://github.com/eren-olympic/games" target="_blank" class="global-link">GitHub</a>
            </div>
        </div>
    `;
    
    const footerHtml = `
        <div id="global-footer">
            <p>&copy; ${new Date().getFullYear()} lgt.wtf. All rights reserved.</p>
            <p class="disclaimer">These games are developed for portfolio and educational purposes. All mechanics belong to their respective original creators.</p>
        </div>
    `;

    document.body.insertAdjacentHTML('afterbegin', headerHtml);
    document.body.insertAdjacentHTML('beforeend', footerHtml);

    if (!document.querySelector('link[href*="global.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = '/shared/global.css';
        document.head.appendChild(link);
    }
});
