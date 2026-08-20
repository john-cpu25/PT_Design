/* =============================================
   PT Design Dashboard - Application Core
   ============================================= */

const App = (() => {

    // ─── Tool Registry ───
    // To add a new tool, just add an entry here and create the render function
    // in a separate file under js/calculators/
    const TOOLS = [
        {
            id: 'pt-spacing-rate',
            name: 'PT Spacing & Rate',
            desc: 'Tính toán khoảng cách cáp và hàm lượng Post-Tensioning cho sàn bê tông ứng lực trước theo 2 phương X, Y.',
            icon: 'assets/icons/pt_spacing.png',
            iconClass: 'icon-indigo',
            tags: [{ text: 'Structural', cls: 'tag-structural' }, { text: 'PT Design', cls: 'tag-design' }],
            render: renderPTSpacingRate,
            headerIcon: 'icon-indigo',
        },
        {
            id: 'punching-shear',
            name: 'Punching Shear Check',
            desc: 'Kiểm tra chọc thủng cho sàn phẳng bê tông cốt thép / ứng lực trước theo AS3600.',
            icon: 'assets/icons/punching_shear.png',
            iconClass: 'icon-emerald',
            tags: [{ text: 'Structural', cls: 'tag-structural' }],
            render: renderPunchingShear,
            headerIcon: 'icon-emerald',
        },
        {
            id: 'strut-and-tie',
            name: 'Strut & Tie Check',
            desc: 'Tính toán và kiểm tra mô hình Strut & Tie theo AS3600-2018 cho cấu kiện bê tông cốt thép.',
            icon: 'assets/icons/strut_tie.png',
            iconClass: 'icon-amber',
            tags: [{ text: 'Structural', cls: 'tag-structural' }, { text: 'AS3600', cls: 'tag-analysis' }],
            render: renderStrutAndTie,
            headerIcon: 'icon-amber',
        },
        {
            id: 'integrity-reinforcement',
            name: 'Integrity Reinforcement',
            desc: 'Kiểm tra cốt thép chống sụp đổ liên kết sàn - cột theo AS3600-2018 Cl 9.2 cho 4 dạng liên kết cột (4 sides, 3 sides, 2 sides).',
            icon: 'assets/icons/integrity.png',
            iconClass: 'icon-sky',
            tags: [{ text: 'Structural', cls: 'tag-structural' }, { text: 'AS3600 Cl 9.2', cls: 'tag-analysis' }],
            render: renderIntegrityReinforcement,
            headerIcon: 'icon-sky',
        },
        {
            id: 'corbel-design',
            name: 'Corbel Design',
            desc: 'Thiết kế Corbel — tính toán lực thanh chống, cốt thép giằng và kiểm tra ứng suất nén.',
            icon: 'assets/icons/corbel.png',
            iconClass: 'icon-indigo',
            tags: [{ text: 'Structural', cls: 'tag-structural' }, { text: 'AS3600', cls: 'tag-analysis' }],
            render: renderCorbelDesign,
            headerIcon: 'icon-indigo',
        },
    ];

    let currentTool = null;

    // ─── Initialize ───
    function init() {
        renderDashboard(TOOLS);
        setupIntro();
    }

    // ─── Video Intro ───
    function setupIntro() {
        const overlay = document.getElementById('introOverlay');
        const video = document.getElementById('introVideo');
        if (!overlay || !video) {
            showApp();
            return;
        }

        // When video ends, smoothly fade out intro to dashboard
        video.addEventListener('ended', () => {
            dismissIntro();
        });

        // Fallback: if video fails to load, skip immediately
        video.addEventListener('error', () => {
            dismissIntro();
        });
    }

    function skipIntro() {
        const video = document.getElementById('introVideo');
        if (video) video.pause();
        dismissIntro();
    }

    function dismissIntro() {
        const overlay = document.getElementById('introOverlay');
        if (!overlay) return;

        overlay.classList.add('fade-out');

        // Show app shell immediately so it's visible behind the fading overlay
        showApp();

        // Remove overlay from DOM after transition
        setTimeout(() => {
            overlay.remove();
        }, 900);
    }

    function showApp() {
        const appShell = document.getElementById('appShell');
        if (appShell) appShell.classList.remove('hidden');
        document.body.classList.add('on-dashboard');
    }

    // ─── Navigation ───
    function openTool(toolId) {
        const tool = TOOLS.find(t => t.id === toolId);
        if (!tool) return;

        currentTool = tool;

        // Switch views
        document.getElementById('dashboardView').classList.remove('active');
        const toolView = document.getElementById('toolView');
        toolView.classList.remove('active');
        // Force reflow for animation restart
        void toolView.offsetWidth;
        toolView.classList.add('active');

        // Show back button
        document.getElementById('navBack').classList.add('visible');

        // Render tool header + content
        const content = document.getElementById('toolContent');
        content.innerHTML = `
            <div class="tool-header">
                <div class="tool-header-icon ${tool.headerIcon}"><img src="${tool.icon}" alt="${tool.name}" style="width:100%; height:100%; object-fit:contain;"></div>
                <div class="tool-header-info">
                    <h2>${tool.name}</h2>
                    <p>${tool.desc}</p>
                </div>
                <button class="btn-export-pdf" onclick="PDFExport.exportCurrentTool('${tool.id}')" title="Export to PDF">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    Export PDF
                </button>
            </div>
            <div id="toolBody"></div>
        `;

        // Render the tool's specific UI
        tool.render(document.getElementById('toolBody'));

        // Scroll to top
        document.body.classList.add('tool-active');
        document.body.classList.remove('on-dashboard');
        window.scrollTo({ top: 0 });
    }

    function goHome() {
        currentTool = null;

        document.getElementById('toolView').classList.remove('active');
        const dash = document.getElementById('dashboardView');
        dash.classList.remove('active');
        void dash.offsetWidth;
        dash.classList.add('active');

        document.getElementById('navBack').classList.remove('visible');

        // Re-render so animations replay
        renderDashboard(TOOLS);

        document.body.classList.remove('tool-active');
        document.body.classList.add('on-dashboard');
        window.scrollTo({ top: 0 });
    }

    // ─── Public API ───
    return { init, openTool, goHome, skipIntro };

})();

// Boot
document.addEventListener('DOMContentLoaded', App.init);
