document.addEventListener('DOMContentLoaded', function() {
    const inputArea = document.getElementById('tool-in');
    const runButton = document.getElementById('tool-run');
    const copyButton = document.getElementById('tool-copy');
    const outputDisplay = document.getElementById('tool-out');

    function getContrastRatio(color1, color2) {
        const luminance = (color) => {
            const rgb = parseInt(color.slice(1), 16);
            const r = (rgb >> 16) & 0xff;
            const g = (rgb >>  8) & 0xff;
            const b = (rgb >>  0) & 0xff;

            const a = [r, g, b].map(c => {
                c /= 255;
                return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
            });
            return (0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2]);
        };

        const lum1 = luminance(color1);
        const lum2 = luminance(color2);
        const ratio = (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05);
        return ratio.toFixed(2);
    }

    function checkContrast() {
        const colors = inputArea.value.split('\n').map(line => line.trim()).filter(Boolean);
        if (colors.length < 2) {
            outputDisplay.textContent = 'Please enter two colors.';
            return;
        }

        const [color1, color2] = colors;
        const contrastRatio = getContrastRatio(color1, color2);
        const result = `Contrast Ratio: ${contrastRatio}`;
        const passFail = (contrastRatio >= 7) ? ' (AA Pass)' : (contrastRatio >= 4.5) ? ' (AA Fail)' : ' (Fail)';
        outputDisplay.textContent = result + passFail;
    }

    function copyToClipboard() {
        const text = outputDisplay.textContent;
        navigator.clipboard.writeText(text).then(() => {
            alert('Copied to clipboard: ' + text);
        });
    }

    runButton.addEventListener('click', checkContrast);
    copyButton.addEventListener('click', copyToClipboard);
});