document.addEventListener('DOMContentLoaded', () => {
    const API_KEY = '70c5ed3bd1ae147e7ab4edccf04946dc';
    const isLibraryLoaded = (library) => typeof library !== 'undefined';
    const themeToggleButton = document.getElementById('theme-toggle-button');
    const applyTheme = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        if (themeToggleButton) {
            themeToggleButton.querySelector('i').className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    };
    const savedTheme = localStorage.getItem('theme') || 'dark';
    applyTheme(savedTheme);

    if (themeToggleButton) {
        themeToggleButton.addEventListener('click', () => {
            const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            applyTheme(newTheme);
        });
    }
    const cursorLight = document.querySelector('.cursor-light');
    if (cursorLight && isLibraryLoaded(window.gsap)) {
        document.addEventListener('mousemove', (e) => {
            gsap.to(cursorLight, {
                duration: 0.5,
                x: e.clientX,
                y: e.clientY,
                ease: 'power2.out'
            });
        });
    }
    function createWeatherParticles(weatherType) {
        const existingParticles = document.querySelector('.weather-particles');
        if (existingParticles) {
            existingParticles.remove();
        }

        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'weather-particles';
        document.body.appendChild(particlesContainer);

        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = `particle ${weatherType}`;
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 3 + 's';
            particle.style.animationDuration = (Math.random() * 3 + 2) + 's';
            particlesContainer.appendChild(particle);
        }

        setTimeout(() => {
            if (particlesContainer.parentNode) {
                particlesContainer.remove();
            }
        }, 10000);
    }
    function getWeatherIcon(weatherMain, weatherDescription) {
        const weatherIconMap = {
            'Clear': 'fas fa-sun',
            'Clouds': 'fas fa-cloud',
            'Rain': 'fas fa-cloud-rain',
            'Drizzle': 'fas fa-cloud-drizzle',
            'Thunderstorm': 'fas fa-bolt',
            'Snow': 'fas fa-snowflake',
            'Mist': 'fas fa-smog',
            'Smoke': 'fas fa-smog',
            'Haze': 'fas fa-smog',
            'Dust': 'fas fa-smog',
            'Fog': 'fas fa-smog',
            'Sand': 'fas fa-smog',
            'Ash': 'fas fa-smog',
            'Squall': 'fas fa-wind',
            'Tornado': 'fas fa-tornado'
        };

        return weatherIconMap[weatherMain] || 'fas fa-question-circle';
    }
    if (isLibraryLoaded(window.gsap) && isLibraryLoaded(window.ScrollTrigger)) {
        gsap.registerPlugin(ScrollTrigger);

        gsap.utils.toArray('.section-title, .hero-subtitle, .feature-card, .team-card, .about-container > *, .footer-container > *, .section-header, .suggested-cities').forEach(el => {
            gsap.from(el, {
                y: 50,
                opacity: 0,
                duration: 1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 90%',
                    toggleActions: 'play none none none'
                }
            });
        });
    }

    const animateWeatherCards = () => {
        const cards = document.querySelectorAll('.bento-box');
        cards.forEach((card, index) => {
            if (window.gsap) {
                gsap.fromTo(card,
                    { y: 50, opacity: 0, scale: 0.8 },
                    { y: 0, opacity: 1, scale: 1, duration: 0.6, delay: index * 0.1, ease: "back.out(1.7)" }
                );
            }
        });
    };

    const pageId = document.body.id;

    if (pageId === 'page-home') {
        if (isLibraryLoaded(window.gsap)) {
            gsap.from(".hero-title .line span", {
                duration: 1.2,
                y: 200,
                ease: "power4.out",
                stagger: 0.25,
                delay: 1
            });
        }

        const container = document.getElementById('globe-container');
        if (container && isLibraryLoaded(window.THREE)) {
            try {
                const scene = new THREE.Scene();
                const camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
                const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
                renderer.setSize(container.offsetWidth, container.offsetHeight);
                container.appendChild(renderer.domElement);

                const geometry = new THREE.SphereGeometry(2.5, 64, 64);
                const material = new THREE.MeshStandardMaterial({ color: 0x238636, wireframe: true });
                const sphere = new THREE.Mesh(geometry, material);
                scene.add(sphere);

                const light = new THREE.DirectionalLight(0xffffff, 1.2);
                light.position.set(5, 3, 5);
                scene.add(light);

                camera.position.z = 6;

                const animate = () => {
                    requestAnimationFrame(animate);
                    sphere.rotation.y += 0.001;
                    renderer.render(scene, camera);
                };
                animate();
            } catch (error) {
                console.error("Three.js globe failed:", error);
            }
        }
    }

    if (pageId === 'page-auth') {
        if (isLibraryLoaded(window.gsap)) {
            gsap.from('.auth-card', {
                duration: 1,
                y: 50,
                opacity: 0,
                ease: 'power3.out',
                delay: 0.5
            });

            gsap.from('.auth-visual', {
                duration: 1.2,
                opacity: 0,
                ease: 'power4.inOut',
                delay: 0.2
            });
        }

        const handleAuth = (form) => {
            if (!form) return;
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                localStorage.setItem('climatic_user', JSON.stringify({
                    email: form.email.value
                }));
                window.location.href = 'app.html';
            });
        };

        handleAuth(document.getElementById('login-form'));
        handleAuth(document.getElementById('register-form'));
    }

    if (pageId === 'page-app') {
        if (!localStorage.getItem('climatic_user')) {
            window.location.href = 'login.html';
            return;
        }

        const cityInput = document.getElementById('city-input');
        const searchButton = document.getElementById('search-button');
        const dashboard = document.getElementById('weather-dashboard');
        const cityChips = document.querySelectorAll('.city-chip');

        let currentMap = null;
        let currentChart = null;

        const createHTMLChart = (weather, container) => {
            if (!container) {
                container = document.querySelector('.forecast-chart');
            }

            const humidity = weather.main.humidity || 0;
            const pressure = weather.main.pressure || 1013;
            const windSpeed = weather.wind?.speed || 0;
            const cloudCover = weather.clouds?.all || 0;
            const temperature = Math.round(weather.main.temp) || 0;
            const feelsLike = Math.round(weather.main.feels_like) || 0;

            const title = container.querySelector('h3');
            container.innerHTML = '';
            if (title) {
                container.appendChild(title);
            }

            const chartDiv = document.createElement('div');
            chartDiv.style.cssText = `
                height: 200px; 
                display: flex; 
                flex-direction: column; 
                gap: 0.75rem; 
                padding: 1rem 0.5rem;
                overflow-y: auto;
            `;

            chartDiv.innerHTML = `
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 0.5rem;">
                    <div style="text-align: center; padding: 0.5rem; background: rgba(35, 134, 54, 0.1); border-radius: 8px; border: 1px solid rgba(35, 134, 54, 0.3);">
                        <div style="font-size: 1.5rem; font-weight: 700; color: var(--primary-color);">${temperature}°C</div>
                        <div style="font-size: 0.8rem; color: var(--text-color-light);">Current</div>
                    </div>
                    <div style="text-align: center; padding: 0.5rem; background: rgba(88, 166, 255, 0.1); border-radius: 8px; border: 1px solid rgba(88, 166, 255, 0.3);">
                        <div style="font-size: 1.5rem; font-weight: 700; color: var(--accent-color);">${feelsLike}°C</div>
                        <div style="font-size: 0.8rem; color: var(--text-color-light);">Feels Like</div>
                    </div>
                </div>
                
                <div class="chart-metric">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.3rem;">
                        <span style="font-size: 0.9rem; color: var(--text-color-light); display: flex; align-items: center; gap: 0.3rem;">
                            <i class="fas fa-tint" style="color: var(--primary-color);"></i>
                            Humidity
                        </span>
                        <span style="font-weight: 600; color: var(--primary-color);">${humidity}%</span>
                    </div>
                    <div style="height: 8px; background: rgba(139, 148, 158, 0.3); border-radius: 4px; overflow: hidden;">
                        <div class="progress-bar" style="height: 100%; width: 0%; background: linear-gradient(90deg, var(--primary-color), #4ade80); border-radius: 4px; transition: width 1.5s ease; animation: fillBar${humidity} 1.5s ease-out forwards;"></div>
                    </div>
                </div>
                
                <div class="chart-metric">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.3rem;">
                        <span style="font-size: 0.9rem; color: var(--text-color-light); display: flex; align-items: center; gap: 0.3rem;">
                            <i class="fas fa-thermometer-half" style="color: var(--accent-color);"></i>
                            Pressure
                        </span>
                        <span style="font-weight: 600; color: var(--accent-color);">${pressure} hPa</span>
                    </div>
                    <div style="height: 8px; background: rgba(139, 148, 158, 0.3); border-radius: 4px; overflow: hidden;">
                        <div class="progress-bar" style="height: 100%; width: 0%; background: linear-gradient(90deg, var(--accent-color), #60a5fa); border-radius: 4px; transition: width 1.5s ease; animation: fillBar${Math.min(100, Math.max(0, ((pressure - 980) / (1050 - 980)) * 100))} 1.7s ease-out forwards;"></div>
                    </div>
                </div>
                
                <div class="chart-metric">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.3rem;">
                        <span style="font-size: 0.9rem; color: var(--text-color-light); display: flex; align-items: center; gap: 0.3rem;">
                            <i class="fas fa-wind" style="color: #dd6b20;"></i>
                            Wind Speed
                        </span>
                        <span style="font-weight: 600; color: #dd6b20;">${windSpeed} m/s</span>
                    </div>
                    <div style="height: 8px; background: rgba(139, 148, 158, 0.3); border-radius: 4px; overflow: hidden;">
                        <div class="progress-bar" style="height: 100%; width: 0%; background: linear-gradient(90deg, #dd6b20, #f59e0b); border-radius: 4px; transition: width 1.5s ease; animation: fillBar${Math.min(100, (windSpeed / 20) * 100)} 1.9s ease-out forwards;"></div>
                    </div>
                </div>
                
                <div class="chart-metric">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.3rem;">
                        <span style="font-size: 0.9rem; color: var(--text-color-light); display: flex; align-items: center; gap: 0.3rem;">
                            <i class="fas fa-cloud" style="color: #8b5cf6;"></i>
                            Cloud Cover
                        </span>
                        <span style="font-weight: 600; color: #8b5cf6;">${cloudCover}%</span>
                    </div>
                    <div style="height: 8px; background: rgba(139, 148, 158, 0.3); border-radius: 4px; overflow: hidden;">
                        <div class="progress-bar" style="height: 100%; width: 0%; background: linear-gradient(90deg, #8b5cf6, #a78bfa); border-radius: 4px; transition: width 1.5s ease; animation: fillBar${cloudCover} 2.1s ease-out forwards;"></div>
                    </div>
                </div>
                
                <style>
                    @keyframes fillBar${humidity} { to { width: ${humidity}%; } }
                    @keyframes fillBar${Math.min(100, Math.max(0, ((pressure - 980) / (1050 - 980)) * 100))} { to { width: ${Math.min(100, Math.max(0, ((pressure - 980) / (1050 - 980)) * 100))}%; } }
                    @keyframes fillBar${Math.min(100, (windSpeed / 20) * 100)} { to { width: ${Math.min(100, (windSpeed / 20) * 100)}%; } }
                    @keyframes fillBar${cloudCover} { to { width: ${cloudCover}%; } }
                </style>
            `;

            container.appendChild(chartDiv);
        };

        const createDoughnutChart = (weather) => {
            const chartContainer = document.querySelector('.forecast-chart');

            if (!chartContainer) return;

            if (currentChart) {
                currentChart.destroy();
                currentChart = null;
            }

            const existingCanvas = chartContainer.querySelector('canvas');
            if (existingCanvas) {
                existingCanvas.remove();
            }

            const canvas = document.createElement('canvas');
            canvas.id = 'weather-chart';
            canvas.style.maxWidth = '100%';
            canvas.style.height = '200px';

            const title = chartContainer.querySelector('h3');
            if (title) {
                title.insertAdjacentElement('afterend', canvas);
            } else {
                chartContainer.appendChild(canvas);
            }

            try {
                const ctx = canvas.getContext('2d');
                const humidity = weather.main.humidity || 0;
                const cloudCover = weather.clouds?.all || 0;
                const clearSky = 100 - cloudCover;
                const dryAir = 100 - humidity;

                currentChart = new Chart(ctx, {
                    type: 'doughnut',
                    data: {
                        labels: ['Humidity', 'Dry Air', 'Clouds', 'Clear Sky'],
                        datasets: [{
                            data: [humidity, dryAir, cloudCover, clearSky],
                            backgroundColor: [
                                'rgba(35, 134, 54, 0.8)',
                                'rgba(139, 148, 158, 0.4)',
                                'rgba(88, 166, 255, 0.8)',
                                'rgba(221, 107, 32, 0.6)'
                            ],
                            borderColor: [
                                'rgba(35, 134, 54, 1)',
                                'rgba(139, 148, 158, 0.6)',
                                'rgba(88, 166, 255, 1)',
                                'rgba(221, 107, 32, 1)'
                            ],
                            borderWidth: 2,
                            hoverOffset: 4
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                position: 'bottom',
                                labels: {
                                    color: getComputedStyle(document.documentElement).getPropertyValue('--text-color-light') || '#8b949e',
                                    font: { size: 10 },
                                    padding: 10,
                                    usePointStyle: true
                                }
                            },
                            tooltip: {
                                backgroundColor: 'rgba(22, 27, 34, 0.9)',
                                titleColor: '#e6f1ff',
                                bodyColor: '#e6f1ff',
                                borderColor: 'rgba(35, 134, 54, 0.5)',
                                borderWidth: 1,
                                callbacks: {
                                    label: function (context) {
                                        return `${context.label}: ${context.parsed}%`;
                                    }
                                }
                            }
                        },
                        animation: {
                            animateRotate: true,
                            animateScale: true,
                            duration: 1200
                        }
                    }
                });
            } catch (error) {
                console.error('Doughnut chart failed:', error);
                createHTMLChart(weather);
            }
        };

        const fetchWeatherData = async (city) => {
            try {
                dashboard.innerHTML = `
                    <div class="bento-box loading-state">
                        <div class="loading-spinner"></div>
                        <p>Loading weather data...</p>
                    </div>
                `;

                const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
                const weather = await response.json();

                if (!response.ok) {
                    throw new Error(weather.message || 'Weather data not found');
                }

                const sunrise = new Date(weather.sys.sunrise * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                const sunset = new Date(weather.sys.sunset * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                const weatherIcon = getWeatherIcon(weather.weather[0].main, weather.weather[0].description);

                dashboard.innerHTML = `
                    <div class="bento-box current-weather">
                        <h2>${weather.name}</h2>
                        <div class="weather-icon-container">
                            <i class="weather-icon ${weatherIcon}" id="main-weather-icon"></i>
                        </div>
                        <div class="temperature-display">
                            <span class="temp-number">${Math.round(weather.main.temp)}</span>
                            <span class="temp-unit">°C</span>
                        </div>
                        <p class="weather-description">${weather.weather[0].description}</p>
                        <div class="weather-details">
                            <p>Feels like: ${Math.round(weather.main.feels_like)}°C</p>
                            <p>Pressure: ${weather.main.pressure} hPa</p>
                        </div>
                    </div>
                    
                    <div class="bento-box map-container">
                        <h3>Location Map</h3>
                        <div id="weather-map" style="height: 250px; width: 100%; border-radius: 10px; overflow: hidden; background: #f0f0f0;"></div>
                    </div>
                    
                    <div class="bento-box humidity">
                        <h3>Humidity</h3>
                        <div class="metric-value">${weather.main.humidity}%</div>
                        <div class="metric-bar">
                            <div class="metric-fill" style="width: ${weather.main.humidity}%;"></div>
                        </div>
                    </div>
                    
                    <div class="bento-box wind">
                        <h3>Wind Speed</h3>
                        <div class="metric-value">${weather.wind.speed} m/s</div>
                        <div class="wind-direction">
                            <i class="fas fa-compass" style="transform: rotate(${weather.wind.deg || 0}deg);"></i>
                        </div>
                    </div>
                    
                    <div class="bento-box sunrise">
                        <h3>Sunrise</h3>
                        <div class="time-value">
                            <i class="fas fa-sun sunrise-icon"></i>
                            ${sunrise}
                        </div>
                    </div>
                    
                    <div class="bento-box sunset">
                        <h3>Sunset</h3>
                        <div class="time-value">
                            <i class="fas fa-sun sunset-icon"></i>
                            ${sunset}
                        </div>
                    </div>
                    
                    <div class="bento-box forecast-chart">
                        <h3>Weather Visualization</h3>
                    </div>
                `;

                animateWeatherCards();

                const weatherMain = weather.weather[0].main.toLowerCase();
                if (weatherMain.includes('rain') || weatherMain.includes('drizzle')) {
                    createWeatherParticles('rain');
                } else if (weatherMain.includes('snow')) {
                    createWeatherParticles('snow');
                } else {
                    createWeatherParticles('default');
                }

                setTimeout(() => {
                    initializeMap(weather.coord.lat, weather.coord.lon, weather.name, weather.main.temp);
                }, 500);

                setTimeout(() => {
                    if (typeof Chart !== 'undefined') {
                        console.log('Using Chart.js for visualization');
                        createDoughnutChart(weather);
                    } else {
                        console.log('Chart.js not available, using HTML visualization');
                        createHTMLChart(weather);
                    }
                }, 600);

            } catch (error) {
                console.error('Weather fetch error:', error);
                dashboard.innerHTML = `
                    <div class="bento-box error-state">
                        <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #ff6b6b; margin-bottom: 1rem;"></i>
                        <h3>Weather data unavailable</h3>
                        <p>${error.message}</p>
                        <button class="cta-button secondary" onclick="location.reload()">Try Again</button>
                    </div>
                `;
            }
        };

        const initializeMap = (lat, lon, cityName, temperature) => {
            const mapElement = document.getElementById('weather-map');

            if (!mapElement) {
                console.error('Map container not found');
                return;
            }

            if (currentMap) {
                currentMap.remove();
                currentMap = null;
            }

            if (typeof L === 'undefined') {
                console.error('Leaflet library not loaded');
                mapElement.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #888;">Map library not available</div>';
                return;
            }

            try {
                
                currentMap = L.map(mapElement, {
                    center: [lat, lon],
                    zoom: 12,
                    zoomControl: true,
                    scrollWheelZoom: false
                });

                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '© OpenStreetMap contributors',
                    maxZoom: 18
                }).addTo(currentMap);

                const marker = L.marker([lat, lon]).addTo(currentMap);
                marker.bindPopup(`
                    <div style="text-align: center; padding: 5px;">
                        <strong>${cityName}</strong><br>
                        Temperature: ${Math.round(temperature)}°C
                    </div>
                `).openPopup();

                setTimeout(() => {
                    if (currentMap) {
                        currentMap.invalidateSize();
                    }
                }, 100);

            } catch (error) {
                console.error('Map initialization error:', error);
                mapElement.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #888;">Unable to load map</div>';
            }
        };

        const handleSearch = () => {
            const city = cityInput.value.trim();
            if (city) {
                fetchWeatherData(city);
                cityInput.value = '';
            }
        };

        if (searchButton) {
            searchButton.addEventListener('click', handleSearch);
        }

        if (cityInput) {
            cityInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    handleSearch();
                }
            });
        }

        cityChips.forEach(chip => {
            chip.addEventListener('click', () => {
                const city = chip.textContent.trim();
                fetchWeatherData(city);
            });
        });

        fetchWeatherData('New York');
    }

    setTimeout(() => {
        const preloader = document.querySelector('.preloader');
        if (preloader) {
            preloader.classList.add('loaded');
        }
    }, 2000);
});

const LocationService = {
    currentPosition: null,

    async requestPermission() {
        if (!navigator.geolocation) {
            throw new Error('Geolocation is not supported by this browser');
        }

        try {
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 300000
                });
            });

            this.currentPosition = position;
            return position;
        } catch (error) {
            throw new Error(`Location access denied: ${error.message}`);
        }
    },

    async getCityFromCoordinates(lat, lon) {
        try {
            const response = await fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`);
            const data = await response.json();
            return data[0]?.name || 'Unknown Location';
        } catch (error) {
            console.error('Error getting city name:', error);
            return 'Current Location';
        }
    }
};

const ValidationService = {
    rules: {
        email: {
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Please enter a valid email address'
        },
        password: {
            minLength: 8,
            pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
            message: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character'
        },
        name: {
            minLength: 2,
            pattern: /^[a-zA-Z\s]+$/,
            message: 'Name must contain only letters and spaces (minimum 2 characters)'
        }
    },

    validateField(field, value, rules = {}) {
        const errors = [];
        const customRules = { ...this.rules[field], ...rules };

        if (!value || value.trim() === '') {
            errors.push('This field is required');
            return { isValid: false, errors };
        }

        if (customRules.minLength && value.length < customRules.minLength) {
            errors.push(`Minimum ${customRules.minLength} characters required`);
        }

        if (customRules.pattern && !customRules.pattern.test(value)) {
            errors.push(customRules.message);
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    },

    getPasswordStrength(password) {
        let strength = 0;
        const checks = [
            /.{8,}/, 
            /[a-z]/,
            /[A-Z]/, 
            /\d/,    
            /[@$!%*?&]/ 
        ];

        checks.forEach(check => {
            if (check.test(password)) strength++;
        });

        if (strength <= 2) return 'weak';
        if (strength <= 4) return 'medium';
        return 'strong';
    }
};

if (pageId === 'page-auth') {
    let locationPermissionRequested = false;

  
    setTimeout(() => {
        const banner = document.getElementById('location-banner');
        if (banner && !locationPermissionRequested) {
            banner.style.display = 'block';
        }
    }, 2000);

    const enableLocationBtn = document.getElementById('enable-location');
    if (enableLocationBtn) {
        enableLocationBtn.addEventListener('click', async () => {
            try {
                enableLocationBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

                const position = await LocationService.requestPermission();
                const city = await LocationService.getCityFromCoordinates(
                    position.coords.latitude,
                    position.coords.longitude
                );

                localStorage.setItem('user_location', JSON.stringify({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    city: city,
                    timestamp: Date.now()
                }));

                const banner = document.getElementById('location-banner');
                banner.style.background = 'linear-gradient(135deg, rgba(35, 134, 54, 0.2), rgba(35, 134, 54, 0.1))';
                banner.innerHTML = `
                    <div class="banner-content">
                        <i class="fas fa-check-circle" style="color: var(--primary-color);"></i>
                        <div>
                            <h4>Location Enabled</h4>
                            <p>Weather updates for ${city}</p>
                        </div>
                    </div>
                `;

                setTimeout(() => {
                    banner.style.display = 'none';
                    locationPermissionRequested = true;
                }, 3000);

            } catch (error) {
                enableLocationBtn.innerHTML = '<i class="fas fa-location-arrow"></i>';
                showNotification('Location access failed. You can enable it later in app settings.', 'error');
            }
        });
    }

    document.querySelectorAll('.password-toggle').forEach(toggle => {
        toggle.addEventListener('click', () => {
            const input = toggle.previousElementSibling;
            const icon = toggle.querySelector('i');

            if (input.type === 'password') {
                input.type = 'text';
                icon.className = 'fas fa-eye-slash';
            } else {
                input.type = 'password';
                icon.className = 'fas fa-eye';
            }
        });
    });

    const setupFieldValidation = (form) => {
        const inputs = form.querySelectorAll('input[required]');

        inputs.forEach(input => {
            const fieldName = input.name;
            const errorElement = document.getElementById(`${input.id}-error`);
            const formGroup = input.closest('.form-group');

            input.addEventListener('input', () => {
                validateSingleField(input, fieldName, errorElement, formGroup);

                if (input.id === 'password') {
                    updatePasswordStrength(input.value);
                }

                if (input.id === 'confirm-password') {
                    const passwordField = document.getElementById('password');
                    if (passwordField && input.value !== passwordField.value) {
                        showFieldError(input, errorElement, formGroup, 'Passwords do not match');
                    } else if (input.value === passwordField.value && input.value !== '') {
                        showFieldSuccess(input, formGroup);
                        hideFieldError(errorElement);
                    }
                }
            });

            input.addEventListener('blur', () => {
                if (input.value.trim() !== '') {
                    validateSingleField(input, fieldName, errorElement, formGroup);
                }
            });
        });
    };

    const validateSingleField = (input, fieldName, errorElement, formGroup) => {
        let validationRules = {};

        switch (fieldName) {
            case 'firstName':
            case 'lastName':
                validationRules = 'name';
                break;
            case 'email':
                validationRules = 'email';
                break;
            case 'password':
                validationRules = 'password';
                break;
        }

        const validation = ValidationService.validateField(validationRules, input.value);

        if (!validation.isValid) {
            showFieldError(input, errorElement, formGroup, validation.errors[0]);
        } else {
            showFieldSuccess(input, formGroup);
            hideFieldError(errorElement);
        }

        return validation.isValid;
    };

    const showFieldError = (input, errorElement, formGroup, message) => {
        input.classList.remove('valid', 'success');
        input.classList.add('invalid');
        formGroup.classList.remove('valid');
        formGroup.classList.add('invalid');
        errorElement.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        errorElement.classList.add('show');
    };

    const showFieldSuccess = (input, formGroup) => {
        input.classList.remove('invalid');
        input.classList.add('valid', 'success');
        formGroup.classList.remove('invalid');
        formGroup.classList.add('valid');
    };

    const hideFieldError = (errorElement) => {
        errorElement.classList.remove('show');
    };

    const updatePasswordStrength = (password) => {
        const strengthIndicator = document.getElementById('password-strength');
        if (strengthIndicator) {
            const strength = ValidationService.getPasswordStrength(password);
            strengthIndicator.className = `password-strength ${strength}`;
        }
    };

    const handleAuthForm = (form, isLogin = false) => {
        if (!form) return;

        setupFieldValidation(form);

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(form);
            const submitBtn = form.querySelector('button[type="submit"]');
            const btnText = submitBtn.querySelector('.btn-text');
            const btnLoader = submitBtn.querySelector('.btn-loader');

            let isFormValid = true;
            const inputs = form.querySelectorAll('input[required]');

            inputs.forEach(input => {
                const fieldName = input.name;
                const errorElement = document.getElementById(`${input.id}-error`);
                const formGroup = input.closest('.form-group');

                if (!validateSingleField(input, fieldName, errorElement, formGroup)) {
                    isFormValid = false;
                }
            });

            if (!isLogin) {
                const password = document.getElementById('password').value;
                const confirmPassword = document.getElementById('confirm-password').value;
                const termsCheckbox = document.getElementById('agree-terms');

                if (password !== confirmPassword) {
                    showFieldError(
                        document.getElementById('confirm-password'),
                        document.getElementById('confirm-password-error'),
                        document.getElementById('confirm-password').closest('.form-group'),
                        'Passwords do not match'
                    );
                    isFormValid = false;
                }

                if (!termsCheckbox.checked) {
                    const termsError = document.getElementById('terms-error');
                    termsError.innerHTML = '<i class="fas fa-exclamation-circle"></i> You must agree to the terms and conditions';
                    termsError.classList.add('show');
                    isFormValid = false;
                } else {
                    document.getElementById('terms-error').classList.remove('show');
                }
            }

            if (!isFormValid) {
                showNotification('Please fix the errors before submitting', 'error');
                return;
            }

            submitBtn.classList.add('loading');
            submitBtn.disabled = true;

            try {
                
                await new Promise(resolve => setTimeout(resolve, 2000));

                const userData = {
                    email: formData.get('email'),
                    firstName: formData.get('firstName') || formData.get('email').split('@')[0],
                    lastName: formData.get('lastName') || '',
                    loginTime: new Date().toISOString(),
                    location: JSON.parse(localStorage.getItem('user_location') || '{}')
                };

                localStorage.setItem('climatic_user', JSON.stringify(userData));

                showNotification(`${isLogin ? 'Login' : 'Registration'} successful! Redirecting...`, 'success');

                setTimeout(() => {
                    window.location.href = 'app.html';
                }, 1500);

            } catch (error) {
                console.error('Auth error:', error);
                showNotification('Authentication failed. Please try again.', 'error');

                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
            }
        });
    };

    handleAuthForm(document.getElementById('login-form'), true);
    handleAuthForm(document.getElementById('register-form'), false);

    document.querySelectorAll('[id^="google-"]').forEach(btn => {
        btn.addEventListener('click', () => {
            showNotification('Google authentication would be implemented here', 'info');
        });
    });
}

const showNotification = (message, type = 'info') => {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close"><i class="fas fa-times"></i></button>
        </div>
    `;

    if (!document.querySelector('.notification-styles')) {
        const styles = document.createElement('style');
        styles.className = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: var(--surface-color);
                border: 1px solid var(--border-color);
                border-radius: 10px;
                padding: 1rem;
                box-shadow: 0 10px 30px var(--shadow-color);
                z-index: 1000;
                transform: translateX(400px);
                opacity: 0;
                transition: all 0.3s ease;
                backdrop-filter: blur(20px);
                max-width: 300px;
            }
            .notification.show {
                transform: translateX(0);
                opacity: 1;
            }
            .notification-content {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                color: var(--text-color);
            }
            .notification.success { border-left: 4px solid var(--primary-color); }
            .notification.error { border-left: 4px solid #ff6b6b; }
            .notification.info { border-left: 4px solid var(--accent-color); }
            .notification-close {
                background: none;
                border: none;
                color: var(--text-color-light);
                cursor: pointer;
                margin-left: auto;
                padding: 0.25rem;
            }
        `;
        document.head.appendChild(styles);
    }

    document.body.appendChild(notification);

    setTimeout(() => notification.classList.add('show'), 100);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 5000);

    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    });
};

if (pageId === 'page-app') {
    
    const initializeAppWithLocation = async () => {
        const storedLocation = JSON.parse(localStorage.getItem('user_location') || '{}');

        if (storedLocation.city && storedLocation.timestamp) {
            
            const isRecent = (Date.now() - storedLocation.timestamp) < 3600000;

            if (isRecent) {
                console.log('Using stored location:', storedLocation.city);
                await fetchWeatherData(storedLocation.city);
                return;
            }
        }

        await fetchWeatherData('New York');
    };

    initializeAppWithLocation();
}
