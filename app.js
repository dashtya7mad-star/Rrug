const API_KEY = "AQ.Ab8RN6K1HA-HFrWxsMdv7WP15ueamGFao0xHW2RVbpZVwcrgkw";

window.analyzeData = async function() {
    const drugName = document.getElementById('drugName').value;
    const imageInput = document.getElementById('imageInput').files[0];
    const loading = document.getElementById('loading');
    const resultBox = document.getElementById('result');
    const resultContent = document.getElementById('resultContent');

    if (!drugName && !imageInput && !window.capturedImageBase64) {
        alert("تكاية زانيارييةك بنووسة يان وينةيةك بگرة!");
        return;
    }

    loading.classList.remove('hidden');
    resultBox.classList.add('hidden');

    try {
        let imageB64 = window.capturedImageBase64;
        if (!imageB64 && imageInput) {
            imageB64 = await convertBase64(imageInput);
        }

        const promptText = `
You are an expert pharmacist AI assistant. Analyze this drug/medication and provide details:
1. Daily Dosage (mg & times per day).
2. Drug & Food Interactions (What to mix / What NOT to mix).
3. Indications (Diseases/conditions it treats).
4. Common Side Effects.
5. Contraindications (Diseases/conditions where it should NOT be given).
Drug Name: ${drugName || "Not provided"}
`;

        const contents = [{
            parts: [{ text: promptText }]
        }];

        if (imageB64) {
            const base64Data = imageB64.split(',')[1] || imageB64;
            contents[0].parts.push({
                inline_data: {
                    mime_type: "image/jpeg",
                    data: base64Data
                }
            });
        }

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents })
        });

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error.message);
        }

        const reply = data.candidates[0].content.parts[0].text;
        resultContent.innerText = reply;
        resultBox.classList.remove('hidden');

    } catch (error) {
        console.error(error);
        alert("هەڵەیەک ڕوویام لە شیکردنەوەدا! " + error.message);
    } finally {
        loading.classList.add('hidden');
    }
};

function convertBase64(file) {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = () => resolve(fileReader.result);
        fileReader.onerror = (error) => reject(error);
    });
}
const API_KEY = "AQ.Ab8RN6K1HA-HFrWxsMdv7WP15ueamGFao0xHW2RVbpZVwcrgkw";

window.analyzeData = async function() {
    const drugName = document.getElementById('drugName').value;
    const imageInput = document.getElementById('imageInput').files[0];
    const loading = document.getElementById('loading');
    const resultBox = document.getElementById('result');
    const resultContent = document.getElementById('resultContent');

    if (!drugName && !imageInput && !window.capturedImageBase64) {
        alert("تكاية زانيارييةك بنووسة يان وينةيةك بگرة!");
        return;
    }

    loading.classList.remove('hidden');
    resultBox.classList.add('hidden');

    try {
        let imageB64 = window.capturedImageBase64;
        if (!imageB64 && imageInput) {
            imageB64 = await convertBase64(imageInput);
        }

        const promptText = `
You are an expert pharmacist AI assistant. Analyze this drug/medication and provide details:
1. Daily Dosage (mg & times per day).
2. Drug & Food Interactions (What to mix / What NOT to mix).
3. Indications (Diseases/conditions it treats).
4. Common Side Effects.
5. Contraindications (Diseases/conditions where it should NOT be given).
Drug Name: ${drugName || "Not provided"}
`;

        const contents = [{
            parts: [{ text: promptText }]
        }];

        if (imageB64) {
            const base64Data = imageB64.split(',')[1] || imageB64;
            contents[0].parts.push({
                inline_data: {
                    mime_type: "image/jpeg",
                    data: base64Data
                }
            });
        }

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents })
        });

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error.message);
        }

        const reply = data.candidates[0].content.parts[0].text;
        resultContent.innerText = reply;
        resultBox.classList.remove('hidden');

    } catch (error) {
        console.error(error);
        alert("هەڵەیەک ڕوویام لە شیکردنەوەدا! " + error.message);
    } finally {
        loading.classList.add('hidden');
    }
};

function convertBase64(file) {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = () => resolve(fileReader.result);
        fileReader.onerror = (error) => reject(error);
    });
}
