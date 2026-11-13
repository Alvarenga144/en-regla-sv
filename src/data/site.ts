export const site = {
  name: "En regla",
  tagline: "Empezar a trabajar en El Salvador, sin perderse en el camino.",
  author: "Esteban Alvarenga",
  url: "https://estebanalvarenga.com",
  github: "https://github.com/Alvarenga144/en-regla-sv",
};

export type NavTone = "sky" | "peach" | "rose" | "sage" | "mint" | "lilac" | "butter" | "sand" | "mauve";

export type NavItem = {
  href: string;
  label: string;
  tone: NavTone;
  featured?: boolean;
};

export const nav: NavItem[] = [
  { href: "/", label: "Inicio", tone: "sky" },
  { href: "/contrato/", label: "Contrato", tone: "peach" },
  { href: "/isss/", label: "Seguro social", tone: "rose" },
  { href: "/afp/", label: "AFP", tone: "sage" },
  { href: "/banco/", label: "Cuenta de banco", tone: "mint" },
  { href: "/salario/", label: "Tu salario", tone: "lilac", featured: true },
  { href: "/renta/", label: "Renta", tone: "butter" },
  { href: "/boleto/", label: "Tu boleto", tone: "sand" },
  { href: "/ayuda/", label: "Algo no cuadra", tone: "mauve" },
];
