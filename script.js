 
        // Auto-scroll to top on page refresh/load
        if (history.scrollRestoration) {
            history.scrollRestoration = 'manual';
        }
        window.addEventListener('beforeunload', function () {
            window.scrollTo(0, 0);
        });

        // Loader Logic - Cinematic Digital
        document.addEventListener('DOMContentLoaded', () => {
            const rings = [
                document.getElementById('ring-1'),
                document.getElementById('ring-2'),
                document.getElementById('ring-3')
            ];
            const shutter = document.getElementById('lens-shutter');
            const scanLine = document.getElementById('scan-line');
            const progressFill = document.getElementById('loader-progress-fill');
            const bgPercentage = document.getElementById('loader-bg-percentage');

            // Animate rings
            gsap.to(rings[0], { rotate: 360, duration: 10, repeat: -1, ease: "none" });
            gsap.to(rings[1], { rotate: -360, duration: 15, repeat: -1, ease: "none" });
            gsap.to(rings[2], { rotate: 360, duration: 8, repeat: -1, ease: "none" });

            // Shutter pulse
            gsap.to(shutter, {
                scale: 1.1,
                boxShadow: "0 0 50px rgba(255, 107, 53, 0.5)",
                duration: 1,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });

            // Scan line loop
            gsap.set(scanLine, { opacity: 0.5, top: "-10%" });
            gsap.to(scanLine, {
                top: "110%",
                duration: 2,
                repeat: -1,
                ease: "none"
            });

            // Loading Progress
            let progress = { value: 0 };
            gsap.to(progress, {
                value: 100,
                duration: 4,
                ease: "power2.inOut",
                onUpdate: () => {
                    const p = Math.floor(progress.value);
                    progressFill.style.width = p + '%';
                    bgPercentage.innerText = p.toString().padStart(2, '0');
                },
                onComplete: () => {
                    // Dramatic exit
                    const tl = gsap.timeline({
                        onComplete: () => {
                            document.getElementById('loader').style.display = 'none';
                            startAnimations();
                        }
                    });

                    tl.to('.loader-camera-container', { scale: 1.5, opacity: 0, duration: 0.8, ease: "power4.in" })
                        .to('.loader-text-container, .loader-progress-container', { y: 20, opacity: 0, duration: 0.5 }, "-=0.6")
                        .to('#loader', { backgroundColor: "transparent", backdropFilter: "blur(0px)", duration: 0.5 }, "-=0.2")
                        .to('#loader', { opacity: 0, duration: 0.5 });
                }
            });
        });

        // Three.js
        let scene, camera, renderer, sculpture;
        function initThreeJS() {
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            document.getElementById('threejs-container').appendChild(renderer.domElement);
            sculpture = new THREE.Group();
            const cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
            const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xff6b35, wireframe: true });
            const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
            cube.position.set(-8, 0, 0);
            sculpture.add(cube);
            const sphereGeometry = new THREE.SphereGeometry(3, 32, 32);
            const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x06ffa5, wireframe: true });
            const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
            sphere.position.set(8, 0, 0);
            sculpture.add(sphere);
            const coneGeometry = new THREE.ConeGeometry(3, 6, 8);
            const coneMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });
            const cone = new THREE.Mesh(coneGeometry, coneMaterial);
            cone.position.set(0, 6, 0);
            sculpture.add(cone);
            scene.add(sculpture);
            camera.position.z = 25;
            animate();
        }
        function animate() {
            requestAnimationFrame(animate);
            sculpture.rotation.x += 0.001;
            sculpture.rotation.y += 0.002;
            renderer.render(scene, camera);
        }
        initThreeJS();
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        // Anime.js Animations
        function startAnimations() {
            anime({
                targets: '.heading-main',
                translateY: [50, 0],
                opacity: [0, 1],
                duration: 1200,
                delay: anime.stagger(200, { start: 300 }),
                easing: 'easeOutExpo'
            });
        }

        // Navbar scroll effect
        window.addEventListener('scroll', () => {
            const navbar = document.getElementById('navbar');
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        // --- JOURNEY SWIPER LOGIC ---
        const journeySwiper = new Swiper('.journey-swiper', {
            effect: 'coverflow',
            grabCursor: true,
            centeredSlides: true,
            slidesPerView: 'auto',
            initialSlide: 2, // Start with middle card (card 3)
            coverflowEffect: {
                rotate: 0,
                stretch: 0,
                depth: 100,
                modifier: 2.5,
                slideShadows: false, // Cleaner look without shadows
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            autoplay: {
                delay: 4000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true
            },
            loop: false, // Disabled loop to fix navigation order
            speed: 600,
            breakpoints: {
                320: {
                    slidesPerView: 1,
                    effect: 'slide',
                    spaceBetween: 20
                },
                768: {
                    slidesPerView: 'auto',
                    effect: 'coverflow'
                }
            }
        });
        // --- END JOURNEY SWIPER LOGIC ---


        // Portfolio Filter Logic
        const filterBtns = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const filter = btn.getAttribute('data-filter');
                projectCards.forEach(card => {
                    if (filter === 'all' || card.getAttribute('data-category') === filter) {
                        card.style.display = 'block';
                        anime({ targets: card, scale: [0.8, 1], opacity: [0, 1], duration: 500, easing: 'easeOutExpo' });
                    } else {
                        anime({ targets: card, scale: [1, 0.8], opacity: [1, 0], duration: 500, easing: 'easeInExpo', complete: () => { card.style.display = 'none'; } });
                    }
                });
            });
        });

        // Form submission
        document.querySelector('.contact-form').addEventListener('submit', function (e) {
            e.preventDefault();
            if (this.checkValidity()) {
                alert('شكرًا لتواصلك معنا! وصل طلبك وسيتواصل معك فريقنا في أقرب وقت ممكن.');
                this.reset();
            } else {
                this.reportValidity();
            }
        });

        // --- MOBILE NAVIGATION LOGIC ---
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const mobileMenu = document.getElementById('mobileMenu');
        const mobileMenuClose = document.getElementById('mobileMenuClose');
        const mobileLinks = document.querySelectorAll('.mobile-nav-link');

        function toggleMobileMenu() {
            mobileMenuBtn.classList.toggle('open');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        }

        mobileMenuBtn.addEventListener('click', toggleMobileMenu);

        if (mobileMenuClose) {
            mobileMenuClose.addEventListener('click', toggleMobileMenu);
        }

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                toggleMobileMenu();
            });
        });

        // --- SCROLL SPY LOGIC ---
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-link');
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

        function activeMenu() {
            let len = sections.length;
            while (--len && window.scrollY + 150 < sections[len].offsetTop) { }

            navLinks.forEach(ltx => ltx.classList.remove('active'));
            if (navLinks[len]) navLinks[len].classList.add('active');

            mobileNavLinks.forEach(ltx => ltx.classList.remove('active'));
            if (mobileNavLinks[len]) mobileNavLinks[len].classList.add('active');
        }
        activeMenu();
        window.addEventListener('scroll', activeMenu);
        // --- END SCROLL SPY LOGIC ---

        // --- HERO SLIDER LOGIC ---
        document.addEventListener('DOMContentLoaded', () => {
            const heroSlides = document.querySelectorAll('.hero-slide');
            const heroDots = document.querySelectorAll('.hero-dot');
            const heroPrevBtn = document.querySelector('.hero-nav-btn.prev');
            const heroNextBtn = document.querySelector('.hero-nav-btn.next');
            let currentHeroSlide = 0;
            const totalHeroSlides = heroSlides.length;
            let heroAutoPlayInterval;

            function showHeroSlide(index) {
                if (index >= totalHeroSlides) index = 0;
                if (index < 0) index = totalHeroSlides - 1;

                currentHeroSlide = index;

                // Slides
                heroSlides.forEach(slide => slide.classList.remove('active'));
                heroSlides[currentHeroSlide].classList.add('active');

                // Dots
                heroDots.forEach(dot => dot.classList.remove('active'));
                if (heroDots[currentHeroSlide]) heroDots[currentHeroSlide].classList.add('active');
            }

            function nextHeroSlide() {
                showHeroSlide(currentHeroSlide + 1);
            }

            function prevHeroSlide() {
                showHeroSlide(currentHeroSlide - 1);
            }

            function startHeroAutoPlay() {
                heroAutoPlayInterval = setInterval(nextHeroSlide, 6000);
            }

            function stopHeroAutoPlay() {
                clearInterval(heroAutoPlayInterval);
            }

            if (heroNextBtn) heroNextBtn.addEventListener('click', () => {
                nextHeroSlide();
                stopHeroAutoPlay();
                startHeroAutoPlay();
            });

            if (heroPrevBtn) heroPrevBtn.addEventListener('click', () => {
                prevHeroSlide();
                stopHeroAutoPlay();
                startHeroAutoPlay();
            });

            heroDots.forEach((dot, idx) => {
                dot.addEventListener('click', () => {
                    showHeroSlide(idx);
                    stopHeroAutoPlay();
                    startHeroAutoPlay();
                });
            });

            const heroContainer = document.querySelector('.hero-slider-container');
            if (heroContainer) {
                heroContainer.addEventListener('mouseenter', stopHeroAutoPlay);
                heroContainer.addEventListener('mouseleave', startHeroAutoPlay);
            }

            // Init
            startHeroAutoPlay();
        });
        // --- END HERO SLIDER LOGIC ---

        // Back to Top Logic
        const backToTopBtn = document.getElementById('backToTop');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // --- VIDEO MODAL LOGIC (FINAL ROBUST VERSION) ---
        window.addEventListener('load', () => {
            const videoModal = document.getElementById('videoModal');
            const modalVideo = document.getElementById('modalVideo');
            const modalTitle = document.getElementById('modalTitle');
            const modalClose = document.getElementById('modalClose');

            if (!videoModal) return;

            // Direct click listeners for all current cards
            function attachCardListeners() {
                const cards = document.querySelectorAll('.project-card');
                cards.forEach(card => {
                    // Remove existing listeners if any (optional but safer)
                    card.onclick = (e) => {
                        e.preventDefault();
                        const videoUrl = card.getAttribute('data-video');
                        const title = card.querySelector('h3') ? card.querySelector('h3').innerText : "مشروع إبداعي";

                        if (videoUrl && modalVideo) {
                            modalVideo.src = videoUrl;
                            modalTitle.innerText = title;
                            videoModal.classList.add('active');
                            document.body.style.overflow = 'hidden';
                            modalVideo.load();
                            modalVideo.play().catch(err => console.log("Silent play fail:", err));
                        }
                    };
                });
            }

            attachCardListeners();

            // Also keep delegation for filtered items
            document.addEventListener('click', (e) => {
                const card = e.target.closest('.project-card');
                if (card && !videoModal.classList.contains('active')) {
                    const videoUrl = card.getAttribute('data-video');
                    const titleNode = card.querySelector('h3');
                    if (videoUrl) {
                        modalVideo.src = videoUrl;
                        if (titleNode) modalTitle.innerText = titleNode.innerText;
                        videoModal.classList.add('active');
                        document.body.style.overflow = 'hidden';
                        modalVideo.load();
                        modalVideo.play().catch(e => { });
                    }
                }
            });

            function closeVideoModal() {
                videoModal.classList.remove('active');
                if (modalVideo) modalVideo.src = '';
                document.body.style.overflow = '';
            }

            if (modalClose) modalClose.onclick = closeVideoModal;

            videoModal.onclick = (e) => {
                if (e.target === videoModal) closeVideoModal();
            };

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') closeVideoModal();
            });
        });

        // Failsafe: Ensure all project cards are visible on load
        window.addEventListener('load', () => {
            const cards = document.querySelectorAll('.project-card');
            cards.forEach(card => {
                card.style.display = 'block';
                card.style.opacity = '1';
                card.style.visibility = 'visible';
            });
            console.log("Portfolio visibility failsafe triggered. Count:", cards.length);
        });

        // --- GSAP PULSE ANIMATION REMOVED ---
    