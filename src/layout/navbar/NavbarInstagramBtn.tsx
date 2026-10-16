import { FaInstagram as Instagram } from "react-icons/fa";

const NavbarInstagramBtn = ({ href = "https://instagram.com" }) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-secondary text-muted-foreground transition-colors hover:border-primary hover:text-primary"
      aria-label="Instagram"
    >
      <Instagram size={18} />
    </a>
  );
};

export default NavbarInstagramBtn;