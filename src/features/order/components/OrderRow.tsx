import { ChevronDown, ChevronUp } from "lucide-react";
import { TableCell, TableRow } from "@/shared/components/ui/table";
import { Order, OrderStatus } from "@/data/orders";
import { StatusSelect } from "./StatusSelect";

export const OrderRow = ({
  order,
  isExpanded,
  onToggle,
  onStatusChange,
}: {
  order: Order;
  isExpanded: boolean;
  onToggle: () => void;
  onStatusChange: (status: OrderStatus) => void;
}) => {
  return (
    <TableRow className="cursor-pointer" onClick={onToggle}>
      <TableCell className="w-10 pr-0">
        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </TableCell>

      <TableCell className="font-mono text-xs text-muted-foreground">
        {order.id}
      </TableCell>

      <TableCell className="font-medium">
        {order.customerName}
      </TableCell>

      <TableCell>
        {order.items.map((i) => `${i.quantity}x ${i.productName}`).join(", ")}
      </TableCell>

      <TableCell className="text-right">
        R$ {order.total.toFixed(2)}
      </TableCell>

      <TableCell onClick={(e) => e.stopPropagation()}>
        <StatusSelect
          value={order.status}
          onChange={onStatusChange}
        />
      </TableCell>
    </TableRow>
  );
};