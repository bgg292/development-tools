document.addEventListener('DOMContentLoaded', function() {
    const inputArea = document.getElementById('tool-in');
    const runButton = document.getElementById('tool-run');
    const copyButton = document.getElementById('tool-copy');
    const outputArea = document.getElementById('tool-out');

    runButton.addEventListener('click', function() {
        const baseColor = inputArea.value.trim();
        const hue = 0; // Placeholder for hue adjustment
        const saturation = 100; // Placeholder for saturation adjustment
        const brightness = 100; // Placeholder for brightness adjustment

        const palette = generatePalette(baseColor, hue, saturation, brightness);
        outputArea.textContent = palette.join(', ');
    });

    copyButton.addEventListener('click', function() {
        const outputText = outputArea.textContent;
        navigator.clipboard.writeText(outputText).then(() => {
            alert('Palette copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    });

    function generatePalette(baseColor, hue, saturation, brightness) {
        // Simple palette generation logic (placeholder)
        return [
            baseColor,
            adjustColor(baseColor, 30),
            adjustColor(baseColor, 60),
            adjustColor(baseColor, 90),
            adjustColor(baseColor, 120)
        ];
    }

    function adjustColor(color, adjustment) {
        // Placeholder function to adjust color
        return color; // In a real implementation, this would return a new color
    }
});