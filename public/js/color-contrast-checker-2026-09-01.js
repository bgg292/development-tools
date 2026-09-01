document.addEventListener('DOMContentLoaded', function() {
    const toolIn = document.getElementById('tool-in');
    const toolRun = document.getElementById('tool-run');
    const toolCopy = document.getElementById('tool-copy');
    const toolOut = document.getElementById('tool-out');

    toolRun.addEventListener('click', function() {
        const colors = toolIn.value.split(',');
        if (colors.length !== 2) {
            toolOut.textContent = 'Please enter two colors separated by a comma.';
            return;
        }

        const color1 = colors[0].trim();
        const color2 = colors[1].trim();
        const contrastRatio = calculateContrast(color1, color2);
        const status = contrastRatio >= 4.5 ? 'Pass' : 'Fail';

        toolOut.textContent = `{'color1': '${color1}', 'color2': '${color2}', 'contrastRatio': '${contrastRatio}', 'status': '${status}'}`;
    });

    toolCopy.addEventListener('click', function() {
        const outputText = toolOut.textContent;
        navigator.clipboard.writeText(outputText).then(() => {
            alert('Output copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    });

    function calculateContrast(color1, color2) {
        const luminance = (color) => {
            const rgb = parseInt(color.replace('#', ''), 16);
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
        const ratio = lum1 > lum2 ? (lum1 + 0.05) / (lum2 + 0.05) : (lum2 + 0.05) / (lum1 + 0.05);
        
        return ratio.toFixed(2);
    }
});