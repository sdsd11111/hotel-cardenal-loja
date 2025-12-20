export interface NavItemType {
  label: string;
  href: string;
  description?: string;
  children?: NavItemType[];
}

export type { NavItemType as NavItem };

export const mainNav: NavItemType[] = [
  {
    label: 'INICIO',
    href: '/',
  },
  {
    label: 'GALERÍA',
    href: '/galeria',
  },
  {
    label: 'SERVICIOS',
    href: '/servicios',
    children: [
      // Alojamiento
      {
        label: 'Alojamiento',
        href: '/servicios/alojamiento',
        children: [
          {
            label: 'Habitaciones Estándar',
            href: '/servicios/habitaciones-confort',
            description: 'Habitaciones cómodas a los mejores precios en Cuenca',
          },
          {
            label: 'Suites Ejecutivas',
            href: '/servicios/suites-ejecutivas',
            description: 'Suites de lujo con todas las comodidades',
          },
          {
            label: 'Dormitorios Familiares',
            href: '/servicios/dormitorios-familiares',
            description: 'Amplios espacios para toda la familia',
          },
          {
            label: 'Estadías Largas',
            href: '/servicios/larga-duracion',
            description: 'Ofertas especiales para estancias prolongadas',
          },
        ],
      },
      // Gastronomía
      {
        label: 'Gastronomía',
        href: '/servicios/gastronomia',
        children: [
          {
            label: 'Restaurante Gourmet',
            href: '/restaurante',
            description: 'Experiencia culinaria excepcional',
          },
          {
            label: 'Room Service',
            href: '/servicios/room-service',
            description: 'Servicio a la habitación 24/7',
          },
          {
            label: 'Bar y Terraza',
            href: '/servicios/bar-terraza',
            description: 'Cócteles y bebidas con vistas espectaculares',
          },
        ],
      },
      // Eventos y Negocios
      {
        label: 'Eventos y Negocios',
        href: '/eventos',
        children: [
          {
            label: 'Salones de Eventos',
            href: '/eventos',
            description: 'Espacios para todo tipo de celebraciones',
          },
          {
            label: 'Centro de Negocios',
            href: '/servicios/negocios',
            description: 'Espacios de trabajo y reuniones',
          },
          {
            label: 'Transporte',
            href: '/servicios/transporte',
            description: 'Traslados y tours',
          },
        ],
      },
    ],
  },
  {
    label: 'CONTACTO',
    href: '/contacto',
  },
];

export const ctaButton = {
  label: 'RESERVAR AHORA',
  href: '/checkout/disponibilidad',
};
