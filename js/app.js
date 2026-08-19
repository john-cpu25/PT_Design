/* =============================================
   PT Design Dashboard - Application Logic
   ============================================= */

const App = (() => {

    // ─── Tool Registry ───
    // To add a new tool, just add an entry here and a render function
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
        renderDashboard();
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
    }

    // ─── Dashboard ───
    function renderDashboard() {
        const grid = document.getElementById('toolsGrid');
        grid.innerHTML = TOOLS.map(tool => `
            <div class="tool-card" onclick="App.openTool('${tool.id}')"
                 style="--card-accent: ${getAccentColor(tool.iconClass)}; --card-accent-end: ${getAccentEndColor(tool.iconClass)}">
                <div class="tool-icon ${tool.iconClass}"><img src="${tool.icon}" alt="${tool.name}" style="width:100%; height:100%; object-fit:contain;"></div>
                <div class="tool-name">${tool.name}</div>
                <div class="tool-desc">${tool.desc}</div>
                <div class="tool-meta">
                    ${tool.tags.map(t => `<span class="tool-tag ${t.cls}">${t.text}</span>`).join('')}
                    <div class="tool-arrow">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                    </div>
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
            </div>
            <div id="toolBody"></div>
        `;

        // Render the tool's specific UI
        tool.render(document.getElementById('toolBody'));

        // Scroll to top
        document.body.classList.add('tool-active');
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
        renderDashboard();

        document.body.classList.remove('tool-active');
        window.scrollTo({ top: 0 });
    }

    // ─── PT Spacing & Rate Calculator ───
    function renderPTSpacingRate(container) {
        container.innerHTML = `
            <div class="calc-grid">
                <!-- General Properties -->
                <section class="calc-card full-width">
                    <div class="calc-card-title">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
                        General Properties
                    </div>
                    <div class="calc-inputs">
                        <div class="calc-field">
                            <label for="pt-num-strands">Number of Strand</label>
                            <input type="number" id="pt-num-strands" value="5" step="1">
                        </div>
                        <div class="calc-field">
                            <label for="pt-diameter">Diameter (mm)</label>
                            <input type="number" id="pt-diameter" value="15.2" step="0.1">
                        </div>
                        <div class="calc-field">
                            <label for="pt-area">Area (mm²)</label>
                            <input type="number" id="pt-area" value="143" step="1">
                        </div>
                    </div>
                </section>

                <!-- X-Direction -->
                <section class="calc-card">
                    <div class="calc-card-title">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                        X-Direction
                    </div>
                    <div class="calc-inputs">
                        <div class="calc-field">
                            <label for="pt-fmax-x">Fmax (kN)</label>
                            <input type="number" id="pt-fmax-x" value="147" step="1">
                        </div>
                        <div class="calc-field">
                            <label for="pt-mass-x">Mass (kg/m)</label>
                            <input type="number" id="pt-mass-x" value="1.122" step="0.001">
                        </div>
                        <div class="calc-field">
                            <label for="pt-depth-x">Slab Depth (mm)</label>
                            <input type="number" id="pt-depth-x" value="250" step="1">
                        </div>
                        <div class="calc-field">
                            <label for="pt-spacing-x">PT Spacing (mm)</label>
                            <input type="number" id="pt-spacing-x" value="1500" step="10">
                        </div>
                    </div>
                    <div class="calc-output">
                        <div class="calc-result-row">
                            <span class="calc-result-label">P/A Ratio</span>
                            <span class="calc-result-value" id="pt-pa-x">0.00 <span class="calc-result-unit">N/mm²</span></span>
                        </div>
                        <div class="calc-result-row">
                            <span class="calc-result-label">PT Rate</span>
                            <span class="calc-result-value" id="pt-rate-x">0.00 <span class="calc-result-unit">kg/m²</span></span>
                        </div>
                    </div>
                </section>

                <!-- Y-Direction -->
                <section class="calc-card">
                    <div class="calc-card-title">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="m5 12 7 7 7-7"/></svg>
                        Y-Direction
                    </div>
                    <div class="calc-inputs">
                        <div class="calc-field">
                            <label for="pt-fmax-y">Fmax (kN)</label>
                            <input type="number" id="pt-fmax-y" value="147" step="1">
                        </div>
                        <div class="calc-field">
                            <label for="pt-mass-y">Mass (kg/m)</label>
                            <input type="number" id="pt-mass-y" value="1.122" step="0.001">
                        </div>
                        <div class="calc-field">
                            <label for="pt-depth-y">Slab Depth (mm)</label>
                            <input type="number" id="pt-depth-y" value="250" step="1">
                        </div>
                        <div class="calc-field">
                            <label for="pt-spacing-y">PT Spacing (mm)</label>
                            <input type="number" id="pt-spacing-y" value="600" step="10">
                        </div>
                    </div>
                    <div class="calc-output">
                        <div class="calc-result-row">
                            <span class="calc-result-label">P/A Ratio</span>
                            <span class="calc-result-value" id="pt-pa-y">0.00 <span class="calc-result-unit">N/mm²</span></span>
                        </div>
                        <div class="calc-result-row">
                            <span class="calc-result-label">PT Rate</span>
                            <span class="calc-result-value" id="pt-rate-y">0.00 <span class="calc-result-unit">kg/m²</span></span>
                        </div>
                    </div>
                </section>

                <!-- Total -->
                <section class="calc-card full-width calc-total-card">
                    <div class="calc-card-title" style="justify-content: center;">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>
                        Total PT Rate
                    </div>
                    <div class="calc-total-value" id="pt-total-rate">0.00</div>
                    <p class="calc-total-unit">Kilograms per Square Meter (kg/m²)</p>
                </section>
            </div>
        `;

        // Bind inputs
        const inputIds = [
            'pt-num-strands', 'pt-diameter', 'pt-area',
            'pt-fmax-x', 'pt-mass-x', 'pt-depth-x', 'pt-spacing-x',
            'pt-fmax-y', 'pt-mass-y', 'pt-depth-y', 'pt-spacing-y'
        ];

        const els = {};
        inputIds.forEach(id => {
            els[id] = document.getElementById(id);
            if (els[id]) els[id].addEventListener('input', ptCalculate);
        });

        const outputs = {
            paX: document.getElementById('pt-pa-x'),
            rateX: document.getElementById('pt-rate-x'),
            paY: document.getElementById('pt-pa-y'),
            rateY: document.getElementById('pt-rate-y'),
            totalRate: document.getElementById('pt-total-rate'),
        };

        function ptCalculate() {
            const n = parseFloat(els['pt-num-strands'].value) || 0;

            // X-Direction
            const fmaxX = parseFloat(els['pt-fmax-x'].value) || 0;
            const massX = parseFloat(els['pt-mass-x'].value) || 0;
            const depthX = parseFloat(els['pt-depth-x'].value) || 0;
            const spacingX = parseFloat(els['pt-spacing-x'].value) || 0;

            const paX = (spacingX && depthX) ? (n * fmaxX) / (spacingX * depthX / 1000) : 0;
            const rateX = spacingX ? (n * massX) / (spacingX / 1000) : 0;

            // Y-Direction
            const fmaxY = parseFloat(els['pt-fmax-y'].value) || 0;
            const massY = parseFloat(els['pt-mass-y'].value) || 0;
            const depthY = parseFloat(els['pt-depth-y'].value) || 0;
            const spacingY = parseFloat(els['pt-spacing-y'].value) || 0;

            const paY = (spacingY && depthY) ? (n * fmaxY) / (spacingY * depthY / 1000) : 0;
            const rateY = spacingY ? (n * massY) / (spacingY / 1000) : 0;

            const totalRate = rateX + rateY;

            // Update outputs
            updateOutput(outputs.paX, paX, 'N/mm²');
            updateOutput(outputs.rateX, rateX, 'kg/m²');
            updateOutput(outputs.paY, paY, 'N/mm²');
            updateOutput(outputs.rateY, rateY, 'kg/m²');

            // Animate total
            animateValue(outputs.totalRate, parseFloat(outputs.totalRate.innerText) || 0, totalRate, 400);
        }

        function updateOutput(el, value, unit) {
            el.innerHTML = `${value.toFixed(2)} <span class="calc-result-unit">${unit}</span>`;
        }

        function animateValue(obj, start, end, duration) {
            if (isNaN(start)) start = 0;
            let startTs = null;
            const step = (ts) => {
                if (!startTs) startTs = ts;
                const progress = Math.min((ts - startTs) / duration, 1);
                const current = progress * (end - start) + start;
                obj.innerText = current.toFixed(2);
                if (progress < 1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
        }

        // Initial calculation
        ptCalculate();
    }

    // ─── Punching Shear Calculator ───
    function renderPunchingShear(container) {
        container.innerHTML = `
            <div class="segment-control" id="ps-type-selector">
                <button class="segment-btn active" data-type="internal">Internal Column</button>
                <button class="segment-btn" data-type="edge">Edge Column</button>
                <button class="segment-btn" data-type="corner">Corner Column</button>
            </div>

            <div class="calc-grid">
                <!-- Diagram Card -->
                <section class="calc-card full-width">
                    <div class="calc-card-title">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
                        Shear Perimeter Diagram
                    </div>
                    <div id="ps-diagram-container" style="height: 240px; display: flex; justify-content: center; align-items: center; background: #fff; border: 1px solid var(--border-light); border-radius: var(--radius-md); overflow: hidden;">
                        <!-- SVG injected here -->
                    </div>
                </section>

                <!-- Geometry -->
                <section class="calc-card">
                    <div class="calc-card-title">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/></svg>
                        Geometry & Properties
                    </div>
                    <div class="calc-inputs">
                        <div class="calc-field">
                            <label for="ps-dim-x">Col Dim X (mm)</label>
                            <input type="number" id="ps-dim-x" value="300" step="10">
                        </div>
                        <div class="calc-field">
                            <label for="ps-dim-y">Col Dim Y (mm)</label>
                            <input type="number" id="ps-dim-y" value="300" step="10">
                        </div>
                        <div class="calc-field">
                            <label for="ps-depth">Slab Depth (mm)</label>
                            <input type="number" id="ps-depth" value="250" step="10">
                        </div>
                        <div class="calc-field">
                            <label for="ps-cover">Cover (mm)</label>
                            <input type="number" id="ps-cover" value="30" step="1">
                        </div>
                        <div class="calc-field">
                            <label for="ps-fc">f'c (MPa)</label>
                            <input type="number" id="ps-fc" value="40" step="1">
                        </div>
                        <div class="calc-field">
                            <label for="ps-fcp">fcp (MPa)</label>
                            <input type="number" id="ps-fcp" value="1.0" step="0.1">
                        </div>
                        <div class="calc-field" style="grid-column: span 2;">
                            <label for="ps-reduction">Perimeter Reduction (mm)</label>
                            <input type="number" id="ps-reduction" value="0" step="10" placeholder="e.g. 200">
                        </div>
                    </div>
                </section>

                <!-- Loads & Rebar -->
                <section class="calc-card">
                    <div class="calc-card-title">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20"/><path d="m17 22-5-5-5 5"/><path d="m17 2-5 5-5-5"/></svg>
                        Loads & Reinforcement
                    </div>
                    <div class="calc-inputs">
                        <div class="calc-field">
                            <label for="ps-v">V* (kN)</label>
                            <input type="number" id="ps-v" value="1000" step="10">
                        </div>
                        <div class="calc-field">
                            <label for="ps-mx">M*x (kNm)</label>
                            <input type="number" id="ps-mx" value="50" step="1">
                        </div>
                        <div class="calc-field">
                            <label for="ps-my">M*y (kNm)</label>
                            <input type="number" id="ps-my" value="50" step="1">
                        </div>
                        <div class="calc-field">
                            <label for="ps-bar-3">3rd Layer Bar Ø</label>
                            <input type="number" id="ps-bar-3" value="24" step="1">
                        </div>
                        <div class="calc-field">
                            <label for="ps-bar-4">4th Layer Bar Ø</label>
                            <input type="number" id="ps-bar-4" value="24" step="1">
                        </div>
                    </div>
                </section>

                <!-- Results -->
                <section class="calc-card full-width">
                    <div class="calc-card-title">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                        Results Summary
                    </div>
                    <div class="calc-output" style="display: grid; grid-template-columns: 1fr 1fr; gap: 0 40px; border-top: none; padding-top: 0; margin-top: 0;">
                        <div>
                            <div class="calc-result-row">
                                <span class="calc-result-label">Effective Depth (do)</span>
                                <span class="calc-result-value" id="res-do">0 <span class="calc-result-unit">mm</span></span>
                            </div>
                            <div class="calc-result-row">
                                <span class="calc-result-label">Critical Perimeter (u)</span>
                                <span class="calc-result-value" id="res-u">0 <span class="calc-result-unit">mm</span></span>
                            </div>
                            <div class="calc-result-row">
                                <span class="calc-result-label">Shear Strength (fcv)</span>
                                <span class="calc-result-value" id="res-fcv">0.00 <span class="calc-result-unit">MPa</span></span>
                            </div>
                        </div>
                        <div>
                            <div class="calc-result-row">
                                <span class="calc-result-label">Design Load (fVu)</span>
                                <span class="calc-result-value" id="res-fvu">0 <span class="calc-result-unit">kN</span></span>
                            </div>
                            <div class="calc-result-row">
                                <span class="calc-result-label">Capacity (fVuo)</span>
                                <span class="calc-result-value" id="res-fvuo">0 <span class="calc-result-unit">kN</span></span>
                            </div>
                            <div class="calc-result-row">
                                <span class="calc-result-label">Max Capacity (fVumax)</span>
                                <span class="calc-result-value" id="res-fvumax">0 <span class="calc-result-unit">kN</span></span>
                            </div>
                        </div>
                    </div>
                </section>
                
                <section class="calc-card full-width calc-total-card">
                    <div class="calc-card-title" style="justify-content: center;">
                        Status
                    </div>
                    <div class="calc-total-value" id="ps-status" style="font-size: 2.5rem; letter-spacing: 0;">OK</div>
                    <p class="calc-total-unit" id="ps-status-desc">No shear reinforcement required</p>
                </section>
            </div>
        `;

        const inputs = container.querySelectorAll('input');
        inputs.forEach(input => input.addEventListener('input', calculatePS));

        const btns = container.querySelectorAll('.segment-btn');
        let currentType = 'internal';
        btns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                btns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                currentType = e.target.dataset.type;
                calculatePS();
            });
        });

        function renderPSDiagram(type) {
            const defs = `
                <defs>
                    <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="#374151" />
                    </marker>
                </defs>
            `;
            if (type === 'internal') {
                return `
                <svg viewBox="0 0 300 220" width="100%" height="100%">
                    ${defs}
                    <rect x="0" y="0" width="300" height="220" fill="#f8f9fc" />
                    <!-- Column -->
                    <rect x="110" y="70" width="80" height="80" fill="#f97316" stroke="#000" stroke-width="1.5"/>
                    <text x="200" y="115" font-size="13" font-weight="bold" fill="#374151">X</text>
                    <text x="150" y="60" font-size="13" font-weight="bold" fill="#374151">Y</text>
                    <!-- Perimeter -->
                    <rect x="70" y="30" width="160" height="160" rx="20" fill="none" stroke="#4F46E5" stroke-width="2" stroke-dasharray="6,4"/>
                    <!-- Mx -->
                    <line x1="50" y1="110" x2="250" y2="110" stroke="#374151" stroke-width="2" marker-end="url(#arrow)"/>
                    <text x="260" y="115" font-weight="bold" font-size="14" fill="#374151">Mx</text>
                    <!-- My -->
                    <line x1="150" y1="190" x2="150" y2="30" stroke="#374151" stroke-width="2" marker-end="url(#arrow)"/>
                    <text x="140" y="25" font-weight="bold" font-size="14" fill="#374151">My</text>
                    <!-- a_x -->
                    <line x1="70" y1="205" x2="230" y2="205" stroke="#6b7280" stroke-width="1.5" marker-start="url(#arrow)" marker-end="url(#arrow)"/>
                    <text x="150" y="200" text-anchor="middle" font-size="13" fill="#6b7280">ax</text>
                    <!-- a_y -->
                    <line x1="50" y1="30" x2="50" y2="190" stroke="#6b7280" stroke-width="1.5" marker-start="url(#arrow)" marker-end="url(#arrow)"/>
                    <text x="45" y="115" text-anchor="end" font-size="13" fill="#6b7280">ay</text>
                </svg>`;
            } else if (type === 'edge') {
                return `
                <svg viewBox="0 0 300 220" width="100%" height="100%">
                    ${defs}
                    <rect x="0" y="50" width="300" height="170" fill="#f8f9fc" />
                    <line x1="0" y1="50" x2="300" y2="50" stroke="#000" stroke-width="3"/>
                    <!-- Column -->
                    <rect x="110" y="50" width="80" height="80" fill="#f97316" stroke="#000" stroke-width="1.5"/>
                    <text x="200" y="95" font-size="13" font-weight="bold" fill="#374151">X</text>
                    <text x="150" y="40" font-size="13" font-weight="bold" fill="#374151">Y</text>
                    <!-- Perimeter -->
                    <path d="M 70 50 L 70 130 Q 70 170 110 170 L 190 170 Q 230 170 230 130 L 230 50" fill="none" stroke="#4F46E5" stroke-width="2" stroke-dasharray="6,4"/>
                    <!-- Mx -->
                    <line x1="50" y1="110" x2="250" y2="110" stroke="#374151" stroke-width="2" marker-end="url(#arrow)"/>
                    <text x="260" y="115" font-weight="bold" font-size="14" fill="#374151">Mx</text>
                    <!-- My -->
                    <line x1="150" y1="190" x2="150" y2="60" stroke="#374151" stroke-width="2" marker-end="url(#arrow)"/>
                    <text x="140" y="55" font-weight="bold" font-size="14" fill="#374151">My</text>
                    <!-- a_x -->
                    <line x1="70" y1="190" x2="230" y2="190" stroke="#6b7280" stroke-width="1.5" marker-start="url(#arrow)" marker-end="url(#arrow)"/>
                    <text x="150" y="185" text-anchor="middle" font-size="13" fill="#6b7280">ax</text>
                    <!-- a_y -->
                    <line x1="50" y1="50" x2="50" y2="170" stroke="#6b7280" stroke-width="1.5" marker-start="url(#arrow)" marker-end="url(#arrow)"/>
                    <text x="45" y="115" text-anchor="end" font-size="13" fill="#6b7280">ay</text>
                </svg>`;
            } else if (type === 'corner') {
                return `
                <svg viewBox="0 0 300 220" width="100%" height="100%">
                    ${defs}
                    <rect x="0" y="50" width="240" height="170" fill="#f8f9fc" />
                    <polyline points="0,50 240,50 240,220" fill="none" stroke="#000" stroke-width="3"/>
                    <!-- Column -->
                    <rect x="140" y="50" width="100" height="80" fill="#f97316" stroke="#000" stroke-width="1.5"/>
                    <text x="250" y="95" font-size="13" font-weight="bold" fill="#374151">X</text>
                    <text x="190" y="40" font-size="13" font-weight="bold" fill="#374151">Y</text>
                    <!-- Perimeter -->
                    <path d="M 100 50 L 100 130 Q 100 170 140 170 L 240 170" fill="none" stroke="#4F46E5" stroke-width="2" stroke-dasharray="6,4"/>
                    <!-- Mx -->
                    <line x1="50" y1="110" x2="210" y2="110" stroke="#374151" stroke-width="2" marker-end="url(#arrow)"/>
                    <text x="220" y="115" font-weight="bold" font-size="14" fill="#374151">Mx</text>
                    <!-- My -->
                    <line x1="190" y1="190" x2="190" y2="70" stroke="#374151" stroke-width="2" marker-end="url(#arrow)"/>
                    <text x="175" y="65" font-weight="bold" font-size="14" fill="#374151">My</text>
                    <!-- a_x -->
                    <line x1="100" y1="190" x2="240" y2="190" stroke="#6b7280" stroke-width="1.5" marker-start="url(#arrow)" marker-end="url(#arrow)"/>
                    <text x="170" y="185" text-anchor="middle" font-size="13" fill="#6b7280">ax</text>
                    <!-- a_y -->
                    <line x1="70" y1="50" x2="70" y2="170" stroke="#6b7280" stroke-width="1.5" marker-start="url(#arrow)" marker-end="url(#arrow)"/>
                    <text x="65" y="110" text-anchor="end" font-size="13" fill="#6b7280">ay</text>
                </svg>`;
            }
        }

        function calculatePS() {
            // Update diagram
            const diagramContainer = document.getElementById('ps-diagram-container');
            if (diagramContainer) {
                diagramContainer.innerHTML = renderPSDiagram(currentType);
            }

            const dimX = parseFloat(document.getElementById('ps-dim-x').value) || 0;
            const dimY = parseFloat(document.getElementById('ps-dim-y').value) || 0;
            const depth = parseFloat(document.getElementById('ps-depth').value) || 0;
            const cover = parseFloat(document.getElementById('ps-cover').value) || 0;
            const fc = parseFloat(document.getElementById('ps-fc').value) || 0;
            const fcp = parseFloat(document.getElementById('ps-fcp').value) || 0;
            const reduction = Math.abs(parseFloat(document.getElementById('ps-reduction').value) || 0); // Convert to positive
            
            const v = parseFloat(document.getElementById('ps-v').value) || 0;
            const mx = parseFloat(document.getElementById('ps-mx').value) || 0;
            const my = parseFloat(document.getElementById('ps-my').value) || 0;
            const bar3 = parseFloat(document.getElementById('ps-bar-3').value) || 0;
            const bar4 = parseFloat(document.getElementById('ps-bar-4').value) || 0;

            const do_eff = depth - cover - Math.max(bar3, bar4);
            
            let u = 0;
            let ax = 0;
            let ay = 0;

            if (currentType === 'internal') {
                u = 2 * (dimX + dimY) + Math.PI * do_eff;
                ax = dimX + do_eff;
                ay = dimY + do_eff;
            } else if (currentType === 'edge') {
                u = 2 * dimX + dimY + (Math.PI / 2) * do_eff;
                ax = dimX + do_eff;
                ay = dimY + do_eff / 2;
            } else if (currentType === 'corner') {
                u = dimX + dimY + (Math.PI / 4) * do_eff;
                ax = dimX + do_eff / 2;
                ay = dimY + do_eff / 2;
            }

            // Apply Perimeter Reduction (if user entered 200 or -200, it subtracts 200)
            u = Math.max(0, u - reduction);

            const fcv = 0.17 * Math.sqrt(fc) + 0.3 * fcp;
            const phi = 0.75; // AS3600 capacity reduction factor
            
            const fVuo = phi * fcv * u * do_eff / 1000;
            const fVumax = 0.2 * fc * u * do_eff / 1000 * phi;
            
            // M*v factor based on AS3600 principles using the diagram dimensions
            let m_factor = 1;
            if (v > 0 && do_eff > 0) {
                if (currentType === 'internal') {
                    m_factor = 1 + (u * mx * 1000) / (8 * v * ax * do_eff) + (u * my * 1000) / (8 * v * ay * do_eff);
                } else if (currentType === 'edge') {
                    m_factor = 1 + (u * mx * 1000) / (8 * v * ax * do_eff) + (u * my * 1000) / (2 * v * ay * do_eff);
                } else if (currentType === 'corner') {
                    m_factor = 1 + (u * mx * 1000) / (2 * v * ax * do_eff) + (u * my * 1000) / (2 * v * ay * do_eff);
                }
            }
            if (!isFinite(m_factor) || m_factor < 1) m_factor = 1;
            // Cap m_factor to a reasonable value for demo if needed, but let's leave it calculated
            const fVu = v * m_factor;

            document.getElementById('res-do').innerHTML = `${Math.max(0, do_eff).toFixed(0)} <span class="calc-result-unit">mm</span>`;
            document.getElementById('res-u').innerHTML = `${Math.max(0, u).toFixed(0)} <span class="calc-result-unit">mm</span>`;
            document.getElementById('res-fcv').innerHTML = `${Math.max(0, fcv).toFixed(2)} <span class="calc-result-unit">MPa</span>`;
            
            document.getElementById('res-fvu').innerHTML = `${fVu.toFixed(0)} <span class="calc-result-unit">kN</span>`;
            document.getElementById('res-fvuo').innerHTML = `${fVuo.toFixed(0)} <span class="calc-result-unit">kN</span>`;
            document.getElementById('res-fvumax').innerHTML = `${fVumax.toFixed(0)} <span class="calc-result-unit">kN</span>`;

            const statusEl = document.getElementById('ps-status');
            const statusDescEl = document.getElementById('ps-status-desc');
            
            if (fVu > fVumax) {
                statusEl.innerText = 'FAIL';
                statusEl.style.color = '#ef4444';
                statusDescEl.innerText = 'Exceeds maximum allowable capacity (V > Vumax)';
            } else if (fVu > fVuo) {
                statusEl.innerText = 'REO REQ';
                statusEl.style.color = 'var(--accent-warning)';
                statusDescEl.innerText = 'Shear reinforcement is required';
            } else {
                statusEl.innerText = 'OK';
                statusEl.style.color = 'var(--accent-success)';
                statusDescEl.innerText = 'No shear reinforcement required';
            }
        }
        
        calculatePS();
    }

    // ─── Strut and Tie Calculator ───
    function renderStrutAndTie(container) {
        container.innerHTML = `
            <div class="segment-control" id="st-tab-selector">
                <button class="segment-btn active" data-tab="strength">Strength (AS3600)</button>
                <button class="segment-btn" data-tab="service">Service</button>
            </div>

            <!-- ===== STRENGTH TAB ===== -->
            <div id="st-tab-strength">
                <div class="st-split">
                    <!-- LEFT: INPUT only -->
                    <div class="st-left">
                        <section class="calc-card">
                            <div class="calc-card-title" style="color:#059669; font-weight:800;">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/></svg>
                                INPUT
                            </div>
                            <table class="st-table st-input-table">
                                <colgroup><col style="width:40%"><col style="width:25%"><col style="width:35%"></colgroup>
                                <tbody>
                                    <tr class="st-section-header"><td colspan="3">Geometry</td></tr>
                                    <tr><td>D (mm)</td><td><input type="number" id="st-D" value="800" step="10"></td><td></td></tr>
                                    <tr><td>Top bar Ø (mm)</td><td><input type="number" id="st-top-bar" value="32" step="2"></td><td></td></tr>
                                    <tr><td>Btm bar Ø (mm)</td><td><input type="number" id="st-btm-bar" value="32" step="2"></td><td></td></tr>
                                    <tr><td>Cover (mm)</td><td><input type="number" id="st-cover" value="30" step="5"></td><td></td></tr>
                                    <tr class="st-computed-row"><td>Deff (mm)</td><td class="st-computed-val" id="st-inp-deff">454</td><td class="st-formula">= D − 2×Cover − ½(top+btm)</td></tr>
                                    <tr><td>d — Horiz. (mm)</td><td><input type="number" id="st-d" value="825" step="10"></td><td></td></tr>
                                    <tr class="st-computed-row"><td>θ (degree)</td><td class="st-computed-val" id="st-inp-theta">42.24</td><td class="st-formula">= atan(Deff/d) × 180/π</td></tr>

                                    <tr class="st-section-header"><td colspan="3">Properties</td></tr>
                                    <tr><td>Ap (mm²)</td><td><input type="number" id="st-Ap" value="0" step="10"></td><td></td></tr>
                                    <tr><td>σp.ef (MPa)</td><td><input type="number" id="st-sigma-pe" value="0" step="10"></td><td></td></tr>
                                    <tr><td>Δσp (MPa)</td><td><input type="number" id="st-delta-sigma" value="0" step="10"></td><td></td></tr>
                                    <tr><td>fsy (MPa)</td><td><input type="number" id="st-fsy" value="500" step="10"></td><td></td></tr>
                                    <tr><td>f'c (MPa)</td><td><input type="number" id="st-fc" value="40" step="5"></td><td></td></tr>

                                    <tr class="st-section-header"><td colspan="3">Loads</td></tr>
                                    <tr><td>DL (kN)</td><td><input type="number" id="st-DL" value="952" step="10"></td><td></td></tr>
                                    <tr><td>LL (kN)</td><td><input type="number" id="st-LL" value="210" step="10"></td><td></td></tr>
                                    <tr class="st-computed-row"><td>F factored (kN)</td><td class="st-computed-val" id="st-inp-F">3825</td><td class="st-formula">= 1.2×DL + 1.5×LL</td></tr>

                                    <tr class="st-section-header"><td colspan="3">Strut Geometry</td></tr>
                                    <tr><td>
                                        <label style="display:inline">Strut Type</label>
                                    </td><td colspan="2">
                                        <select id="st-strut-type">
                                            <option value="prismatic">Prismatic Strut</option>
                                            <option value="fan-shaped">Fan-shaped Compression field</option>
                                            <option value="bottle-shaped">Bottle-shaped Compression field</option>
                                        </select>
                                    </td></tr>
                                    <tr><td>Col over — a (mm)</td><td><input type="number" id="st-a" value="200" step="10"></td><td></td></tr>
                                    <tr><td>b (mm)</td><td><input type="number" id="st-b" value="2500" step="10"></td><td class="st-formula st-note">other side</td></tr>
                                    <tr><td>Col under — a1 (mm)</td><td><input type="number" id="st-a1" value="450" step="10"></td><td></td></tr>
                                    <tr><td>b1 (mm)</td><td><input type="number" id="st-b1" value="1000" step="10"></td><td class="st-formula st-note">other side</td></tr>
                                </tbody>
                            </table>
                        </section>

                        <section class="calc-card calc-total-card">
                            <div class="calc-card-title" style="justify-content: center; color:#b45309;">Note</div>
                            <div class="calc-total-value" id="st-note" style="font-size: 2.2rem; letter-spacing: 0; color:#059669;">OK with RC member, Design Strut &amp; Tie</div>
                        </section>
                    </div>

                    <!-- RIGHT: Image + OUTPUT + Status -->
                    <div class="st-right">
                        <section class="calc-card">
                            <div class="calc-card-title">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
                                Strut & Tie Model
                            </div>
                            <div id="st-diagram-strength" class="st-diagram-compact"></div>
                        </section>

                        <section class="calc-card">
                            <div class="calc-card-title" style="color:#ef4444; font-weight:800;">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                                OUTPUT
                            </div>
                            <table class="st-table st-output-table">
                                <colgroup><col style="width:32%"><col style="width:22%"><col style="width:46%"></colgroup>
                                <thead>
                                    <tr><th>Parameter</th><th>Value</th><th>Formula</th></tr>
                                </thead>
                                <tbody>
                                    <tr class="st-section-header" style="color:#3b82f6;"><td colspan="3">Tie Bar</td></tr>
                                    <tr><td>Rv (kN)</td><td class="st-out-val" id="st-res-Rv">3825</td><td class="st-formula">= F factored</td></tr>
                                    <tr><td>T = Rh (kN)</td><td class="st-out-val" id="st-res-Rh">4212.56</td><td class="st-formula">= Rv × d / Deff</td></tr>
                                    <tr><td>φst</td><td class="st-out-val">0.85</td><td class="st-formula">AS3600 Table 2.2.2</td></tr>
                                    <tr class="st-highlight-row"><td>Ah (mm²)</td><td class="st-out-val st-highlight" id="st-res-Ah">9911.89</td><td class="st-formula" id="st-formula-Ah">= (Rh×1000 − φ·Ap·(σpe+Δσp)) / (φ·fsy)</td></tr>
                                    <tr><td>Choose N (bar dia)</td><td><select id="st-bar-dia">
                                        <option value="16">16</option>
                                        <option value="20">20</option>
                                        <option value="24">24</option>
                                        <option value="28">28</option>
                                        <option value="32" selected>32</option>
                                        <option value="36">36</option>
                                        <option value="40">40</option>
                                    </select></td><td class="st-formula" id="st-bar-result" style="font-weight:700; color:#059669; font-style:normal;">— N32</td></tr>

                                    <tr class="st-section-header" style="color:#ef4444;"><td colspan="3">Check Strut</td></tr>
                                    <tr><td>Strut Type</td><td class="st-out-val" id="st-res-strut-type">Prismatic</td><td class="st-formula"></td></tr>
                                    <tr><td>dc (mm)</td><td class="st-out-val" id="st-res-dc">403.34</td><td class="st-formula">= a1 × sin(θ)</td></tr>
                                    <tr><td>ws (mm)</td><td class="st-out-val" id="st-res-ws">500</td><td class="st-formula">= MIN(b, b1)</td></tr>
                                    <tr><td>Ac (mm²)</td><td class="st-out-val" id="st-res-Ac">201669</td><td class="st-formula">= ws × dc</td></tr>
                                    <tr><td>φst</td><td class="st-out-val">0.65</td><td class="st-formula">AS3600 Table 2.2.2</td></tr>
                                    <tr><td>βs</td><td class="st-out-val" id="st-res-beta">1.00</td><td class="st-formula" id="st-formula-beta">Prismatic → 1.0</td></tr>
                                    <tr class="st-highlight-row"><td>φ·Strut Cap. (kN)</td><td class="st-out-val st-highlight" id="st-res-fstrut">4719</td><td class="st-formula">= φ × βs × 0.9 × f'c × Ac / 1000</td></tr>
                                    <tr class="st-highlight-row"><td>Force C (kN)</td><td class="st-out-val st-highlight" id="st-res-forceC">5690</td><td class="st-formula">= Rv / sin(θ)</td></tr>
                                    <tr id="st-asc-row" style="display:none;"><td>Asc required (mm²)</td><td class="st-out-val" id="st-res-Asc">0</td><td class="st-formula">= (C − φ·Cap) × 1000 / fsc</td></tr>
                                    <tr id="st-asc-bar-row" style="display:none;"><td>Choose N (bar dia)</td><td><select id="st-asc-bar-dia">
                                        <option value="16">16</option>
                                        <option value="20">20</option>
                                        <option value="24">24</option>
                                        <option value="28">28</option>
                                        <option value="32" selected>32</option>
                                        <option value="36">36</option>
                                        <option value="40">40</option>
                                    </select></td><td class="st-formula" id="st-asc-bar-result" style="font-weight:700; color:#ef4444; font-style:normal;">—</td></tr>
                                </tbody>
                            </table>
                        </section>

                        <section class="calc-card calc-total-card">
                            <div class="calc-card-title" style="justify-content: center;">Status</div>
                            <div class="calc-total-value" id="st-status" style="font-size: 2.2rem; letter-spacing: 0;">OK</div>
                            <p class="calc-total-unit" id="st-status-desc">Concrete strut is OK</p>
                        </section>
                    </div>
                </div>
            </div>

            <!-- ===== SERVICE TAB ===== -->
            <div id="st-tab-service" style="display: none;">
                <div class="st-split">
                    <!-- LEFT: Diagram + Inputs -->
                    <div class="st-left">
                        <section class="calc-card">
                            <div class="calc-card-title">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
                                Strut & Tie Model (Service)
                            </div>
                            <div id="st-diagram-service" class="st-diagram-compact"></div>
                        </section>

                        <section class="calc-card">
                            <div class="st-section-label">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/></svg>
                                Geometry & Load
                            </div>
                            <div class="st-compact-inputs">
                                <div class="calc-field">
                                    <label for="st-svc-D">D (mm)</label>
                                    <input type="number" id="st-svc-D" value="550" step="10">
                                </div>
                                <div class="calc-field">
                                    <label for="st-svc-d">d — Horiz. (mm)</label>
                                    <input type="number" id="st-svc-d" value="500" step="10">
                                </div>
                                <div class="calc-field">
                                    <label for="st-svc-bar-stress">Bar Stress (MPa)</label>
                                    <input type="number" id="st-svc-bar-stress" value="200" step="10">
                                </div>
                                <div class="calc-field">
                                    <label for="st-svc-F">F unfactored (kN)</label>
                                    <input type="number" id="st-svc-F" value="3050" step="10">
                                </div>
                            </div>
                        </section>
                    </div>

                    <!-- RIGHT: Results -->
                    <div class="st-right">
                        <section class="calc-card">
                            <div class="calc-card-title">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                                Results
                            </div>
                            <div class="calc-output" style="border-top:none; padding-top:0; margin-top:0;">
                                <div class="calc-result-row">
                                    <span class="calc-result-label">θ (angle)</span>
                                    <span class="calc-result-value" id="st-svc-res-theta">0.00 <span class="calc-result-unit">°</span></span>
                                </div>
                                <div class="calc-result-row">
                                    <span class="calc-result-label">Rv (kN)</span>
                                    <span class="calc-result-value" id="st-svc-res-Rv">0 <span class="calc-result-unit">kN</span></span>
                                </div>
                                <div class="calc-result-row">
                                    <span class="calc-result-label">Rh (kN)</span>
                                    <span class="calc-result-value" id="st-svc-res-Rh">0.00 <span class="calc-result-unit">kN</span></span>
                                </div>
                                <div class="calc-result-row">
                                    <span class="calc-result-label">Ah required</span>
                                    <span class="calc-result-value" id="st-svc-res-Ah">0 <span class="calc-result-unit">mm²</span></span>
                                </div>
                            </div>
                        </section>

                        <section class="calc-card calc-total-card">
                            <div class="calc-card-title" style="justify-content: center;">Suggested Reinforcement</div>
                            <div class="calc-total-value" id="st-svc-suggest" style="font-size: 2rem; letter-spacing: 0;">—</div>
                            <p class="calc-total-unit" id="st-svc-suggest-desc">Enter values to calculate</p>
                        </section>
                    </div>
                </div>
            </div>
        `;

        // ── Tab switching ──
        const tabBtns = container.querySelectorAll('#st-tab-selector .segment-btn');
        const tabStrength = document.getElementById('st-tab-strength');
        const tabService = document.getElementById('st-tab-service');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const tab = btn.dataset.tab;
                tabStrength.style.display = tab === 'strength' ? '' : 'none';
                tabService.style.display = tab === 'service' ? '' : 'none';
            });
        });

        // ── SVG Diagrams ──
        function renderStrengthDiagram() {
            return `<img src="img/strut-tie-model.png" alt="Strut & Tie Model" style="width:100%; height:100%; object-fit:contain;"/>`;
        }

        function renderServiceDiagram() {
            return `<img src="img/strut-tie-model.png" alt="Strut & Tie Model (Service)" style="width:100%; height:100%; object-fit:contain;"/>`;
        }

        // ── Strength Calculation (AS3600-2018) ──
        // Formulas match Excel: Strut and Tie CHECK.xls
        function calcStrength() {
            document.getElementById('st-diagram-strength').innerHTML = renderStrengthDiagram();

            const D = parseFloat(document.getElementById('st-D').value) || 0;
            const topBar = parseFloat(document.getElementById('st-top-bar').value) || 0;
            const btmBar = parseFloat(document.getElementById('st-btm-bar').value) || 0;
            const cover = parseFloat(document.getElementById('st-cover').value) || 0;
            const d_horiz = parseFloat(document.getElementById('st-d').value) || 0;

            const Ap = parseFloat(document.getElementById('st-Ap').value) || 0;
            const sigma_pe = parseFloat(document.getElementById('st-sigma-pe').value) || 0;
            const delta_sigma = parseFloat(document.getElementById('st-delta-sigma').value) || 0;
            const fsy = parseFloat(document.getElementById('st-fsy').value) || 0;

            const DL = parseFloat(document.getElementById('st-DL').value) || 0;
            const LL = parseFloat(document.getElementById('st-LL').value) || 0;

            const a = parseFloat(document.getElementById('st-a').value) || 0;
            const b = parseFloat(document.getElementById('st-b').value) || 0;
            const a1 = parseFloat(document.getElementById('st-a1').value) || 0;
            const b1 = parseFloat(document.getElementById('st-b1').value) || 0;

            const strutType = document.getElementById('st-strut-type').value;
            const fc = parseFloat(document.getElementById('st-fc').value) || 0;
            const fsc = 200; // MPa — standard compressive steel yield stress

            // Deff: Excel C8 = D - (Cover*2 + topBar/2 + btmBar/2)
            const Deff = D - (cover * 2 + topBar / 2 + btmBar / 2);

            // θ angle: Excel C10 = ATAN(Deff/d)*180/PI
            const theta_rad = (Deff > 0 && d_horiz > 0) ? Math.atan(Deff / d_horiz) : 0;
            const theta_deg = theta_rad * (180 / Math.PI);

            // Factored load: Excel C19 = 1.2*DL + 1.5*LL
            const F = 1.2 * DL + 1.5 * LL;
            const Rv = F;

            // Horizontal tie force: Excel F6 = (Rv * d) / Deff
            const phi_st_tie = 0.85;
            let Rh = 0;
            if (Deff > 0) {
                Rh = (Rv * d_horiz) / Deff;
            }

            // Tie reinforcement: Excel F8 = (Rh*1000 - φst*Ap*(σpe+Δσp)) / (φst*fsy)
            let Ah = 0;
            if (fsy > 0) {
                Ah = (Rh * 1000 - phi_st_tie * Ap * (sigma_pe + delta_sigma)) / (phi_st_tie * fsy);
            }
            if (Ah < 0) Ah = 0;

            // Strut check
            // dc: Excel F12 = MIN(a, a1) * SIN(θ)
            const dc_strut = a1 * Math.sin(theta_rad);

            // ws: Excel F13 = MIN(b, b1)
            const ws = Math.min(b, b1);

            // Ac: Excel F14 = ws * dc
            const Ac = ws * dc_strut;

            // βs factor: AS3600-2018 Table 7.2.3
            // Prismatic Strut: βs = 1.0
            // Fan-shaped & Bottle-shaped: βs = 1/(1 + 0.66·cot²θ)
            let beta_s = 1.0;
            if (strutType === 'fan-shaped' || strutType === 'bottle-shaped') {
                const cotTheta = 1 / Math.tan(theta_rad);
                beta_s = 1 / (1 + 0.66 * cotTheta * cotTheta);
            }

            const phi_strut = 0.65;

            // Strut capacity: Excel F18 = φst * βs * 0.9 * f'c * Ac / 1000
            const f_strut = phi_strut * beta_s * 0.9 * fc * Ac / 1000;

            // Force in diagonal strut (compression): Excel F19 = F / sin(θ)
            const sinTheta = Math.sin(theta_rad);
            const forceC = sinTheta > 0 ? Rv / sinTheta : 0;

            // Update INPUT computed rows
            document.getElementById('st-inp-deff').innerText = Math.max(0, Deff).toFixed(0);
            document.getElementById('st-inp-theta').innerText = theta_deg.toFixed(2);
            document.getElementById('st-inp-F').innerText = F.toFixed(0);

            // Note: Excel =IF(C10<30,"Design as flexural RC member","OK with RC member, Design Strut & Tie")
            document.getElementById('st-note').innerText = theta_deg < 30 ? 'Design as flexural RC member' : 'OK with RC member, Design Strut & Tie';

            // Update OUTPUT table
            document.getElementById('st-res-Rv').innerText = Rv.toFixed(0);
            document.getElementById('st-res-Rh').innerText = Rh.toFixed(2);
            document.getElementById('st-res-Ah').innerText = Ah.toFixed(2);

            // Bar count: Excel =ROUNDUP(IF(F9=12,F8/110,IF(F9=16,F8/200,...)))
            const barDia = parseInt(document.getElementById('st-bar-dia').value) || 32;
            const barAreas = {16: 200, 20: 310, 24: 450, 28: 610, 32: 800, 36: 1020, 40: 1260};
            const barArea = barAreas[barDia] || 800;
            const barCount = Ah > 0 ? Math.ceil(Ah / barArea) : 0;
            document.getElementById('st-bar-result').innerText = barCount > 0 ? `${barCount} N${barDia}` : '—';

            const strutNames = {'prismatic': 'Prismatic Strut', 'fan-shaped': 'Fan-shaped', 'bottle-shaped': 'Bottle-shaped'};
            document.getElementById('st-res-strut-type').innerText = strutNames[strutType] || strutType;
            document.getElementById('st-res-dc').innerText = dc_strut.toFixed(2);
            document.getElementById('st-res-ws').innerText = ws.toFixed(0);
            document.getElementById('st-res-Ac').innerText = Ac.toFixed(0);
            document.getElementById('st-res-beta').innerText = beta_s.toFixed(2);
            const betaFormulas = {'prismatic': 'Prismatic → 1.0', 'fan-shaped': '= 1/(1 + 0.66·cot²θ)', 'bottle-shaped': '= 1/(1 + 0.66·cot²θ)'};
            document.getElementById('st-formula-beta').innerText = betaFormulas[strutType] || '';
            document.getElementById('st-res-fstrut').innerText = f_strut.toFixed(0);
            document.getElementById('st-res-forceC').innerText = forceC.toFixed(0);

            // Status
            const statusEl = document.getElementById('st-status');
            const statusDesc = document.getElementById('st-status-desc');
            const ascRow = document.getElementById('st-asc-row');

            if (forceC > f_strut) {
                // Strut fails → need compressive steel
                const Asc = (fsc > 0) ? (forceC - f_strut) * 1000 / fsc : 0;
                document.getElementById('st-res-Asc').innerText = Asc.toFixed(0);
                ascRow.style.display = '';
                document.getElementById('st-asc-bar-row').style.display = '';

                // Asc bar count
                const ascBarDia = parseInt(document.getElementById('st-asc-bar-dia').value) || 32;
                const ascBarArea = barAreas[ascBarDia] || 800;
                const ascBarCount = Asc > 0 ? Math.ceil(Asc / ascBarArea) : 0;
                document.getElementById('st-asc-bar-result').innerText = ascBarCount > 0 ? `${ascBarCount} N${ascBarDia}` : '—';

                statusEl.innerText = 'STRUT FAIL';
                statusEl.style.color = '#ef4444';
                statusDesc.innerText = 'Concrete strut is failed, Compressive steel parallel to axis of strut is required';
            } else {
                ascRow.style.display = 'none';
                document.getElementById('st-asc-bar-row').style.display = 'none';
                statusEl.innerText = 'OK';
                statusEl.style.color = 'var(--accent-success)';
                statusDesc.innerText = 'Concrete strut is OK';
            }
        }

        // ── Service Calculation ──
        function calcService() {
            document.getElementById('st-diagram-service').innerHTML = renderServiceDiagram();

            const D = parseFloat(document.getElementById('st-svc-D').value) || 0;
            const d = parseFloat(document.getElementById('st-svc-d').value) || 0;
            const barStress = parseFloat(document.getElementById('st-svc-bar-stress').value) || 0;
            const F = parseFloat(document.getElementById('st-svc-F').value) || 0;

            // θ = atan(D / d)
            const theta_rad = (D > 0 && d > 0) ? Math.atan(D / d) : 0;
            const theta_deg = theta_rad * (180 / Math.PI);

            const Rv = F;
            const tanTheta = Math.tan(theta_rad);
            const Rh = tanTheta > 0 ? Rv / tanTheta : 0;
            const Ah = barStress > 0 ? Rh * 1000 / barStress : 0;

            document.getElementById('st-svc-res-theta').innerHTML = `${theta_deg.toFixed(2)} <span class="calc-result-unit">°</span>`;
            document.getElementById('st-svc-res-Rv').innerHTML = `${Rv.toFixed(0)} <span class="calc-result-unit">kN</span>`;
            document.getElementById('st-svc-res-Rh').innerHTML = `${Rh.toFixed(2)} <span class="calc-result-unit">kN</span>`;
            document.getElementById('st-svc-res-Ah').innerHTML = `${Ah.toFixed(0)} <span class="calc-result-unit">mm²</span>`;

            // Suggest bar count
            const suggestEl = document.getElementById('st-svc-suggest');
            const suggestDesc = document.getElementById('st-svc-suggest-desc');
            if (Ah > 0) {
                const barDias = [12, 16, 20, 24, 28, 32, 36];
                let bestDia = 20;
                let bestN = 999;
                for (const dia of barDias) {
                    const area1 = Math.PI * dia * dia / 4;
                    const n = Math.ceil(Ah / area1);
                    if (n < bestN || (n === bestN && dia < bestDia)) {
                        bestN = n;
                        bestDia = dia;
                    }
                }
                // Pick reasonable: try N20
                const area20 = Math.PI * 20 * 20 / 4;
                const n20 = Math.ceil(Ah / area20);
                suggestEl.innerText = `${n20}N20`;
                suggestDesc.innerText = `${n20} bars × Ø20mm = ${(n20 * area20).toFixed(0)} mm² ≥ ${Ah.toFixed(0)} mm²`;
            } else {
                suggestEl.innerText = '—';
                suggestDesc.innerText = 'Enter values to calculate';
            }
        }

        // ── Bind all inputs ──
        const strengthInputs = [
            'st-D', 'st-top-bar', 'st-btm-bar', 'st-cover', 'st-d',
            'st-Ap', 'st-sigma-pe', 'st-delta-sigma', 'st-fsy',
            'st-DL', 'st-LL',
            'st-a', 'st-b', 'st-a1', 'st-b1',
            'st-fc'
        ];
        strengthInputs.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.addEventListener('input', calcStrength);
        });
        document.getElementById('st-strut-type').addEventListener('change', calcStrength);
        document.getElementById('st-bar-dia').addEventListener('change', calcStrength);
        document.getElementById('st-asc-bar-dia').addEventListener('change', calcStrength);

        const serviceInputs = ['st-svc-D', 'st-svc-d', 'st-svc-bar-stress', 'st-svc-F'];
        serviceInputs.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.addEventListener('input', calcService);
        });

        // Initial calculations
        calcStrength();
        calcService();
    }

    // ─── Integrity Reinforcement Calculator (AS3600-2018 Cl 9.2) ───
    const IR_BAR_AREAS = {
        12: 113.10,
        16: 201.06,
        20: 314.16,
        24: 452.39,
        28: 615.75,
        32: 804.25,
        36: 1017.88,
        40: 1256.64
    };

    let irSections = [
        { id: 1, name: 'Section A', longDia: 16, longCount: 2, latDia: 16, latCount: 6 },
        { id: 2, name: 'Section B', longDia: 20, longCount: 2, latDia: 20, latCount: 2 },
        { id: 3, name: 'Section C', longDia: 28, longCount: 2, latDia: 28, latCount: 5 },
        { id: 4, name: 'Section D', longDia: 28, longCount: 2, latDia: 28, latCount: 10 },
        { id: 5, name: 'Section E', longDia: 32, longCount: 4, latDia: 32, latCount: 15 },
        { id: 6, name: 'Section F', longDia: 20, longCount: 4, latDia: 20, latCount: 15 }
    ];

    let nextSectionId = 7;

    function renderIntegrityReinforcement(container) {
        container.innerHTML = `
            <div class="st-split" style="margin-bottom: 24px;">
                <!-- LEFT: Code Parameters & Input -->
                <div class="st-left">
                    <section class="calc-card">
                        <div class="calc-card-title" style="color:#059669; font-weight:800;">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/></svg>
                            INPUT & CODE PARAMETERS
                        </div>
                        <table class="st-table st-input-table">
                            <colgroup><col style="width:40%"><col style="width:25%"><col style="width:35%"></colgroup>
                            <tbody>
                                <tr class="st-section-header"><td colspan="3">Design Load & Material</td></tr>
                                <tr>
                                    <td>Fz — Column Reaction (kN)</td>
                                    <td><input type="number" id="ir-Fz" value="520" step="10"></td>
                                    <td class="st-formula st-note">vertical reaction load</td>
                                </tr>
                                <tr>
                                    <td>φ — Capacity Factor</td>
                                    <td><input type="number" id="ir-phi" value="0.70" step="0.05"></td>
                                    <td class="st-formula">AS3600 Cl 9.2</td>
                                </tr>
                                <tr>
                                    <td>fsy — Steel Yield (MPa)</td>
                                    <td><input type="number" id="ir-fsy" value="500" step="10"></td>
                                    <td class="st-formula">Standard yield</td>
                                </tr>
                                <tr class="st-highlight-row" style="background:#fefce8; border-top:2px solid var(--accent-primary);">
                                    <td style="font-weight:800; color:#1e40af;">Reo Required — As,req (mm²)</td>
                                    <td class="st-out-val st-highlight" id="ir-res-Asreq" style="font-size:1.15rem; font-weight:800; color:#1e40af;">2971</td>
                                    <td class="st-formula" style="font-weight:600;">= 2 × Fz × 1000 / (φ × fsy)</td>
                                </tr>
                            </tbody>
                        </table>
                    </section>

                    <!-- Summary Note Card -->
                    <section class="calc-card calc-total-card">
                        <div class="calc-card-title" style="justify-content: center; color:#0284c7;">AS3600-2018 Cl 9.2 Requirement</div>
                        <div class="calc-total-value" style="font-size: 1.15rem; letter-spacing: 0; color:#1e40af; font-weight:700; text-align:center;">
                            Continuous bottom rebar passing through column core
                        </div>
                        <div class="calc-total-unit" style="font-size:0.85rem; color:#6b7280; text-align:center; margin-top:4px;">
                            Tensile tying force = 2 × Fz / φ to prevent progressive collapse
                        </div>
                    </section>
                </div>

                <!-- RIGHT: Development Length Table -->
                <div class="st-right">
                    <section class="calc-card">
                        <div class="calc-card-title" style="color:#0284c7; font-weight:800;">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="20" x2="12" y2="4"/><polyline points="6 10 12 4 18 10"/></svg>
                            DEVELOPMENT LENGTH PAST COLUMN FACE (Ld)
                        </div>
                        <table class="st-table" style="text-align:center;">
                            <thead>
                                <tr style="border-bottom: 2px solid var(--accent-primary);">
                                    <th style="text-align:center; font-size:0.75rem; text-transform:uppercase; letter-spacing:0.04em;">Bar Size</th>
                                    <th style="text-align:center; font-size:0.75rem; text-transform:uppercase; letter-spacing:0.04em;">Bar Area (mm²)</th>
                                    <th style="text-align:center; font-size:0.75rem; text-transform:uppercase; letter-spacing:0.04em;">Ld Required (mm)</th>
                                    <th style="text-align:center; font-size:0.75rem; text-transform:uppercase; letter-spacing:0.04em;">Extension Past Face (mm)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr><td style="text-align:center;"><strong>N12</strong></td><td style="text-align:center;">113</td><td style="text-align:center;">960</td><td style="text-align:center; font-weight:700; color:#1e40af;">1000</td></tr>
                                <tr><td style="text-align:center;"><strong>N16</strong></td><td style="text-align:center;">201</td><td style="text-align:center;">1280</td><td style="text-align:center; font-weight:700; color:#1e40af;">1300</td></tr>
                                <tr><td style="text-align:center;"><strong>N20</strong></td><td style="text-align:center;">314</td><td style="text-align:center;">1600</td><td style="text-align:center; font-weight:700; color:#1e40af;">1600</td></tr>
                                <tr><td style="text-align:center;"><strong>N24</strong></td><td style="text-align:center;">452</td><td style="text-align:center;">1920</td><td style="text-align:center; font-weight:700; color:#1e40af;">2000</td></tr>
                                <tr><td style="text-align:center;"><strong>N28</strong></td><td style="text-align:center;">616</td><td style="text-align:center;">2240</td><td style="text-align:center; font-weight:700; color:#1e40af;">2300</td></tr>
                                <tr><td style="text-align:center;"><strong>N32</strong></td><td style="text-align:center;">804</td><td style="text-align:center;">2560</td><td style="text-align:center; font-weight:700; color:#1e40af;">2600</td></tr>
                                <tr><td style="text-align:center;"><strong>N36</strong></td><td style="text-align:center;">1018</td><td style="text-align:center;">2880</td><td style="text-align:center; font-weight:700; color:#1e40af;">2900</td></tr>
                                <tr><td style="text-align:center;"><strong>N40</strong></td><td style="text-align:center;">1257</td><td style="text-align:center;">2880</td><td style="text-align:center; font-weight:700; color:#1e40af;">2900</td></tr>
                            </tbody>
                        </table>
                        <div style="font-size:0.75rem; color:#6b7280; margin-top:8px; font-style:italic;">
                            * Ld = 2 × 40 × db (anchorage on both sides, rounded up to 100mm)
                        </div>
                    </section>
                </div>
            </div>

            <!-- Visual 4-Sets Explanation Cards -->
            <section class="calc-card" style="margin-bottom: 24px;">
                <div class="calc-card-title" style="color:#4f46e5; font-weight:800;">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                    4 COLUMN CONNECTION SETS (AS3600-2018)
                </div>

                <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap:16px;">
                    <!-- SET 1 -->
                    <div style="background:var(--bg-secondary); border:1px solid var(--border-light); border-radius:var(--radius-md); padding:14px; text-align:center; display:flex; flex-direction:column; align-items:center;">
                        <div style="background:#fff; border:1px solid var(--border-light); border-radius:var(--radius-md); padding:8px; margin-bottom:12px; width:100%; display:flex; justify-content:center; box-shadow:var(--shadow-sm);">
                            <svg viewBox="0 0 140 110" width="120" height="95">
                                <rect x="52" y="24" width="36" height="62" fill="#bfdbfe" fill-opacity="0.6" stroke="#2563eb" stroke-width="1.5" rx="2" />
                                <line x1="62" y1="6" x2="62" y2="104" stroke="#1d4ed8" stroke-width="2.5" />
                                <line x1="78" y1="6" x2="78" y2="104" stroke="#1d4ed8" stroke-width="2.5" />
                                <line x1="8" y1="40" x2="132" y2="40" stroke="#1d4ed8" stroke-width="2.5" />
                                <line x1="8" y1="55" x2="132" y2="55" stroke="#1d4ed8" stroke-width="2.5" />
                                <line x1="8" y1="70" x2="132" y2="70" stroke="#1d4ed8" stroke-width="2.5" />
                            </svg>
                        </div>
                        <div style="font-weight:800; color:#4f46e5; font-size:0.95rem; margin-bottom:4px;">SET 1: 4 SIDES</div>
                        <div style="font-size:0.78rem; color:#6b7280; margin-bottom:8px;">Internal Column (Cột giữa)</div>
                        <div style="font-size:0.82rem; font-weight:700; color:#1e40af; background:#fff; padding:6px 10px; border-radius:6px; border:1px solid var(--border-light); width:100%;">
                            As = 2×N<sub>long</sub>×A<sub>b</sub> + 2×N<sub>lat</sub>×A<sub>b</sub>
                        </div>
                        <div style="font-size:0.75rem; color:#9ca3af; margin-top:6px;">2 passes in both directions</div>
                    </div>

                    <!-- SET 2 -->
                    <div style="background:var(--bg-secondary); border:1px solid var(--border-light); border-radius:var(--radius-md); padding:14px; text-align:center; display:flex; flex-direction:column; align-items:center;">
                        <div style="background:#fff; border:1px solid var(--border-light); border-radius:var(--radius-md); padding:8px; margin-bottom:12px; width:100%; display:flex; justify-content:center; box-shadow:var(--shadow-sm);">
                            <svg viewBox="0 0 140 110" width="120" height="95">
                                <rect x="52" y="24" width="36" height="62" fill="#bfdbfe" fill-opacity="0.6" stroke="#2563eb" stroke-width="1.5" rx="2" />
                                <line x1="62" y1="6" x2="62" y2="86" stroke="#1d4ed8" stroke-width="2.5" />
                                <line x1="78" y1="6" x2="78" y2="86" stroke="#1d4ed8" stroke-width="2.5" />
                                <line x1="8" y1="40" x2="132" y2="40" stroke="#1d4ed8" stroke-width="2.5" />
                                <line x1="8" y1="55" x2="132" y2="55" stroke="#1d4ed8" stroke-width="2.5" />
                                <line x1="8" y1="70" x2="132" y2="70" stroke="#1d4ed8" stroke-width="2.5" />
                            </svg>
                        </div>
                        <div style="font-weight:800; color:#0284c7; font-size:0.95rem; margin-bottom:4px;">SET 2: 3 SIDES (LONG)</div>
                        <div style="font-size:0.78rem; color:#6b7280; margin-bottom:8px;">Edge Column - Long (Cột biên dài)</div>
                        <div style="font-size:0.82rem; font-weight:700; color:#1e40af; background:#fff; padding:6px 10px; border-radius:6px; border:1px solid var(--border-light); width:100%;">
                            As = 1×N<sub>long</sub>×A<sub>b</sub> + 2×N<sub>lat</sub>×A<sub>b</sub>
                        </div>
                        <div style="font-size:0.75rem; color:#9ca3af; margin-top:6px;">1 pass long + 2 passes lat</div>
                    </div>

                    <!-- SET 3 -->
                    <div style="background:var(--bg-secondary); border:1px solid var(--border-light); border-radius:var(--radius-md); padding:14px; text-align:center; display:flex; flex-direction:column; align-items:center;">
                        <div style="background:#fff; border:1px solid var(--border-light); border-radius:var(--radius-md); padding:8px; margin-bottom:12px; width:100%; display:flex; justify-content:center; box-shadow:var(--shadow-sm);">
                            <svg viewBox="0 0 140 110" width="120" height="95">
                                <rect x="52" y="24" width="36" height="62" fill="#bfdbfe" fill-opacity="0.6" stroke="#2563eb" stroke-width="1.5" rx="2" />
                                <line x1="62" y1="6" x2="62" y2="104" stroke="#1d4ed8" stroke-width="2.5" />
                                <line x1="78" y1="6" x2="78" y2="104" stroke="#1d4ed8" stroke-width="2.5" />
                                <line x1="52" y1="40" x2="132" y2="40" stroke="#1d4ed8" stroke-width="2.5" />
                                <line x1="52" y1="55" x2="132" y2="55" stroke="#1d4ed8" stroke-width="2.5" />
                                <line x1="52" y1="70" x2="132" y2="70" stroke="#1d4ed8" stroke-width="2.5" />
                            </svg>
                        </div>
                        <div style="font-weight:800; color:#d97706; font-size:0.95rem; margin-bottom:4px;">SET 3: 3 SIDES (SHORT)</div>
                        <div style="font-size:0.78rem; color:#6b7280; margin-bottom:8px;">Edge Column - Short (Cột biên ngắn)</div>
                        <div style="font-size:0.82rem; font-weight:700; color:#1e40af; background:#fff; padding:6px 10px; border-radius:6px; border:1px solid var(--border-light); width:100%;">
                            As = 2×N<sub>long</sub>×A<sub>b</sub> + 1×N<sub>lat</sub>×A<sub>b</sub>
                        </div>
                        <div style="font-size:0.75rem; color:#9ca3af; margin-top:6px;">2 passes long + 1 pass lat</div>
                    </div>

                    <!-- SET 4 -->
                    <div style="background:var(--bg-secondary); border:1px solid var(--border-light); border-radius:var(--radius-md); padding:14px; text-align:center; display:flex; flex-direction:column; align-items:center;">
                        <div style="background:#fff; border:1px solid var(--border-light); border-radius:var(--radius-md); padding:8px; margin-bottom:12px; width:100%; display:flex; justify-content:center; box-shadow:var(--shadow-sm);">
                            <svg viewBox="0 0 140 110" width="120" height="95">
                                <rect x="52" y="24" width="36" height="62" fill="#bfdbfe" fill-opacity="0.6" stroke="#2563eb" stroke-width="1.5" rx="2" />
                                <line x1="62" y1="6" x2="62" y2="86" stroke="#1d4ed8" stroke-width="2.5" />
                                <line x1="78" y1="6" x2="78" y2="86" stroke="#1d4ed8" stroke-width="2.5" />
                                <line x1="52" y1="40" x2="132" y2="40" stroke="#1d4ed8" stroke-width="2.5" />
                                <line x1="52" y1="55" x2="132" y2="55" stroke="#1d4ed8" stroke-width="2.5" />
                                <line x1="52" y1="70" x2="132" y2="70" stroke="#1d4ed8" stroke-width="2.5" />
                            </svg>
                        </div>
                        <div style="font-weight:800; color:#059669; font-size:0.95rem; margin-bottom:4px;">SET 4: 2 SIDES</div>
                        <div style="font-size:0.78rem; color:#6b7280; margin-bottom:8px;">Corner Column (Cột góc)</div>
                        <div style="font-size:0.82rem; font-weight:700; color:#1e40af; background:#fff; padding:6px 10px; border-radius:6px; border:1px solid var(--border-light); width:100%;">
                            As = 1×N<sub>long</sub>×A<sub>b</sub> + 1×N<sub>lat</sub>×A<sub>b</sub>
                        </div>
                        <div style="font-size:0.75rem; color:#9ca3af; margin-top:6px;">1 pass in each direction</div>
                    </div>
                </div>
            </section>

            <!-- Bottom Section: Multi-Section Schedule & Check Table -->
            <section class="calc-card">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
                    <div class="calc-card-title" style="color:#1e40af; font-weight:800; margin-bottom:0;">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                        COLUMN SECTIONS REINFORCEMENT SCHEDULE & INTEGRITY CHECK
                    </div>
                    <button class="btn btn-primary" id="ir-add-section-btn" style="padding:6px 14px; font-size:0.8rem; font-weight:600; display:flex; align-items:center; gap:6px;">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                        + Add Section
                    </button>
                </div>

                <div style="overflow-x:auto;">
                    <table class="st-table" id="ir-sections-table" style="min-width: 900px;">
                        <thead>
                            <tr>
                                <th style="width:14%;">Section</th>
                                <th style="width:16%;">Longitudinal</th>
                                <th style="width:16%;">Latitude (Transverse)</th>
                                <th style="width:13%;">Set 1 (4-side)</th>
                                <th style="width:13%;">Set 2 (3-long)</th>
                                <th style="width:13%;">Set 3 (3-short)</th>
                                <th style="width:13%;">Set 4 (2-side)</th>
                                <th style="width:5%;"></th>
                            </tr>
                        </thead>
                        <tbody id="ir-sections-body">
                            <!-- Rendered dynamically by JS -->
                        </tbody>
                    </table>
                </div>
            </section>
        `;

        // Event listeners
        document.getElementById('ir-Fz').addEventListener('input', calcIntegrity);
        document.getElementById('ir-phi').addEventListener('input', calcIntegrity);
        document.getElementById('ir-fsy').addEventListener('input', calcIntegrity);
        document.getElementById('ir-add-section-btn').addEventListener('click', addIrSection);

        calcIntegrity();
    }

    function renderIrTableRows(As_req) {
        const tbody = document.getElementById('ir-sections-body');
        if (!tbody) return;

        tbody.innerHTML = '';

        irSections.forEach((sec, idx) => {
            const abLong = IR_BAR_AREAS[sec.longDia] || 201.06;
            const abLat = IR_BAR_AREAS[sec.latDia] || 201.06;

            const as1 = 2 * sec.longCount * abLong + 2 * sec.latCount * abLat;
            const as2 = 1 * sec.longCount * abLong + 2 * sec.latCount * abLat;
            const as3 = 2 * sec.longCount * abLong + 1 * sec.latCount * abLat;
            const as4 = 1 * sec.longCount * abLong + 1 * sec.latCount * abLat;

            const makeBadge = (val) => {
                const pass = val >= As_req;
                const bg = pass ? '#dcfce7' : '#fee2e2';
                const col = pass ? '#15803d' : '#b91c1c';
                const text = pass ? 'OK' : 'FAIL';
                return `
                    <div style="display:flex; flex-direction:column; align-items:center; gap:2px;">
                        <span style="font-weight:700; color:#1e40af; font-size:0.85rem;">${Math.round(val)}</span>
                        <span style="font-size:0.7rem; font-weight:800; padding:2px 8px; border-radius:9999px; background:${bg}; color:${col};">${text}</span>
                    </div>
                `;
            };

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>
                    <input type="text" class="ir-sec-name" data-idx="${idx}" value="${sec.name}" style="width:100%;">
                </td>
                <td>
                    <div style="display:flex; gap:6px; align-items:center;">
                        <input type="number" class="ir-long-count" data-idx="${idx}" value="${sec.longCount}" min="1" max="50" style="width:50px; text-align:center;">
                        <select class="ir-long-dia" data-idx="${idx}">
                            ${[12, 16, 20, 24, 28, 32, 36, 40].map(d => `<option value="${d}" ${d === sec.longDia ? 'selected' : ''}>N${d}</option>`).join('')}
                        </select>
                    </div>
                </td>
                <td>
                    <div style="display:flex; gap:6px; align-items:center;">
                        <input type="number" class="ir-lat-count" data-idx="${idx}" value="${sec.latCount}" min="1" max="50" style="width:50px; text-align:center;">
                        <select class="ir-lat-dia" data-idx="${idx}">
                            ${[12, 16, 20, 24, 28, 32, 36, 40].map(d => `<option value="${d}" ${d === sec.latDia ? 'selected' : ''}>N${d}</option>`).join('')}
                        </select>
                    </div>
                </td>
                <td style="text-align:center;">${makeBadge(as1)}</td>
                <td style="text-align:center;">${makeBadge(as2)}</td>
                <td style="text-align:center;">${makeBadge(as3)}</td>
                <td style="text-align:center;">${makeBadge(as4)}</td>
                <td style="text-align:center;">
                    <button class="ir-del-btn" data-idx="${idx}" style="background:none; border:none; color:#ef4444; cursor:pointer; font-size:1rem; padding:4px;" title="Delete section">✕</button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        // Re-bind table inputs
        tbody.querySelectorAll('.ir-sec-name').forEach(el => {
            el.addEventListener('input', e => {
                const i = parseInt(e.target.dataset.idx);
                irSections[i].name = e.target.value;
            });
        });
        tbody.querySelectorAll('.ir-long-count').forEach(el => {
            el.addEventListener('input', e => {
                const i = parseInt(e.target.dataset.idx);
                irSections[i].longCount = parseInt(e.target.value) || 1;
                calcIntegrity();
            });
        });
        tbody.querySelectorAll('.ir-long-dia').forEach(el => {
            el.addEventListener('change', e => {
                const i = parseInt(e.target.dataset.idx);
                irSections[i].longDia = parseInt(e.target.value);
                calcIntegrity();
            });
        });
        tbody.querySelectorAll('.ir-lat-count').forEach(el => {
            el.addEventListener('input', e => {
                const i = parseInt(e.target.dataset.idx);
                irSections[i].latCount = parseInt(e.target.value) || 1;
                calcIntegrity();
            });
        });
        tbody.querySelectorAll('.ir-lat-dia').forEach(el => {
            el.addEventListener('change', e => {
                const i = parseInt(e.target.dataset.idx);
                irSections[i].latDia = parseInt(e.target.value);
                calcIntegrity();
            });
        });
        tbody.querySelectorAll('.ir-del-btn').forEach(el => {
            el.addEventListener('click', e => {
                const i = parseInt(e.target.dataset.idx);
                irSections.splice(i, 1);
                calcIntegrity();
            });
        });
    }

    function addIrSection() {
        const charCode = 65 + (irSections.length % 26);
        const name = `Section ${String.fromCharCode(charCode)}`;
        irSections.push({
            id: nextSectionId++,
            name: name,
            longDia: 20,
            longCount: 2,
            latDia: 20,
            latCount: 4
        });
        calcIntegrity();
    }

    function calcIntegrity() {
        const fz = parseFloat(document.getElementById('ir-Fz').value) || 0;
        const phi = parseFloat(document.getElementById('ir-phi').value) || 0.70;
        const fsy = parseFloat(document.getElementById('ir-fsy').value) || 500;

        // Excel formula: Reo req = Fz * 2 / 500 / Phi * 1000
        const As_req = (phi > 0 && fsy > 0) ? (2 * fz * 1000) / (phi * fsy) : 0;

        const reqEl = document.getElementById('ir-res-Asreq');
        if (reqEl) reqEl.innerText = As_req.toFixed(0);

        renderIrTableRows(As_req);
    }

    // ─── Corbel Design (Strut & Tie Model) ───
    const CORBEL_BAR_SIZES = [12, 16, 20, 24, 28, 32, 36, 40];

    function renderCorbelDesign(container) {
        const barOpts = CORBEL_BAR_SIZES.map(d => `<option value="${d}" ${d === 32 ? 'selected' : ''}>N${d}</option>`).join('');

        container.innerHTML = `
            <div class="st-split" style="margin-bottom: 24px;">
                <!-- LEFT: Input -->
                <div class="st-left">
                    <section class="calc-card">
                        <div class="calc-card-title" style="color:#059669; font-weight:800;">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/></svg>
                            INPUT
                        </div>
                        <table class="st-table st-input-table">
                            <colgroup><col style="width:40%"><col style="width:25%"><col style="width:35%"></colgroup>
                            <tbody>
                                <tr class="st-section-header"><td colspan="3">Ultimate Loads</td></tr>
                                <tr><td>V — Vertical (kN)</td><td><input type="number" id="cb-V" value="2300" step="10"></td><td class="st-formula">ultimate shear</td></tr>
                                <tr><td>N — Horizontal (kN)</td><td><input type="number" id="cb-N" value="0" step="10"></td><td class="st-formula">horizontal tension</td></tr>

                                <tr class="st-section-header"><td colspan="3">Geometry</td></tr>
                                <tr><td>L1 — Shear span (mm)</td><td><input type="number" id="cb-L1" value="400" step="10"></td><td class="st-formula">face to load</td></tr>
                                <tr><td>L3 — Corbel depth (mm)</td><td><input type="number" id="cb-L3" value="500" step="10"></td><td class="st-formula">total depth</td></tr>
                                <tr><td>b — Width (mm)</td><td><input type="number" id="cb-b" value="1000" step="10"></td><td class="st-formula">corbel width</td></tr>
                                <tr><td>w — Bearing length (mm)</td><td><input type="number" id="cb-w" value="50" step="10"></td><td class="st-formula">bearing plate</td></tr>

                                <tr class="st-section-header"><td colspan="3">Concrete Cover</td></tr>
                                <tr><td>Cover top (mm)</td><td><input type="number" id="cb-cvr-top" value="50" step="5"></td><td></td></tr>
                                <tr><td>Cover bottom (mm)</td><td><input type="number" id="cb-cvr-btm" value="50" step="5"></td><td></td></tr>
                                <tr><td>Cover side (mm)</td><td><input type="number" id="cb-cvr-side" value="30" step="5"></td><td></td></tr>

                                <tr class="st-section-header"><td colspan="3">Material & Bars</td></tr>
                                <tr><td>f'c (MPa)</td><td><input type="number" id="cb-fc" value="50" step="5"></td><td></td></tr>
                                <tr><td>fsy (MPa)</td><td><input type="number" id="cb-fsy" value="500" step="10"></td><td></td></tr>
                                <tr><td>Tie AD bar</td><td><select id="cb-dAD">${barOpts}</select></td><td class="st-formula">U-bars at corbel</td></tr>
                                <tr><td>Tie BC bar</td><td><select id="cb-dBC">${barOpts}</select></td><td class="st-formula">stirrup tie</td></tr>
                                <tr><td>Bend diameter</td><td><select id="cb-bend"><option value="3">3d</option><option value="4">4d</option><option value="5" selected>5d</option></select></td><td class="st-formula">U-bar bend radius</td></tr>
                                <tr><td>φ tension (fst,t)</td><td><input type="number" id="cb-fst-t" value="0.85" step="0.05"></td><td></td></tr>
                                <tr><td>βs — Strut factor</td><td><input type="number" id="cb-bs" value="0.6" step="0.05"></td><td class="st-formula">bottle-shaped</td></tr>
                            </tbody>
                        </table>
                    </section>
                </div>

                <!-- RIGHT: Geometry Diagram -->
                <div class="st-right">
                    <section class="calc-card" style="display:flex; flex-direction:column; align-items:center;">
                        <div class="calc-card-title" style="color:#0284c7; font-weight:800;">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3h18v18H3z"/><line x1="3" y1="12" x2="21" y2="12"/></svg>
                            CORBEL STRUT & TIE MODEL
                        </div>
                        <div id="cb-diagram" style="width:100%; display:flex; justify-content:center; padding:10px 0;"></div>
                    </section>

                    <!-- Computed Geometry -->
                    <section class="calc-card">
                        <div class="calc-card-title" style="color:#4f46e5; font-weight:800;">COMPUTED GEOMETRY</div>
                        <table class="st-table">
                            <tbody>
                                <tr><td style="width:50%;">Bending dia (mm)</td><td style="text-align:center; font-weight:700; color:#1e40af;" id="cb-res-bendDia">—</td></tr>
                                <tr><td>Eccentricity e (mm)</td><td style="text-align:center; font-weight:700; color:#1e40af;" id="cb-res-e">—</td></tr>
                                <tr><td>L6 — effective depth (mm)</td><td style="text-align:center; font-weight:700; color:#1e40af;" id="cb-res-L6">—</td></tr>
                                <tr><td>a — lever arm (mm)</td><td style="text-align:center; font-weight:700; color:#1e40af;" id="cb-res-a">—</td></tr>
                                <tr style="border-top:2px solid var(--accent-primary);"><td style="font-weight:800;">θ — Strut angle (°)</td><td style="text-align:center; font-weight:800; color:#1e40af; font-size:1.1rem;" id="cb-res-theta">—</td></tr>
                            </tbody>
                        </table>
                    </section>
                </div>
            </div>

            <!-- RESULTS -->
            <div class="st-split" style="margin-bottom:24px;">
                <!-- LEFT: Truss Forces -->
                <div class="st-left">
                    <section class="calc-card">
                        <div class="calc-card-title" style="color:#dc2626; font-weight:800;">TRUSS MEMBER FORCES</div>
                        <table class="st-table" style="text-align:center;">
                            <thead><tr><th style="text-align:center;">Member</th><th style="text-align:center;">Type</th><th style="text-align:center;">Force (kN)</th></tr></thead>
                            <tbody>
                                <tr><td style="font-weight:700;">AB</td><td><span style="color:#dc2626; font-weight:700;">Compression</span></td><td style="font-weight:800; color:#1e40af; font-size:1.05rem;" id="cb-res-AB">—</td></tr>
                                <tr><td style="font-weight:700;">AD</td><td><span style="color:#059669; font-weight:700;">Tension</span></td><td style="font-weight:800; color:#1e40af; font-size:1.05rem;" id="cb-res-AD">—</td></tr>
                                <tr><td style="font-weight:700;">BC</td><td><span style="color:#059669; font-weight:700;">Tension</span></td><td style="font-weight:800; color:#1e40af; font-size:1.05rem;" id="cb-res-BC">—</td></tr>
                            </tbody>
                        </table>
                    </section>
                </div>

                <!-- RIGHT: Reinforcement -->
                <div class="st-right">
                    <section class="calc-card">
                        <div class="calc-card-title" style="color:#059669; font-weight:800;">REINFORCEMENT REQUIRED</div>
                        <table class="st-table" style="text-align:center;">
                            <thead><tr><th style="text-align:center;">Tie</th><th style="text-align:center;">As,req (mm²)</th><th style="text-align:center;">Bars</th><th style="text-align:center;">Description</th></tr></thead>
                            <tbody>
                                <tr><td style="font-weight:700;">AD</td><td style="font-weight:800; color:#1e40af;" id="cb-res-AsAD">—</td><td style="font-weight:800; color:#1e40af;" id="cb-res-nAD">—</td><td style="font-size:0.8rem; color:#6b7280;">U-bars at corbel top</td></tr>
                                <tr><td style="font-weight:700;">BC</td><td style="font-weight:800; color:#1e40af;" id="cb-res-AsBC">—</td><td style="font-weight:800; color:#1e40af;" id="cb-res-nBC">—</td><td style="font-size:0.8rem; color:#6b7280;">Stirrup ties</td></tr>
                            </tbody>
                        </table>
                    </section>
                </div>
            </div>

            <!-- Strut Check -->
            <section class="calc-card">
                <div class="calc-card-title" style="color:#dc2626; font-weight:800;">STRUT STRESS CHECK</div>
                <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:16px; text-align:center;">
                    <div style="background:var(--bg-secondary); border:1px solid var(--border-light); border-radius:var(--radius-md); padding:14px;">
                        <div style="font-size:0.78rem; color:#6b7280; margin-bottom:4px;">Max Strut Stress (f<sub>f'c</sub>)</div>
                        <div style="font-size:1.3rem; font-weight:800; color:#1e40af;" id="cb-res-ffc">—</div>
                        <div style="font-size:0.7rem; color:#9ca3af;">= 0.7 × 0.85 × βs × f'c (MPa)</div>
                    </div>
                    <div style="background:var(--bg-secondary); border:1px solid var(--border-light); border-radius:var(--radius-md); padding:14px;">
                        <div style="font-size:0.78rem; color:#6b7280; margin-bottom:4px;">Required Strut Thickness (t<sub>AB</sub>)</div>
                        <div style="font-size:1.3rem; font-weight:800; color:#1e40af;" id="cb-res-tAB">—</div>
                        <div style="font-size:0.7rem; color:#9ca3af;">= AB × 1000 / (f<sub>f'c</sub> × b) (mm)</div>
                    </div>
                    <div style="background:var(--bg-secondary); border:1px solid var(--border-light); border-radius:var(--radius-md); padding:14px;">
                        <div style="font-size:0.78rem; color:#6b7280; margin-bottom:4px;">Status</div>
                        <div style="font-size:1.3rem; font-weight:800;" id="cb-res-status">—</div>
                        <div style="font-size:0.7rem; color:#9ca3af;" id="cb-res-status-desc">t<sub>AB</sub> vs available depth</div>
                    </div>
                </div>
            </section>
        `;

        // Bind all inputs
        const cbInputs = [
            'cb-V','cb-N','cb-L1','cb-L3','cb-b','cb-w',
            'cb-cvr-top','cb-cvr-btm','cb-cvr-side',
            'cb-fc','cb-fsy','cb-fst-t','cb-bs'
        ];
        cbInputs.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.addEventListener('input', calcCorbel);
        });
        ['cb-dAD','cb-dBC','cb-bend'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.addEventListener('change', calcCorbel);
        });

        calcCorbel();
    }

    function drawCorbelDiagram(theta, L1, L3, L6, a_val) {
        const svgW = 360, svgH = 280;
        const colW = 80, corbH = 200, corbW = 180;
        const ox = 60, oy = 30;

        // Key points for strut-and-tie
        const Ax = ox + colW + corbW - 20; // load point (top-right)
        const Ay = oy + 20;
        const Bx = ox + colW + 10; // bottom-left (support)
        const By = oy + corbH - 10;
        const Dx = ox + colW + 10; // top-left (column face, top)
        const Dy = oy + 20;

        let svg = `<svg viewBox="0 0 ${svgW} ${svgH}" width="100%" style="max-width:360px;">`;

        // Column (grey)
        svg += `<rect x="${ox}" y="${oy - 10}" width="${colW}" height="${corbH + 40}" fill="#e5e7eb" stroke="#9ca3af" stroke-width="1" rx="2"/>`;
        // Corbel body
        svg += `<polygon points="${ox + colW},${oy} ${ox + colW + corbW},${oy} ${ox + colW + corbW},${oy + 60} ${ox + colW},${oy + corbH}" fill="#dbeafe" stroke="#2563eb" stroke-width="1.5" fill-opacity="0.6"/>`;

        // Strut AB (compression - red dashed)
        svg += `<line x1="${Ax}" y1="${Ay}" x2="${Bx}" y2="${By}" stroke="#dc2626" stroke-width="2.5" stroke-dasharray="6 3"/>`;
        svg += `<text x="${(Ax + Bx) / 2 + 14}" y="${(Ay + By) / 2 - 6}" fill="#dc2626" font-size="11" font-weight="800">AB</text>`;

        // Tie AD (tension - green solid)
        svg += `<line x1="${Ax}" y1="${Ay}" x2="${Dx}" y2="${Dy}" stroke="#059669" stroke-width="2.5"/>`;
        svg += `<text x="${(Ax + Dx) / 2}" y="${Dy - 6}" fill="#059669" font-size="11" font-weight="800" text-anchor="middle">AD (Tie)</text>`;

        // Tie BC (tension - green solid)
        svg += `<line x1="${Bx}" y1="${By}" x2="${Dx + corbW - 30}" y2="${By}" stroke="#059669" stroke-width="2" stroke-dasharray="4 2" opacity="0.5"/>`;
        svg += `<line x1="${Bx}" y1="${Dy}" x2="${Bx}" y2="${By}" stroke="#059669" stroke-width="2.5"/>`;
        svg += `<text x="${Bx - 14}" y="${(Dy + By) / 2 + 4}" fill="#059669" font-size="10" font-weight="700" text-anchor="end" writing-mode="tb">BC</text>`;

        // Load arrow V
        svg += `<line x1="${Ax}" y1="${Ay - 35}" x2="${Ax}" y2="${Ay - 5}" stroke="#1e40af" stroke-width="2.5"/>`;
        svg += `<polygon points="${Ax - 5},${Ay - 10} ${Ax + 5},${Ay - 10} ${Ax},${Ay - 2}" fill="#1e40af"/>`;
        svg += `<text x="${Ax + 6}" y="${Ay - 22}" fill="#1e40af" font-size="12" font-weight="800">V</text>`;

        // Angle θ arc
        const arcR = 30;
        const endAng = Math.PI - theta * Math.PI / 180;
        const startAng = Math.PI;
        const x1a = Bx + arcR * Math.cos(startAng);
        const y1a = By + arcR * Math.sin(startAng);
        const x2a = Bx + arcR * Math.cos(endAng);
        const y2a = By + arcR * Math.sin(endAng);
        svg += `<path d="M ${Bx - arcR} ${By} A ${arcR} ${arcR} 0 0 0 ${x2a} ${y2a}" fill="none" stroke="#d97706" stroke-width="1.5"/>`;
        svg += `<text x="${Bx - arcR - 6}" y="${By - 12}" fill="#d97706" font-size="11" font-weight="700">θ=${theta.toFixed(1)}°</text>`;

        // Dimension labels
        svg += `<text x="${ox + colW + corbW / 2}" y="${oy + corbH + 20}" fill="#6b7280" font-size="9" text-anchor="middle">a = ${a_val.toFixed(0)} mm</text>`;
        svg += `<text x="${ox + colW + corbW + 15}" y="${oy + corbH / 2}" fill="#6b7280" font-size="9" transform="rotate(90 ${ox + colW + corbW + 15} ${oy + corbH / 2})">L6 = ${L6.toFixed(0)}</text>`;

        // Nodes
        [{ x: Ax, y: Ay, l: 'A' }, { x: Bx, y: By, l: 'B' }, { x: Dx, y: Dy, l: 'D' }].forEach(n => {
            svg += `<circle cx="${n.x}" cy="${n.y}" r="5" fill="#4f46e5"/>`;
            svg += `<text x="${n.x + (n.l === 'D' ? -12 : 8)}" y="${n.y + 4}" fill="#4f46e5" font-size="11" font-weight="800">${n.l}</text>`;
        });

        svg += '</svg>';
        return svg;
    }

    function calcCorbel() {
        const V = parseFloat(document.getElementById('cb-V').value) || 0;
        const N = parseFloat(document.getElementById('cb-N').value) || 0;
        const L1 = parseFloat(document.getElementById('cb-L1').value) || 400;
        const L3 = parseFloat(document.getElementById('cb-L3').value) || 500;
        const b = parseFloat(document.getElementById('cb-b').value) || 1000;
        const w = parseFloat(document.getElementById('cb-w').value) || 50;
        const cvrTop = parseFloat(document.getElementById('cb-cvr-top').value) || 50;
        const cvrBtm = parseFloat(document.getElementById('cb-cvr-btm').value) || 50;
        const cvrSide = parseFloat(document.getElementById('cb-cvr-side').value) || 30;
        const fc = parseFloat(document.getElementById('cb-fc').value) || 50;
        const fsy = parseFloat(document.getElementById('cb-fsy').value) || 500;
        const dAD = parseInt(document.getElementById('cb-dAD').value) || 32;
        const dBC = parseInt(document.getElementById('cb-dBC').value) || 32;
        const bendF = parseInt(document.getElementById('cb-bend').value) || 5;
        const fst_t = parseFloat(document.getElementById('cb-fst-t').value) || 0.85;
        const bs = parseFloat(document.getElementById('cb-bs').value) || 0.6;

        // Derived
        const bendDia = bendF * dBC;
        const e = 0.5 * bendDia - (0.5 * bendDia + dBC / 2) / Math.sqrt(2);
        const L5_calc = cvrSide + dBC + e;
        const L6 = L3 - cvrTop - cvrBtm - 0.5 * dAD - dBC - e;
        const a_val = L1 + L5_calc;

        // Strut angle
        const theta_rad = Math.atan(L6 / a_val);
        const theta_deg = theta_rad * 180 / Math.PI;

        // Truss forces
        const sinTh = Math.sin(theta_rad);
        const cosTh = Math.cos(theta_rad);
        const AB = sinTh > 0 ? V / sinTh : 0;  // Compression
        const AD = N + AB * cosTh;               // Tension tie (horizontal)
        const BC = V;                             // Tension tie (vertical)

        // Reinforcement
        const As_AD = (fsy > 0 && fst_t > 0) ? AD * 1000 / (fsy * fst_t) : 0;
        const As_BC = (fsy > 0 && fst_t > 0) ? BC * 1000 / (fsy * fst_t) : 0;
        const A_bar_AD = Math.PI * dAD * dAD / 4;
        const A_bar_BC = Math.PI * dBC * dBC / 4;
        const n_AD = Math.ceil(As_AD / A_bar_AD);
        const n_BC = Math.ceil(As_BC / A_bar_BC);

        // Strut stress check
        const ffc = 0.7 * 0.85 * bs * fc;
        const tAB = (ffc > 0 && b > 0) ? AB * 1000 / (ffc * b) : 0;

        // Update UI
        document.getElementById('cb-res-bendDia').innerText = bendDia.toFixed(0);
        document.getElementById('cb-res-e').innerText = e.toFixed(1);
        document.getElementById('cb-res-L6').innerText = L6.toFixed(1);
        document.getElementById('cb-res-a').innerText = a_val.toFixed(1);
        document.getElementById('cb-res-theta').innerText = theta_deg.toFixed(1);

        document.getElementById('cb-res-AB').innerText = AB.toFixed(0);
        document.getElementById('cb-res-AD').innerText = AD.toFixed(0);
        document.getElementById('cb-res-BC').innerText = BC.toFixed(0);

        document.getElementById('cb-res-AsAD').innerText = As_AD.toFixed(0);
        document.getElementById('cb-res-AsBC').innerText = As_BC.toFixed(0);
        document.getElementById('cb-res-nAD').innerText = `${n_AD} N${dAD}`;
        document.getElementById('cb-res-nBC').innerText = `${n_BC} N${dBC}`;

        document.getElementById('cb-res-ffc').innerText = `${ffc.toFixed(2)} MPa`;
        document.getElementById('cb-res-tAB').innerText = `${tAB.toFixed(1)} mm`;

        const statusEl = document.getElementById('cb-res-status');
        const statusDescEl = document.getElementById('cb-res-status-desc');
        if (tAB <= L6 && L6 > 0) {
            statusEl.innerText = 'OK';
            statusEl.style.color = '#059669';
            statusDescEl.innerText = `tAB = ${tAB.toFixed(0)} mm ≤ L6 = ${L6.toFixed(0)} mm`;
        } else {
            statusEl.innerText = 'FAIL';
            statusEl.style.color = '#ef4444';
            statusDescEl.innerText = `tAB = ${tAB.toFixed(0)} mm > L6 = ${L6.toFixed(0)} mm — increase depth`;
        }

        // Draw diagram
        const diagEl = document.getElementById('cb-diagram');
        if (diagEl) diagEl.innerHTML = drawCorbelDiagram(theta_deg, L1, L3, L6, a_val);
    }

    // ─── Public API ───
    return { init, openTool, goHome, skipIntro };

})();

// Boot
document.addEventListener('DOMContentLoaded', App.init);
