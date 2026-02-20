/* ========= Task 5.2: KARANLIK / AYDINLIK MOD ========= */

const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Sayfa yüklendiğinde hafızadaki temayı kontrol et
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    body.classList.add(savedTheme);
    if (savedTheme === 'dark-mode') {
        if(themeToggle) themeToggle.classList.replace('fa-moon', 'fa-sun');
    }
}

// Butona tıklandığında temayı değiştir
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');

        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark-mode');
            themeToggle.classList.replace('fa-moon', 'fa-sun');
        } else {
            localStorage.removeItem('theme'); 
            themeToggle.classList.replace('fa-sun', 'fa-moon');
        }
    });
}


/* ========= Task 5.3: DÖVİZ ÇEVİRİCİ (MICRO APP) ========= */

const amountInput = document.getElementById('amount');
const fromCurrencySelect = document.getElementById('from-currency');
const resultDiv = document.getElementById('converter-result');

// ÇOK DAHA GÜVENİLİR VE ANLIK GÜNCELLENEN YENİ API
const API_URL = 'https://open.er-api.com/v6/latest';

// Eğer sayfada döviz çevirici modülü varsa bu kodlar çalışsın
if (amountInput && fromCurrencySelect && resultDiv) {
    
    async function convertCurrency() {
        // Kullanıcının girdiği miktarı al (Örn: 500)
        const amount = parseFloat(amountInput.value); 
        const fromCurrency = fromCurrencySelect.value;

        // Geçersiz bir değer girilirse uyarı ver
        if (!amount || amount <= 0) {
            resultDiv.innerHTML = `<p style="color:var(--text-muted);">Lütfen geçerli bir miktar girin.</p>`;
            return;
        }

        // Yükleniyor efekti
        resultDiv.innerHTML = `<p style="color:var(--text-muted);">Güncel kurlar hesaplanıyor...</p>`;

        try {
            // Seçtiğimiz para biriminin (Örn: TRY) güncel verilerini çek
            const response = await fetch(`${API_URL}/${fromCurrency}`);
            const data = await response.json();
            
            // Ekranda görmek istediğimiz hedefler
            const targetCurrencies = ['TRY', 'USD', 'EUR'];
            
            let resultHTML = `<p style="color:var(--text-muted);">${amount} ${fromCurrency} anlık karşılığı:</p>`;
            
            // Hedef kurları dön ve ekrana yaz
            targetCurrencies.forEach(currency => {
                // Seçilen para birimini kendisine çevirmesine gerek yok (Örn: TRY -> TRY gösterme)
                if (currency !== fromCurrency && data.rates[currency]) {
                    
                    // İŞTE ÇÖZÜM: Girilen miktar ile API'den gelen anlık kuru ÇARPIYORUZ!
                    const calculatedValue = amount * data.rates[currency];
                    
                    // .toLocaleString() ile sayıları 500.00 gibi şık bir formatta yazdırıyoruz
                    resultHTML += `
                        <h2 style="color:var(--primary-color); margin:10px 0;">
                            ${calculatedValue.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency}
                        </h2>
                    `;
                }
            });

            // Sonucu ekrana bas
            resultDiv.innerHTML = resultHTML;

        } catch (error) {
            console.error('Döviz API Hatası:', error);
            resultDiv.innerHTML = `<p style="color:red;">Üzgünüz, sunucudan veri alınamadı.</p>`;
        }
    }

    // Kullanıcı sayı yazdıkça veya para birimi değiştirdikçe anında hesapla
    amountInput.addEventListener('input', convertCurrency);
    fromCurrencySelect.addEventListener('change', convertCurrency);
    
    // Sayfa ilk açıldığında da 500 üzerinden hesaplayıp göstersin
    document.addEventListener('DOMContentLoaded', convertCurrency);
}