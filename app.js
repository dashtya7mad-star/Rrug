import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

const API_KEY = "YOUR_GEMINI_API_KEY"; // Key ی خۆت لێرە دابنێ
const genAI = new GoogleGenerativeAI(API_KEY);

let currentLang = 'ckb';
let capturedImageBase64 = null;
let mediaStream = null;

// فەرهەنگی وەرگێڕانی ناوەڕۆکی لاپەڕەکە
const translations = {
    ckb: {
        dir: 'rtl',
        title: 'زانیاری دەرمان بە ژیریی دەستکرد',
        subtitle: 'ناوی دەرمان بنووسە یان ڕاستەوخۆ کامێرا بەکاربهێنە',
        placeholder: 'ناوی دەرمان...',
        upload: 'بارکردنی وێنە',
        camera: 'کردنەوەی کامێرا',
        capture: 'گرتنی وێنە',
        search: 'گەڕان و شیکردنەوە',
        loading: 'تکایە چاوەڕێ بکە، زانیارییەکان لە شیکردنەوەدان...',
        resultTitle: 'ئەنجامی شیکردنەوە:',
        disclaimer: '* ئاگاداری: ئەم زانیارییانە بۆ ڕێنمایی گشتیین. هەمیشە ڕاوێژ بە پزیشک بکە.',
        promptLang: 'زمانی کوردی'
    },
    ar: {
        dir: 'rtl',
        title: 'معلومات الدواء بالذكاء الاصطناعي',
        subtitle: 'اكتب اسم الدواء أو استخدم الكاميرا مباشرة',
        placeholder: 'اسم الدواء...',
        upload: 'رفع صورة',
        camera: 'فتح الكاميرا',
        capture: 'التقاط صورة',
        search: 'بحث وتحليل',
        loading: 'يرجى الانتظار، جاري التحليل...',
        resultTitle: 'نتيجة التحليل:',
        disclaimer: '* تنبيه: هذه المعلومات للإرشاد العام فقط. استشر الطبيب دائماً.',
        promptLang: 'اللغة العربية'
    },
    en: {
        dir: 'ltr',
        title: 'AI Medication Information',
        subtitle: 'Type drug name or use your camera directly',
        placeholder: 'Drug name...',
        upload: 'Upload Image',
        camera: 'Open Camera',
        capture: 'Take Photo',
        search: 'Search & Analyze',
        loading: 'Please wait, analyzing data...',
        resultTitle: 'Analysis Result:',
        disclaimer: '* Disclaimer: This information is for general guidance. Always consult a doctor.',
        promptLang: 'English'
    }
};

window.changeLanguage = function(lang) {
    currentLang = lang;
    const t = translations[lang];
    
    document.getElementById('htmlTag').dir = t.dir;
    document.getElementById('title').innerText = t.title;
    document.getElementById('subtitle').innerText = t.subtitle;
    document.getElementById('drugName').placeholder = t.placeholder;
    document.getElementById('uploadLabel').innerText = t.upload;
    document.getElementById('cameraBtn').innerText = t.camera;
    document.getElementById('captureBtn').innerText = t.capture;
    document.getElementById('searchBtn').innerText = t.search;
    document.getElementById('loading').innerText = t.loading;
    document.getElementById('resultTitle').innerText = t.resultTitle;
    document.getElementById('disclaimer').innerText = t.disclaimer;
};

// ڕێکخستنی کامێرا
window.toggleCamera = async function() {
    const cameraContainer = document.getElementById('cameraContainer');
    const video = document.getElementById('webcam');

    if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
        mediaStream = null;
        cameraContainer.classList.add('hidden');
    } else {
        try {
            mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
            video.srcObject = mediaStream;
            cameraContainer.classList.remove('hidden');
        } catch (err) {
            alert("نەتوانرا کامێرا بکڕێتەوە / Cannot access camera");
        }
    }
};

window.capturePhoto = function() {
    const video = document.getElementById('webcam');
    const canvas = document.getElementById('canvas');
    const preview = document.getElementById('imagePreview');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);

    capturedImageBase64 = canvas.toDataURL('image/jpeg');
    preview.src = capturedImageBase64;
    preview.classList.remove('hidden');

    toggleCamera(); // بەستنی کامێرا دوای وێنەگرتن
};

// شیکردنەوە لە ڕێگەی Gemini
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
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
        You are an expert pharmacist AI assistant. Analyze this drug/medication and provide details ONLY in ${translations[currentLang].promptLang}:
        1. Daily Dosage (mg & times per day).
        2. Drug & Food Interactions (What to mix / What NOT to mix).
        3. Indications (Diseases/conditions it treats).
        4. Common Side Effects.
        5. Contraindications (Diseases/conditions where it should NOT be given).
        `;

        let contents = [prompt];

        if (drugName) contents.push(`Drug Name: ${drugName}`);

        if (capturedImageBase64) {
            contents.push({
                inlineData: {
                    data: capturedImageBase64.split(',')[1],
                    mimeType: "image/jpeg"
                }
            });
        } else if (imageInput) {
            const base64 = await convertBase64(imageInput);
            contents.push({
                inlineData: {
                    data: base64.split(',')[1],
                    mimeType: imageInput.type
                }
            });
        }

        const result = await model.generateContent(contents);
        const response = await result.response;

        resultContent.innerText = response.text();
        resultBox.classList.remove('hidden');

    } catch (error) {
        console.error(error);
        alert("هەڵەیەک ڕوویدا لە شیکردنەوەدا!");
    } finally {
        loading.classList.add('hidden');
    }
};

function convertBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
}
