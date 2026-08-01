document.addEventListener('DOMContentLoaded', function() {
    const input = document.getElementById('tool-in');
    const runButton = document.getElementById('tool-run');
    const copyButton = document.getElementById('tool-copy');
    const output = document.getElementById('tool-out');

    runButton.addEventListener('click', function() {
        const colors = input.value.split(',');
        if (colors.length !== 2) {
            output.textContent = 'Please enter two colors in the format: #FFFFFF, #000000';
            return;
        }

        const [color1, color2] = colors.map(color => color.trim());
        const contrastRatio = calculateContrast(color1, color2);
        const status = contrastRatio >= 4.5 ? 'Pass' : 'Fail';

        output.textContent = JSON.stringify({
            color1: color1,
            color2: color2,
            contrastRatio: contrastRatio.toFixed(1) + ':1',
            status: status
        });
    });

    copyButton.addEventListener('click', function() {
        const textToCopy = output.textContent;
        navigator.clipboard.writeText(textToCopy).then(() => {
            alert('Copied to clipboard!');
        }, () => {
            alert('Failed to copy text.');
        });
    });

    function calculateContrast(hex1, hex2) {
        const rgb1 = hexToRgb(hex1);
        const rgb2 = hexToRgb(hex2);
        const luminance1 = getLuminance(rgb1);
        const luminance2 = getLuminance(rgb2);
        const contrast = (Math.max(luminance1, luminance2) + 0.05) / (Math.min(luminance1, luminance2) + 0.05);
        return contrast;
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