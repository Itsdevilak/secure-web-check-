document.addEventListener('DOMContentLoaded', () => {
    // Initialize Particles.js if available
    if (window.particlesJS) {
        particlesJS("particles-js", {
            "particles": {
                "number": { "value": 80, "density": { "enable": true, "value_area": 800 } },
                "color": { "value": "#00f2ff" },
                "shape": { "type": "circle" },
                "opacity": { "value": 0.5, "random": false },
                "size": { "value": 3, "random": true },
                "line_linked": { "enable": true, "distance": 150, "color": "#00f2ff", "opacity": 0.2, "width": 1 },
                "move": { "enable": true, "speed": 2, "direction": "none", "random": false, "straight": false, "out_mode": "out", "bounce": false }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": { "onhover": { "enable": true, "mode": "repulse" }, "onclick": { "enable": true, "mode": "push" }, "resize": true },
                "modes": { "repulse": { "distance": 100, "duration": 0.4 } }
            },
            "retina_detect": true
        });
    }

    // Initialize VanillaTilt
    if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll(".glass-card"), {
            max: 10,
            speed: 400,
            glare: true,
            "max-glare": 0.2,
        });
    }

    // Form Handling
    const form = document.getElementById('analyze-form');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const urlInput = document.getElementById('url-input');
            const btnText = document.getElementById('btn-text');
            const btnLoader = document.getElementById('btn-loader');
            const resultsContainer = document.getElementById('results-container');
            const errorMsg = document.getElementById('error-msg');
            const terminalOutput = document.getElementById('terminal-output');
            const terminalLines = document.getElementById('terminal-lines'); // Ensure this element exists

            // Reset UI
            errorMsg.classList.add('hidden');
            resultsContainer.classList.add('hidden');
            if (terminalOutput) {
                terminalOutput.classList.add('hidden');
                if (terminalLines) terminalLines.innerHTML = '';
            }
            resultsContainer.innerHTML = '';

            const formData = new FormData();
            formData.append('url', urlInput.value);

            try {
                // Start Loading / Terminal Effect
                btnText.textContent = 'Processing...';
                btnLoader.classList.remove('hidden');

                if (terminalOutput && terminalLines) {
                    terminalOutput.classList.remove('hidden');
                    // Simulation steps
                    await addTerminalLine('> Initializing connection to target...', 400);
                    await addTerminalLine(`> Target identified: ${urlInput.value}`, 600);
                    await addTerminalLine('> Verifying SSL/TLS handshake...', 800);
                    await addTerminalLine('> Scanning HTTP headers for vulnerabilities...', 800);
                    await addTerminalLine('> Analyzing server response metrics...', 600);
                    await addTerminalLine('> Compiling security report...', 1000);
                }

                const response = await fetch('/api/analyze', {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();

                if (data.error) {
                    throw new Error(data.error);
                }

                if (terminalOutput && terminalLines) {
                    await addTerminalLine('> ANALYSIS COMPLETE. RENDERING REPORT.', 500);
                }

                // Hide terminal after a brief pause and show results
                setTimeout(() => {
                    if (terminalOutput) terminalOutput.classList.add('hidden');
                    renderResults(data);
                    resultsContainer.classList.remove('hidden');
                }, 800);


            } catch (error) {
                errorMsg.textContent = error.message || 'An error occurred during analysis.';
                errorMsg.classList.remove('hidden');
                if (terminalOutput) terminalOutput.classList.add('hidden');
            } finally {
                btnText.textContent = 'Analyze';
                btnLoader.classList.add('hidden');
            }
        });
    }
});

function renderResults(data) {
    const container = document.getElementById('results-container');

    const scoreColor = data.score > 80 ? 'text-green-400' : (data.score > 50 ? 'text-yellow-400' : 'text-red-400');

    let html = `
        <div class="border-t border-white/10 pt-8 animate-fade-in-up">
            <div class="flex items-center justify-between mb-8">
                <div>
                    <h3 class="text-2xl font-bold mb-2">Analysis Results</h3>
                    <a href="${data.url}" target="_blank" class="text-cyber-blue hover:underline text-sm">${data.url}</a>
                </div>
                <div class="text-right">
                    <div class="text-4xl font-bold ${scoreColor}">${data.score}/100</div>
                    <div class="text-xs text-gray-400 uppercase tracking-wider">Security Score</div>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Status Card -->
                <div class="bg-black/30 p-6 rounded-lg border border-white/5">
                    <h4 class="text-gray-400 text-sm uppercase mb-4 font-semibold">Server Status</h4>
                    <div class="space-y-3">
                        <div class="flex justify-between">
                            <span>Status Code</span>
                            <span class="${data.status_code === 200 ? 'text-green-400' : 'text-red-400'} font-mono">${data.status_code}</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Response Time</span>
                            <span class="font-mono text-cyber-blue">${data.response_time}ms</span>
                        </div>
                        <div class="flex justify-between">
                            <span>HTTPS</span>
                            <span class="${data.https ? 'text-green-400' : 'text-red-400'} font-mono">${data.https ? 'Secure' : 'Insecure'}</span>
                        </div>
                    </div>
                </div>

                <!-- SEO Card -->
                <div class="bg-black/30 p-6 rounded-lg border border-white/5">
                    <h4 class="text-gray-400 text-sm uppercase mb-4 font-semibold">SEO Meta</h4>
                    <div class="space-y-3">
                        <div>
                            <span class="text-xs text-gray-500 block">Title</span>
                            <p class="text-sm line-clamp-1" title="${data.seo.title}">${data.seo.title}</p>
                        </div>
                        <div>
                            <span class="text-xs text-gray-500 block">Description</span>
                            <p class="text-sm text-gray-300 line-clamp-2" title="${data.seo.description}">${data.seo.description}</p>
                        </div>
                    </div>
                </div>

                <!-- Headers Card -->
                <div class="bg-black/30 p-6 rounded-lg border border-white/5 md:col-span-2">
                    <h4 class="text-gray-400 text-sm uppercase mb-4 font-semibold">Security Headers</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        ${Object.entries(data.headers).map(([key, value]) => `
                            <div class="flex justify-between items-center border-b border-white/5 pb-2">
                                <span class="text-sm text-gray-300">${key}</span>
                                <span class="text-xs font-mono px-2 py-1 rounded ${value !== 'Missing' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}">
                                    ${value !== 'Missing' ? 'Present' : 'Missing'}
                                </span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;

    container.innerHTML = html;
}

async function addTerminalLine(text, delay) {
    const lines = document.getElementById('terminal-lines');
    if (!lines) return;

    const line = document.createElement('div');
    line.className = 'typing-cursor';
    line.textContent = text;
    lines.appendChild(line);

    // Auto scroll
    const container = document.getElementById('terminal-output');
    if (container) container.scrollTop = container.scrollHeight;

    await new Promise(r => setTimeout(r, delay));

    // Remove cursor effect from previous line
    line.classList.remove('typing-cursor');
}
