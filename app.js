// App Logic for SuperTransportabilityMap (v3.0 Targeted Learning Engine)

document.addEventListener('DOMContentLoaded', () => {
    const map = L.map('map').setView([20, 0], 2);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { attribution: '&copy; CARTO' }).addTo(map);

    const btnCompute = document.getElementById('btnCompute');
    const globalScore = document.getElementById('globalScore');
    const yearSlider = document.getElementById('yearSelect');
    const yearDisplay = document.getElementById('yearDisplay');
    const centroids = { 'USA': [38, -97], 'IND': [20, 77], 'NGA': [9, 8], 'KEN': [0, 38], 'BRA': [-14, -51] };

    // Year slider live update
    yearSlider.addEventListener('input', () => { yearDisplay.textContent = yearSlider.value; });

    // Forest chart with CI error bars
    const ctxForest = document.getElementById('forestChart').getContext('2d');
    const forestChart = new Chart(ctxForest, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'TMLE Targeted HR',
                data: [],
                backgroundColor: '#a855f7',
                barThickness: 8
            }]
        },
        options: {
            indexAxis: 'y', responsive: true, maintainAspectRatio: false,
            scales: {
                x: {
                    min: 0.3, max: 2.2,
                    title: { display: true, text: 'Targeted HR (95% CI)', color: '#94a3b8' },
                    grid: { color: '#334155' },
                    ticks: { color: '#94a3b8' }
                },
                y: {
                    grid: { color: '#334155' },
                    ticks: { color: '#f8fafc' }
                }
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: (ctx) => {
                            const ci = ctx.dataset.ciData?.[ctx.dataIndex];
                            if (ci) return `HR ${ctx.raw.toFixed(2)} [${ci[0].toFixed(2)}, ${ci[1].toFixed(2)}]`;
                            return `HR ${ctx.raw.toFixed(2)}`;
                        }
                    }
                }
            }
        },
        plugins: [{
            id: 'ciWhiskers',
            afterDatasetsDraw(chart) {
                const dataset = chart.data.datasets[0];
                if (!dataset.ciData) return;
                const { ctx: c } = chart;
                const meta = chart.getDatasetMeta(0);
                c.save();
                c.strokeStyle = '#f8fafc';
                c.lineWidth = 1.5;
                dataset.ciData.forEach((ci, i) => {
                    const bar = meta.data[i];
                    if (!bar) return;
                    const y = bar.y;
                    const xLow = chart.scales.x.getPixelForValue(ci[0]);
                    const xHigh = chart.scales.x.getPixelForValue(ci[1]);
                    // Horizontal line
                    c.beginPath(); c.moveTo(xLow, y); c.lineTo(xHigh, y); c.stroke();
                    // Caps
                    c.beginPath(); c.moveTo(xLow, y - 4); c.lineTo(xLow, y + 4); c.stroke();
                    c.beginPath(); c.moveTo(xHigh, y - 4); c.lineTo(xHigh, y + 4); c.stroke();
                });
                // Reference line at HR=1
                const xOne = chart.scales.x.getPixelForValue(1.0);
                const area = chart.chartArea;
                c.strokeStyle = '#fbbf24';
                c.setLineDash([4, 4]);
                c.beginPath(); c.moveTo(xOne, area.top); c.lineTo(xOne, area.bottom); c.stroke();
                c.restore();
            }
        }]
    });

    // Radar chart for demographic distance
    const ctxRadar = document.getElementById('radarChart').getContext('2d');
    const radarChart = new Chart(ctxRadar, {
        type: 'radar',
        data: {
            labels: ['Age 65+ (%)', 'Urbanization (%)', 'Health Exp (% GDP)', 'Hospital Beds/1k'],
            datasets: [{
                label: 'Trial Population',
                data: [15.0, 80.0, 12.0, 4.0],
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.15)',
                pointBackgroundColor: '#3b82f6',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            scales: {
                r: {
                    angleLines: { color: '#334155' },
                    grid: { color: '#334155' },
                    pointLabels: { color: '#94a3b8', font: { size: 10 } },
                    ticks: { display: false },
                    suggestedMin: 0, suggestedMax: 100
                }
            },
            plugins: {
                legend: {
                    labels: { color: '#f8fafc', font: { size: 11 }, usePointStyle: true }
                }
            }
        }
    });

    let cachedData = null;

    const updateDashboard = (data) => {
        if (!data || !data.map_data) return;
        cachedData = data;

        // Clear old markers
        map.eachLayer((layer) => { if (layer instanceof L.CircleMarker) map.removeLayer(layer); });

        const sortedData = [...data.map_data].sort((a, b) => a.recalibrated_hr - b.recalibrated_hr);

        // Forest chart
        forestChart.data.labels = sortedData.map(d => d.iso3);
        forestChart.data.datasets[0].data = sortedData.map(d => d.recalibrated_hr);
        forestChart.data.datasets[0].ciData = sortedData.map(d => d.hr_ci);
        forestChart.update();

        // Radar chart — show selected country vs trial
        updateRadar(sortedData[0]);

        // Compute real global score: mean transportability propensity across countries
        const avgPi = data.map_data.reduce((s, d) => s + d.super_learner_pi, 0) / data.map_data.length;
        globalScore.textContent = (avgPi * 100).toFixed(0) + '%';
        globalScore.style.color = avgPi > 0.3 ? '#a855f7' : avgPi > 0.1 ? '#fbbf24' : '#ef4444';

        // Map markers
        sortedData.forEach(country => {
            const coord = centroids[country.iso3];
            if (!coord) return;

            let color = '#ef4444';
            if (country.super_learner_pi > 0.6) color = '#a855f7';
            else if (country.super_learner_pi > 0.2) color = '#fbbf24';

            const marker = L.circleMarker(coord, {
                radius: 6 + (country.readiness_score / 4),
                fillColor: color, color: color, weight: 1, fillOpacity: 0.7
            }).addTo(map)
              .bindPopup(`
                <div style="font-family: 'Courier New', monospace; font-size: 0.8rem; line-height: 1.2;">
                    <b style="color:#a855f7;">${country.iso3} | Targeted Learner</b><br>
                    -------------------------<br>
                    SMD (Covariate Bal): ${country.smd_avg.toFixed(4)}<br>
                    SuperLearner \u03c0(Z): ${country.super_learner_pi.toFixed(3)}<br>
                    Initial HR: ${country.hr_initial.toFixed(2)}<br>
                    <b>Targeted HR: ${country.recalibrated_hr.toFixed(2)}</b><br>
                    Targeted Gain \u0394\u03c8: ${(country.targeted_gain * 100).toFixed(1)}%<br>
                    EIF-based SE: ${country.influence_se.toFixed(4)}<br>
                    95% CI: [${country.hr_ci[0].toFixed(2)}, ${country.hr_ci[1].toFixed(2)}]<br>
                    -------------------------<br>
                    Health Readiness: ${Math.round(country.readiness_score)}%
                </div>
              `);

            // Click marker to update radar
            marker.on('click', () => updateRadar(country));
        });

        // Footer audit
        const footer = document.querySelector('.sidebar-footer');
        footer.innerHTML = `
            <p>E156 Targeted Learning (v3.0)</p>
            <p style="color:#a855f7; font-size:0.7rem;">TMLE + Super Learner Ensemble</p>
            <p style="color:#94a3b8; font-size:0.6rem;">Efficient Influence Function optimized</p>
            <p style="color:#3b82f6; font-size:0.6rem;">TruthCert: ${data.audit.ihme_hash.substring(0, 12)}...</p>
        `;
    };

    const updateRadar = (country) => {
        const targetValues = [
            country.pop_65plus_pct,
            country.urbanization,
            country.health_exp_gdp ?? (country.readiness_score / 5),
            country.hospital_beds_per_1000 ?? (country.readiness_score / 50)
        ];

        // Update or add target dataset
        if (radarChart.data.datasets.length < 2) {
            radarChart.data.datasets.push({
                label: `${country.iso3} Target`,
                data: targetValues,
                borderColor: '#a855f7',
                backgroundColor: 'rgba(168, 85, 247, 0.15)',
                pointBackgroundColor: '#a855f7',
                borderWidth: 2
            });
        } else {
            radarChart.data.datasets[1].label = `${country.iso3} Target`;
            radarChart.data.datasets[1].data = targetValues;
        }
        radarChart.update();
    };

    btnCompute.addEventListener('click', async () => {
        btnCompute.textContent = 'Computing TMLE...';
        btnCompute.disabled = true;
        try {
            const response = await fetch('transportability_data.json');
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data = await response.json();
            updateDashboard(data);
        } catch (e) {
            console.error(e);
            globalScore.textContent = 'Error';
            globalScore.style.color = '#ef4444';
        } finally {
            btnCompute.textContent = 'Compute Transportability';
            btnCompute.disabled = false;
        }
    });

    btnCompute.click();
});
