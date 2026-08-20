/* =============================================
   PT Spacing & Rate Calculator
   ============================================= */

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
