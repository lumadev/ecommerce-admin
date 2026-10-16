import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="flex min-h-[50vh] items-center justify-center text-center">
    <div>
      <h1 className="mb-4 text-4xl font-bold">404</h1>
      <p className="mb-4 text-xl text-muted-foreground">
        Ops! Página não encontrada.
      </p>
      <Link to="/" className="text-primary underline hover:text-primary/90">
        Retornar ao painel
      </Link>
    </div>
  </div>
);

export default NotFound;