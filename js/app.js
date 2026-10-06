document.addEventListener('DOMContentLoaded', () => {
    // Khởi tạo Mô-đun Đếm Thời Gian
    const loveCounter = new LoveCounter();

    // Render Dữ Liệu Ban Đầu
    document.getElementById('couple-names').innerText = LOVE_CONFIG.coupleNames;
    document.getElementById('quote-subtitle').innerText = LOVE_CONFIG.subtitle;
    document.getElementById('special-letter-content').innerHTML = SPECIAL_LETTER_TEXT;

    initHeartsBackground();
    initLoginSystem();
    initNotesSystem();
    initGallerySystem();

    // Event Confetti
    document.getElementById('confetti-btn').addEventListener('click', triggerConfetti);

    // Lightbox Modal Image Close
    document.getElementById('close-image-modal-btn').addEventListener('click', () => {
        document.getElementById('image-modal').classList.add('hidden');
    });
});

/* LOGIN SYSTEM */
function initLoginSystem() {
    const loginForm = document.getElementById('login-form');
    const logoutBtn = document.getElementById('logout-btn');

    const checkState = () => {
        const isLoggedIn = localStorage.getItem('is_logged_in') === 'true' || sessionStorage.getItem('is_logged_in') === 'true';
        if (isLoggedIn) {
            document.getElementById('login-screen').classList.add('hidden');
            document.getElementById('main-content').classList.remove('hidden');
        } else {
            document.getElementById('login-screen').classList.remove('hidden');
            document.getElementById('main-content').classList.add('hidden');
        }
    };

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const user = document.getElementById('login-username').value.trim();
        const pass = document.getElementById('login-password').value.trim();
        const remember = document.getElementById('remember-me').checked;
        const errorDiv = document.getElementById('login-error');

        if (user === LOVE_CONFIG.credentials.username && pass === LOVE_CONFIG.credentials.password) {
            errorDiv.classList.add('hidden');
            if (remember) localStorage.setItem('is_logged_in', 'true');
            else sessionStorage.setItem('is_logged_in', 'true');

            checkState();
            triggerConfetti();
        } else {
            errorDiv.classList.remove('hidden');
        }
    });

    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('is_logged_in');
        sessionStorage.removeItem('is_logged_in');
        checkState();
    });

    checkState();
}

/* FLOATING HEARTS EFFECT */
function initHeartsBackground() {
    const container = document.getElementById('hearts-container');
    const icons = ['fa-heart', 'fa-heart-pulse'];
    const colors = ['#f43f5e', '#fb7185', '#fda4af', '#e11d48'];

    for (let i = 0; i < 20; i++) {
        const heart = document.createElement('i');
        heart.className = `fa-solid ${icons[Math.floor(Math.random() * icons.length)]} heart-particle`;
        heart.style.left = `${Math.random() * 100}vw`;
        heart.style.animationDuration = `${5 + Math.random() * 7}s`;
        heart.style.animationDelay = `${Math.random() * 5}s`;
        heart.style.fontSize = `${12 + Math.random() * 18}px`;
        heart.style.color = colors[Math.floor(Math.random() * colors.length)];
        heart.style.opacity = Math.random() * 0.7 + 0.3;
        container.appendChild(heart);
    }
}

/* DAILY NOTES SYSTEM */
function initNotesSystem() {
    let customNotes = JSON.parse(localStorage.getItem('love_custom_notes') || '[]');

    const getRandomNote = () => {
        const allNotes = [...DEFAULT_NOTES, ...customNotes];
        const randomText = allNotes[Math.floor(Math.random() * allNotes.length)];
        const noteEl = document.getElementById('daily-note-text');
        
        noteEl.style.opacity = 0;
        setTimeout(() => {
            noteEl.innerText = randomText;
            noteEl.style.opacity = 1;
        }, 200);
    };

    document.getElementById('random-note-btn').addEventListener('click', getRandomNote);
    document.getElementById('toggle-note-form-btn').addEventListener('click', () => {
        document.getElementById('custom-note-form').classList.toggle('hidden');
    });

    document.getElementById('save-note-btn').addEventListener('click', () => {
        const input = document.getElementById('custom-note-input');
        const val = input.value.trim();
        if (!val) return;

        customNotes.push(val);
        localStorage.setItem('love_custom_notes', JSON.stringify(customNotes));
        input.value = '';
        document.getElementById('custom-note-form').classList.add('hidden');
        document.getElementById('daily-note-text').innerText = val;
    });

    getRandomNote();
}

/* GALLERY SYSTEM */
function initGallerySystem() {
    let galleryImages = JSON.parse(localStorage.getItem('love_gallery_images') || '[]');

    const render = () => {
        const container = document.getElementById('gallery-container');
        const emptyMsg = document.getElementById('empty-gallery-msg');
        container.innerHTML = '';

        if (galleryImages.length === 0) {
            const defaults = [
                "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=500&q=80",
                "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=500&q=80",
                "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=500&q=80"
            ];
            defaults.forEach((src) => container.appendChild(createCard(src, false)));
            emptyMsg.classList.add('hidden');
        } else {
            emptyMsg.classList.add('hidden');
            galleryImages.forEach((src, idx) => container.appendChild(createCard(src, true, idx)));
        }
    };

    const createCard = (src, isCustom, idx = null) => {
        const card = document.createElement('div');
        card.className = "group relative aspect-square bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-rosepink-200 transition-all transform hover:-translate-y-1 cursor-pointer";
        card.innerHTML = `
            <img src="${src}" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" alt="Kỷ niệm">
            ${isCustom ? `
                <button class="delete-btn absolute top-2 right-2 bg-rosepink-600/80 hover:bg-rosepink-600 text-white w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
                    <i class="fa-solid fa-trash-can text-xs"></i>
                </button>
            ` : ''}
        `;

        card.querySelector('img').onclick = () => {
            document.getElementById('modal-img').src = src;
            document.getElementById('image-modal').classList.remove('hidden');
        };

        if (isCustom) {
            card.querySelector('.delete-btn').onclick = (e) => {
                e.stopPropagation();
                galleryImages.splice(idx, 1);
                localStorage.setItem('love_gallery_images', JSON.stringify(galleryImages));
                render();
            };
        }
        return card;
    };

    document.getElementById('image-upload').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (evt) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const maxDim = 800;
                let width = img.width, height = img.height;

                if (width > height && width > maxDim) {
                    height = Math.round((height * maxDim) / width);
                    width = maxDim;
                } else if (height > maxDim) {
                    width = Math.round((width * maxDim) / height);
                    height = maxDim;
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                const base64Str = canvas.toDataURL('image/jpeg', 0.7);
                try {
                    galleryImages.push(base64Str);
                    localStorage.setItem('love_gallery_images', JSON.stringify(galleryImages));
                    render();
                } catch (err) {
                    alert("Bộ nhớ lưu trữ trình duyệt đầy, hãy xóa bớt ảnh cũ nhé!");
                }
            };
            img.src = evt.target.result;
        };
        reader.readAsDataURL(file);
    });

    render();
}

/* CONFETTI TRIGGER */
function triggerConfetti() {
    confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#f43f5e', '#fda4af', '#ffffff', '#e11d48']
    });
}