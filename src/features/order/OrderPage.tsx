import { TriangleAlert } from "lucide-react";

import { OrderTable } from "./components/OrderTable";
import { useOrders } from "./hooks/useOrders";
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert";

const OrderPage = () => {
  const { orders, updateStatus } = useOrders();

  return (
    <div>
      <h1>Pedidos</h1>

      <Alert className="my-4 border-amber-500/50 bg-amber-500/5 [&>svg]:text-amber-600">
        <TriangleAlert size={16} aria-hidden="true" />
        <AlertTitle>Aviso</AlertTitle>
        <AlertDescription>
          Os dados exibidos nesta tela são fictícios e não representam pedidos reais. Esta tela está em desenvolvimento.
        </AlertDescription>
      </Alert>

      <OrderTable
        orders={orders}
        onStatusChange={updateStatus}
      />
    </div>
  );
};

export default OrderPage;