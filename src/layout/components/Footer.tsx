import { FaInstagram as Instagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="border-t border-border py-10">
      <div className="container mx-auto flex flex-col items-center gap-4 px-4 text-center">
        <a href="/" className="font-display text-lg font-bold tracking-wider text-primary">
          JOANES<span className="text-foreground">3D</span>
        </a>
        <p className="max-w-md text-sm text-muted-foreground">
          Transformando ideias em realidade, camada por camada.
        </p>
        {/* <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary"
        >
          <Instagram size={16} />
          Siga-nos no Instagram
        </a> */}
        <p className="text-xs text-muted-foreground/60">
          © 2026 Joanes3D. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
