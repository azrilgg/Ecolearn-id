// 3D WASTE SORTING GALLERY (ENHANCED)
// Uses Three.js & GSAP

const initWasteSorting3D = () => {
    const container = document.getElementById('canvas-container');
    if (!container) return;

    // SCENE SETUP
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0f2027, 0.02); // Matching CSS gradient

    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 8;
    camera.position.y = 1;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.domElement.style.outline = "none";
    container.appendChild(renderer.domElement);

    // LIGHTING
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x00ff80, 1.5, 30);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    const purpleLight = new THREE.PointLight(0x9c27b0, 0.8, 30);
    purpleLight.position.set(-5, -5, 5);
    scene.add(purpleLight);

    // EXPANDED DATA
    const wasteData = [
        {
            type: 'Organik',
            color: '#4caf50',
            icon: 'fa-leaf',
            bgImage: 'image/organik.jpg',
            desc: 'Sampah yang berasal dari sisa makhluk hidup dan mudah terurai secara alami oleh mikroorganisme.',
            time: '1 - 6 Bulan',
            method: 'Kompos / Biopori',
            impact: 'Jika tidak dikelola, menumpuk di TPA dan menghasilkan gas metana (CH4) yang menyebabkan pemanasan global.',
            tips: 'Habiskan porsi makan, olah sisa sayur/buah menjadi eco-enzyme, atau buat lubang biopori di halaman.',
            funfact: 'Kulit pisang bisa terurai dalam 2 minggu, tapi kulit jeruk butuh 6 bulan karena sifat asamnya!',
            example: 'Sisa makanan, kulit buah, daun kering, ranting, tulang ikan.'
        },
        {
            type: 'Plastik',
            color: '#2196f3',
            icon: 'fa-bottle-water',
            bgImage: 'image/plastic.jpg',
            desc: 'Sampah polimer sintetis yang sangat sulit terurai secara alami dan mencemari laut serta tanah.',
            time: '50 - 500 Tahun',
            method: 'Ecobrick / Daur Ulang',
            impact: 'Menjadi mikroplastik yang termakan ikan dan akhirnya masuk ke tubuh manusia. Menyumbat saluran air penyebab banjir.',
            tips: 'Bawa tumblr dan tas belanja sendiri. Hindari sedotan plastik. Cuci bersih sampah plastik sebelum disetor ke Bank Sampah.',
            funfact: 'Satu botol plastik butuh 450 tahun untuk hancur sepenuhnya di alam.',
            example: 'Botol minum, kantong kresek, kemasan sachet, wadah makanan, sedotan.'
        },
        {
            type: 'Kertas',
            color: '#ffc107',
            icon: 'fa-newspaper',
            bgImage: 'image/paper.jpg',
            desc: 'Sampah berbahan dasar serat kayu (selulosa) yang mudah didaur ulang menjadi produk kertas baru.',
            time: '2 - 6 Minggu',
            method: 'Daur Ulang Kertas',
            impact: 'Pemborosan kertas berarti penebangan pohon lebih banyak. Kertas di TPA juga bisa menghasilkan metana.',
            tips: 'Gunakan kertas dua sisi. Hindari mencetak struk jika tidak perlu. Daur ulang menjadi kerajinan bubur kertas.',
            funfact: 'Setiap 1 ton kertas daur ulang dapat menyelamatkan 17 pohon dewasa!',
            example: 'Koran, kardus, kertas tulis, majalah, amplop, karton susu.'
        },
        {
            type: 'Kaca',
            color: '#e0e0e0',
            icon: 'fa-wine-bottle',
            bgImage: 'image/kaca.jpg',
            desc: 'Material padat transparan yang bisa didaur ulang tanpa batas waktu tanpa penurunan kualitas (infinite recycling).',
            time: '1 Juta Tahun',
            method: 'Lebur & Cetak Ulang',
            impact: 'Pecahan kaca berbahaya bagi hewan dan manusia. Kaca di alam tidak akan terurai selamanya.',
            tips: 'Gunakan kembali wadah selai atau sirup untuk menyimpan bumbu. Jangan campur pecahan kaca dengan sampah lain.',
            funfact: 'Kaca terbentuk dari pasir kuarsa yang dipanaskan hingga suhu ekstrem >1700°C.',
            example: 'Botol sirup, toples selai, cermin pecah, gelas, botol parfum.'
        },
        {
            type: 'Logam',
            color: '#ff5722',
            icon: 'fa-can-food',
            bgImage: 'image/logam.jpg',
            desc: 'Sampah mineral tambang yang kuat dan bernilai ekonomis tinggi untuk didaur ulang.',
            time: '50 - 200 Tahun',
            method: 'Bank Sampah',
            impact: 'Penambangan bijih logam merusak ekosistem. Daur ulang logam menghemat energi hingga 95% dibanding tambang baru.',
            tips: 'Pilah kaleng aluminium dan besi terpisah. Remukkan kaleng untuk menghemat ruang penyimpanan.',
            funfact: 'Aluminium adalah logam yang paling banyak didaur ulang di dunia.',
            example: 'Kaleng minuman, seng, paku, peralatan masak bekas, tutup botol.'
        },
        {
            type: 'E-Waste',
            color: '#9c27b0',
            icon: 'fa-battery-full',
            bgImage: 'image/e-waste.jpg',
            desc: 'Sampah elektronik yang mengandung bahan berbahaya dan beracun (B3) seperti merkuri dan timbal.',
            time: 'Tidak Terurai',
            method: 'Drop Box E-Waste',
            impact: 'Mencemari air tanah dan tanah dengan logam berat yang beracun, menyebabkan kanker dan kerusakan saraf.',
            tips: 'Jangan buang di tempat sampah biasa! Kumpulkan dan setor ke dropbox khusus e-waste (misal: di mall/kantor pos).',
            funfact: 'Dalam 1 ton handphone bekas, terdapat emas lebih banyak daripada 1 ton bijih emas tambang!',
            example: 'Baterai bekas, kabel rusak, HP jadul, lampu bohlam, charger, laptop rusak.'
        }
    ];

    // CREATE CARDS
    const cards = [];
    const group = new THREE.Group();
    scene.add(group);

    const radius = 5;
    const cardGeometry = new THREE.PlaneGeometry(2.4, 3.4);

    // Texture Helper
    const createTexturedMaterial = (text, color, bgImage) => {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 768;
        const ctx = canvas.getContext('2d');
        const texture = new THREE.CanvasTexture(canvas);

        // Function to draw content
        const drawContent = (img = null) => {
            // Background
            if (img) {
                // Draw Image (Cover)
                const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
                const x = (canvas.width / 2) - (img.width / 2) * scale;
                const y = (canvas.height / 2) - (img.height / 2) * scale;
                ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

                // Dark Overlay for readability
                ctx.fillStyle = 'rgba(0,0,0,0.6)';
                ctx.fillRect(0, 0, 512, 768);
            } else {
                // Fallback Gradient
                const grd = ctx.createLinearGradient(0, 0, 512, 768);
                grd.addColorStop(0, color);
                grd.addColorStop(1, '#051a1a');
                ctx.fillStyle = grd;
                ctx.fillRect(0, 0, 512, 768);
            }

            // Glass Shine Effect
            const shine = ctx.createLinearGradient(0, 0, 512, 768);
            shine.addColorStop(0, 'rgba(255,255,255,0.2)');
            shine.addColorStop(0.5, 'rgba(255,255,255,0)');
            ctx.fillStyle = shine;
            ctx.fillRect(0, 0, 512, 300);

            // Border
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 15;
            ctx.strokeRect(15, 15, 482, 738);

            // Text
            ctx.shadowColor = "rgba(0,0,0,0.8)";
            ctx.shadowBlur = 20;
            ctx.shadowOffsetX = 5;
            ctx.shadowOffsetY = 5;

            ctx.fillStyle = '#fff';
            ctx.font = '900 65px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(text.toUpperCase(), 256, 384);

            ctx.font = '30px Arial';
            ctx.fillStyle = color; // Use type color for text
            ctx.fillText("TAP FOR DETAILS", 256, 450);

            texture.needsUpdate = true;
        };

        // Draw initial fallback
        drawContent();

        // Load specific image
        if (bgImage) {
            const img = new Image();
            img.src = bgImage;
            img.onload = () => drawContent(img);
        }

        return new THREE.MeshLambertMaterial({ map: texture, side: THREE.DoubleSide });
    };

    wasteData.forEach((data, i) => {
        const angle = (i / wasteData.length) * Math.PI * 2;
        const material = createTexturedMaterial(data.type, data.color, data.bgImage);
        const card = new THREE.Mesh(cardGeometry, material);

        // Position in circle
        card.position.x = Math.cos(angle) * radius;
        card.position.z = Math.sin(angle) * radius;
        card.rotation.y = -angle + Math.PI / 2;

        card.userData = { id: i, data: data };

        group.add(card);
        cards.push(card);
    });

    // PARTICLE SYSTEM (ENHANCEMENT)
    const particleGeo = new THREE.BufferGeometry();
    const particleCount = 200;
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i++) {
        particlePositions[i] = (Math.random() - 0.5) * 20;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
        color: 0x00ff80,
        size: 0.05,
        transparent: true,
        opacity: 0.6
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // INTERACTION
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let targetRotation = 0;

    // Touch & Mouse Events for Drag
    const onStart = (x, y) => {
        isDragging = true;
        previousMousePosition = { x, y };
    };

    const onMove = (x, y) => {
        if (!isDragging) return;
        const deltaMove = { x: x - previousMousePosition.x };
        targetRotation += deltaMove.x * 0.005;
        previousMousePosition = { x, y };
    };

    const onEnd = () => isDragging = false;

    // Mouse Listeners
    container.addEventListener('mousedown', (e) => onStart(e.clientX, e.clientY));
    container.addEventListener('mousemove', (e) => onMove(e.clientX, e.clientY));
    window.addEventListener('mouseup', onEnd);

    // Touch Listeners (Mobile)
    container.addEventListener('touchstart', (e) => onStart(e.touches[0].clientX, e.touches[0].clientY));
    container.addEventListener('touchmove', (e) => onMove(e.touches[0].clientX, e.touches[0].clientY));
    window.addEventListener('touchend', onEnd);

    // Raycaster
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onClick = (clientX, clientY) => {
        if (isDragging) return;

        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(cards);

        if (intersects.length > 0) {
            const selected = intersects[0].object;
            showInfo(selected.userData.data);

            gsap.to(selected.scale, { x: 1.1, y: 1.1, duration: 0.2, yoyo: true, repeat: 1 });
            gsap.to(selected.rotation, { y: selected.rotation.y + Math.PI * 2, duration: 1 });
        }
    };

    container.addEventListener('click', (e) => onClick(e.clientX, e.clientY));
    // container.addEventListener('touchend', ...); // handled via click usually works, but sometimes needs specific touch handler

    // UI LOGIC
    const overlay = document.getElementById('ws-info-overlay');
    const closeBtn = document.getElementById('ws-close-btn');

    // AVAILABLE IMAGES (From local directory)
    const availableImages = [
        'image/forest.jpg', 'image/water.jpg', 'image/recycle.jpg', 'image/botol-lampu.jpg',
        'image/sampah.jpg', 'image/clean-energy.jpg', 'image/habitat.jpg', 'image/kebun.jpg',
        'image/lingkungan.jpg', 'image/ocean.jpg', 'image/polusi.jpg', 'image/wildlife.jpg'
    ];

    const showInfo = (data) => {
        document.getElementById('ws-title-display').innerText = data.type;
        document.getElementById('ws-desc-display').innerText = data.desc;
        document.getElementById('ws-time-display').innerText = data.time;
        document.getElementById('ws-method-display').innerText = data.method;
        document.getElementById('ws-example-display').innerText = data.example;

        // Expanded Fields
        document.getElementById('ws-impact-display').innerText = data.impact;
        document.getElementById('ws-tips-display').innerText = data.tips;
        document.getElementById('ws-funfact-display').innerText = data.funfact;

        // Specific Image Injection
        const imgElement = document.getElementById('ws-random-image');
        if (imgElement && data.bgImage) {
            imgElement.src = data.bgImage;
        }

        // Update Icon
        const iconContainer = document.getElementById('ws-icon-display');
        iconContainer.innerHTML = `<i class="fa-solid ${data.icon}"></i>`;
        iconContainer.style.borderColor = data.color;
        iconContainer.style.color = data.color;
        iconContainer.style.boxShadow = `0 10px 30px ${data.color}4d`;

        overlay.classList.add('active');
    };

    closeBtn.addEventListener('click', () => {
        overlay.classList.remove('active');
    });

    // ANIMATION LOOP
    const animate = () => {
        requestAnimationFrame(animate);

        group.rotation.y += (targetRotation - group.rotation.y) * 0.08;

        if (!isDragging) {
            targetRotation += 0.002; // Slow auto rotate
        }

        const time = Date.now() * 0.001;
        cards.forEach((card, i) => {
            card.position.y = Math.sin(time + i) * 0.15; // Floating
        });

        // Rotate particles
        particles.rotation.y += 0.001;
        particles.rotation.x += 0.0005;

        renderer.render(scene, camera);
    };

    animate();

    window.addEventListener('resize', () => {
        if (!container) return;
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
};

window.addEventListener('load', initWasteSorting3D);
