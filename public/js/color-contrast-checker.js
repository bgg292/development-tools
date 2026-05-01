document.addEventListener('DOMContentLoaded', function() {
    const inputArea = document.getElementById('tool-in');
    const runButton = document.getElementById('tool-run');
    const copyButton = document.getElementById('tool-copy');
    const outputArea = document.getElementById('tool-out');

    runButton.addEventListener('click', function() {
        const colors = inputArea.value.split('\n').map(color => color.trim());
        if (colors.length !== 2) {
            outputArea.textContent = 'Please provide two hex color codes.';
            return;
        }

        const [color1, color2] = colors;
        const contrastRatio = calculateContrast(color1, color2);
        const result = contrastRatio >= 4.5 ? 'Pass' : 'Fail';
        outputArea.textContent = `Contrast Ratio: ${contrastRatio.toFixed(2)} (${result})`;
    });

    copyButton.addEventListener('click', function() {
        navigator.clipboard.writeText(outputArea.textContent).then(() => {
            alert('Result copied to clipboard!');
        }).catch(err => {
            console.error('Could not copy text: ', err);
        });
    });

    function calculateContrast(hex1, hex2) {
        const rgb1 = hexToRgb(hex1);
        const rgb2 = hexToRgb(hex2);
        const luminance1 = getLuminance(rgb1);
        const luminance2 = getLuminance(rgb2);
        return (luminance1 > luminance2)
            ? (luminance1 + 0.05) / (luminance2 + 0.05)
            : (luminance2 + 0.05) / (luminance1 + 0.05);
    }

    function hexToRgb(hex) {
        const bigint = parseInt(hex.replace(/^#/, ''), 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return { r, g, b };
    }

    function getLuminance({ r, g, b }) {
        const a = [r, g, b].map(c => {
            c /= 255;
            return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        });
        return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
    }
});