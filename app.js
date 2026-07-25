const API_KEY = process.env.GEMINI_API_KEY || window.GEMINI_API_KEY;
// لە شوێنی فراخوانی مستقیم لە Gemini، ئەم کۆدە بەکاربهێنە:
window.analyzeData = async function() {
    const drugName = document.getElementById('drugName').value;
    const imageInput = document.getElementById('imageInput').files[0];
    const loading = document.getElementById('loading');
    const resultBox = document.getElementById('result');
    const resultContent = document.getElementById('resultContent');

    if (!drugName && !imageInput && !capturedImageBase64) {
        alert("تکایە زانیارییەک بنووسە یان وێنەیەک بگرە!");
        return;
    }

    loading.classList.remove('hidden');
    resultBox.classList.add('hidden');

    try {
        let imageB64 = capturedImageBase64;
        if (!imageB64 && imageInput) {
            imageB64 = await convertBase64(imageInput);
        }

        const prompt = `
        You are an expert pharmacist AI assistant. Analyze this drug/medication and provide details ONLY in ${translations[currentLang].promptLang}:
        1. Daily Dosage (mg & times per day).
        2. Drug & Food Interactions (What to mix / What NOT to mix).
        3. Indications (Diseases/conditions it treats).
        4. Common Side Effects.
        5. Contraindications (Diseases/conditions where it should NOT be given).
        `;

        // ناردنی داواکاری بۆ Backend
        const response = await fetch('/api/gemini', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                prompt: prompt,
                drugName: drugName,
                imageBase64: imageB64
            })
        });

        const data = await response.json();
        
        if (data.error) throw new Error(data.error);

        resultContent.innerText = data.text;
        resultBox.classList.remove('hidden');

    } catch (error) {
        console.error(error);
        alert("هەڵەیەک ڕوویدا لە شیکردنەوەدا!");
    } finally {
        loading.classList.add('hidden');
    }
};
