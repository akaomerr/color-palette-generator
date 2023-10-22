const fileInput = document.getElementById('fileInput');
const imageCanvas = document.getElementById('imageCanvas');
const colorList = document.getElementById('colorList');
const confirmButton = document.getElementById('confirmButton');

fileInput.addEventListener('change', () => {
    confirmButton.style.display = 'block';
});

function calculateColorDistance(color1, color2) {
    const r1 = parseInt(color1.slice(1, 3), 16);
    const g1 = parseInt(color1.slice(3, 5), 16);
    const b1 = parseInt(color1.slice(5, 7), 16);
    const r2 = parseInt(color2.slice(1, 3), 16);
    const g2 = parseInt(color2.slice(3, 5), 16);
    const b2 = parseInt(color2.slice(5, 7), 16);

    return Math.sqrt(Math.pow(r1 - r2, 2) + Math.pow(g1 - g2, 2) + Math.pow(b1 - b2, 2));
}

confirmButton.addEventListener('click', () => {
    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function(event) {
        const image = new Image();
        image.src = event.target.result;

        image.onload = function() {
            imageCanvas.width = image.width;
            imageCanvas.height = image.height;
            const ctx = imageCanvas.getContext('2d');
            ctx.drawImage(image, 0, 0, image.width, image.height);

            const imageData = ctx.getImageData(0, 0, image.width, image.height).data;
            const colorSet = new Set();

            for (let i = 0; i < imageData.length; i += 4) {
                const rgba = `#${(imageData[i] << 16 | imageData[i + 1] << 8 | imageData[i + 2]).toString(16).padStart(6, '0')}`;
                colorSet.add(rgba);
            }

            const uniqueColors = Array.from(colorSet);

            const selectedColors = [uniqueColors[0]]; 

            for (let i = 1; i < uniqueColors.length; i++) {
                let isDistinct = true;
                for (let j = 0; j < selectedColors.length; j++) {
                    if (calculateColorDistance(uniqueColors[i], selectedColors[j]) < 50) {
                        isDistinct = false;
                        break;
                    }
                }
                if (isDistinct) {
                    selectedColors.push(uniqueColors[i]);
                }
                if (selectedColors.length >= 20) {
                    break;
                }
            }

            colorList.innerHTML = selectedColors.map(color => {
                const div = document.createElement('div');
                div.style.backgroundColor = color;
                div.textContent = color;
                return div.outerHTML;
            }).join('');
        };
    };

    reader.readAsDataURL(file);
});