/* ==== Carrusel 3D del Equipo - VERSIÓN MEJORADA ==== */

class Carousel3D {
    constructor(containerId, teamMembers) {
        this.container = document.getElementById(containerId);
        this.teamMembers = teamMembers;
        this.currentIndex = 0;
        this.isAnimating = false;
        this.autoplayInterval = null;
        this.autoplayDelay = 10000; // 10 segundos
        this.isPaused = false;
        
        this.init();
    }
    
    init() {
        if (!this.container) {
            console.error('Contenedor del carrusel no encontrado');
            return;
        }
        
        this.renderCards();
        this.updatePositions();
        this.attachEventListeners();
        this.createIndicators();
        this.attachCardHoverEffects();
        this.startAutoplay();
    }
    
    renderCards() {
        this.container.innerHTML = '';
        
        this.teamMembers.forEach((member, index) => {
            const cardWrapper = document.createElement('div');
            cardWrapper.className = 'carousel-card';
            cardWrapper.setAttribute('data-index', index);
            
            cardWrapper.innerHTML = `
                <div class="card equipo-card h-100 border-0 shadow-sm">
                    <img
                        src="${member.image}"
                        class="card-img-top"
                        alt="${member.name}"
                        style="height: 300px; object-fit: cover;"
                        loading="lazy"
                    />
                    <div class="card-body text-center">
                        <h5 class="fw-bold mb-2">${member.name}</h5>
                        <p class="text-muted mb-0">${member.role}</p>
                    </div>
                    <div class="card-footer">
                        <a href="${member.linkedin}" target="_blank" rel="noopener" aria-label="LinkedIn de ${member.name}"><i class="bi bi-linkedin"></i></a>
                        <a href="${member.github}" target="_blank" rel="noopener" aria-label="GitHub de ${member.name}"><i class="bi bi-github"></i></a>
                    </div>
                </div>
            `;
            
            this.container.appendChild(cardWrapper);
        });
    }
    
    updatePositions() {
        const cards = this.container.querySelectorAll('.carousel-card');
        const total = cards.length;
        
        cards.forEach((card, index) => {
            card.classList.remove('active', 'next', 'prev', 'hidden-right', 'hidden-left');
            
            const position = (index - this.currentIndex + total) % total;
            
            //posición de cards
            if (position === 0) {
                card.classList.add('active');
                card.style.visibility = 'visible';
            } else if (position === 1) {
                card.classList.add('next');
                card.style.visibility = 'visible';
            } else if (position === total - 1) {
                card.classList.add('prev');
                card.style.visibility = 'visible';
            } else if (position > 1 && position <= total / 2) {
                card.classList.add('hidden-right');
                card.style.visibility = 'hidden';
            } else {
                card.classList.add('hidden-left');
                card.style.visibility = 'hidden';
            }
        });
        
        this.updateIndicators();
    }
    
    next() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        this.addBlurTransition();
        
        setTimeout(() => {
            this.currentIndex = (this.currentIndex + 1) % this.teamMembers.length;
            this.updatePositions();
            
            setTimeout(() => {
                this.removeBlurTransition();
                this.isAnimating = false;
            }, 450);
        }, 180);
    }
    
    prev() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        this.addBlurTransition();
        
        setTimeout(() => {
            this.currentIndex = (this.currentIndex - 1 + this.teamMembers.length) % this.teamMembers.length;
            this.updatePositions();
            
            setTimeout(() => {
                this.removeBlurTransition();
                this.isAnimating = false;
            }, 450);
        }, 180);
    }
    
    goToSlide(index) {
        if (this.isAnimating || index === this.currentIndex) return;
        
        this.isAnimating = true;
        this.addBlurTransition();
        
        setTimeout(() => {
            this.currentIndex = index;
            this.updatePositions();
            
            setTimeout(() => {
                this.removeBlurTransition();
                this.isAnimating = false;
            }, 450);
        }, 180);
        
        this.resetAutoplay();
    }
    
    addBlurTransition() {
        const cards = this.container.querySelectorAll('.carousel-card');
        // añade blur a las cards visibles (active, next, prev)
        cards.forEach(card => {
            if (!card.classList.contains('hidden-left') && !card.classList.contains('hidden-right')) {
                card.classList.add('transitioning');
            }
        });
    }
    
    removeBlurTransition() {
        const cards = this.container.querySelectorAll('.carousel-card');
        cards.forEach(card => card.classList.remove('transitioning'));
    }
    
    createIndicators() {
        const indicatorContainer = document.createElement('div');
        indicatorContainer.className = 'carousel-indicator';
        
        this.teamMembers.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.setAttribute('data-index', index);
            if (index === 0) dot.classList.add('active');
            
            dot.addEventListener('click', () => this.goToSlide(index));
            indicatorContainer.appendChild(dot);
        });
        
        this.container.parentElement.appendChild(indicatorContainer);
    }
    
    updateIndicators() {
        const indicators = document.querySelectorAll('.carousel-indicator span');
        indicators.forEach((dot, index) => {
            if (index === this.currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    // Eventos de hover de colores integrados
    attachCardHoverEffects() {
        const coloresHover = ['#D7ECEB', '#6EBFC3', '#EBD2EC', '#F9D6E2'];
        const colorOriginal = '#D7ECEB';
        
        const tarjetasEquipo = this.container.querySelectorAll('.equipo-card');
        
        tarjetasEquipo.forEach(tarjeta => {
            tarjeta.addEventListener('mouseenter', () => {
                const indiceAleatorio = Math.floor(Math.random() * coloresHover.length);
                tarjeta.style.backgroundColor = coloresHover[indiceAleatorio];
            });
            
            tarjeta.addEventListener('mouseleave', () => {
                tarjeta.style.backgroundColor = colorOriginal;
            });
        });
    }
    
    attachEventListeners() {
        const nextBtn = document.getElementById('nextBtn');
        const prevBtn = document.getElementById('prevBtn');
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.next();
                this.resetAutoplay();
            });
        }
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.prev();
                this.resetAutoplay();
            });
        }
        
        // Navegación con teclado
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') {
                this.next();
                this.resetAutoplay();
            } else if (e.key === 'ArrowLeft') {
                this.prev();
                this.resetAutoplay();
            }
        });
        
        // Pausar autoplay al pasar el mouse
        this.container.parentElement.addEventListener('mouseenter', () => {
            this.stopAutoplay();
        });
        
        this.container.parentElement.addEventListener('mouseleave', () => {
            if (!this.isPaused) {
                this.startAutoplay();
            }
        });
    }
    
    startAutoplay() {
        if (this.isPaused) return;
        this.stopAutoplay();
        this.autoplayInterval = setInterval(() => {
            this.next();
        }, this.autoplayDelay);
    }
    
    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }
    
    resetAutoplay() {
        this.stopAutoplay();
        this.startAutoplay();
    }
    
    // Método para pausar/reanudar manualmente
    toggleAutoplay() {
        this.isPaused = !this.isPaused;
        if (this.isPaused) {
            this.stopAutoplay();
        } else {
            this.startAutoplay();
        }
        return this.isPaused;
    }
}

// Datos del equipo
const Team = [
    {
        name: "Aylin Lucero Meléndez Juan",
        role: "Desarrolladora Java Frontend y Backend",
        image: "../images/bugBuster/Aylin.webp",
        linkedin: "https://www.linkedin.com/in/aylin-melendez-juan-engineer/",
        github: "https://github.com/Aylin-coder"
    },
    {
        name: "Jose Alejandro Rojas Lona",
        role: "Ingeniero de Mezcla y Mastering. Frontend-Developer",
        image: "../images/bugBuster/Lona.webp",
        linkedin: "https://www.linkedin.com/in/rojaslona/",
        github: "https://github.com/rojaslona"
    },
    {
        name: "Daniel Garduño Palomo",
        role: "Ingeniero Aeroespacial. Desarrollador Backend",
        image: "../images/bugBuster/Daniel.webp",
        linkedin: "https://www.linkedin.com/in/daniel-garduno-palomo/",
        github: "https://github.com/danielgp42"
    },
    {
        name: "Josette Pérez Castillo",
        role: "Técnico Administrativo. Desarrollador Full-Stack",
        image: "../images/bugBuster/Josett.webp",
        linkedin: "https://www.linkedin.com/in/josette-castillo/",
        github: "https://github.com/JosettCast"
    },
    {
        name: "Arturo Ramirez Tejeda",
        role: "Desarrollador Java Full-Stack. Pentester",
        image: "../images/bugBuster/Arturo.webp",
        linkedin: "https://www.linkedin.com/in/arturo-rmzt/",
        github: "https://github.com/Zerek247"
    },
    {
        name: "Anghelo Ortiz Oropeza",
        role: "Psicólogo Forense. Desarrollador Full-Stack",
        image: "../images/bugBuster/Anghelo.webp",
        linkedin: "https://www.linkedin.com/in/anghelo-ortiz/",
        github: "https://github.com/Argelus"
    },
    {
        name: "Erick Alberto Romo Rodríguez",
        role: "Ingeniero en Sistemas. Frontend-Developer.",
        image: "../images/bugBuster/Erick.webp",
        linkedin: "http://www.linkedin.com/in/erick-alberto-romo-rodriguez/",
        github: "http://github.com/erickromorodriguez29"
    },
    {
        name: "Ramón Domínguez Solís",
        role: "Profesional en Finanzas. Desarrollador Java Full-Stack",
        image: "../images/bugBuster/Ramon.webp",
        linkedin: "http://www.linkedin.com/in/ramondominguezsolis/",
        github: "https://github.com/ramonjnds"
    },
    {
        name: "Juan Pérez Marcelo",
        role: "Background en Análisis de Datos. Frontend-Programmer.",
        image: "../images/bugBuster/juan.webp",
        linkedin: "https://www.linkedin.com/in/juanpemarc/",
        github: "http://github.com/juanperez1710"
    }
];

// Inicializar el carrusel cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    const carousel = new Carousel3D('carousel3d', Team);
    
    // Log para confirmar inicialización
    console.log('🎠 Carrusel 3D inicializado correctamente');
    
});