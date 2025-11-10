

const FAQ_DATA = [
  {
    id: 1,
    question: "¿Qué tipo de tratamientos ofrecen?",
    answer: "Faciales, corporales, masajes holísticos y reductivos, tratamientos cosméticos, depilación permanente, depilación con cera, tratamientos EMS y radiofrecuencia, HIFU, hidrofacial, quiropraxia, despigmentación, drenaje linfático y rehabilitación clínica y cosmética (postoperatoria)."
  },
  {
    id: 2,
    question: "¿Cuánto tiempo dura cada sesión?",
    answer: "Las depilaciones suelen durar entre 15 y 20 minutos, mientras que otros tratamientos pueden extenderse hasta 3 horas, según su complejidad."
  },
  {
    id: 3,
    question: "¿Cómo es el proceso para reagendar?",
    answer: "Debes avisar con al menos 24 horas de anticipación para no perder tu depósito de $150. Para reagendar tu cita, comunícate con nosotros vía WhatsApp al 5562316302 e indícanos tus horarios disponibles."
  },
  {
    id: 4,
    question: "¿Puedo personalizar un paquete o combinar servicios?",
    answer: "Sí, puedes consultar nuestras promociones contactándonos vía WhatsApp al 5562316302."
  },
  {
    id: 5,
    question: "¿Cómo puedo hacer una cita?",
    answer: "Ponte en contacto con nosotros vía WhatsApp al 5562316302 para agendar tu cita, resolver dudas o conocer nuestras promociones."
  },
  {
    id: 6,
    question: "¿Atienden sin cita previa?",
    answer: "Atendemos únicamente con cita previa para garantizar un servicio personalizado y de calidad."
  },
  {
    id: 7,
    question: "¿Cuál es su horario de atención?",
    answer: "Nuestro horario de atención es de lunes a viernes, de 9:00 a.m. a 8:00 p.m., y los sábados, de 9:00 a.m. a 8:00 p.m."
  },
  {
    id: 8,
    question: "¿Qué métodos de pago aceptan?",
    answer: "Aceptamos pagos con tarjeta, transferencia bancaria o en efectivo."
  },
  {
    id: 9,
    question: "¿Tienen promociones o paquetes especiales?",
    answer: "Sí, ofrecemos promociones y paquetes especiales, que varían según la temporada y eventos especiales. Para conocer las promociones vigentes, comunícate con nosotros."
  },
  {
    id: 10,
    question: "¿Cómo puedo cancelar mi cita?",
    answer: "Para cancelar tu cita, comunícate con nosotros vía WhatsApp al 5562316302 con al menos 24 horas de anticipación. Se solicita un anticipo de $150 que se pierde si no se cancela con 24 horas de anticipación."
  }
];


function generateFAQHTML(accordionId = 'faqAccordion', idPrefix = 'faq') {
  return FAQ_DATA.map((faq, index) => {
    const faqId = `${idPrefix}${faq.id}`;
    const headingId = `heading${idPrefix}${faq.id}`;

    return `
      <div class="accordion-item">
        <h2 class="accordion-header" id="${headingId}">
          <button class="accordion-button collapsed" 
                  type="button" 
                  data-bs-toggle="collapse" 
                  data-bs-target="#${faqId}"
                  aria-expanded="false"
                  aria-controls="${faqId}">
            ${faq.question}
          </button>
        </h2>
        <div id="${faqId}" 
             class="accordion-collapse collapse" 
             data-bs-parent="#${accordionId}"
             aria-labelledby="${headingId}">
          <div class="accordion-body">
            ${faq.answer}
          </div>
        </div>
      </div>
    `;
  }).join('');
}


function renderFAQ(containerId, accordionId = 'faqAccordion', idPrefix = 'faq') {
  const container = document.getElementById(containerId);
  if (!container) {
    console.warn(`FAQ container with id "${containerId}" not found`);
    return;
  }

  const accordionHTML = `
    <div class="accordion" id="${accordionId}">
      ${generateFAQHTML(accordionId, idPrefix)}
    </div>
  `;

  container.innerHTML = accordionHTML;
}

function initAutoFAQ() {
  document.querySelectorAll('[data-faq="true"]').forEach(element => {
    const accordionId = element.dataset.accordionId || 'faqAccordion';
    const idPrefix = element.dataset.idPrefix || 'faq';

    element.innerHTML = `
      <div class="accordion" id="${accordionId}">
        ${generateFAQHTML(accordionId, idPrefix)}
      </div>
    `;
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAutoFAQ);
} else {
  initAutoFAQ();
}

