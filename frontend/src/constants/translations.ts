/**
 * ARCHIVO DE TRADUCCIÓN DEL SISTEMA // TRANSLATION CORE
 * Contiene todos los textos estáticos del portafolio en ES y EN.
 * Diseñado para presentar una imagen profesional, clara y atractiva para reclutadores.
 */

export const translations: Record<string, any> = {
  es: {
    nav: { 
      boot: 'Inicio', 
      skills: 'Habilidades', 
      projects: 'Proyectos', 
      experience: 'Experiencia', 
      education: 'Formación', 
      posts: 'Artículos', 
      signal: 'Contacto' 
    },
    hero: { 
      system_loaded: 'ALBA GARCÍA // FULL-STACK DEVELOPER', 
      bio_1: 'DESARROLLANDO APLICACIONES WEB', 
      bio_highlight: 'ROBUSTAS Y ESCALABLES', 
      bio_2: 'CON TECNOLOGÍAS MODERNAS.', 
      btn_deploy: 'VER PROYECTOS', 
      btn_dump: 'DESCARGAR CV' 
    },
    about: {
      title: 'SOBRE MÍ',
      subtitle: 'DESARROLLADORA FULL-STACK & ARQUITECTURA WEB',
      bio: 'Desarrolladora Web Full-Stack apasionada por crear aplicaciones web de alto rendimiento, limpias y escalables. Mi enfoque combina código de calidad, arquitectura sólida (Clean Architecture, REST APIs) y una cuidadosa experiencia de usuario.',
      education_title: 'FORMACIÓN ACADÉMICA',
      experience_title: 'EXPERIENCIA PROFESIONAL'
    },
    skills: { 
      title: 'STACK TECNOLÓGICO', 
      frontend: 'FRONTEND', 
      backend: 'BACKEND & DATOS', 
      tools: 'DEVOPS & HERRAMIENTAS' 
    },
    projects: { 
      module_title: 'PROYECTOS DESTACADOS',
      view_details: 'VER DETALLES',
      tech_used: 'TECNOLOGÍAS USADAS',
      github_link: 'CÓDIGO FUENTE (GITHUB)',
      live_link: 'VER EN VIVO',
      solved_problems: 'PROBLEMAS RESUELTOS',
      technical_challenges: 'RETOS TÉCNICOS',
      evolution: 'EVOLUCIÓN Y MEJORAS',
      limitations: 'LIMITACIONES DE LA VERSIÓN',
      video_link: 'VER DEMO EN VÍDEO'
    },
    experience: { 
      module_title: 'EXPERIENCIA PROFESIONAL', 
      data_core: 'TRAYECTORIA', 
      timeline_desc: 'Historial de posiciones, responsabilidades e hitos técnicos conseguidos.' 
    },
    education: { 
      module_title: 'FORMACIÓN Y CERTIFICACIONES', 
      data_core: 'FORMACIÓN', 
      timeline_desc: 'Titulación oficial y aprendizaje técnico continuo.' 
    },
    posts: { 
      module_title: 'PUBLICACIONES & BLOG', 
      read_more: 'LEER ARTÍCULO' 
    },
    github: { 
      loading: 'Cargando repositorios de GitHub...', 
      description_stub: 'Repositorio sin descripción pública.', 
      lang_data: 'Código' 
    },
    contact: { 
      connect: 'CONTACTO', 
      handshake: 'ENVIAR MENSAJE', 
      access_node: 'Hablemos', 
      signal_desc: 'Si buscas una desarrolladora comprometida con ganas de aportar valor a tu equipo, envíame un mensaje.', 
      user_id: 'Tu Nombre', 
      signal_email: 'Tu Correo Electrónico', 
      data_packet: 'Escribe tu mensaje aquí...', 
      establish_link: 'ENVIAR MENSAJE', 
      subject: 'Asunto',
      fail_title: 'Error al enviar',
      fail_desc: 'Hubo un error al enviar tu mensaje. Por favor, reintenta.',
      length: 'Longitud',
      success_title: '¡Mensaje Enviado!', 
      success_desc: 'Tu mensaje ha sido enviado correctamente. Responderé lo antes posible.' 
    },
    footer: { 
      architecture: 'Full-Stack Developer // React, TypeScript & Node.js', 
      rights: 'TODOS LOS DERECHOS RESERVADOS' 
    }
  },
  en: {
    nav: { 
      boot: 'Home', 
      skills: 'Skills', 
      projects: 'Projects', 
      experience: 'Experience', 
      education: 'Education', 
      posts: 'Articles', 
      signal: 'Contact' 
    },
    hero: { 
      system_loaded: 'ALBA GARCÍA // FULL-STACK DEVELOPER', 
      bio_1: 'BUILDING HIGH-PERFORMANCE', 
      bio_highlight: 'ROBUST & SCALABLE WEBSITES', 
      bio_2: 'WITH MODERN TECHNOLOGIES.', 
      btn_deploy: 'VIEW PROJECTS', 
      btn_dump: 'DOWNLOAD CV' 
    },
    about: {
      title: 'ABOUT ME',
      subtitle: 'FULL-STACK DEVELOPER & WEB ARCHITECT',
      bio: 'Full-Stack Web Developer passionate about creating high-performance, clean, and scalable web applications. My approach combines quality code, solid architecture (Clean Architecture, REST APIs), and clean user experience.',
      education_title: 'EDUCATION',
      experience_title: 'WORK EXPERIENCE'
    },
    skills: { 
      title: 'TECH STACK', 
      frontend: 'FRONTEND', 
      backend: 'BACKEND & DATA', 
      tools: 'DEVOPS & TOOLS' 
    },
    projects: { 
      module_title: 'FEATURED PROJECTS',
      view_details: 'VIEW DETAILS',
      tech_used: 'TECHNOLOGIES USED',
      github_link: 'SOURCE CODE (GITHUB)',
      live_link: 'LIVE DEMO',
      solved_problems: 'PROBLEMS SOLVED',
      technical_challenges: 'TECHNICAL CHALLENGES',
      evolution: 'EVOLUTIONS & IMPROVEMENTS',
      limitations: 'SYSTEM LIMITATIONS',
      video_link: 'WATCH VIDEO DEMO'
    },
    experience: { 
      module_title: 'WORK EXPERIENCE', 
      data_core: 'CAREER', 
      timeline_desc: 'Track record of engineering roles, responsibilities, and technical milestones.' 
    },
    education: { 
      module_title: 'EDUCATION & DEGREES', 
      data_core: 'EDUCATION', 
      timeline_desc: 'Official degrees and continuous technical learning.' 
    },
    posts: { 
      module_title: 'PUBLICATIONS & ARTICLES', 
      read_more: 'READ ARTICLE' 
    },
    github: { 
      loading: 'Loading GitHub repositories...', 
      description_stub: 'Repository without public description.', 
      lang_data: 'Code' 
    },
    contact: { 
      connect: 'CONTACT', 
      handshake: 'SEND A MESSAGE', 
      access_node: 'Let\'s talk', 
      signal_desc: 'If you are looking for a dedicated developer ready to add value to your team, feel free to drop me a line.', 
      user_id: 'Your Name', 
      signal_email: 'Your Email Address', 
      data_packet: 'Write your message here...', 
      establish_link: 'SEND MESSAGE', 
      subject: 'Subject',
      fail_title: 'Delivery Failed',
      fail_desc: 'There was an error sending your message. Please try again.',
      length: 'Length',
      success_title: 'Message Sent!', 
      success_desc: 'Your message has been sent successfully. I will get back to you soon.' 
    },
    footer: { 
      architecture: 'Full-Stack Developer // React, TypeScript & Node.js', 
      rights: 'ALL RIGHTS RESERVED' 
    }
  }
};
