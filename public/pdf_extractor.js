const pdfFileInput = document.getElementById('pdfFile');
const extractBtn = document.getElementById('extractBtn');
const pdfContent = document.getElementById('pdfContent');
const downloadBtn = document.getElementById('downloadBtn');

let generatedHTML = '';

extractBtn.addEventListener('click', async () => {
    const apiKey = document.getElementById('apiKey').value;
    const pdfFile = pdfFileInput.files[0];

    if (!apiKey || !pdfFile) {
        alert("Please provide both an API key and a PDF file.");
        return;
    }

    var drop = document.getElementById('api_select');
    var dropval = drop.value;
    if(drop === null)
    {
        dropval = 'google_gemini'
    }
    
    pdfContent.innerHTML = '';
    downloadBtn.style.display = 'none';

    const formData = new FormData();
    formData.append('apiselect', dropval)
    formData.append('apiKey', apiKey);
    formData.append('pdfFile', pdfFile);

    try {
        const response = await fetch('https://ai-powered-html-resume-generator.vercel.app/extract-pdf', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Failed to extract PDF or generate resume');
        }

        const result = await response.json();
        generatedHTML = result.htmlResume;
        pdfContent.innerHTML = generatedHTML;

        downloadBtn.style.display = 'inline';

    } catch (error) {
        pdfContent.textContent = 'Error: ' + error.message;
    }
});

downloadBtn.addEventListener('click', () => {
    const blob = new Blob([generatedHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'resume.html'; 
    a.click();

    URL.revokeObjectURL(url);
});