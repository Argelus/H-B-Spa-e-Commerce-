// /Front-end/components/animated-testimonials.js
document.addEventListener('DOMContentLoaded', () => {
    const teamData = [
        {
            bio: "Anghelo es nuestro especialista principal en masajes terapéuticos, con más de 10 años de experiencia en técnicas de relajación profunda y alivio del estrés. Su enfoque holístico asegura una experiencia renovadora.",
            name: "Anghelo",
            role: "Masajista Terapéutico",
            img: "images/bugBuster/Anghelo.webp",
        },
        {
            bio: "Arturo lidera nuestro equipo de estética facial. Utiliza las técnicas más innovadoras y productos orgánicos para crear tratamientos personalizados que revitalizan y rejuvenecen la piel.",
            name: "Arturo",
            role: "Esteticista Principal",
            img: "images/bugBuster/Arturo.webp",
        },
        {
            bio: "Aylin es experta en cuidado corporal y exfoliaciones. Su pasión por los ingredientes naturales y su técnica detallista dejan la piel suave, hidratada y radiante tras cada sesión.",
            name: "Aylin",
            role: "Especialista Corporal",
            img: "images/bugBuster/Aylin.webp",
        },
        {
            bio: "Daniel es nuestro especialista en terapias alternativas, incluyendo aromaterapia y reflexología. Su calma y conocimiento ayudan a nuestros clientes a encontrar el equilibrio perfecto entre cuerpo y mente.",
            name: "Daniel",
            role: "Terapeuta Holístico",
            img: "images/bugBuster/Daniel.webp",
        },
        {
            bio: "Erick se encarga de la experiencia del cliente, asegurando que cada visita sea perfecta desde la llegada hasta la partida. Su atención al detalle y amabilidad hacen que todos se sientan bienvenidos.",
            name: "Erick",
            role: "Coordinador de Bienestar",
            img: "images/bugBuster/Erick.webp",
        },
        {
            bio: "Josett es nuestra manicurista y pedicurista estrella. Transforma el cuidado de manos y pies en un arte, utilizando productos de alta calidad para un acabado impecable y duradero.",
            name: "Josett",
            role: "Artista de Uñas",
            img: "images/bugBuster/Josett.webp",
        },
        {
            bio: "Juan es un talentoso masajista especializado en técnicas deportivas y de tejido profundo. Es el preferido de los atletas y de quienes buscan aliviar tensiones musculares crónicas.",
            name: "Juan",
            role: "Masajista Deportivo",
            img: "images/bugBuster/juan.webp",
        },
        {
            bio: "Lona es la fundadora y alma de H&B SPA. Con una visión clara de bienestar integral, supervisa cada detalle para garantizar una experiencia de lujo, calidad y relajación inigualable.",
            name: "Lona",
            role: "Directora y Fundadora",
            img: "images/bugBuster/Lona.webp",
        },
        {
            bio: "Ramón es nuestro experto en hidroterapia y circuitos de agua. Guía a los clientes a través de experiencias acuáticas que desintoxican el cuerpo y calman la mente.",
            name: "Ramón",
            role: "Experto en Hidroterapia",
            img: "images/bugBuster/Ramon.webp",
        },
    ];

    const section = document.getElementById('team-section');
    if (!section) return;

    const imageStack = section.querySelector('.image-stack');
    const contentWrapper = section.querySelector('.team-member-content-wrapper');
    const prevBtn = section.querySelector('#team-member-prev');
    const nextBtn = section.querySelector('#team-member-next');

    let currentIndex = 0;
    let isAnimating = false;

    function init() {
        imageStack.innerHTML = '';
        contentWrapper.innerHTML = '';

        teamData.forEach((member, index) => {
            const imgWrapper = document.createElement('div');
            imgWrapper.classList.add('team-member-img-wrapper');
            imgWrapper.dataset.index = index;
            const img = document.createElement('img');
            img.src = member.img;
            img.alt = member.name;
            imgWrapper.appendChild(img);
            imageStack.appendChild(imgWrapper);

            const contentItem = document.createElement('div');
            contentItem.classList.add('team-member-item');
            contentItem.dataset.index = index;
            contentItem.innerHTML = `
                <p class="bio">“${member.bio}”</p>
                <p class="name">${member.name}</p>
                <p class="role">${member.role}</p>
            `;
            contentWrapper.appendChild(contentItem);
        });

        updateSlides(true);

        nextBtn.addEventListener('click', () => navigate('next'));
        prevBtn.addEventListener('click', () => navigate('prev'));
    }

    function navigate(direction) {
        if (isAnimating) return;
        isAnimating = true;

        const newIndex = direction === 'next'
            ? (currentIndex + 1) % teamData.length
            : (currentIndex - 1 + teamData.length) % teamData.length;

        currentIndex = newIndex;
        updateSlides();

        setTimeout(() => {
            isAnimating = false;
        }, 600);
    }

    function updateSlides() {
        const imageWrappers = section.querySelectorAll('.team-member-img-wrapper');
        const contentItems = section.querySelectorAll('.team-member-item');

        const prevIndex = (currentIndex - 1 + teamData.length) % teamData.length;
        const nextIndex = (currentIndex + 1) % teamData.length;

        imageWrappers.forEach((wrapper, index) => {
            wrapper.classList.remove('is-active', 'is-prev', 'is-next', 'is-inactive');
            if (index === currentIndex) {
                wrapper.classList.add('is-active');
            } else if (index === prevIndex) {
                wrapper.classList.add('is-prev');
            } else if (index === nextIndex) {
                wrapper.classList.add('is-next');
            } else {
                wrapper.classList.add('is-inactive');
            }
        });

        contentItems.forEach((item, index) => {
            item.classList.remove('is-active');
            if (index === currentIndex) {
                item.classList.add('is-active');
            }
        });
    }

    init();
});

