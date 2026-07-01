document.addEventListener('DOMContentLoaded', function() {
    const inputArea = document.getElementById('tool-in');
    const runButton = document.getElementById('tool-run');
    const copyButton = document.getElementById('tool-copy');
    const outputArea = document.getElementById('tool-out');

    function calculateContrast(foreground, background) {
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

        const lum1 = luminance(foreground);
        const lum2 = luminance(background);
        const ratio = (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05);
        return ratio.toFixed(2);
    }

    runButton.addEventListener('click', function() {
        const colors = inputArea.value.split('\n').map(line => line.trim());
        if (colors.length >= 2) {
            const contrastRatio = calculateContrast(colors[0], colors[1]);
            const result = `Contrast Ratio: ${contrastRatio} (${contrastRatio >= 4.5 ? 'Pass' : 'Fail'})`;
            outputArea.textContent = result;
        } else {
            outputArea.textContent = 'Please provide both foreground and background colors.';
        }
    });

    copyButton.addEventListener('click', function() {
        const resultText = outputArea.textContent;
        navigator.clipboard.writeText(resultText).then(() => {
            alert('Result copied to clipboard!');
        }).catch(err => {
            console.error('Could not copy text: ', err);
        });
    });
});