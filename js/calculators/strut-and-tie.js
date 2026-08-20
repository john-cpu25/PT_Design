/* =============================================
   Strut & Tie Calculator (AS3600-2018)
   ============================================= */

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
