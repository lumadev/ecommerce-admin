export type OrderStatus =
  | 'PENDING_PAYMENT'
  | 'PAYMENT_APPROVED'
  | 'PREPARING'
  | 'PAYMENT_FAILED'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELED';

export const OrderStatusLabel: Record<OrderStatus, string> = {
  PENDING_PAYMENT: 'Aguardando pagamento',
  PAYMENT_APPROVED: 'Pagamento aprovado',
  PAYMENT_FAILED: 'Pagamento recusado',
  PREPARING: 'Pedido em preparação',
  SHIPPED: 'Enviado',
  DELIVERED: 'Entregue',
  CANCELED: 'Cancelado',
};

export const OrderStatusColor: Record<OrderStatus, string> = {
  PENDING_PAYMENT: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  PAYMENT_APPROVED: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  PREPARING: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  PAYMENT_FAILED: 'bg-destructive/20 text-red-400 border-destructive/30',
  SHIPPED: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  DELIVERED: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
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
      { status: 'PENDING_PAYMENT', date: '2025-03-28T10:00:00' },
      { status: 'PAYMENT_APPROVED', date: '2025-03-28T10:15:00' },
      { status: 'PREPARING', date: '2025-03-28T14:30:00' },
      { status: 'SHIPPED', date: '2025-03-29T09:00:00' },
    ],
  },
  {
    id: 'PED-20250325-002',
    date: '2025-03-25',
    status: 'DELIVERED',
    customerName: 'João Santos',
    items: [
      { productName: 'Suporte para Fone', quantity: 1, unitPrice: 39.9, image: productSuporte },
    ],
    total: 39.9,
    statusHistory: [
      { status: 'PENDING_PAYMENT', date: '2025-03-25T08:00:00' },
      { status: 'PAYMENT_APPROVED', date: '2025-03-25T08:05:00' },
      { status: 'PREPARING', date: '2025-03-25T12:00:00' },
      { status: 'SHIPPED', date: '2025-03-26T10:00:00' },
      { status: 'DELIVERED', date: '2025-03-28T14:00:00' },
    ],
  },
  {
    id: 'PED-20250330-003',
    date: '2025-03-30',
    status: 'PENDING_PAYMENT',
    customerName: 'Ana Oliveira',
    items: [
      { productName: 'Vaso Geométrico', quantity: 1, unitPrice: 49.9, image: productVaso },
    ],
    total: 49.9,
    statusHistory: [
      { status: 'PENDING_PAYMENT', date: '2025-03-30T16:00:00' },
    ],
  },
];