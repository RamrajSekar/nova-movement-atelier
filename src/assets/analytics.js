(() => {
  const hosts = ['novamovementatelier.com.au', 'www.novamovementatelier.com.au'];
  const publicPaths = [
    '/', '/sports-physiotherapy-port-augusta/',
    '/dizziness-balance-physiotherapy-port-augusta/',
    '/workplace-injury-physiotherapy-port-augusta/',
    '/musculoskeletal-physiotherapy-port-augusta/',
    '/geriatric-physiotherapy-port-augusta/'
  ];
  const pathname = location.pathname.endsWith('/') ? location.pathname : location.pathname + '/';
  if (location.protocol !== 'https:' || !hosts.includes(location.hostname) ||
      !publicPaths.includes(pathname) || window.__novaGA4Installed ||
      navigator.globalPrivacyControl === true || navigator.doNotTrack === '1') return;
  window.__novaGA4Installed = true;

  const measurementId = 'G-FE01RRDFWW';
  const pageLocation = 'https://novamovementatelier.com.au' + pathname;
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  const gtag = window.gtag;
  // No advertising consent or personalisation is enabled by this integration.
  gtag('consent', 'default', {
    ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied'
  });
  gtag('js', new Date());
  gtag('config', measurementId, {
    send_page_view: false,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    page_location: pageLocation,
    page_referrer: '',
    page_title: 'Nova Movement Atelier',
    ignore_referrer: true
  });
  const send = (name, parameters = {}) => gtag('event', name, {
    send_to: measurementId,
    page_location: pageLocation,
    page_referrer: '',
    page_title: 'Nova Movement Atelier',
    ...parameters
  });
  send('page_view');

  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=' + measurementId;
  document.head.appendChild(script);

  const buttonLocation = link => {
    if (link.closest('.mobile-bar')) return 'mobile_bar';
    if (link.closest('header')) return 'header';
    if (link.closest('.hero')) return 'hero';
    if (link.closest('#booking')) return 'booking_section';
    if (link.closest('#suren')) return 'practitioner_section';
    if (link.closest('#visit')) return 'contact_section';
    if (link.closest('.service-page-hero')) return 'service_hero';
    if (link.closest('.service-page-content')) return 'service_content';
    if (link.closest('footer')) return 'footer';
    return 'page_content';
  };
  document.addEventListener('click', event => {
    const link = event.target instanceof Element ? event.target.closest('a[href]') : null;
    if (!link) return;
    let destination;
    try { destination = new URL(link.getAttribute('href'), location.href); } catch { return; }
    let eventName;
    if (destination.protocol === 'tel:') eventName = 'phone_click';
    else if (destination.protocol === 'https:' &&
      destination.hostname === 'nova-movement-atelier.au5.cliniko.com' &&
      /^\/bookings(?:\/|$)/.test(destination.pathname)) eventName = 'booking_click';
    if (eventName) send(eventName, { button_location: buttonLocation(link) });
    // Native navigation is never prevented or delayed. These are intent clicks only.
  });
})();
