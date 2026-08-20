/* =============================================
   Corbel Design (Strut & Tie Model)
   ============================================= */

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
