/* =============================================
   Punching Shear Calculator (AS3600)
   ============================================= */

function renderPunchingShear(container) {
    container.innerHTML = `
        <div class="segment-control" id="ps-type-selector">
            <button class="segment-btn active" data-type="internal">Internal Column</button>
            <button class="segment-btn" data-type="edge">Edge Column</button>
            <button class="segment-btn" data-type="corner">Corner Column</button>
        </div>

        <div class="st-split">
            <!-- LEFT: Diagram + Inputs -->
            <div class="st-left">
                <section class="calc-card">
                    <div class="calc-card-title">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
                        Shear Perimeter Diagram
                    </div>
                    <div id="ps-diagram-container" style="height: 200px; display: flex; justify-content: center; align-items: center; background: #fff; border: 1px solid var(--border-light); border-radius: var(--radius-md); overflow: hidden;">
                        <!-- SVG injected here -->
                    </div>
                </section>

                <section class="calc-card">
                    <div class="calc-card-title">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/></svg>
                        Geometry & Properties
                    </div>
                    <div class="calc-inputs" style="grid-template-columns: repeat(4, 1fr);">
                        <div class="calc-field">
                            <label for="ps-dim-x">Col X (mm)</label>
                            <input type="number" id="ps-dim-x" value="300" step="10">
                        </div>
                        <div class="calc-field">
                            <label for="ps-dim-y">Col Y (mm)</label>
                            <input type="number" id="ps-dim-y" value="300" step="10">
                        </div>
                        <div class="calc-field">
                            <label for="ps-depth">Slab D (mm)</label>
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
                            <label for="ps-reduction">Perim. Reduc. (mm)</label>
                            <input type="number" id="ps-reduction" value="0" step="10">
                        </div>
                    </div>
                </section>

                <section class="calc-card">
                    <div class="calc-card-title">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20"/><path d="m17 22-5-5-5 5"/><path d="m17 2-5 5-5-5"/></svg>
                        Loads & Reinforcement
                    </div>
                    <div class="calc-inputs" style="grid-template-columns: repeat(5, 1fr);">
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
                            <label for="ps-bar-3">3rd Bar Ø</label>
                            <input type="number" id="ps-bar-3" value="24" step="1">
                        </div>
                        <div class="calc-field">
                            <label for="ps-bar-4">4th Bar Ø</label>
                            <input type="number" id="ps-bar-4" value="24" step="1">
                        </div>
                    </div>
                </section>
            </div>

            <!-- RIGHT: Results + Status -->
            <div class="st-right">
                <section class="calc-card">
                    <div class="calc-card-title">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                        Results Summary
                    </div>
                    <div class="calc-output" style="border-top: none; padding-top: 0; margin-top: 0;">
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
                        <div style="border-top: 1px solid var(--border-light); margin: 8px 0;"></div>
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
                </section>
                
                <section class="calc-card calc-total-card">
                    <div class="calc-card-title" style="justify-content: center;">
                        Status
                    </div>
                    <div class="calc-total-value" id="ps-status" style="font-size: 2.5rem; letter-spacing: 0;">OK</div>
                    <p class="calc-total-unit" id="ps-status-desc">No shear reinforcement required</p>
                </section>
            </div>
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
