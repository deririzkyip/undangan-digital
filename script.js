// LOGIKA UTAMA UNDANGAN DIGITAL - TEMA BIRU
// Romeo & Juliet Wedding

document.addEventListener('DOMContentLoaded', () => {
    // 1. PARSING NAMA TAMU DARI URL PARAMETER (?to=Nama+Tamu)
    const getQueryParam = (param) => {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    };

    // Bersihkan ucapan otomatis jika ada parameter ?clear=1 di URL
    if (getQueryParam('clear') === '1' || getQueryParam('clear') === 'true') {
        localStorage.setItem('wedding_wishes', '[]');
        const url = new URL(window.location.href);
        url.searchParams.delete('clear');
        window.history.replaceState({}, '', url.toString());
        setTimeout(() => {
            Swal.fire({
                icon: 'success',
                title: 'Dibersihkan!',
                text: 'Semua doa & ucapan telah dihapus dari browser ini.',
                confirmButtonColor: '#1B3A6B'
            });
        }, 100);
    }

    const rawGuestName = getQueryParam('to');
    const guestNameElement = document.getElementById('guest-name');
    const inputNameElement = document.getElementById('input-name');

    if (rawGuestName) {
        const cleanName = decodeURIComponent(rawGuestName.replace(/\+/g, ' '));
        guestNameElement.textContent = cleanName;
        if (inputNameElement) {
            inputNameElement.value = cleanName;
        }
    } else {
        guestNameElement.textContent = "Tamu Undangan";
    }

    // 2. BUKA UNDANGAN & PLAY MUSIK
    const btnOpenInvitation = document.getElementById('btn-open-invitation');
    const coverScreen = document.getElementById('cover-screen');
    const mainContent = document.getElementById('main-content');
    const bgMusic = document.getElementById('bg-music');
    const musicIcon = document.getElementById('music-icon');

    if (bgMusic) {
        bgMusic.volume = 0.6;
    }

    btnOpenInvitation.addEventListener('click', () => {
        coverScreen.classList.add('slide-up');
        mainContent.classList.add('visible');

        if (bgMusic) {
            bgMusic.play().then(() => {
                console.log("Musik diputar.");
            }).catch(error => {
                console.log("Autoplay dicegah browser: ", error);
            });
        }

        startFallingPetals();
        initScrollAnimations();

        setTimeout(() => {
            coverScreen.style.display = 'none';
        }, 1000);
    });

    // 3. KONTROL AUDIO (PLAY/PAUSE)
    const btnMusicToggle = document.getElementById('btn-music-toggle');
    let isMusicPlaying = true;

    if (btnMusicToggle && bgMusic) {
        btnMusicToggle.addEventListener('click', () => {
            if (isMusicPlaying) {
                bgMusic.pause();
                musicIcon.classList.remove('fa-spin');
                musicIcon.classList.replace('fa-compact-disc', 'fa-play');
                isMusicPlaying = false;
            } else {
                bgMusic.play();
                musicIcon.classList.add('fa-spin');
                musicIcon.classList.replace('fa-play', 'fa-compact-disc');
                isMusicPlaying = true;
            }
        });
    }

    // 4. COUNTDOWN TIMER (12 Oktober 2026)
    const targetDate = new Date("September 12, 2026 08:00:00").getTime();

    const updateCountdown = () => {
        const now = new Date().getTime();
        const difference = targetDate - now;

        if (difference < 0) {
            document.getElementById('days').textContent = "00";
            document.getElementById('hours').textContent = "00";
            document.getElementById('minutes').textContent = "00";
            document.getElementById('seconds').textContent = "00";
            return;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        document.getElementById('days').textContent = days < 10 ? '0' + days : days;
        document.getElementById('hours').textContent = hours < 10 ? '0' + hours : hours;
        document.getElementById('minutes').textContent = minutes < 10 ? '0' + minutes : minutes;
        document.getElementById('seconds').textContent = seconds < 10 ? '0' + seconds : seconds;
    };

    setInterval(updateCountdown, 1000);
    updateCountdown();

    // 5. ANIMASI SCROLL (FADE IN/UP)
    const initScrollAnimations = () => {
        const animatedElements = document.querySelectorAll('.animate-on-scroll');

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { root: null, threshold: 0.1, rootMargin: '0px' });

        animatedElements.forEach(el => observer.observe(el));
    };

    // 6. ANIMASI GUGURAN KELOPAK (FALLING PETALS - BIRU)
    const startFallingPetals = () => {
        const container = document.getElementById('petals-container');
        if (!container) return;
        for (let i = 0; i < 25; i++) {
            createPetal(container);
        }
    };

    const createPetal = (container) => {
        const petal = document.createElement('div');
        petal.classList.add('petal');

        const left = Math.random() * 100;
        const size = Math.random() * 12 + 8;
        const duration = Math.random() * 12 + 8;
        const delay = Math.random() * -20;
        const opacity = Math.random() * 0.5 + 0.25;

        petal.style.left = `${left}%`;
        petal.style.width = `${size}px`;
        petal.style.height = `${size}px`;
        petal.style.animationDuration = `${duration}s`;
        petal.style.animationDelay = `${delay}s`;
        petal.style.opacity = opacity;

        // Variasi warna biru muda
        const blues = ['#90CAF9', '#64B5F6', '#42A5F5', '#BBDEFB', '#E3F2FD'];
        const randomBlue = blues[Math.floor(Math.random() * blues.length)];
        petal.style.backgroundColor = randomBlue;

        container.appendChild(petal);

        petal.addEventListener('animationiteration', () => {
            petal.style.left = `${Math.random() * 100}%`;
            petal.style.animationDuration = `${Math.random() * 12 + 8}s`;
        });
    };

    // 7. LIGHTBOX GALLERY
    const galleryImages = [
        "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600",
        "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=600",
        "https://images.unsplash.com/photo-1519225495810-7517c24a2828?q=80&w=600",
        "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=600",
        "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=600",
        "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=80&w=600"
    ];
    let currentImgIdx = 0;

    window.openLightbox = (index) => {
        currentImgIdx = index;
        document.getElementById('lightbox').style.display = "block";
        document.getElementById('lightbox-img').src = galleryImages[currentImgIdx];
        document.getElementById('lightbox-caption').innerHTML = `Foto Momen Bahagia ke-${currentImgIdx + 1}`;
        document.body.style.overflow = "hidden";
    };

    window.closeLightbox = () => {
        document.getElementById('lightbox').style.display = "none";
        document.body.style.overflow = "auto";
    };

    window.prevLightbox = (event) => {
        event.stopPropagation();
        currentImgIdx = (currentImgIdx - 1 + galleryImages.length) % galleryImages.length;
        document.getElementById('lightbox-img').src = galleryImages[currentImgIdx];
        document.getElementById('lightbox-caption').innerHTML = `Foto Momen Bahagia ke-${currentImgIdx + 1}`;
    };

    window.nextLightbox = (event) => {
        event.stopPropagation();
        currentImgIdx = (currentImgIdx + 1) % galleryImages.length;
        document.getElementById('lightbox-img').src = galleryImages[currentImgIdx];
        document.getElementById('lightbox-caption').innerHTML = `Foto Momen Bahagia ke-${currentImgIdx + 1}`;
    };

    document.addEventListener('keydown', (e) => {
        if (e.key === "Escape") closeLightbox();
    });

    // 8. BUKU TAMU / RSVP & UCAPAN
    const rsvpForm = document.getElementById('rsvp-form');
    const wishesContainer = document.getElementById('wishes-container');
    const wishesCount = document.getElementById('wishes-count');

    const defaultWishes = [];

    const getWishes = () => {
        const saved = localStorage.getItem('wedding_wishes');
        if (saved) return JSON.parse(saved);
        localStorage.setItem('wedding_wishes', JSON.stringify(defaultWishes));
        return defaultWishes;
    };

    const sanitizeHTML = (str) => {
        return str.replace(/[&<>'"]/g, tag => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
        }[tag] || tag));
    };

    const renderWishes = () => {
        const wishes = getWishes();
        wishesCount.textContent = wishes.length;

        if (wishes.length === 0) {
            wishesContainer.innerHTML = `
                <div class="empty-wishes text-center">
                    <i class="fa-solid fa-comments"></i>
                    <p>Belum ada ucapan. Jadilah yang pertama memberikan doa restu!</p>
                </div>`;
            return;
        }

        wishesContainer.innerHTML = [...wishes].reverse().map(wish => {
            let badgeClass = 'hadir';
            if (wish.attendance === 'Tidak Hadir') badgeClass = 'tidak-hadir';
            if (wish.attendance === 'Ragu-ragu') badgeClass = 'ragu-ragu';
            return `
                <div class="wish-bubble">
                    <div class="wish-header">
                        <span class="wish-name">${sanitizeHTML(wish.name)}</span>
                        <span class="wish-badge ${badgeClass}">${wish.attendance}</span>
                    </div>
                    <p class="wish-message">${sanitizeHTML(wish.message)}</p>
                    <div class="wish-time">${wish.time}</div>
                </div>`;
        }).join('');
    };

    if (rsvpForm) {
        rsvpForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('input-name').value.trim();
            const attendance = document.getElementById('input-attendance').value;
            const guests = document.getElementById('input-guests').value;
            const message = document.getElementById('input-message').value.trim();

            if (!name || !attendance || !message) {
                Swal.fire({ icon: 'error', title: 'Oops...', text: 'Mohon lengkapi semua kolom form!', confirmButtonColor: '#1B3A6B' });
                return;
            }

            const todayStr = new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
            const newWish = { name, attendance, guests: parseInt(guests), message, time: todayStr };

            const btnSubmit = document.getElementById('btn-submit-rsvp');
            const originalBtnContent = btnSubmit.innerHTML;
            btnSubmit.disabled = true;
            btnSubmit.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> Mengirim...`;

            const GOOGLE_SCRIPT_URL = localStorage.getItem('google_sheet_url') || "";
            let sheetOk = false;

            if (GOOGLE_SCRIPT_URL) {
                try {
                    const formData = new URLSearchParams();
                    formData.append('nama', name);
                    formData.append('kehadiran', attendance);
                    formData.append('jumlah_tamu', guests);
                    formData.append('ucapan', message);
                    await fetch(GOOGLE_SCRIPT_URL, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: formData.toString() });
                    sheetOk = true;
                } catch (err) { console.error("Gagal kirim ke Sheets:", err); }
            }

            const current = getWishes();
            current.push(newWish);
            localStorage.setItem('wedding_wishes', JSON.stringify(current));

            rsvpForm.reset();
            if (rawGuestName) {
                inputNameElement.value = decodeURIComponent(rawGuestName.replace(/\+/g, ' '));
            }
            renderWishes();

            btnSubmit.disabled = false;
            btnSubmit.innerHTML = originalBtnContent;

            let alertMsg = 'Ucapan Anda berhasil disimpan!';
            if (GOOGLE_SCRIPT_URL && sheetOk) alertMsg = 'Konfirmasi & ucapan berhasil dikirim ke Google Sheets!';
            else if (GOOGLE_SCRIPT_URL && !sheetOk) alertMsg = 'Ucapan disimpan lokal, tapi gagal terhubung ke Google Sheets.';

            Swal.fire({ icon: 'success', title: 'Terima Kasih!', text: alertMsg, confirmButtonColor: '#1B3A6B' });
        });
    }

    renderWishes();
});
