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

        function calculatePS() {
            const dimX = parseFloat(document.getElementById('ps-dim-x').value) || 0;
            const dimY = parseFloat(document.getElementById('ps-dim-y').value) || 0;
            const depth = parseFloat(document.getElementById('ps-depth').value) || 0;
            const cover = parseFloat(document.getElementById('ps-cover').value) || 0;
            const fc = parseFloat(document.getElementById('ps-fc').value) || 0;
            const fcp = parseFloat(document.getElementById('ps-fcp').value) || 0;
            
            const v = parseFloat(document.getElementById('ps-v').value) || 0;
            const mx = parseFloat(document.getElementById('ps-mx').value) || 0;
            const my = parseFloat(document.getElementById('ps-my').value) || 0;
            const bar3 = parseFloat(document.getElementById('ps-bar-3').value) || 0;
            const bar4 = parseFloat(document.getElementById('ps-bar-4').value) || 0;

            const do_eff = depth - cover - Math.max(bar3, bar4);
            
            let u = 0;
            if (currentType === 'internal') {
                u = 2 * (dimX + dimY) + Math.PI * do_eff;
            } else if (currentType === 'edge') {
                u = 2 * dimX + dimY + (Math.PI / 2) * do_eff;
            } else if (currentType === 'corner') {
                u = dimX + dimY + (Math.PI / 4) * do_eff;
            }

            const fcv = 0.17 * Math.sqrt(fc) + 0.3 * fcp;
            const phi = 0.75; // AS3600 capacity reduction factor
            
            const fVuo = phi * fcv * u * do_eff / 1000;
            const fVumax = 0.2 * fc * u * do_eff / 1000 * phi;
            
            // Simplified M*v calculation for the demo
            const M_v = Math.sqrt(mx*mx + my*my);
            const m_factor = 1 + (M_v * 1000 / (v * Math.max(dimX, dimY) || 1));
            const fVu = v * Math.min(m_factor, 1.5); // Cap to 1.5 for basic estimation

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
