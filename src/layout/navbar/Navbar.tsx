import { useCartContext as useCart } from "@/features/cart/useCart";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { motion } from "framer-motion";
import { useState } from "react";

import SearchDialog from "../../features/search/SearchDialog";
import LoginModal from "../../features/auth/LoginModal";
import NavbarSearch from "./NavbarSearch";
// import NavbarInstagramBtn from "./NavbarInstagramBtn";
import NavbarShoppingBtn from "./NavbarShoppingBtn";
import NavbarUserMenu from "./NavbarUserMenu";

const Navbar = () => {
  const { totalItems, setIsOpen } = useCart();
  const { isAuthenticated, isCheckingSession, user } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  return (
    <>
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
      <LoginModal open={loginOpen} onOpenChange={setLoginOpen} />
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl"
      >
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <a href="/" className="font-display text-xl font-bold tracking-wider text-primary">
            JOANES<span className="text-foreground">3D</span>
          </a>

          <div className="flex items-center gap-3">
            <NavbarSearch onOpen={() => setSearchOpen(true)} />

            <NavbarUserMenu
              isAuthenticated={isAuthenticated}
              isCheckingSession={isCheckingSession}
              user={user}
              onLoginClick={() => setLoginOpen(true)}
            />

            {/* <NavbarInstagramBtn /> */}

            <NavbarShoppingBtn 
              onOpen={() => setIsOpen(true)} 
              totalItems={totalItems}
            />
          </div>
        </div>
      </motion.nav>
    </>
  );
};

export default Navbar;