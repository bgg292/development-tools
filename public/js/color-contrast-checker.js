document.addEventListener('DOMContentLoaded', function() {
    const inputArea = document.getElementById('tool-in');
    const runButton = document.getElementById('tool-run');
    const copyButton = document.getElementById('tool-copy');
    const outputDisplay = document.getElementById('tool-out');

    runButton.addEventListener('click', function() {
        const colors = inputArea.value.split(',');
        if (colors.length !== 2) {
            outputDisplay.textContent = 'Please enter two hex colors separated by a comma.';
            return;
        }

        const contrastRatio = calculateContrast(colors[0].trim(), colors[1].trim());
        const result = contrastRatio >= 4.5 ? 'Pass' : 'Fail';
        outputDisplay.textContent = `Contrast Ratio: ${contrastRatio.toFixed(2)} (${result})`;
    });

    copyButton.addEventListener('click', function() {
        navigator.clipboard.writeText(outputDisplay.textContent)
            .then(() => {
                alert('Result copied to clipboard!');
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
            });
    });

    function calculateContrast(color1, color2) {
        const luminance1 = getLuminance(hexToRgb(color1));
        const luminance2 = getLuminance(hexToRgb(color2));
        const ratio = (Math.max(luminance1, luminance2) + 0.05) / (Math.min(luminance1, luminance2) + 0.05);
        return ratio;
    }

    function hexToRgb(hex) {
        let r = 0, g = 0, b = 0;
        if (hex.length === 7) {
            r = parseInt(hex.slice(1, 3), 16);
            g = parseInt(hex.slice(3, 5), 16);
            b = parseInt(hex.slice(5, 7), 16);
        }
        return [r, g, b];
    }

    function getLuminance(rgb) {
        const [r, g, b] = rgb.map(c => {
            c /= 255;
            return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    }
});