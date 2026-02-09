document.addEventListener('DOMContentLoaded', function() {
    const input = document.getElementById('tool-in');
    const runButton = document.getElementById('tool-run');
    const copyButton = document.getElementById('tool-copy');
    const output = document.getElementById('tool-out');

    function calculateContrast(color1, color2) {
        const luminance = (color) => {
            const rgb = parseInt(color.slice(1), 16);
            const r = (rgb >> 16) & 0xff;
            const g = (rgb >>  8) & 0xff;
            const b = (rgb >>  0) & 0xff;

            const a = [r, g, b].map(c => {
                c /= 255;
                return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
            });
            return (0.2126 * a[0]) + (0.7152 * a[1]) + (0.0722 * a[2]);
        };

        const lum1 = luminance(color1);
        const lum2 = luminance(color2);
        const ratio = lum1 > lum2 ? (lum1 + 0.05) / (lum2 + 0.05) : (lum2 + 0.05) / (lum1 + 0.05);
        return ratio.toFixed(2);
    }

    function updateOutput() {
        const colors = input.value.split(',');
        if (colors.length === 2) {
            const color1 = colors[0].trim();
            const color2 = colors[1].trim();
            const contrastRatio = calculateContrast(color1, color2);
            output.textContent = `Contrast Ratio: ${contrastRatio}:1 (${contrastRatio >= 4.5 ? 'Pass' : 'Fail'})`;
        } else {
            output.textContent = 'Please enter two colors in the format: #FFFFFF, #000000';
        }
    }

    runButton.addEventListener('click', updateOutput);

    copyButton.addEventListener('click', function() {
        navigator.clipboard.writeText(output.textContent).then(() => {
            alert('Copied to clipboard!');
        }).catch(err => {
            console.error('Could not copy text: ', err);
        });
    });
});