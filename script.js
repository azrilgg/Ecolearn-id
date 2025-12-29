/* 
   ECOLEARN - GOD TIER BRAIN (v2.0)
   Features: Universal 3D Tilt, Scroll Observer, Dynamic Cursor, Quiz Logic, Global Navbar, Community Forum
*/

// Global Menu Toggle
// Global Menu Toggle
window.toggleMenu = () => {
    const navLinks = document.getElementById('navLinks');
    const navbar = document.querySelector('.navbar');
    const hamburgerIcon = document.querySelector('.hamburger i');

    if (navLinks && navbar) {
        const isActive = navLinks.classList.toggle('active');
        navbar.classList.toggle('menu-open', isActive);
        document.body.style.overflow = isActive ? 'hidden' : 'auto';

        // Morph icon if using FontAwesome (Bars -> Xmark)
        if (hamburgerIcon) {
            hamburgerIcon.classList.toggle('fa-bars', !isActive);
            hamburgerIcon.classList.toggle('fa-xmark', isActive);
        }
    }
};

// Close menu on ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const navLinks = document.getElementById('navLinks');
        if (navLinks && navLinks.classList.contains('active')) {
            window.toggleMenu();
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. PRELOADER HANDLING ---
    const loader = document.getElementById('ecoload-screen');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('loaded');
        }, 1200); // 1.2s delay for drama
    }

    // --- 2. UNIVERSAL 3D TILT ENGINE ---
    const tiltElements = document.querySelectorAll('.glass-panel, .hover-lift, .achieve-card, .why-card, .forum-card');

    tiltElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -10; // Max 10deg for better 3D
            const rotateY = ((x - centerX) / centerX) * 10;

            el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });

        el.addEventListener('mouseleave', () => {
            el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });

    // --- 3. NAVBAR SCROLL EFFECT ---
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- 4. GLOBAL CUSTOM CURSOR ---
    let cursorDot = document.getElementById('cursor-dot');
    let cursorRing = document.getElementById('cursor-ring');

    if (!cursorDot) {
        cursorDot = document.createElement('div');
        cursorDot.id = 'cursor-dot';
        document.body.appendChild(cursorDot);
    }
    if (!cursorRing) {
        cursorRing = document.createElement('div');
        cursorRing.id = 'cursor-ring';
        document.body.appendChild(cursorRing);
    }

    if (cursorDot && cursorRing) {
        cursorDot.style.opacity = '1';
        cursorRing.style.opacity = '1';

        cursorRing.style.transition = 'width 0.3s ease, height 0.3s ease, transform 0.15s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.3s ease';
        cursorDot.style.transition = 'opacity 0.3s ease';

        document.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;
            cursorDot.style.transform = `translate3d(${posX}px, ${posY}px, 0)`;
            cursorRing.style.transform = `translate3d(${posX}px, ${posY}px, 0)`;
        });

        // Click effect
        document.addEventListener('mousedown', () => {
            cursorRing.style.transform += ' scale(0.8)';
            cursorRing.style.borderColor = 'var(--secondary)';
        });
        document.addEventListener('mouseup', () => {
            cursorRing.style.borderColor = 'rgba(0, 255, 128, 0.4)';
        });
    }

    // --- 5. QUIZ LOGIC ---
    if (document.querySelector('.ultra-quiz-section')) {
        initQuiz();
    }

    // --- 6. COMMUNITY FORUM LOGIC ---
    if (document.querySelector('.forum-section')) {
        initCommunity();
    }
});

/* --- QUIZ SYSTEM CODE (ENHANCED) --- */
function initQuiz() {
    const startBtn = document.querySelector('.uqz-start-btn');
    const introScreen = document.getElementById('quizIntro');
    const playScreen = document.getElementById('quizPlay');
    const resultScreen = document.getElementById('quizResult');
    const levelCards = document.querySelectorAll('.uqz-level-card');

    let selectedLevel = null;
    let selectedGameMode = 'classic';
    let currentQuestionIndex = 0;
    let score = 0;
    let questions = [];
    let playerName = '';
    let startTime = 0;
    let playerAvatar = '';
    let soundEnabled = true;

    // SOUND EFFECTS SYSTEM (Using Web Audio for lightweight sound synthesis)
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

    const playSound = (type) => {
        if (!soundEnabled) return;
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        if (type === 'correct') {
            oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
            oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
            oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.4);
        } else if (type === 'wrong') {
            oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
            oscillator.frequency.setValueAtTime(150, audioContext.currentTime + 0.15);
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
        } else if (type === 'start') {
            oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4
            oscillator.frequency.setValueAtTime(554.37, audioContext.currentTime + 0.1); // C#5
            oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.2); // E5
            oscillator.frequency.setValueAtTime(880, audioContext.currentTime + 0.3); // A5
            gainNode.gain.setValueAtTime(0.25, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        } else if (type === 'win') {
            for (let i = 0; i < 4; i++) {
                const osc = audioContext.createOscillator();
                const gain = audioContext.createGain();
                osc.connect(gain);
                gain.connect(audioContext.destination);
                osc.frequency.setValueAtTime([523.25, 659.25, 783.99, 1046.50][i], audioContext.currentTime + i * 0.15);
                gain.gain.setValueAtTime(0.2, audioContext.currentTime + i * 0.15);
                gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + i * 0.15 + 0.3);
                osc.start(audioContext.currentTime + i * 0.15);
                osc.stop(audioContext.currentTime + i * 0.15 + 0.3);
            }
        }
    };

    // AVATAR UPLOAD HANDLER
    const avatarInput = document.getElementById('avatarInput');
    const avatarPreview = document.getElementById('avatarPreview');
    const soundToggle = document.getElementById('soundToggle');

    if (avatarInput) {
        avatarInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    playerAvatar = event.target.result;
                    avatarPreview.src = playerAvatar;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // SOUND TOGGLE HANDLER
    if (soundToggle) {
        soundToggle.addEventListener('click', () => {
            soundEnabled = !soundEnabled;
            soundToggle.classList.toggle('muted', !soundEnabled);
            soundToggle.innerHTML = soundEnabled
                ? '<i class="fa-solid fa-volume-high"></i><span>Sound ON</span>'
                : '<i class="fa-solid fa-volume-xmark"></i><span>Sound OFF</span>';
        });
    }

    // EXPANDED QUIZ DATA - 75+ QUESTIONS (25 per level)
    const quizData = {
        easy: [
            { q: "Apa kepanjangan dari 3R?", options: ["Reduce, Reuse, Recycle", "Run, Race, Ride", "Read, Rest, Relax"], a: 0, category: "3R" },
            { q: "Warna tempat sampah organik biasanya?", options: ["Merah", "Hijau", "Kuning"], a: 1, category: "Sampah" },
            { q: "Plastik butuh waktu berapa lama untuk terurai?", options: ["1 Tahun", "10-20 Tahun", "Hingga 1000 Tahun"], a: 2, category: "Polusi" },
            { q: "Mana yang termasuk sampah anorganik?", options: ["Kulit buah", "Botol plastik", "Daun kering"], a: 1, category: "Sampah" },
            { q: "Berapa persen bumi yang tertutup air?", options: ["50%", "71%", "90%"], a: 1, category: "Konservasi" },
            { q: "Pohon menghasilkan apa yang kita butuhkan?", options: ["Karbon dioksida", "Oksigen", "Nitrogen"], a: 1, category: "Alam" },
            { q: "Apa cara sederhana menghemat listrik?", options: ["Matikan lampu saat tidur", "Nyalakan AC 24 jam", "Biarkan TV menyala"], a: 0, category: "Energi" },
            { q: "Simbol segitiga dengan angka pada plastik disebut?", options: ["Barcode", "Kode daur ulang", "Logo merek"], a: 1, category: "3R" },
            { q: "Apa penyebab utama polusi udara di kota?", options: ["Pohon", "Kendaraan bermotor", "Hujan"], a: 1, category: "Polusi" },
            { q: "Kompos terbuat dari?", options: ["Plastik", "Sampah organik", "Logam"], a: 1, category: "3R" },
            { q: "Hewan apa yang terancam punah karena perburuan?", options: ["Ayam", "Harimau Sumatera", "Kucing"], a: 1, category: "Satwa" },
            { q: "Kantong belanja ramah lingkungan terbuat dari?", options: ["Plastik sekali pakai", "Kain atau kertas", "Styrofoam"], a: 1, category: "3R" },
            { q: "Air minum sebaiknya disimpan dalam botol?", options: ["Plastik sekali pakai", "Kaca atau stainless", "Styrofoam"], a: 1, category: "Kesehatan" },
            { q: "Apa warna tempat sampah untuk kertas?", options: ["Biru", "Merah", "Hitam"], a: 0, category: "Sampah" },
            { q: "Energi yang berasal dari matahari disebut?", options: ["Geotermal", "Solar/Surya", "Nuklir"], a: 1, category: "Energi" },
            { q: "Berapa liter air yang dihabiskan untuk mandi 5 menit?", options: ["5 liter", "40 liter", "100 liter"], a: 1, category: "Air" },
            { q: "Apa yang dimaksud dengan biodegradable?", options: ["Tahan lama", "Dapat terurai alami", "Kuat sekali"], a: 1, category: "Lingkungan" },
            { q: "Hutan tropis terluas di dunia ada di?", options: ["Afrika", "Amazon", "Asia"], a: 1, category: "Hutan" },
            { q: "Apa fungsi utama mangrove?", options: ["Hiasan pantai", "Mencegah abrasi", "Tempat parkir"], a: 1, category: "Laut" },
            { q: "Berapa persen sampah plastik yang berhasil didaur ulang?", options: ["Lebih dari 50%", "Kurang dari 10%", "100%"], a: 1, category: "Sampah" },
            { q: "Apa nama gas yang menyebabkan efek rumah kaca?", options: ["Oksigen", "Karbon Dioksida", "Helium"], a: 1, category: "Iklim" },
            { q: "Tanaman apa yang menyerap CO2 paling banyak?", options: ["Rumput", "Pohon besar", "Bunga"], a: 1, category: "Alam" },
            { q: "Apa yang harus dilakukan dengan minyak jelantah bekas?", options: ["Buang ke saluran air", "Kumpulkan untuk biodiesel", "Simpan di kulkas"], a: 1, category: "3R" },
            { q: "Berapa persen oksigen yang dihasilkan oleh laut?", options: ["20%", "50%", "70%"], a: 1, category: "Laut" },
            { q: "Apa nama Hari Bumi yang diperingati setiap tahun?", options: ["22 April", "1 Januari", "17 Agustus"], a: 0, category: "Global" }
        ],
        medium: [
            { q: "Apa dampak Gas Rumah Kaca?", options: ["Pendinginan Global", "Pemanasan Global", "Hujan Asam"], a: 1, category: "Iklim" },
            { q: "Energi matahari disebut juga?", options: ["Geotermal", "Tenaga Surya", "Biomassa"], a: 1, category: "Energi" },
            { q: "Apa itu carbon footprint?", options: ["Jejak kaki karbon di tanah", "Total emisi CO2 dari aktivitas", "Jenis bahan bakar"], a: 1, category: "Iklim" },
            { q: "Pengasaman laut disebabkan oleh?", options: ["Penyerapan CO2", "Tumpahan minyak", "Ikan berlebih"], a: 0, category: "Laut" },
            { q: "Berapa lama baterai untuk terurai di alam?", options: ["10 tahun", "100 tahun", "Tidak terurai"], a: 1, category: "Polusi" },
            { q: "Apa dampak deforestasi?", options: ["Udara lebih bersih", "Hilangnya habitat satwa", "Air lebih jernih"], a: 1, category: "Hutan" },
            { q: "E-waste adalah sampah dari?", options: ["Elektronik", "Makanan", "Kertas"], a: 0, category: "Sampah" },
            { q: "Biodiversitas penting karena?", options: ["Hiasan saja", "Keseimbangan ekosistem", "Tidak penting"], a: 1, category: "Alam" },
            { q: "Turbin angin menghasilkan?", options: ["Listrik", "Air bersih", "Minyak"], a: 0, category: "Energi" },
            { q: "SDGs adalah singkatan dari?", options: ["Sustainable Development Goals", "Super Dynamic Goals", "Standard Design Guidelines"], a: 0, category: "Global" },
            { q: "Lapisan ozon melindungi kita dari?", options: ["Hujan", "Sinar UV berbahaya", "Angin"], a: 1, category: "Atmosfer" },
            { q: "Apa itu energi terbarukan?", options: ["Energi yang habis", "Energi dari sumber tak terbatas", "Energi mahal"], a: 1, category: "Energi" },
            { q: "Coral bleaching disebabkan oleh?", options: ["Kenaikan suhu laut", "Polusi suara", "Gelap"], a: 0, category: "Laut" },
            { q: "Apa fungsi Bank Sampah?", options: ["Membuang sampah", "Menukar sampah dengan uang", "Menyimpan uang"], a: 1, category: "3R" },
            { q: "Apa yang dimaksud dengan urban farming?", options: ["Bertani di kota", "Olahraga ekstrem", "Seni modern"], a: 0, category: "Pertanian" },
            { q: "Berapa suhu ideal AC untuk penghematan energi?", options: ["16 derajat", "24-26 derajat", "30 derajat"], a: 1, category: "Energi" },
            { q: "Apa nama gerakan global untuk iklim oleh anak muda?", options: ["Fridays for Future", "Monday Motivation", "Sunday Funday"], a: 0, category: "Global" },
            { q: "Berapa persen hutan Indonesia yang sudah hilang?", options: ["5%", "25%", "50%+"], a: 2, category: "Hutan" },
            { q: "Apa alternatif plastik dari tanaman?", options: ["Bioplastik", "Superplastik", "Megaplastik"], a: 0, category: "Teknologi" },
            { q: "Apa manfaat vertical garden?", options: ["Memperindah saja", "Menyerap polusi udara", "Menambah berat bangunan"], a: 1, category: "Alam" },
            { q: "Rainwater harvesting adalah?", options: ["Menampung air hujan", "Membuang air", "Merebus air"], a: 0, category: "Air" },
            { q: "Apa yang dimaksud dengan sustainable fashion?", options: ["Fashion mahal", "Fashion ramah lingkungan", "Fashion cepat"], a: 1, category: "Gaya Hidup" },
            { q: "Mobil listrik lebih ramah lingkungan karena?", options: ["Lebih mahal", "Tidak berbahan bakar fosil", "Lebih besar"], a: 1, category: "Transportasi" },
            { q: "Berapa persen energi terbuang dari lampu pijar?", options: ["10%", "50%", "90%"], a: 2, category: "Energi" },
            { q: "Apa nama konferensi iklim tahunan PBB?", options: ["COP", "FBI", "WHO"], a: 0, category: "Global" }
        ],
        hard: [
            { q: "Perjanjian internasional tentang iklim disebut?", options: ["Paris Agreement", "Geneva Convention", "Tokyo Protocol"], a: 0, category: "Global" },
            { q: "Apa itu Microplastic?", options: ["Plastik ukuran <5mm", "Plastik elastis", "Plastik biodegradable"], a: 0, category: "Polusi" },
            { q: "Carbon capture technology bertujuan untuk?", options: ["Melepas CO2", "Menangkap dan menyimpan CO2", "Membuat CO2"], a: 1, category: "Teknologi" },
            { q: "CFC merusak lapisan?", options: ["Troposfer", "Ozon", "Litosfer"], a: 1, category: "Atmosfer" },
            { q: "UU lingkungan di Indonesia yang utama?", options: ["UU No. 32/2009", "UU No. 1/1945", "UU No. 100/2000"], a: 0, category: "Regulasi" },
            { q: "Ecological footprint mengukur?", options: ["Kecepatan berjalan", "Dampak manusia pada bumi", "Ukuran sepatu"], a: 1, category: "Global" },
            { q: "IPCC adalah singkatan dari?", options: ["Intergovernmental Panel on Climate Change", "Indonesian Plastic Control Committee", "Internet Protocol Climate Center"], a: 0, category: "Global" },
            { q: "Ekonomi sirkular bertujuan?", options: ["Membuang lebih banyak", "Mengurangi limbah dengan daur ulang", "Produksi massal"], a: 1, category: "Ekonomi" },
            { q: "Net Zero berarti?", options: ["Tidak ada internet", "Emisi karbon nol bersih", "Zero tolerance"], a: 1, category: "Iklim" },
            { q: "Apa itu greenwashing?", options: ["Mencuci dengan deterjen hijau", "Klaim palsu ramah lingkungan", "Menanam pohon"], a: 1, category: "Industri" },
            { q: "Berapa target kenaikan suhu Paris Agreement?", options: ["Di bawah 2°C", "Di bawah 10°C", "Tepat 5°C"], a: 0, category: "Global" },
            { q: "Blue carbon mengacu pada?", options: ["Warna laut", "Karbon di ekosistem pesisir", "Jenis plastik"], a: 1, category: "Laut" },
            { q: "Berapa ppm CO2 yang dianggap aman?", options: ["350 ppm", "500 ppm", "1000 ppm"], a: 0, category: "Atmosfer" },
            { q: "Apa itu AMDAL?", options: ["Analisis Mengenai Dampak Lingkungan", "Asosiasi Masyarakat Daur Alang", "Alat Mengukur Daya Listrik"], a: 0, category: "Regulasi" },
            { q: "Extended Producer Responsibility (EPR) adalah?", options: ["Produsen bertanggung jawab atas limbah produk", "Konsumen bayar lebih", "Pemerintah membuang"], a: 0, category: "Industri" },
            { q: "Apa nama skema perdagangan karbon Eropa?", options: ["EU ETS", "Green Deal", "Carbon Tax"], a: 0, category: "Ekonomi" },
            { q: "Ocean acidification menurunkan pH laut ke?", options: ["8.1", "7.0", "6.5"], a: 0, category: "Laut" },
            { q: "Apa itu biomimicry?", options: ["Meniru desain alam", "Kloning hewan", "Rekayasa genetik"], a: 0, category: "Teknologi" },
            { q: "Berapa persen spesies terancam punah akibat perubahan iklim?", options: ["10%", "25%", "50%+"], a: 2, category: "Satwa" },
            { q: "Apa nama teknologi penyimpanan energi terbesar?", options: ["Grid-scale battery", "USB power", "Kincir angin"], a: 0, category: "Teknologi" },
            { q: "Life Cycle Assessment (LCA) mengukur?", options: ["Umur hidup manusia", "Dampak lingkungan produk dari awal sampai akhir", "Biaya produksi"], a: 1, category: "Industri" },
            { q: "Apa itu Scope 3 emissions?", options: ["Emisi langsung", "Emisi dari rantai pasok", "Emisi dari olahraga"], a: 1, category: "Industri" },
            { q: "REDD+ bertujuan untuk?", options: ["Mengurangi deforestasi", "Menanam sawit", "Membangun jalan"], a: 0, category: "Hutan" },
            { q: "Apa nama standar bangunan hijau internasional?", options: ["LEED", "REED", "FEED"], a: 0, category: "Bangunan" },
            { q: "Berapa target renewable energy Indonesia 2025?", options: ["23%", "50%", "100%"], a: 0, category: "Energi" }
        ]
    };

    // MINI GAMES DATA
    const miniGamesData = {
        trueFalse: [
            { q: "Plastik dapat terurai dalam waktu 1 bulan?", options: ["Salah", "Benar"], a: 0, category: "Fakta" },
            { q: "Indonesia memiliki 17% spesies burung dunia?", options: ["Salah", "Benar"], a: 1, category: "Bio" },
            { q: "Lampu LED 80% lebih hemat energi dari bohlam?", options: ["Salah", "Benar"], a: 1, category: "Energi" },
            { q: "Air bersih hanya 2.5% dari total air di bumi?", options: ["Salah", "Benar"], a: 1, category: "Air" },
            { q: "Menanam 1 pohon bisa menyerap 22 kg CO2 per tahun?", options: ["Salah", "Benar"], a: 1, category: "Pohon" },
            { q: "Kertas tidak bisa didaur ulang sama sekali?", options: ["Salah", "Benar"], a: 0, category: "Daur Ulang" },
            { q: "Indonesia penghasil sampah plastik terbesar kedua di dunia?", options: ["Salah", "Benar"], a: 1, category: "Sampah" },
            { q: "Energi nuklir tidak menghasilkan emisi karbon saat operasi?", options: ["Salah", "Benar"], a: 1, category: "Energi" },
            { q: "Deforestasi menyumbang 10% emisi gas rumah kaca global?", options: ["Salah", "Benar"], a: 1, category: "Hutan" },
            { q: "Kantong plastik sekali pakai sudah dilarang di seluruh Indonesia?", options: ["Salah", "Benar"], a: 0, category: "Regulasi" },
            { q: "Hutan Amazon menghasilkan 20% oksigen dunia?", options: ["Salah", "Benar"], a: 1, category: "Hutan" },
            { q: "Kaca butuh 1 juta tahun untuk terurai?", options: ["Salah", "Benar"], a: 1, category: "Limbah" },
            { q: "Suhu bumi naik 1.1°C sejak revolusi industri?", options: ["Salah", "Benar"], a: 1, category: "Iklim" },
            { q: "Baterai bekas boleh dibuang di tempat sampah biasa?", options: ["Salah", "Benar"], a: 0, category: "B3" },
            { q: "Minyak bumi adalah sumber energi terbarukan?", options: ["Salah", "Benar"], a: 0, category: "Energi" }
        ],
        speedRound: [
            { q: "Gas utama di atmosfer bumi?", options: ["Oksigen", "Nitrogen", "Argon"], a: 1, category: "Speed" },
            { q: "Zat hijau daun disebut?", options: ["Klorofil", "Xantofil", "Stomata"], a: 0, category: "Speed" },
            { q: "Hewan terbesar di bumi?", options: ["Gajah", "Paus Biru", "T-Rex"], a: 1, category: "Speed" },
            { q: "Pohon tertinggi di dunia?", options: ["Cemara", "Sequoia", "Banyan"], a: 1, category: "Speed" },
            { q: "Lapisan terluar bumi?", options: ["Mantel", "Kerak", "Inti"], a: 1, category: "Speed" },
            { q: "Planet terdekat ke matahari?", options: ["Venus", "Merkurius", "Mars"], a: 1, category: "Speed" },
            { q: "Sumber energi matahari?", options: ["Fusi Nuklir", "Pembakaran", "Listrik"], a: 0, category: "Speed" },
            { q: "Gas yang kita hirup?", options: ["CO2", "Oksigen", "Nitrogen"], a: 1, category: "Speed" },
            { q: "Organisme terkecil?", options: ["Virus", "Bakteri", "Semut"], a: 0, category: "Speed" },
            { q: "Proses tanaman membuat makanan?", options: ["Respirasi", "Fotosintesis", "Digesti"], a: 1, category: "Speed" },
            { q: "Logam yang cair di suhu ruang?", options: ["Besi", "Raksa", "Emas"], a: 1, category: "Speed" },
            { q: "Bahan bakar pesawat?", options: ["Bensin", "Avtur", "Solar"], a: 1, category: "Speed" },
            { q: "Simbol kimia Air?", options: ["HO2", "H2O", "O2H"], a: 1, category: "Speed" },
            { q: "Ibukota Indonesia baru?", options: ["Jakarta", "Nusantara", "Balikpapan"], a: 1, category: "Speed" },
            { q: "Benua terbesar?", options: ["Afrika", "Asia", "Amerika"], a: 1, category: "Speed" }
        ]
    };

    // ACHIEVEMENT SYSTEM
    const achievements = {
        eco_rookie: { id: 'eco_rookie', name: 'Eco Rookie', desc: 'Selesaikan quiz pertama', icon: 'fa-seedling', unlocked: false },
        green_warrior: { id: 'green_warrior', name: 'Green Warrior', desc: 'Raih skor 80%+', icon: 'fa-shield', unlocked: false },
        earth_champion: { id: 'earth_champion', name: 'Earth Champion', desc: 'Raih skor sempurna 100%', icon: 'fa-trophy', unlocked: false },
        speed_demon: { id: 'speed_demon', name: 'Speed Demon', desc: 'Selesaikan dalam 20 detik', icon: 'fa-bolt', unlocked: false },
        eco_master: { id: 'eco_master', name: 'Eco Master', desc: 'Selesaikan semua level', icon: 'fa-crown', unlocked: false },
        streak_hero: { id: 'streak_hero', name: 'Streak Hero', desc: 'Jawab 5 benar berturut-turut', icon: 'fa-fire', unlocked: false }
    };

    // Load achievements from localStorage
    const loadAchievements = () => {
        const saved = localStorage.getItem('eco_achievements');
        if (saved) {
            const parsed = JSON.parse(saved);
            Object.keys(parsed).forEach(key => {
                if (achievements[key]) achievements[key].unlocked = parsed[key].unlocked;
            });
        }
    };

    const saveAchievements = () => {
        localStorage.setItem('eco_achievements', JSON.stringify(achievements));
    };

    const unlockAchievement = (id) => {
        if (achievements[id] && !achievements[id].unlocked) {
            achievements[id].unlocked = true;
            saveAchievements();
            showAchievementPopup(achievements[id]);
        }
    };

    const showAchievementPopup = (achievement) => {
        const popup = document.createElement('div');
        popup.className = 'achievement-popup';
        popup.innerHTML = `
            <div class="achievement-popup-inner">
                <i class="fa-solid ${achievement.icon}"></i>
                <div>
                    <strong>Achievement Unlocked!</strong>
                    <p>${achievement.name}</p>
                </div>
            </div>
        `;
        document.body.appendChild(popup);
        setTimeout(() => popup.classList.add('show'), 100);
        setTimeout(() => {
            popup.classList.remove('show');
            setTimeout(() => popup.remove(), 500);
        }, 3000);
    };

    loadAchievements();

    // GAME MODE SELECTION
    const gameModeTabs = document.querySelectorAll('.game-mode-tab');
    const levelsContainer = document.querySelector('.uqz-levels');

    if (gameModeTabs.length > 0) {
        gameModeTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Update UI
                gameModeTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                selectedGameMode = tab.getAttribute('data-mode');

                // Show/Hide Levels based on mode
                if (selectedGameMode === 'classic') {
                    if (levelsContainer) levelsContainer.style.display = 'flex';
                    // Reset level selection
                    selectedLevel = null;
                    levelCards.forEach(c => c.classList.remove('selected'));
                    startBtn.style.display = 'none';
                } else {
                    if (levelsContainer) levelsContainer.style.display = 'none';
                    // Auto-show start button for mini-games
                    startBtn.style.display = 'block';
                    startBtn.animate([{ opacity: 0, transform: 'translateY(20px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 300, fill: 'forwards' });
                }
            });
        });
    }

    // Level card selection
    levelCards.forEach(card => {
        card.addEventListener('click', () => {
            levelCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            selectedLevel = card.getAttribute('data-level');
            startBtn.style.display = 'block';
            startBtn.animate([{ opacity: 0, transform: 'translateY(20px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 300, fill: 'forwards' });
        });
    });

    startBtn.addEventListener('click', () => {
        playerName = document.getElementById('quizName').value.trim();
        if (!playerName) {
            alert('Masukkan nama kamu dulu, Agen Lingkungan!');
            return;
        }

        // Logic based on Game Mode
        if (selectedGameMode === 'classic') {
            if (!selectedLevel) {
                alert('Pilih level terlebih dahulu!');
                return;
            }
            const allQuestions = [...quizData[selectedLevel]];
            questions = shuffleArray(allQuestions).slice(0, 10);
        } else if (selectedGameMode === 'truefalse') {
            const allQuestions = [...miniGamesData.trueFalse];
            questions = shuffleArray(allQuestions).slice(0, 10);
            selectedLevel = 'True/False'; // For leaderboard
        } else if (selectedGameMode === 'speed') {
            const allQuestions = [...miniGamesData.speedRound];
            questions = shuffleArray(allQuestions).slice(0, 10);
            selectedLevel = 'Speed Round'; // For leaderboard
        }

        score = 0;
        currentQuestionIndex = 0;
        correctStreak = 0;
        startTime = Date.now();
        introScreen.classList.add('uqz-hidden');
        playScreen.classList.remove('uqz-hidden');
        playSound('start');
        loadQuestion();
        startTimer();
    });

    const shuffleArray = (arr) => {
        const newArr = [...arr];
        for (let i = newArr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
        }
        return newArr;
    };

    let correctStreak = 0;

    function loadQuestion() {
        const qData = questions[currentQuestionIndex];
        document.getElementById('questionText').innerText = qData.q;
        document.getElementById('qCurrent').innerText = currentQuestionIndex + 1;
        document.getElementById('qTotal').innerText = questions.length;

        // Add category badge
        let categoryBadge = document.getElementById('categoryBadge');
        if (!categoryBadge) {
            categoryBadge = document.createElement('div');
            categoryBadge.id = 'categoryBadge';
            categoryBadge.className = 'category-badge';
            document.getElementById('questionText').before(categoryBadge);
        }
        categoryBadge.innerHTML = `<i class="fa-solid fa-tag"></i> ${qData.category}`;

        const optionsContainer = document.querySelector('.options-grid');
        optionsContainer.innerHTML = '';

        // Shuffle options
        const shuffledOptions = qData.options.map((opt, idx) => ({ text: opt, isCorrect: idx === qData.a }));
        const shuffledOpts = shuffleArray(shuffledOptions);

        shuffledOpts.forEach((opt) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.innerText = opt.text;
            btn.onclick = () => checkAnswer(opt.isCorrect, btn, shuffledOpts);
            optionsContainer.appendChild(btn);
        });

        const progressPercent = ((currentQuestionIndex) / questions.length) * 100;
        document.getElementById('uqzProgressFill').style.width = `${progressPercent}%`;
    }

    function checkAnswer(isCorrect, btn, allOpts) {
        const buttons = document.querySelectorAll('.option-btn');
        buttons.forEach(b => b.disabled = true);

        if (isCorrect) {
            btn.classList.add('correct');
            score++;
            correctStreak++;
            playSound('correct');
            if (correctStreak >= 5) unlockAchievement('streak_hero');
        } else {
            btn.classList.add('wrong');
            correctStreak = 0;
            playSound('wrong');
            // Show correct answer
            buttons.forEach((b, idx) => {
                if (allOpts[idx].isCorrect) b.classList.add('correct');
            });
        }

        setTimeout(() => {
            currentQuestionIndex++;
            if (currentQuestionIndex < questions.length) {
                loadQuestion();
                resetQuestionTimer();
            } else {
                showResult();
            }
        }, 1000);
    }

    function showResult() {
        if (quizTimer) clearInterval(quizTimer);
        playScreen.classList.add('uqz-hidden');
        resultScreen.classList.remove('uqz-hidden');

        const finalScore = Math.round((score / questions.length) * 100);
        const totalTime = Math.round((Date.now() - startTime) / 1000);

        document.getElementById('finalScore').innerText = finalScore;

        // Achievement checks
        unlockAchievement('eco_rookie');
        if (finalScore >= 80) unlockAchievement('green_warrior');
        if (finalScore === 100) unlockAchievement('earth_champion');
        if (totalTime <= 20) unlockAchievement('speed_demon');

        // Check if all levels completed
        const completedLevels = JSON.parse(localStorage.getItem('eco_completed_levels') || '[]');
        if (!completedLevels.includes(selectedLevel)) {
            completedLevels.push(selectedLevel);
            localStorage.setItem('eco_completed_levels', JSON.stringify(completedLevels));
        }
        if (completedLevels.length >= 3) unlockAchievement('eco_master');

        let msg = "Terus Belajar!";
        let emoji = "📚";
        if (finalScore === 100) { msg = "PERFECT! Earth Hero!"; emoji = "🌍"; }
        else if (finalScore >= 80) { msg = "Luar Biasa!"; emoji = "🌟"; }
        else if (finalScore >= 60) { msg = "Bagus Sekali!"; emoji = "👍"; }
        document.getElementById('resultMsg').innerText = `${emoji} ${msg}`;

        // Play win sound
        playSound('win');

        // Update result avatar
        const resultAvatar = document.getElementById('resultAvatar');
        if (resultAvatar && playerAvatar) {
            resultAvatar.src = playerAvatar;
        } else if (resultAvatar) {
            resultAvatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(playerName)}&background=00ff80&color=fff&size=120`;
        }

        // Add stats display
        displayStats(finalScore, totalTime);

        // Save to leaderboard
        saveToLeaderboard(playerName, finalScore, selectedLevel, playerAvatar);

        // Display mini leaderboard
        displayMiniLeaderboard();

        // Display achievements
        displayAchievements();
    }

    function displayStats(finalScore, totalTime) {
        let statsContainer = document.getElementById('quizStats');
        if (!statsContainer) {
            statsContainer = document.createElement('div');
            statsContainer.id = 'quizStats';
            statsContainer.className = 'quiz-stats';
            document.getElementById('resultMsg').after(statsContainer);
        }
        statsContainer.innerHTML = `
            <div class="stat-item">
                <i class="fa-solid fa-check-circle"></i>
                <span>${score}/${questions.length} Benar</span>
            </div>
            <div class="stat-item">
                <i class="fa-solid fa-clock"></i>
                <span>${totalTime} detik</span>
            </div>
            <div class="stat-item">
                <i class="fa-solid fa-layer-group"></i>
                <span>Level ${selectedLevel.charAt(0).toUpperCase() + selectedLevel.slice(1)}</span>
            </div>
        `;
    }

    function displayAchievements() {
        let achieveContainer = document.getElementById('quizAchievements');
        if (!achieveContainer) {
            achieveContainer = document.createElement('div');
            achieveContainer.id = 'quizAchievements';
            achieveContainer.className = 'quiz-achievements';
            const statsEl = document.getElementById('quizStats');
            if (statsEl) statsEl.after(achieveContainer);
        }

        const unlockedList = Object.values(achievements).filter(a => a.unlocked);
        if (unlockedList.length === 0) {
            achieveContainer.innerHTML = '<p style="color: var(--text-muted);">Belum ada achievement. Terus bermain!</p>';
            return;
        }

        achieveContainer.innerHTML = `
            <h4 style="margin-bottom: 15px; color: var(--primary);"><i class="fa-solid fa-medal"></i> Achievement Kamu</h4>
            <div class="achievements-grid">
                ${unlockedList.map(a => `
                    <div class="achieve-badge">
                        <i class="fa-solid ${a.icon}"></i>
                        <span>${a.name}</span>
                    </div>
                `).join('')}
            </div>
        `;
    }

    function saveToLeaderboard(name, score, level, avatar = '') {
        const leaderboard = JSON.parse(localStorage.getItem('eco_leaderboard') || '[]');

        // Generate avatar URL if not provided
        const avatarUrl = avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=00ff80&color=fff&size=120`;

        // Check if player already exists (update their score if higher)
        const existingIndex = leaderboard.findIndex(entry => entry.name.toLowerCase() === name.toLowerCase());

        if (existingIndex !== -1) {
            // Only update if new score is higher
            if (score > leaderboard[existingIndex].score) {
                leaderboard[existingIndex] = {
                    name,
                    score,
                    level,
                    avatar: avatar || leaderboard[existingIndex].avatar || avatarUrl,
                    date: new Date().toISOString()
                };
            } else if (avatar && !leaderboard[existingIndex].avatar.startsWith('data:')) {
                // Update avatar if player has new avatar but keep existing score
                leaderboard[existingIndex].avatar = avatar;
            }
        } else {
            // Add new entry
            leaderboard.push({
                name,
                score,
                level,
                avatar: avatarUrl,
                date: new Date().toISOString()
            });
        }

        // Sort by score descending and keep top 50
        leaderboard.sort((a, b) => b.score - a.score);

        // Save to localStorage
        try {
            localStorage.setItem('eco_leaderboard', JSON.stringify(leaderboard.slice(0, 50)));
        } catch (e) {
            // If storage is full (usually due to large avatar images), save without avatars
            console.warn('Storage full, saving without avatar images');
            const minimalLeaderboard = leaderboard.slice(0, 50).map(entry => ({
                ...entry,
                avatar: entry.avatar.startsWith('data:')
                    ? `https://ui-avatars.com/api/?name=${encodeURIComponent(entry.name)}&background=00ff80&color=fff&size=120`
                    : entry.avatar
            }));
            localStorage.setItem('eco_leaderboard', JSON.stringify(minimalLeaderboard));
        }
    }

    // MINI LEADERBOARD DISPLAY
    function displayMiniLeaderboard() {
        const miniLb = document.getElementById('miniLeaderboard');
        if (!miniLb) return;

        const leaderboard = JSON.parse(localStorage.getItem('eco_leaderboard') || '[]');
        const top3 = leaderboard.slice(0, 3);

        if (top3.length === 0) {
            miniLb.innerHTML = '<p style="color: var(--text-muted); text-align: center;">Jadilah yang pertama!</p>';
            return;
        }

        miniLb.innerHTML = top3.map((entry, idx) => `
            <div class="mini-lb-item rank-${idx + 1}">
                <span class="mini-lb-rank">${idx + 1}</span>
                <img class="mini-lb-avatar" src="${entry.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(entry.name)}&background=00ff80&color=fff&size=80`}" alt="${entry.name}">
                <div class="mini-lb-info">
                    <span class="mini-lb-name">${entry.name}</span>
                    <span class="mini-lb-score">${entry.score} pts - ${entry.level}</span>
                </div>
            </div>
        `).join('');
    }

    // Timer System
    let quizTimer = null;
    let timeLeft = 60; // 60 seconds total
    let timePerQuestion = 60;

    function startTimer() {
        timeLeft = timePerQuestion;
        createTimerDisplay();
        updateTimerDisplay();
        if (quizTimer) clearInterval(quizTimer);
        quizTimer = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();
            if (timeLeft <= 0) {
                clearInterval(quizTimer);
                showResult();
            }
        }, 1000);
    }

    function resetQuestionTimer() {
        // Timer continues from where it was
        updateTimerDisplay();
    }

    function createTimerDisplay() {
        let timerEl = document.getElementById('quizTimerCircle');
        if (!timerEl) {
            const header = document.querySelector('.uqz-play-header');
            timerEl = document.createElement('div');
            timerEl.id = 'quizTimerCircle';
            timerEl.className = 'timer-circle';
            timerEl.innerHTML = `
                <svg viewBox="0 0 100 100">
                    <circle class="timer-bg" cx="50" cy="50" r="45"/>
                    <circle class="timer-progress" cx="50" cy="50" r="45"/>
                </svg>
                <span class="timer-text" id="timerText">60</span>
            `;
            header.appendChild(timerEl);
        }
    }

    function updateTimerDisplay() {
        const timerText = document.getElementById('timerText');
        const progress = document.querySelector('.timer-progress');
        if (timerText) timerText.innerText = timeLeft;
        if (progress) {
            const circumference = 2 * Math.PI * 45;
            const offset = circumference - (timeLeft / timePerQuestion) * circumference;
            progress.style.strokeDasharray = circumference;
            progress.style.strokeDashoffset = offset;

            // Change color based on time
            if (timeLeft <= 10) {
                progress.style.stroke = '#ff3333';
            } else if (timeLeft <= 20) {
                progress.style.stroke = '#ffaa00';
            } else {
                progress.style.stroke = 'var(--primary)';
            }
        }
    }
}

// --- 6. ENHANCED COMMUNITY FORUM SYSTEM ---
function initCommunity() {
    const forumGrid = document.querySelector('.forum-grid');
    const topicBtn = document.querySelector('.btn-primary[href="#"]');

    // DATA STORAGE
    let topics = JSON.parse(localStorage.getItem('eco_topics')) || [];
    let comments = JSON.parse(localStorage.getItem('eco_comments')) || {};
    let events = JSON.parse(localStorage.getItem('eco_events')) || [];
    let challenges = JSON.parse(localStorage.getItem('eco_challenges')) || {};
    let userProfile = JSON.parse(localStorage.getItem('eco_user_profile')) || { name: '', streak: 0, lastActive: null };

    // CATEGORY COLORS
    const categoryColors = {
        'Tips & Trik': { color: 'var(--primary)', bg: 'rgba(0, 255, 128, 0.1)' },
        'Event': { color: 'var(--accent)', bg: 'rgba(255, 215, 0, 0.1)' },
        'Ask': { color: 'var(--primary)', bg: 'rgba(0, 255, 128, 0.1)' },
        'Showcase': { color: 'var(--secondary)', bg: 'rgba(0, 150, 255, 0.1)' },
        'News': { color: 'var(--primary)', bg: 'rgba(0, 255, 128, 0.1)' },
        'Urgent': { color: '#ff0055', bg: 'rgba(255, 0, 85, 0.1)' }
    };

    // LOAD DYNAMIC PODIUM FROM QUIZ LEADERBOARD
    const loadDynamicPodium = () => {
        const leaderboard = JSON.parse(localStorage.getItem('eco_leaderboard') || '[]');

        // Default data for fallback
        const defaults = [
            { name: 'Andika P.', score: 100, avatar: 'image/user1.jpg', level: 'hard' },
            { name: 'Sarah J.', score: 95, avatar: 'image/user2.jpg', level: 'medium' },
            { name: 'Rangga S.', score: 85, avatar: 'image/user3.jpg', level: 'easy' }
        ];

        // Use leaderboard data if available, otherwise defaults
        const top3 = leaderboard.length >= 3 ? leaderboard.slice(0, 3) :
            leaderboard.length > 0 ? [...leaderboard, ...defaults.slice(leaderboard.length)] : defaults;

        // Helper function to set avatar with fallback
        const setAvatarWithFallback = (imgElement, avatarUrl, name, bgColor) => {
            if (!imgElement) return;

            const fallbackUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${bgColor}&color=fff&size=120`;

            // If it's a base64 data URL or valid URL
            if (avatarUrl && (avatarUrl.startsWith('data:') || avatarUrl.startsWith('http') || avatarUrl.startsWith('image/'))) {
                imgElement.src = avatarUrl;
                imgElement.onerror = () => {
                    imgElement.src = fallbackUrl;
                    imgElement.onerror = null; // Prevent infinite loop
                };
            } else {
                imgElement.src = fallbackUrl;
            }
        };

        // Update Rank 1 (Gold)
        const name1 = document.getElementById('name1');
        const avatar1 = document.getElementById('avatar1');
        const points1 = document.getElementById('points1');
        if (name1 && top3[0]) {
            name1.textContent = top3[0].name;
            setAvatarWithFallback(avatar1, top3[0].avatar, top3[0].name, 'ffd700');
            points1.textContent = `Points: ${top3[0].score.toLocaleString()}`;
        }

        // Update Rank 2 (Silver)
        const name2 = document.getElementById('name2');
        const avatar2 = document.getElementById('avatar2');
        const points2 = document.getElementById('points2');
        if (name2 && top3[1]) {
            name2.textContent = top3[1].name;
            setAvatarWithFallback(avatar2, top3[1].avatar, top3[1].name, 'c0c0c0');
            points2.textContent = `Points: ${top3[1].score.toLocaleString()}`;
        }

        // Update Rank 3 (Bronze)
        const name3 = document.getElementById('name3');
        const avatar3 = document.getElementById('avatar3');
        const points3 = document.getElementById('points3');
        if (name3 && top3[2]) {
            name3.textContent = top3[2].name;
            setAvatarWithFallback(avatar3, top3[2].avatar, top3[2].name, 'cd7f32');
            points3.textContent = `Points: ${top3[2].score.toLocaleString()}`;
        }

        // Add animation class to show update
        const podiumCards = document.querySelectorAll('.podium-card');
        podiumCards.forEach(card => {
            card.classList.add('updated');
            setTimeout(() => card.classList.remove('updated'), 1000);
        });
    };

    // DISPLAY QUIZ ACHIEVEMENTS IN COMMUNITY
    const displayCommunityAchievements = () => {
        const container = document.getElementById('communityAchievements');
        if (!container) return;

        const achievements = JSON.parse(localStorage.getItem('eco_achievements') || '{}');
        const unlocked = Object.values(achievements).filter(a => a && a.unlocked);

        if (unlocked.length === 0) {
            container.innerHTML = `
                <p style="color: var(--text-muted); text-align: center; padding: 20px;">
                    <i class="fa-solid fa-gamepad" style="font-size: 2rem; display: block; margin-bottom: 10px;"></i>
                    Belum ada achievement. Mulai quiz untuk mengumpulkan badges!
                </p>
                <a href="quiz.html" class="btn-primary" style="display: inline-block; margin-top: 10px;">Mulai Quiz</a>
            `;
            return;
        }

        container.innerHTML = unlocked.map(a => `
            <div class="community-achieve-badge">
                <i class="fa-solid ${a.icon}"></i>
                <span>${a.name}</span>
            </div>
        `).join('');
    };

    // Initialize dynamic content
    loadDynamicPodium();
    displayCommunityAchievements();

    // STREAK SYSTEM
    const updateStreak = () => {
        const today = new Date().toDateString();
        if (userProfile.lastActive === today) return;

        const yesterday = new Date(Date.now() - 86400000).toDateString();
        if (userProfile.lastActive === yesterday) {
            userProfile.streak++;
        } else {
            userProfile.streak = 1;
        }
        userProfile.lastActive = today;
        localStorage.setItem('eco_user_profile', JSON.stringify(userProfile));
    };

    updateStreak();

    // SETUP TOPIC MODAL (Enhanced)
    const setupModal = () => {
        if (document.getElementById('topicModal')) return;
        const modal = document.createElement('div');
        modal.id = 'topicModal';
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-glass">
                <h2><i class="fa-solid fa-pen-nib"></i> Buat Topik Baru</h2>
                <div class="form-group">
                    <label>Judul Topik</label>
                    <input type="text" id="modalTopicTitle" placeholder="Apa yang ingin kamu bahas?" maxlength="100">
                </div>
                <div class="form-group">
                    <label>Deskripsi (opsional)</label>
                    <textarea id="modalTopicDesc" placeholder="Jelaskan lebih detail..." rows="3" style="width:100%; background: rgba(255,255,255,0.05); border: 1px solid var(--glass-border); border-radius: 12px; color: var(--white); padding: 15px; resize: none;"></textarea>
                </div>
                <div class="form-group">
                    <label>Nama Kamu</label>
                    <input type="text" id="modalUserName" placeholder="Nama samaran juga boleh" maxlength="30">
                </div>
                <div class="form-group">
                    <label>Kategori</label>
                    <select id="modalCategory">
                        <option value="Tips & Trik">💡 Tips & Trik</option>
                        <option value="Event">📅 Event</option>
                        <option value="Ask">❓ Ask</option>
                        <option value="Showcase">🎨 Showcase</option>
                        <option value="News">📰 News</option>
                    </select>
                </div>
                <div class="modal-btns">
                    <button class="btn-glass" id="closeModal">Batal</button>
                    <button class="btn-primary" id="submitTopic">Publish Sekarang</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        document.getElementById('closeModal').onclick = () => modal.classList.remove('active');
        modal.onclick = (e) => { if (e.target === modal) modal.classList.remove('active'); };

        document.getElementById('submitTopic').onclick = () => {
            const title = document.getElementById('modalTopicTitle').value.trim();
            const desc = document.getElementById('modalTopicDesc').value.trim();
            const user = document.getElementById('modalUserName').value.trim();
            const category = document.getElementById('modalCategory').value;

            if (!title || !user) {
                alert('Mohon isi judul dan nama!');
                return;
            }

            const newTopic = {
                id: Date.now(),
                title,
                description: desc,
                user,
                category,
                likes: 0,
                commentCount: 0,
                date: new Date().toISOString()
            };
            topics.unshift(newTopic);
            localStorage.setItem('eco_topics', JSON.stringify(topics));
            addActivity(`${user} membuat topik baru: "${title.substring(0, 30)}..."`);
            renderTopics();
            modal.classList.remove('active');

            // Clear form
            document.getElementById('modalTopicTitle').value = '';
            document.getElementById('modalTopicDesc').value = '';
            document.getElementById('modalUserName').value = '';
        };
    };

    // COMMENT MODAL
    const setupCommentModal = () => {
        if (document.getElementById('commentModal')) return;
        const modal = document.createElement('div');
        modal.id = 'commentModal';
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-glass comment-modal">
                <div class="comment-header">
                    <h2 id="commentTopicTitle">Topik</h2>
                    <button class="close-comment-btn" id="closeCommentModal"><i class="fa-solid fa-xmark"></i></button>
                </div>
                <p id="commentTopicDesc" style="color: var(--text-muted); margin-bottom: 20px;"></p>
                <div id="commentsContainer" class="comments-container"></div>
                <div class="comment-form">
                    <input type="text" id="commentName" placeholder="Nama kamu" maxlength="30">
                    <textarea id="commentText" placeholder="Tulis komentar..." rows="2"></textarea>
                    <button class="btn-primary" id="submitComment"><i class="fa-solid fa-paper-plane"></i> Kirim</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        document.getElementById('closeCommentModal').onclick = () => modal.classList.remove('active');
        modal.onclick = (e) => { if (e.target === modal) modal.classList.remove('active'); };
    };

    // ACTIVITY FEED
    const activities = JSON.parse(localStorage.getItem('eco_activities')) || [];

    const addActivity = (text) => {
        activities.unshift({
            id: Date.now(),
            text,
            time: new Date().toISOString()
        });
        localStorage.setItem('eco_activities', JSON.stringify(activities.slice(0, 50)));
        renderActivityFeed();
    };

    const renderActivityFeed = () => {
        const feed = document.getElementById('activityFeed');
        if (!feed) return;

        const recentActivities = activities.slice(0, 10);
        feed.innerHTML = recentActivities.length === 0
            ? '<p style="color: var(--text-muted); text-align: center;">Belum ada aktivitas</p>'
            : recentActivities.map(a => `
                <div class="activity-item">
                    <i class="fa-solid fa-circle-dot"></i>
                    <div>
                        <p>${a.text}</p>
                        <small>${formatTimeAgo(a.time)}</small>
                    </div>
                </div>
            `).join('');
    };

    // TIME FORMATTING
    const formatTimeAgo = (dateString) => {
        const now = new Date();
        const date = new Date(dateString);
        const diff = Math.floor((now - date) / 1000);

        if (diff < 60) return 'Baru saja';
        if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
        if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
        if (diff < 604800) return `${Math.floor(diff / 86400)} hari lalu`;
        return date.toLocaleDateString('id-ID');
    };

    // RENDER TOPICS (Enhanced with comments)
    const renderTopics = (filter = '', searchTerm = '') => {
        if (!forumGrid) return;
        forumGrid.querySelectorAll('.dynamic-topic').forEach(el => el.remove());

        let filteredTopics = [...topics];

        // Apply filter
        if (filter && filter !== 'all') {
            filteredTopics = filteredTopics.filter(t => t.category === filter);
        }

        // Apply search
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filteredTopics = filteredTopics.filter(t =>
                t.title.toLowerCase().includes(term) ||
                t.user.toLowerCase().includes(term) ||
                (t.description && t.description.toLowerCase().includes(term))
            );
        }

        filteredTopics.forEach(t => {
            const catColor = categoryColors[t.category] || categoryColors['Tips & Trik'];
            const topicComments = comments[t.id] || [];

            const div = document.createElement('div');
            div.className = 'forum-card dynamic-topic';
            div.innerHTML = `
                <span class="f-tag" style="color: ${catColor.color}; background: ${catColor.bg}; border-color: ${catColor.color}30;">${t.category || 'Community'}</span>
                <h3 class="f-title">${t.title}</h3>
                ${t.description ? `<p class="f-desc">${t.description.substring(0, 100)}${t.description.length > 100 ? '...' : ''}</p>` : ''}
                <div class="f-meta">
                    <div class="f-user">
                        <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(t.user)}&background=00ff80&color=fff" alt="User">
                        <span>${t.user}</span>
                        <small style="color: var(--text-muted); margin-left: 10px;">${formatTimeAgo(t.date)}</small>
                    </div>
                    <div class="f-actions">
                        <button class="comment-btn" data-id="${t.id}">
                            <i class="fa-solid fa-comment"></i> <span>${topicComments.length}</span>
                        </button>
                        <button class="like-btn ${localStorage.getItem('liked_' + t.id) ? 'active' : ''}" data-id="${t.id}">
                            <i class="fa-solid fa-heart"></i> <span>${t.likes || 0}</span>
                        </button>
                    </div>
                </div>
            `;

            // Event listeners
            div.querySelector('.like-btn').onclick = (e) => {
                e.stopPropagation();
                likeTopic(t.id);
            };
            div.querySelector('.comment-btn').onclick = (e) => {
                e.stopPropagation();
                openCommentModal(t.id);
            };
            div.onclick = () => openCommentModal(t.id);

            forumGrid.prepend(div);
        });
    };

    // LIKE TOPIC
    const likeTopic = (id) => {
        if (localStorage.getItem('liked_' + id)) return;
        const topic = topics.find(t => t.id === id);
        if (topic) {
            topic.likes = (topic.likes || 0) + 1;
            localStorage.setItem('liked_' + id, 'true');
            localStorage.setItem('eco_topics', JSON.stringify(topics));
            renderTopics();
        }
    };
    window.likeTopic = likeTopic;

    // OPEN COMMENT MODAL
    const openCommentModal = (topicId) => {
        const topic = topics.find(t => t.id === topicId);
        if (!topic) return;

        const modal = document.getElementById('commentModal');
        document.getElementById('commentTopicTitle').innerText = topic.title;
        document.getElementById('commentTopicDesc').innerText = topic.description || '';

        renderComments(topicId);

        document.getElementById('submitComment').onclick = () => {
            const name = document.getElementById('commentName').value.trim();
            const text = document.getElementById('commentText').value.trim();

            if (!name || !text) {
                alert('Mohon isi nama dan komentar!');
                return;
            }

            if (!comments[topicId]) comments[topicId] = [];
            comments[topicId].push({
                id: Date.now(),
                user: name,
                text,
                date: new Date().toISOString(),
                likes: 0
            });

            // Update topic comment count
            topic.commentCount = comments[topicId].length;
            localStorage.setItem('eco_topics', JSON.stringify(topics));
            localStorage.setItem('eco_comments', JSON.stringify(comments));

            addActivity(`${name} berkomentar di "${topic.title.substring(0, 20)}..."`);

            renderComments(topicId);
            renderTopics();

            document.getElementById('commentName').value = '';
            document.getElementById('commentText').value = '';
        };

        modal.classList.add('active');
    };

    // RENDER COMMENTS
    const renderComments = (topicId) => {
        const container = document.getElementById('commentsContainer');
        const topicComments = comments[topicId] || [];

        if (topicComments.length === 0) {
            container.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 30px;">Belum ada komentar. Jadilah yang pertama!</p>';
            return;
        }

        container.innerHTML = topicComments.map(c => `
            <div class="comment-item">
                <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(c.user)}&background=00ff80&color=fff" alt="${c.user}">
                <div class="comment-content">
                    <div class="comment-header-info">
                        <strong>${c.user}</strong>
                        <small>${formatTimeAgo(c.date)}</small>
                    </div>
                    <p>${c.text}</p>
                </div>
            </div>
        `).join('');

        container.scrollTop = container.scrollHeight;
    };

    // SEARCH & FILTER SYSTEM
    const setupSearchFilter = () => {
        const forumHeader = document.querySelector('.forum-section .container > div:first-child');
        if (!forumHeader || document.getElementById('searchFilterContainer')) return;

        const searchContainer = document.createElement('div');
        searchContainer.id = 'searchFilterContainer';
        searchContainer.className = 'search-filter-container';
        searchContainer.innerHTML = `
            <div class="search-box">
                <i class="fa-solid fa-search"></i>
                <input type="text" id="topicSearch" placeholder="Cari topik...">
            </div>
            <div class="filter-chips">
                <button class="filter-chip active" data-filter="all">Semua</button>
                <button class="filter-chip" data-filter="Tips & Trik">💡 Tips</button>
                <button class="filter-chip" data-filter="Event">📅 Event</button>
                <button class="filter-chip" data-filter="Ask">❓ Ask</button>
                <button class="filter-chip" data-filter="Showcase">🎨 Showcase</button>
                <button class="filter-chip" data-filter="News">📰 News</button>
            </div>
        `;

        forumHeader.after(searchContainer);

        // Search event
        let searchTimeout;
        document.getElementById('topicSearch').addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                const activeFilter = document.querySelector('.filter-chip.active')?.dataset.filter || 'all';
                renderTopics(activeFilter, e.target.value);
            }, 300);
        });

        // Filter events
        searchContainer.querySelectorAll('.filter-chip').forEach(chip => {
            chip.onclick = () => {
                searchContainer.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                const searchTerm = document.getElementById('topicSearch').value;
                renderTopics(chip.dataset.filter, searchTerm);
            };
        });
    };

    // DAILY CHALLENGES SYSTEM
    const setupDailyChallenges = () => {
        const challengeSection = document.querySelector('.challenges-section');
        if (!challengeSection) return;

        const challengeButtons = challengeSection.querySelectorAll('.btn-glass');
        const today = new Date().toDateString();

        challengeButtons.forEach((btn, index) => {
            const challengeId = `challenge_${index}_${today}`;
            const isJoined = localStorage.getItem(challengeId);

            if (isJoined) {
                btn.innerHTML = '<i class="fa-solid fa-check"></i> Sudah Ikut';
                btn.classList.add('joined');
                btn.disabled = true;
            }

            btn.onclick = () => {
                if (localStorage.getItem(challengeId)) return;

                const userName = prompt('Masukkan nama kamu untuk ikut tantangan:');
                if (!userName) return;

                localStorage.setItem(challengeId, userName);
                btn.innerHTML = '<i class="fa-solid fa-check"></i> Sudah Ikut';
                btn.classList.add('joined');

                // Update streak
                updateStreak();

                addActivity(`${userName} mengikuti tantangan mingguan!`);

                // Show success message
                showNotification('🎉 Selamat! Kamu berhasil bergabung dengan tantangan.');
            };
        });

        // Add streak display
        const streakDisplay = document.createElement('div');
        streakDisplay.className = 'streak-display';
        streakDisplay.innerHTML = `
            <div class="streak-badge">
                <i class="fa-solid fa-fire"></i>
                <span>${userProfile.streak} Hari Streak</span>
            </div>
        `;
        challengeSection.querySelector('.container').prepend(streakDisplay);
    };

    // NOTIFICATION SYSTEM
    const showNotification = (message) => {
        const notif = document.createElement('div');
        notif.className = 'eco-notification';
        notif.innerHTML = `<p>${message}</p>`;
        document.body.appendChild(notif);

        setTimeout(() => notif.classList.add('show'), 100);
        setTimeout(() => {
            notif.classList.remove('show');
            setTimeout(() => notif.remove(), 500);
        }, 3000);
    };

    // LEADERBOARD WITH QUIZ SCORES
    const updateLeaderboardFromQuiz = () => {
        const leaderboard = JSON.parse(localStorage.getItem('eco_leaderboard') || '[]');
        const podiumCards = document.querySelectorAll('.podium-card');

        if (leaderboard.length > 0 && podiumCards.length >= 3) {
            // Get top 3 unique users
            const uniqueUsers = [];
            leaderboard.forEach(entry => {
                if (!uniqueUsers.find(u => u.name === entry.name)) {
                    uniqueUsers.push(entry);
                }
            });

            const top3 = uniqueUsers.slice(0, 3);

            // Update podium cards (Rank 1 is in the middle)
            const orderMap = [1, 0, 2]; // [Rank 2, Rank 1, Rank 3]
            podiumCards.forEach((card, idx) => {
                const userIdx = orderMap[idx];
                if (top3[userIdx]) {
                    const user = top3[userIdx];
                    const nameEl = card.querySelector('h3');
                    const pointsEl = card.querySelector('p');
                    const avatarEl = card.querySelector('.p-avatar');

                    if (nameEl) nameEl.innerText = user.name;
                    if (pointsEl) pointsEl.innerText = `Score: ${user.score}`;
                    if (avatarEl) {
                        const fallbackUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=00ff80&color=fff&size=200`;
                        if (user.avatar && (user.avatar.startsWith('data:') || user.avatar.startsWith('http') || user.avatar.startsWith('image/'))) {
                            avatarEl.src = user.avatar;
                        } else {
                            avatarEl.src = fallbackUrl;
                        }
                    }
                }
            });
        }
    };

    // ACTIVITY FEED SIDEBAR
    const setupActivityFeed = () => {
        const forumSection = document.querySelector('.forum-section .container');
        if (!forumSection || document.getElementById('activitySidebar')) return;

        // Create grid layout
        forumSection.style.display = 'grid';
        forumSection.style.gridTemplateColumns = '1fr 300px';
        forumSection.style.gap = '30px';

        const mainContent = document.createElement('div');
        mainContent.className = 'forum-main';

        // Move existing content to main
        const header = forumSection.querySelector('div:first-child');
        const searchFilter = document.getElementById('searchFilterContainer');
        const grid = forumSection.querySelector('.forum-grid');

        if (header) mainContent.appendChild(header);
        if (searchFilter) mainContent.appendChild(searchFilter);
        if (grid) mainContent.appendChild(grid);

        forumSection.appendChild(mainContent);

        // Create sidebar
        const sidebar = document.createElement('aside');
        sidebar.id = 'activitySidebar';
        sidebar.className = 'activity-sidebar';
        sidebar.innerHTML = `
            <div class="sidebar-card">
                <h3><i class="fa-solid fa-bolt"></i> Aktivitas Terbaru</h3>
                <div id="activityFeed" class="activity-feed"></div>
            </div>
            <div class="sidebar-card">
                <h3><i class="fa-solid fa-trophy"></i> Top Kontributor</h3>
                <div id="topContributors" class="top-contributors"></div>
            </div>
        `;
        forumSection.appendChild(sidebar);

        renderActivityFeed();
        renderTopContributors();
    };

    // TOP CONTRIBUTORS
    const renderTopContributors = () => {
        const container = document.getElementById('topContributors');
        if (!container) return;

        // Count posts per user
        const userCounts = {};
        topics.forEach(t => {
            userCounts[t.user] = (userCounts[t.user] || 0) + 1;
        });

        // Add comment counts
        Object.values(comments).flat().forEach(c => {
            userCounts[c.user] = (userCounts[c.user] || 0) + 0.5;
        });

        const sorted = Object.entries(userCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

        container.innerHTML = sorted.length === 0
            ? '<p style="color: var(--text-muted);">Belum ada kontributor</p>'
            : sorted.map((u, idx) => `
                <div class="contributor-item">
                    <span class="rank">#${idx + 1}</span>
                    <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(u[0])}&background=00ff80&color=fff" alt="${u[0]}">
                    <span>${u[0]}</span>
                    <span class="contrib-count">${Math.floor(u[1])} post</span>
                </div>
            `).join('');
    };

    // INITIALIZE
    if (topicBtn) {
        setupModal();
        topicBtn.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('topicModal').classList.add('active');
        });
    }

    setupCommentModal();
    setupSearchFilter();
    setupDailyChallenges();
    updateLeaderboardFromQuiz();

    // Wait for DOM to be ready for activity feed
    setTimeout(() => {
        setupActivityFeed();
    }, 100);

    renderTopics();
}


// --- COMMUNITY FEATURES (ENHANCED) ---
function initCommunity() {
    initPolling();
    initTopicSearch();
    loadTopics(); // Simulated Persistence
    initLikePersistence();
}

// 1. POLLING LOGIC
function initPolling() {
    const hasVoted = localStorage.getItem('eco_poll_voted');
    const savedStats = JSON.parse(localStorage.getItem('eco_poll_stats')) || { 1: 35, 2: 42, 3: 23, total: 1240 };

    updatePollUI(savedStats, hasVoted);
}

window.votePoll = function (optionId) {
    if (localStorage.getItem('eco_poll_voted')) return;

    let stats = JSON.parse(localStorage.getItem('eco_poll_stats')) || { 1: 35, 2: 42, 3: 23, total: 1240 };
    stats[optionId]++;
    stats.total++;

    localStorage.setItem('eco_poll_stats', JSON.stringify(stats));
    localStorage.setItem('eco_poll_voted', optionId);

    // Animate notification
    showNotification('Terima kasih atas suaramu! 🗳️');

    updatePollUI(stats, optionId);
}

function updatePollUI(stats, userVote) {
    const opts = [1, 2, 3];
    opts.forEach(id => {
        const btn = document.getElementById(`pollOpt${id}`);
        const bar = document.getElementById(`pollBar${id}`);
        const pct = document.getElementById(`pollPct${id}`);

        // Calculate dynamic percentage
        let percentage = Math.round((stats[id] / stats.total) * 100);

        if (bar) bar.style.width = `${percentage}%`;
        if (pct) pct.innerText = `${percentage}%`;

        if (userVote) {
            if (btn) {
                btn.classList.add('disabled');
                btn.style.cursor = 'default';
                btn.removeAttribute('onclick');
            }
            if (id == userVote && btn) {
                btn.style.borderColor = 'var(--primary)';
                if (bar) bar.style.background = 'rgba(0,255,128,0.4)';
            }
        }
    });

    const totalDisplay = document.querySelector('.poll-section p');
    if (totalDisplay) totalDisplay.innerText = `Total Vote: ${stats.total.toLocaleString()} Eco Warriors`;
}

// 2. TOPIC CREATION (Add Topic)
window.openTopicModal = function () {
    document.getElementById('topicModal').classList.add('active');
}

window.closeTopicModal = function () {
    document.getElementById('topicModal').classList.remove('active');
}

window.handleTopicSubmit = function (e) {
    e.preventDefault();

    const title = document.getElementById('topicTitle').value;
    const category = document.getElementById('topicCategory').value;
    const content = document.getElementById('topicContent').value;

    if (title && content) {
        // Create Topic Object
        const newTopic = {
            id: Date.now(),
            title, category, content,
            user: "Eco Warrior (You)",
            avatar: "image/user1.jpg", // Default persistence
            likes: 0,
            comments: 0, // Initial comments
            views: 1
        };

        // Save to LocalStorage (Simulated DB)
        const topics = JSON.parse(localStorage.getItem('eco_topics') || '[]');
        topics.unshift(newTopic);
        localStorage.setItem('eco_topics', JSON.stringify(topics));

        // Add to UI immediately
        renderTopic(newTopic, true);

        closeTopicModal();
        e.target.reset();
        showNotification('Topik berhasil diterbitkan! 📝');
    }
}

function loadTopics() {
    const topics = JSON.parse(localStorage.getItem('eco_topics') || '[]');
    topics.forEach(t => renderTopic(t, false));
}

function renderTopic(t, prepend) {
    const grid = document.getElementById('forumGrid');
    if (!grid) return;

    const card = document.createElement('div');
    card.className = 'forum-card new-topic';
    card.setAttribute('data-category', t.category);
    card.setAttribute('data-aos', 'zoom-in');

    // Tag Color Logic
    let tagColor = '';
    if (t.category === 'Urgent') tagColor = 'style="color: #ff0055; background: rgba(255,0,85,0.1); border-color: rgba(255,0,85,0.2);"';
    else if (t.category === 'Event') tagColor = 'style="color: var(--accent); background: rgba(255,215,0,0.1); border-color: rgba(255,215,0,0.2);"';

    card.innerHTML = `
        <span class="f-tag" ${tagColor}>${t.category}</span>
        <h3 class="f-title">${t.title}</h3>
        <p style="font-size:0.9rem; color:#aaa; margin-bottom:15px; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">${t.content}</p>
        <div class="f-meta">
            <div class="f-user">
                <img src="${t.avatar}" alt="User">
                <span>${t.user}</span>
            </div>
            <div class="f-actions">
                <button class="like-btn" onclick="toggleLike(this)">
                    <i class="fa-solid fa-heart"></i> <span>${t.likes}</span>
                </button>
            </div>
        </div>
    `;

    if (prepend) {
        grid.prepend(card);
    } else {
        grid.append(card);
    }
}

// 3. SEARCH & FILTER
window.initTopicSearch = function () {
    // Already in HTML onkeyup
}

window.filterCategory = function (cat) {
    const cards = document.querySelectorAll('.forum-card');
    const btns = document.querySelectorAll('.filter-tag');

    // Active Button State
    btns.forEach(b => {
        if (b.innerText === cat) b.classList.add('active');
        else b.classList.remove('active');
    });

    cards.forEach(card => {
        // Handle dynamic or static tag
        const tagEl = card.querySelector('.f-tag');
        if (!tagEl) return;
        const cardCat = tagEl.innerText;

        if (cat === 'All' || cardCat === cat) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

window.filterForum = function () {
    const query = document.getElementById('forumSearch').value.toLowerCase();
    const cards = document.querySelectorAll('.forum-card');

    cards.forEach(card => {
        const title = card.querySelector('.f-title').innerText.toLowerCase();
        if (title.includes(query)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// 5. NOTIFICATION SYSTEM (Shared)
function showNotification(msg) {
    let notif = document.getElementById('ecoNotification');
    if (!notif) {
        notif = document.createElement('div');
        notif.id = 'ecoNotification';
        notif.className = 'eco-notification';
        document.body.appendChild(notif);
    }
    notif.innerHTML = `<p><i class="fa-solid fa-circle-check" style="color:#00ff80"></i> ${msg}</p>`;
    notif.classList.add('show');
    setTimeout(() => notif.classList.remove('show'), 3000);
}

// Like Persistence (Simple UI Toggle)
window.toggleLike = function (btn) {
    btn.classList.toggle('active');
    let countSpan = btn.querySelector('span');
    let count = parseInt(countSpan.innerText);

    if (btn.classList.contains('active')) {
        count++;
    } else {
        count--;
    }
    countSpan.innerText = count;
}

function initLikePersistence() {
    // This could be expanded to store liked IDs in LS
}
