import { useContext } from "react";
import { ClientAuthContext } from "../auth.context";

export const useAuth = () => {
  const context = useContext(ClientAuthContext);

  if (!context) {
    throw new Error("useAuth must be used within ClientAuthProvider");
  }

  return context;
};