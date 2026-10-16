import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { products } from "@/data/products";
import { useCartContext as useCart } from "@/features/cart/useCart";
import { ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

const featuredProducts = products.slice(0, 4);

const HeroSection = () => {
  const { addItem } = useCart();
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % featuredProducts.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const goToProducts = () => navigate("/produtos");

  return (
    <section className="relative min-h-screen overflow-hidden bg-background">
      {/* Subtle grid background */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: "linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)",
        backgroundSize: "60px 60px"
      }} />

      <div className="relative z-10 container mx-auto flex min-h-screen items-center px-4 py-20">
        <div className="grid w-full items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left: Text content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center lg:text-left"
          >
            <h1 className="mb-6 font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
              <span className="text-gradient-primary">Criações 3D</span>
              <br />
              <span className="text-foreground">Sob Medida</span>
            </h1>
            <p className="mb-10 max-w-lg text-lg text-muted-foreground sm:text-xl lg:mx-0 mx-auto">
              Transformamos suas ideias em objetos reais com impressão 3D de alta qualidade. 
              Produtos únicos, personalizados e prontos para encantar.
            </p>
            <div className="flex flex-col items-center gap-4 sm:flex-row lg:justify-start sm:justify-center">
              <button
                onClick={goToProducts}
                className="rounded-lg bg-gradient-cta px-8 py-3 font-display text-sm font-semibold uppercase tracking-wider text-primary-foreground transition-all hover:shadow-glow-strong hover:scale-105"
              >
                Ver Produtos
              </button>
              <button
                onClick={() => document.getElementById("encomenda")?.scrollIntoView({ behavior: "smooth" })}
                className="rounded-lg border border-primary/30 px-8 py-3 font-display text-sm font-semibold uppercase tracking-wider text-primary transition-all hover:border-primary hover:shadow-glow"
              >
                Entre em Contato
              </button>
            </div>
          </motion.div>

          {/* Right: Featured products showcase */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            {/* Main featured image */}
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="relative overflow-hidden rounded-2xl border border-primary/10 bg-card shadow-glow aspect-[4/3]">
                {featuredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    className={`absolute inset-0 ${activeIndex === index ? "pointer-events-auto z-10" : "pointer-events-none z-0"}`}
                    initial={false}
                    animate={{
                      opacity: activeIndex === index ? 1 : 0,
                      scale: activeIndex === index ? 1 : 1.05,
                    }}
                    transition={{ duration: 0.7 }}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                    
                    {/* Product info overlay */}
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 p-6"
                      initial={false}
                      animate={{
                        opacity: activeIndex === index ? 1 : 0,
                        y: activeIndex === index ? 0 : 20,
                      }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <span className="mb-2 inline-block rounded-full bg-primary/20 px-3 py-1 font-display text-xs uppercase tracking-wider text-primary">
                        {product.category}
                      </span>
                      <h3 className="mb-1 font-display text-xl font-bold text-foreground">
                        {product.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="font-display text-lg font-bold text-primary">
                          R$ {product.price.toFixed(2)}
                        </span>
                        <button
                          onClick={() => addItem(product)}
                          className="flex items-center gap-2 rounded-lg bg-primary/20 px-4 py-2 text-sm font-medium text-primary transition-all hover:bg-primary hover:text-primary-foreground"
                        >
                          <ShoppingCart className="h-4 w-4" />
                          Adicionar
                        </button>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
                {/* Navigation arrows */}
                <button
                  onClick={() => setActiveIndex((prev) => (prev - 1 + featuredProducts.length) % featuredProducts.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-background/60 text-foreground backdrop-blur-sm transition-all hover:bg-background/80 hover:shadow-glow"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setActiveIndex((prev) => (prev + 1) % featuredProducts.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-background/60 text-foreground backdrop-blur-sm transition-all hover:bg-background/80 hover:shadow-glow"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
               </div>

              {/* Dots indicator */}
              <div className="mt-4 flex justify-center gap-2">
                {featuredProducts.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      activeIndex === index
                        ? "w-8 bg-primary shadow-glow"
                        : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Floating thumbnail grid */}
            <div className="mt-4 grid grid-cols-4 gap-2">
              {featuredProducts.map((product, index) => (
                <button
                  key={product.id}
                  onClick={() => setActiveIndex(index)}
                  className={`overflow-hidden rounded-lg border-2 transition-all duration-300 aspect-square ${
                    activeIndex === index
                      ? "border-primary shadow-glow scale-105"
                      : "border-transparent opacity-50 hover:opacity-80"
                  }`}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="h-8 w-5 rounded-full border-2 border-primary/40 flex items-start justify-center pt-1"
        >
          <div className="h-2 w-1 rounded-full bg-primary animate-pulse-glow" />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
