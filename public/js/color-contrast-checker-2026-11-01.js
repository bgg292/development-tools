document.addEventListener('DOMContentLoaded', function() {
    const inputArea = document.getElementById('tool-in');
    const runButton = document.getElementById('tool-run');
    const copyButton = document.getElementById('tool-copy');
    const outputArea = document.getElementById('tool-out');

    function calculateContrast(color1, color2) {
        const luminance = (color) => {
            const rgb = parseInt(color.slice(1), 16);
            const r = ((rgb >> 16) & 0xff) / 255;
            const g = ((rgb >> 8) & 0xff) / 255;
            const b = (rgb & 0xff) / 255;

            const a = [r, g, b].map(c => {
                return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
            });

            return (0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2]);
        };

        const lum1 = luminance(color1);
        const lum2 = luminance(color2);
        const ratio = lum1 > lum2 ? (lum1 + 0.05) / (lum2 + 0.05) : (lum2 + 0.05) / (lum1 + 0.05);
        
        return ratio.toFixed(2);
    }

    function checkContrast() {
        const colors = inputArea.value.split(',');
        if (colors.length === 2) {
            const color1 = colors[0].trim();
            const color2 = colors[1].trim();
            const contrastRatio = calculateContrast(color1, color2);
            outputArea.textContent = `Contrast Ratio: ${contrastRatio} (AA, AAA)`;
        } else {
            outputArea.textContent = 'Please enter two colors in the format: #FFFFFF, #000000';
        }
    }

    function copyToClipboard() {
        const text = outputArea.textContent;
        navigator.clipboard.writeText(text).then(() => {
            alert('Copied to clipboard: ' + text);
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    }

    runButton.addEventListener('click', checkContrast);
    copyButton.addEventListener('click', copyToClipboard);
});