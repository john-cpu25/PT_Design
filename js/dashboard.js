/* =============================================
   Dashboard - Tool Grid Rendering
   ============================================= */

function renderDashboard(tools) {
    const grid = document.getElementById('toolsGrid');
    grid.innerHTML = tools.map(tool => `
        <div class="tool-card" onclick="App.openTool('${tool.id}')"
             style="--card-accent: ${getAccentColor(tool.iconClass)}; --card-accent-end: ${getAccentEndColor(tool.iconClass)}">
            <div class="tool-card-thumb">
                <img src="${tool.icon}" alt="${tool.name}" class="tool-card-img">
            </div>
            <div class="tool-card-footer">
                <div class="tool-name">${tool.name}</div>
                <div class="tool-arrow">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </div>
            </div>
            <div class="tool-card-overlay">
                <p class="tool-card-overlay-text">${tool.desc}</p>
            </div>
        </div>
    `).join('');
}

function getAccentColor(cls) {
    const map = { 'icon-indigo': '#4F46E5', 'icon-emerald': '#059669', 'icon-amber': '#D97706', 'icon-sky': '#0284C7' };
    return map[cls] || '#4F46E5';
}

function getAccentEndColor(cls) {
    const map = { 'icon-indigo': '#7C3AED', 'icon-emerald': '#10B981', 'icon-amber': '#F59E0B', 'icon-sky': '#38BDF8' };
    return map[cls] || '#7C3AED';
}
