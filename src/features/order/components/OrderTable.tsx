import { Fragment, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/shared/components/ui/table";
import { Order, OrderStatus } from "@/data/orders";
import { OrderRow } from "./OrderRow";
import { StatusTimeline } from "./StatusTimeline";

export const OrderTable = ({
  orders,
  onStatusChange,
}: {
  orders: Order[];
  onStatusChange: (id: string, status: OrderStatus) => void;
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead />
          <TableHead>Pedido</TableHead>
          <TableHead>Cliente</TableHead>
          <TableHead>Itens</TableHead>
          <TableHead className="text-right">Valor</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {orders.map((order) => (
          <Fragment key={order.id}>
            <OrderRow
              order={order}
              isExpanded={expandedId === order.id}
              onToggle={() =>
                setExpandedId((prev) => (prev === order.id ? null : order.id))
              }
              onStatusChange={(status) =>
                onStatusChange(order.id, status)
              }
            />

            <AnimatePresence>
              {expandedId === order.id && (
                <TableRow>
                  <TableCell colSpan={6}>
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <StatusTimeline history={order.statusHistory} />
                    </motion.div>
                  </TableCell>
                </TableRow>
              )}
            </AnimatePresence>
          </Fragment>
        ))}
      </TableBody>
    </Table>
  );
};