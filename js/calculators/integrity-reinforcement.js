/* =============================================
   Integrity Reinforcement Calculator (AS3600-2018 Cl 9.2)
   ============================================= */

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
        <div style="display:grid; grid-template-columns: 320px 1fr; gap:10px; height: calc(100vh - 130px); max-height: calc(100vh - 130px);">
            <!-- LEFT PANEL: Input + Sets + Ld -->
            <div style="display:flex; flex-direction:column; gap:6px; overflow-y:auto; min-height:0;">
                <section class="calc-card" style="padding:10px 14px;">
                    <div class="calc-card-title" style="color:#059669; font-weight:800; margin-bottom:6px; font-size:0.75rem;">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/></svg>
                        INPUT & CODE PARAMETERS
                    </div>
                    <table class="st-table st-input-table" style="font-size:0.74rem;">
                        <colgroup><col style="width:40%"><col style="width:35%"><col style="width:25%"></colgroup>
                        <tbody>
                            <tr><td>Fz (kN)</td><td><input type="number" id="ir-Fz" value="520" step="10"></td><td class="st-formula st-note">reaction</td></tr>
                            <tr><td>φ</td><td><input type="number" id="ir-phi" value="0.70" step="0.05"></td><td class="st-formula">Cl 9.2</td></tr>
                            <tr><td>fsy (MPa)</td><td><input type="number" id="ir-fsy" value="500" step="10"></td><td class="st-formula">yield</td></tr>
                            <tr class="st-highlight-row" style="background:#fefce8; border-top:2px solid var(--accent-primary);">
                                <td style="font-weight:800; color:#1e40af;">As,req (mm²)</td>
                                <td class="st-out-val st-highlight" id="ir-res-Asreq" style="font-size:1rem;">2971</td>
                                <td class="st-formula" style="font-size:0.58rem;">= 2×Fz×1000/(φ×fsy)</td>
                            </tr>
                        </tbody>
                    </table>
                </section>

                <!-- AS3600 Note -->
                <section class="calc-card" style="padding:8px 12px; background: linear-gradient(135deg, #EEF2FF, #F5F3FF); text-align:center;">
                    <div style="font-size:0.68rem; font-weight:700; color:#0284c7; margin-bottom:4px;">AS3600-2018 Cl 9.2</div>
                    <div style="font-size:0.72rem; font-weight:700; color:#1e40af;">Continuous bottom rebar through column core</div>
                    <div style="font-size:0.62rem; color:#6b7280; margin-top:2px;">Tying force = 2 × Fz / φ</div>
                </section>

                <!-- 4 Sets compact -->
                <section class="calc-card" style="padding:8px 12px;">
                    <div style="font-size:0.68rem; font-weight:800; color:#4f46e5; margin-bottom:6px;">4 COLUMN CONNECTION SETS</div>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px;">
                        <div style="background:var(--bg-secondary); border:1px solid var(--border-light); border-radius:6px; padding:6px; text-align:center;">
                            <svg viewBox="0 0 140 110" width="60" height="45"><rect x="52" y="24" width="36" height="62" fill="#bfdbfe" fill-opacity="0.6" stroke="#2563eb" stroke-width="1.5" rx="2" /><line x1="62" y1="6" x2="62" y2="104" stroke="#1d4ed8" stroke-width="2.5" /><line x1="78" y1="6" x2="78" y2="104" stroke="#1d4ed8" stroke-width="2.5" /><line x1="8" y1="40" x2="132" y2="40" stroke="#1d4ed8" stroke-width="2.5" /><line x1="8" y1="55" x2="132" y2="55" stroke="#1d4ed8" stroke-width="2.5" /><line x1="8" y1="70" x2="132" y2="70" stroke="#1d4ed8" stroke-width="2.5" /></svg>
                            <div style="font-weight:800; color:#4f46e5; font-size:0.65rem;">SET 1: 4 SIDES</div>
                            <div style="font-size:0.58rem; color:#1e40af;">2×N<sub>L</sub>A + 2×N<sub>T</sub>A</div>
                        </div>
                        <div style="background:var(--bg-secondary); border:1px solid var(--border-light); border-radius:6px; padding:6px; text-align:center;">
                            <svg viewBox="0 0 140 110" width="60" height="45"><rect x="52" y="24" width="36" height="62" fill="#bfdbfe" fill-opacity="0.6" stroke="#2563eb" stroke-width="1.5" rx="2" /><line x1="62" y1="6" x2="62" y2="86" stroke="#1d4ed8" stroke-width="2.5" /><line x1="78" y1="6" x2="78" y2="86" stroke="#1d4ed8" stroke-width="2.5" /><line x1="8" y1="40" x2="132" y2="40" stroke="#1d4ed8" stroke-width="2.5" /><line x1="8" y1="55" x2="132" y2="55" stroke="#1d4ed8" stroke-width="2.5" /><line x1="8" y1="70" x2="132" y2="70" stroke="#1d4ed8" stroke-width="2.5" /></svg>
                            <div style="font-weight:800; color:#0284c7; font-size:0.65rem;">SET 2: 3 LONG</div>
                            <div style="font-size:0.58rem; color:#1e40af;">1×N<sub>L</sub>A + 2×N<sub>T</sub>A</div>
                        </div>
                        <div style="background:var(--bg-secondary); border:1px solid var(--border-light); border-radius:6px; padding:6px; text-align:center;">
                            <svg viewBox="0 0 140 110" width="60" height="45"><rect x="52" y="24" width="36" height="62" fill="#bfdbfe" fill-opacity="0.6" stroke="#2563eb" stroke-width="1.5" rx="2" /><line x1="62" y1="6" x2="62" y2="104" stroke="#1d4ed8" stroke-width="2.5" /><line x1="78" y1="6" x2="78" y2="104" stroke="#1d4ed8" stroke-width="2.5" /><line x1="52" y1="40" x2="132" y2="40" stroke="#1d4ed8" stroke-width="2.5" /><line x1="52" y1="55" x2="132" y2="55" stroke="#1d4ed8" stroke-width="2.5" /><line x1="52" y1="70" x2="132" y2="70" stroke="#1d4ed8" stroke-width="2.5" /></svg>
                            <div style="font-weight:800; color:#d97706; font-size:0.65rem;">SET 3: 3 SHORT</div>
                            <div style="font-size:0.58rem; color:#1e40af;">2×N<sub>L</sub>A + 1×N<sub>T</sub>A</div>
                        </div>
                        <div style="background:var(--bg-secondary); border:1px solid var(--border-light); border-radius:6px; padding:6px; text-align:center;">
                            <svg viewBox="0 0 140 110" width="60" height="45"><rect x="52" y="24" width="36" height="62" fill="#bfdbfe" fill-opacity="0.6" stroke="#2563eb" stroke-width="1.5" rx="2" /><line x1="62" y1="6" x2="62" y2="86" stroke="#1d4ed8" stroke-width="2.5" /><line x1="78" y1="6" x2="78" y2="86" stroke="#1d4ed8" stroke-width="2.5" /><line x1="52" y1="40" x2="132" y2="40" stroke="#1d4ed8" stroke-width="2.5" /><line x1="52" y1="55" x2="132" y2="55" stroke="#1d4ed8" stroke-width="2.5" /><line x1="52" y1="70" x2="132" y2="70" stroke="#1d4ed8" stroke-width="2.5" /></svg>
                            <div style="font-weight:800; color:#059669; font-size:0.65rem;">SET 4: 2 SIDES</div>
                            <div style="font-size:0.58rem; color:#1e40af;">1×N<sub>L</sub>A + 1×N<sub>T</sub>A</div>
                        </div>
                    </div>
                </section>

                <!-- Ld Table compact -->
                <section class="calc-card" style="padding:8px 12px;">
                    <div style="font-size:0.68rem; font-weight:800; color:#0284c7; margin-bottom:4px;">DEVELOPMENT LENGTH (Ld)</div>
                    <table class="st-table" style="text-align:center; font-size:0.7rem;">
                        <thead>
                            <tr><th>Bar</th><th>Area</th><th>Ld (mm)</th><th>Ext. (mm)</th></tr>
                        </thead>
                        <tbody>
                            <tr><td><strong>N12</strong></td><td>113</td><td>960</td><td style="font-weight:700; color:#1e40af;">1000</td></tr>
                            <tr><td><strong>N16</strong></td><td>201</td><td>1280</td><td style="font-weight:700; color:#1e40af;">1300</td></tr>
                            <tr><td><strong>N20</strong></td><td>314</td><td>1600</td><td style="font-weight:700; color:#1e40af;">1600</td></tr>
                            <tr><td><strong>N24</strong></td><td>452</td><td>1920</td><td style="font-weight:700; color:#1e40af;">2000</td></tr>
                            <tr><td><strong>N28</strong></td><td>616</td><td>2240</td><td style="font-weight:700; color:#1e40af;">2300</td></tr>
                            <tr><td><strong>N32</strong></td><td>804</td><td>2560</td><td style="font-weight:700; color:#1e40af;">2600</td></tr>
                            <tr><td><strong>N36</strong></td><td>1018</td><td>2880</td><td style="font-weight:700; color:#1e40af;">2900</td></tr>
                            <tr><td><strong>N40</strong></td><td>1257</td><td>2880</td><td style="font-weight:700; color:#1e40af;">2900</td></tr>
                        </tbody>
                    </table>
                    <div style="font-size:0.6rem; color:#9ca3af; margin-top:4px;">* Ld = 2 × 40 × db</div>
                </section>
            </div>

            <!-- RIGHT PANEL: Section Schedule (scrollable) -->
            <div style="display:flex; flex-direction:column; min-height:0;">
                <section class="calc-card" style="flex:1; display:flex; flex-direction:column; min-height:0; padding:10px 14px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                        <div class="calc-card-title" style="color:#1e40af; font-weight:800; margin-bottom:0; font-size:0.75rem;">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                            COLUMN SECTIONS REINFORCEMENT SCHEDULE & INTEGRITY CHECK
                        </div>
                        <button class="btn btn-primary" id="ir-add-section-btn" style="padding:4px 12px; font-size:0.75rem; font-weight:600; display:flex; align-items:center; gap:6px;">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                            Add Section
                        </button>
                    </div>

                    <div style="flex:1; overflow-y:auto; min-height:0;">
                        <table class="st-table" id="ir-sections-table" style="width:100%;">
                            <thead style="position:sticky; top:0; z-index:1; background:var(--bg-card);">
                                <tr>
                                    <th style="width:14%;">Section</th>
                                    <th style="width:16%;">Longitudinal</th>
                                    <th style="width:16%;">Latitude (Transverse)</th>
                                    <th style="width:13%;">Set 1 (4-side)</th>
                                    <th style="width:13%;">Set 2 (3-long)</th>
                                    <th style="width:13%;">Set 3 (3-short)</th>
                                    <th style="width:13%;">Set 4 (2-side)</th>
                                    <th style="width:3%;"></th>
                                </tr>
                            </thead>
                            <tbody id="ir-sections-body">
                                <!-- Rendered dynamically by JS -->
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </div>
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
