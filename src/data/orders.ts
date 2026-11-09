export type OrderStatus =
  | 'PENDING'
  | 'PAYMENT_FAILED'
  | 'PAID'
  | 'INVENTORY_ISSUE'
  | 'SHIPPED'
  | 'COMPLETED'
  | 'CANCELED';

export type OrderStatusAction = Extract<
  OrderStatus,
  'PAID' | 'SHIPPED' | 'COMPLETED' | 'CANCELED'
>;

export const OrderStatusLabel: Record<OrderStatus, string> = {
  PENDING: 'Aguardando pagamento',
  PAYMENT_FAILED: 'Pagamento recusado',
  PAID: 'Pagamento aprovado',
  INVENTORY_ISSUE: 'Problema no estoque',
  SHIPPED: 'Enviado',
  COMPLETED: 'Entregue',
  CANCELED: 'Cancelado',
};

export const OrderStatusColor: Record<OrderStatus, string> = {
  PENDING: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  PAYMENT_FAILED: 'bg-destructive/20 text-red-400 border-destructive/30',
  PAID: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  INVENTORY_ISSUE: 'bg-destructive/20 text-red-400 border-destructive/30',
  SHIPPED: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  COMPLETED: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  CANCELED: 'bg-muted text-muted-foreground border-border',
};

export interface OrderItem {
  productName: string;
  quantity: number;
  unitPrice: number;
  image: string;
}

export interface StatusHistoryEntry {
  status: OrderStatus;
  date: string;
}

export interface Order {
  id: string;
  date: string;
  status: OrderStatus;
  items: OrderItem[];
  total: number;
  customerName: string;
  trackingCode?: string;
  statusHistory: StatusHistoryEntry[];
}

// Mock data
import productVaso from '@/assets/product-vaso.jpg';
import productLuminaria from '@/assets/product-luminaria.jpg';
import productSuporte from '@/assets/product-suporte.jpg';

export const mockOrders: Order[] = [
  {
    id: 'PED-20250328-001',
    date: '2025-03-28',
    status: 'SHIPPED',
    customerName: 'Maria Silva',
    trackingCode: 'BR123456789XX',
    items: [
      { productName: 'Vaso Geométrico', quantity: 2, unitPrice: 49.9, image: productVaso },
      { productName: 'Luminária Lua', quantity: 1, unitPrice: 89.9, image: productLuminaria },
    ],
    total: 189.7,
    statusHistory: [
      { status: 'PENDING', date: '2025-03-28T10:00:00' },
      { status: 'PAID', date: '2025-03-28T10:15:00' },
      { status: 'SHIPPED', date: '2025-03-29T09:00:00' },
    ],
  },
  {
    id: 'PED-20250325-002',
    date: '2025-03-25',
    status: 'COMPLETED',
    customerName: 'João Santos',
    items: [
      { productName: 'Suporte para Fone', quantity: 1, unitPrice: 39.9, image: productSuporte },
    ],
    total: 39.9,
    statusHistory: [
      { status: 'PENDING', date: '2025-03-25T08:00:00' },
      { status: 'PAID', date: '2025-03-25T08:05:00' },
      { status: 'SHIPPED', date: '2025-03-26T10:00:00' },
      { status: 'COMPLETED', date: '2025-03-28T14:00:00' },
    ],
  },
  {
    id: 'PED-20250330-003',
    date: '2025-03-30',
    status: 'PENDING',
    customerName: 'Ana Oliveira',
    items: [
      { productName: 'Vaso Geométrico', quantity: 1, unitPrice: 49.9, image: productVaso },
    ],
    total: 49.9,
    statusHistory: [
      { status: 'PENDING', date: '2025-03-30T16:00:00' },
    ],
  },
];