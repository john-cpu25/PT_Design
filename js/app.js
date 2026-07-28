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
            icon: '📐',
            iconClass: 'icon-indigo',
            tags: [{ text: 'Structural', cls: 'tag-structural' }, { text: 'PT Design', cls: 'tag-design' }],
            render: renderPTSpacingRate,
            headerIcon: 'icon-indigo',
        },
        {
            id: 'punching-shear',
            name: 'Punching Shear Check',
            desc: 'Kiểm tra chọc thủng cho sàn phẳng bê tông cốt thép / ứng lực trước theo AS3600.',
            icon: '🏢',
            iconClass: 'icon-emerald',
            tags: [{ text: 'Structural', cls: 'tag-structural' }],
            render: renderPunchingShear,
            headerIcon: 'icon-emerald',
        },
        // Future tools can be added here:
        // {
        //     id: 'pt-loss',
        //     name: 'PT Loss Calculator',
        //     desc: 'Tính tổn hao ứng suất trong cáp ứng lực trước.',
        //     icon: '📉',
        //     iconClass: 'icon-amber',
        //     tags: [{ text: 'Analysis', cls: 'tag-analysis' }],
        //     render: renderPTLoss,
        //     headerIcon: 'icon-amber',
        // },
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

        // When video ends, fade out intro
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
                <div class="tool-icon ${tool.iconClass}">${tool.icon}</div>
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
                <div class="tool-header-icon ${tool.headerIcon}">${tool.icon}</div>
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
        window.scrollTo({ top: 0, behavior: 'smooth' });
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

        window.scrollTo({ top: 0, behavior: 'smooth' });
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

    // ─── Public API ───
    return { init, openTool, goHome, skipIntro };

})();

// Boot
document.addEventListener('DOMContentLoaded', App.init);
