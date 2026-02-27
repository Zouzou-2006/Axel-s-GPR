document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.site-header');
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navLinksContainer = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('main section[id]');
    const contactForm = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');
    const languageToggle = document.getElementById('language-toggle');

    const translations = {
        en: {
            nav_home: 'Home',
            nav_about: 'About',
            nav_services: 'Services',
            nav_process: 'Process',
            nav_portfolio: 'Portfolio',
            nav_faq: 'FAQ',
            nav_contact: 'Contact',
            nav_cta: 'Request Estimate',
            hero_eyebrow: 'Licensed • Insured • Detail-Driven',
            hero_title: 'Professional Painting That Elevates Every Space',
            hero_desc: 'From preparation to final walkthrough, AXEL\'S GPR delivers clean lines, durable finishes, and a stress-free experience for homes and businesses.',
            hero_btn_primary: 'Get a Free Estimate',
            hero_btn_secondary: 'View Work',
            hero_trust_1: '⭐ 4.9 Average Client Rating',
            hero_trust_2: '300+ Completed Projects',
            hero_trust_3: 'Fast, On-Time Delivery',
            hero_panel_title: 'Why Clients Choose Us',
            hero_panel_1: 'Complete surface preparation and protection',
            hero_panel_2: 'Premium low-odor paints and materials',
            hero_panel_3: 'Clear pricing with no hidden costs',
            hero_panel_4: 'Daily cleanup and final quality inspection',
            stat_1: 'Years of Experience',
            stat_2: 'Projects Completed',
            stat_3: 'Repeat & Referral Clients',
            stat_4: 'Quote Response Time',
            about_eyebrow: 'About AXEL\'S GPR',
            about_title: 'Craftsmanship, Communication, Consistency',
            about_desc_1: 'We help property owners transform interiors and exteriors with professional painting and finishing services. Our team focuses on preparation, precision, and dependable communication from day one.',
            about_desc_2: 'Whether you are updating one room or repainting an entire property, we manage every detail with respect for your space and a finish you can trust.',
            about_card_1_title: 'Service Areas',
            about_card_1_desc: 'Residential and commercial projects across your city and surrounding neighborhoods.',
            about_card_2_title: 'Working Hours',
            about_card_2_desc: 'Monday to Saturday: 8:00 AM - 6:00 PM',
            about_card_3_title: 'Estimate Policy',
            about_card_3_desc: 'Free on-site or virtual estimates with scope, timeline, and product recommendations.',
            services_title: 'Our Services',
            services_subtitle: 'Complete painting and finishing solutions designed for long-term results.',
            service_1_title: 'Interior Painting',
            service_1_desc: 'Walls, ceilings, trim, doors, and cabinets with smooth, clean, even finishes.',
            service_2_title: 'Exterior Painting',
            service_2_desc: 'Weather-resistant systems for stucco, siding, wood, masonry, and more.',
            service_3_title: 'Drywall & Surface Repair',
            service_3_desc: 'Patchwork, crack repair, sanding, and priming for a flawless paint-ready surface.',
            service_4_title: 'Color Consultation',
            service_4_desc: 'Practical recommendations for palettes, undertones, and finish durability.',
            service_5_title: 'Commercial Repaints',
            service_5_desc: 'Efficient, clean execution for offices, retail spaces, and income properties.',
            service_6_title: 'Maintenance Plans',
            service_6_desc: 'Scheduled touch-ups and protection plans to preserve value year-round.',
            process_title: 'Our 4-Step Process',
            process_1_title: 'Consultation',
            process_1_desc: 'We review your goals, inspect surfaces, and provide transparent pricing.',
            process_2_title: 'Preparation',
            process_2_desc: 'Protection, repairs, cleaning, and priming for maximum finish performance.',
            process_3_title: 'Application',
            process_3_desc: 'Professional application methods with premium paint systems.',
            process_4_title: 'Final Walkthrough',
            process_4_desc: 'Comprehensive quality check and touch-ups before final approval.',
            portfolio_title: 'Recent Projects',
            portfolio_subtitle: 'A quick look at quality outcomes our clients expect on every project.',
            portfolio_1_title: 'Modern Living Room Refresh',
            portfolio_1_desc: 'Neutral palette update with feature wall and premium eggshell finish.',
            portfolio_2_title: 'Exterior Curb Appeal Restoration',
            portfolio_2_desc: 'Full façade repaint with trim detailing and weather-resistant coatings.',
            portfolio_3_title: 'Office Interior Rebrand',
            portfolio_3_desc: 'Fast-turn commercial repaint coordinated around operational hours.',
            testimonials_title: 'What Clients Say',
            testimonial_1_text: '"The crew was punctual, respectful, and detail-oriented. The finish quality exceeded our expectations."',
            testimonial_1_name: '— Residential Client',
            testimonial_2_text: '"Great communication from quote to completion. Clean execution and delivered right on schedule."',
            testimonial_2_name: '— Business Owner',
            faq_title: 'Frequently Asked Questions',
            faq_1_q: 'How long does a typical project take?',
            faq_1_a: 'Most residential interiors are completed in 2 to 5 days depending on repairs, scope, and drying conditions.',
            faq_2_q: 'Do you help with paint color selection?',
            faq_2_a: 'Yes. We guide color and sheen selection based on lighting, use, and durability requirements.',
            faq_3_q: 'Are estimates free?',
            faq_3_a: 'Yes. Every estimate includes a clear scope, timeline, and pricing breakdown.',
            faq_4_q: 'Are you insured?',
            faq_4_a: 'Yes, AXEL\'S GPR is fully insured for residential and commercial painting projects.',
            contact_eyebrow: 'Let\'s Talk',
            contact_title: 'Request Your Free Estimate',
            contact_desc: 'Tell us about your project and we will contact you with next steps within 24 hours.',
            contact_phone_label: 'Phone:',
            contact_email_label: 'Email:',
            contact_location_label: 'Location:',
            contact_hours_label: 'Hours:',
            form_name: 'Full Name',
            form_phone: 'Phone Number',
            form_email: 'Email Address',
            form_service: 'Service Needed',
            form_message: 'Project Details',
            service_select: 'Select a service',
            service_option_1: 'Interior Painting',
            service_option_2: 'Exterior Painting',
            service_option_3: 'Commercial Repaint',
            service_option_4: 'Surface Repair',
            service_option_5: 'Other',
            form_submit: 'Send Request',
            ph_name: 'Your full name',
            ph_phone: '(555) 123-4567',
            ph_email: 'you@email.com',
            ph_message: 'Tell us about your project goals, area, and timeline...',
            footer_desc: 'Professional painting and finishing services for residential and commercial properties.',
            footer_links: 'Quick Links',
            footer_services: 'Services',
            footer_portfolio: 'Portfolio',
            footer_contact: 'Contact',
            footer_contact_title: 'Contact',
            footer_city: 'Your City, ST',
            footer_copy: '© 2026 AXEL\'S GPR. All rights reserved.',
            form_error: 'Please complete all fields and enter a valid email address.',
            form_success: 'Thank you! Your estimate request has been received. We will contact you shortly.'
        },
        es: {
            nav_home: 'Inicio',
            nav_about: 'Nosotros',
            nav_services: 'Servicios',
            nav_process: 'Proceso',
            nav_portfolio: 'Portafolio',
            nav_faq: 'Preguntas',
            nav_contact: 'Contacto',
            nav_cta: 'Solicitar Cotización',
            hero_eyebrow: 'Con licencia • Asegurados • Enfoque en detalle',
            hero_title: 'Pintura Profesional Que Mejora Cada Espacio',
            hero_desc: 'Desde la preparación hasta la entrega final, AXEL\'S GPR ofrece acabados limpios, duraderos y una experiencia sin complicaciones para hogares y negocios.',
            hero_btn_primary: 'Cotización Gratis',
            hero_btn_secondary: 'Ver Proyectos',
            hero_trust_1: '⭐ 4.9 Calificación Promedio',
            hero_trust_2: 'Más de 300 Proyectos Completados',
            hero_trust_3: 'Entrega Rápida y Puntual',
            hero_panel_title: 'Por Qué Nos Eligen',
            hero_panel_1: 'Preparación completa y protección de superficies',
            hero_panel_2: 'Pinturas y materiales premium de bajo olor',
            hero_panel_3: 'Precios claros y sin costos ocultos',
            hero_panel_4: 'Limpieza diaria e inspección final de calidad',
            stat_1: 'Años de Experiencia',
            stat_2: 'Proyectos Completados',
            stat_3: 'Clientes Recurrentes y Referidos',
            stat_4: 'Tiempo de Respuesta',
            about_eyebrow: 'Sobre AXEL\'S GPR',
            about_title: 'Calidad, Comunicación y Consistencia',
            about_desc_1: 'Ayudamos a propietarios a transformar interiores y exteriores con servicios profesionales de pintura y acabados. Nuestro equipo prioriza preparación, precisión y comunicación confiable desde el primer día.',
            about_desc_2: 'Ya sea una sola habitación o una propiedad completa, cuidamos cada detalle con respeto por su espacio y un acabado de confianza.',
            about_card_1_title: 'Zonas de Servicio',
            about_card_1_desc: 'Proyectos residenciales y comerciales en su ciudad y zonas cercanas.',
            about_card_2_title: 'Horario',
            about_card_2_desc: 'Lunes a Sábado: 8:00 AM - 6:00 PM',
            about_card_3_title: 'Política de Cotización',
            about_card_3_desc: 'Cotizaciones gratis en sitio o virtuales con alcance, tiempo y recomendaciones.',
            services_title: 'Nuestros Servicios',
            services_subtitle: 'Soluciones completas de pintura y acabado diseñadas para durar.',
            service_1_title: 'Pintura Interior',
            service_1_desc: 'Muros, techos, molduras, puertas y gabinetes con acabados uniformes y limpios.',
            service_2_title: 'Pintura Exterior',
            service_2_desc: 'Sistemas resistentes al clima para estuco, siding, madera y mampostería.',
            service_3_title: 'Reparación de Superficies',
            service_3_desc: 'Resanes, reparación de grietas, lijado y primer para una base perfecta.',
            service_4_title: 'Asesoría de Color',
            service_4_desc: 'Recomendaciones prácticas de color, subtonos y tipo de acabado.',
            service_5_title: 'Repintado Comercial',
            service_5_desc: 'Ejecución eficiente y limpia para oficinas, locales y propiedades de renta.',
            service_6_title: 'Planes de Mantenimiento',
            service_6_desc: 'Retoques programados y protección para preservar valor todo el año.',
            process_title: 'Nuestro Proceso en 4 Pasos',
            process_1_title: 'Consulta',
            process_1_desc: 'Revisamos objetivos, inspeccionamos superficies y entregamos precio transparente.',
            process_2_title: 'Preparación',
            process_2_desc: 'Protección, reparaciones, limpieza y primer para máximo rendimiento.',
            process_3_title: 'Aplicación',
            process_3_desc: 'Métodos profesionales de aplicación con sistemas de pintura premium.',
            process_4_title: 'Revisión Final',
            process_4_desc: 'Control de calidad completo y retoques antes de la aprobación final.',
            portfolio_title: 'Proyectos Recientes',
            portfolio_subtitle: 'Una vista rápida de los resultados de calidad que ofrecemos en cada proyecto.',
            portfolio_1_title: 'Renovación de Sala Moderna',
            portfolio_1_desc: 'Actualización de paleta neutra con muro de acento y acabado eggshell premium.',
            portfolio_2_title: 'Restauración Exterior',
            portfolio_2_desc: 'Repintado total de fachada con detalles en molduras y recubrimiento resistente.',
            portfolio_3_title: 'Renovación de Oficina',
            portfolio_3_desc: 'Repintado comercial rápido coordinado con horarios de operación.',
            testimonials_title: 'Lo Que Dicen Nuestros Clientes',
            testimonial_1_text: '"El equipo fue puntual, respetuoso y detallista. La calidad final superó nuestras expectativas."',
            testimonial_1_name: '— Cliente Residencial',
            testimonial_2_text: '"Excelente comunicación desde la cotización hasta la entrega. Trabajo limpio y puntual."',
            testimonial_2_name: '— Dueño de Negocio',
            faq_title: 'Preguntas Frecuentes',
            faq_1_q: '¿Cuánto dura un proyecto típico?',
            faq_1_a: 'La mayoría de interiores residenciales se completan en 2 a 5 días según alcance y reparaciones.',
            faq_2_q: '¿Ayudan a elegir colores?',
            faq_2_a: 'Sí. Recomendamos colores y acabados según iluminación, uso y durabilidad.',
            faq_3_q: '¿La cotización es gratis?',
            faq_3_a: 'Sí. Cada cotización incluye alcance, tiempo y desglose de precios.',
            faq_4_q: '¿Están asegurados?',
            faq_4_a: 'Sí, AXEL\'S GPR cuenta con seguro para proyectos residenciales y comerciales.',
            contact_eyebrow: 'Hablemos',
            contact_title: 'Solicita Tu Cotización Gratis',
            contact_desc: 'Cuéntanos sobre tu proyecto y te responderemos en menos de 24 horas.',
            contact_phone_label: 'Teléfono:',
            contact_email_label: 'Correo:',
            contact_location_label: 'Ubicación:',
            contact_hours_label: 'Horario:',
            form_name: 'Nombre Completo',
            form_phone: 'Número de Teléfono',
            form_email: 'Correo Electrónico',
            form_service: 'Servicio Requerido',
            form_message: 'Detalles del Proyecto',
            service_select: 'Selecciona un servicio',
            service_option_1: 'Pintura Interior',
            service_option_2: 'Pintura Exterior',
            service_option_3: 'Repintado Comercial',
            service_option_4: 'Reparación de Superficies',
            service_option_5: 'Otro',
            form_submit: 'Enviar Solicitud',
            ph_name: 'Tu nombre completo',
            ph_phone: '(555) 123-4567',
            ph_email: 'tu@email.com',
            ph_message: 'Cuéntanos tus objetivos, área y tiempos del proyecto...',
            footer_desc: 'Servicios profesionales de pintura y acabados para propiedades residenciales y comerciales.',
            footer_links: 'Enlaces Rápidos',
            footer_services: 'Servicios',
            footer_portfolio: 'Portafolio',
            footer_contact: 'Contacto',
            footer_contact_title: 'Contacto',
            footer_city: 'Tu Ciudad, ST',
            footer_copy: '© 2026 AXEL\'S GPR. Todos los derechos reservados.',
            form_error: 'Completa todos los campos e ingresa un correo electrónico válido.',
            form_success: '¡Gracias! Hemos recibido tu solicitud y te contactaremos en breve.'
        }
    };

    let currentLang = localStorage.getItem('siteLanguage') || 'en';

    const closeMobileMenu = () => {
        if (!navLinksContainer || !menuBtn) {
            return;
        }

        navLinksContainer.classList.remove('active');
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.textContent = '☰';
    };

    const updateActiveNav = () => {
        const headerOffset = header ? header.offsetHeight + 20 : 100;
        let currentSectionId = '';

        sections.forEach((section) => {
            const top = section.offsetTop - headerOffset;
            const bottom = top + section.offsetHeight;
            if (window.scrollY >= top && window.scrollY < bottom) {
                currentSectionId = section.id;
            }
        });

        navLinks.forEach((link) => {
            const href = link.getAttribute('href');
            link.classList.toggle('active', href === `#${currentSectionId}`);
        });
    };

    const applyLanguage = (lang) => {
        const selected = translations[lang] ? lang : 'en';
        currentLang = selected;

        document.documentElement.lang = selected;
        localStorage.setItem('siteLanguage', selected);

        document.querySelectorAll('[data-i18n]').forEach((element) => {
            const key = element.dataset.i18n;
            if (translations[selected][key]) {
                element.textContent = translations[selected][key];
            }
        });

        document.querySelectorAll('[data-i18n-placeholder]').forEach((element) => {
            const key = element.dataset.i18nPlaceholder;
            if (translations[selected][key]) {
                element.setAttribute('placeholder', translations[selected][key]);
            }
        });

        if (languageToggle) {
            languageToggle.textContent = selected === 'en' ? 'ES' : 'EN';
        }

        updateActiveNav();
    };

    if (menuBtn && navLinksContainer) {
        menuBtn.addEventListener('click', () => {
            const isOpen = navLinksContainer.classList.toggle('active');
            menuBtn.setAttribute('aria-expanded', String(isOpen));
            menuBtn.textContent = isOpen ? '✕' : '☰';
        });
    }

    navLinks.forEach((link) => {
        link.addEventListener('click', (event) => {
            const targetId = link.getAttribute('href');
            if (!targetId || !targetId.startsWith('#')) {
                return;
            }

            const targetElement = document.querySelector(targetId);
            if (!targetElement) {
                return;
            }

            event.preventDefault();
            const offset = header ? header.offsetHeight + 8 : 80;
            const top = targetElement.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
            closeMobileMenu();
        });
    });

    window.addEventListener('scroll', updateActiveNav, { passive: true });
    window.addEventListener('resize', () => {
        if (window.innerWidth > 760) {
            closeMobileMenu();
        }
    });

    if (languageToggle) {
        languageToggle.addEventListener('click', () => {
            const nextLang = currentLang === 'en' ? 'es' : 'en';
            applyLanguage(nextLang);
        });
    }

    if (contactForm && formMessage) {
        contactForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const fields = [
                contactForm.querySelector('#name'),
                contactForm.querySelector('#phone'),
                contactForm.querySelector('#email'),
                contactForm.querySelector('#service'),
                contactForm.querySelector('#message')
            ];

            const hasEmptyField = fields.some((field) => !field || !field.value.trim());
            const emailField = contactForm.querySelector('#email');
            const emailIsValid = emailField ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value.trim()) : false;

            if (hasEmptyField || !emailIsValid) {
                formMessage.textContent = translations[currentLang].form_error;
                formMessage.classList.remove('success');
                formMessage.classList.add('error');
                return;
            }

            formMessage.textContent = translations[currentLang].form_success;
            formMessage.classList.remove('error');
            formMessage.classList.add('success');
            contactForm.reset();
        });
    }

    applyLanguage(currentLang);
});
