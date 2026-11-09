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
  {
    id: 'PED-20250331-004',
    date: '2025-03-31',
    status: 'PAYMENT_FAILED',
    customerName: 'Carlos Pereira',
    items: [
      { productName: 'Luminária Lua', quantity: 1, unitPrice: 89.9, image: productLuminaria },
    ],
    total: 89.9,
    statusHistory: [
      { status: 'PENDING', date: '2025-03-31T09:00:00' },
      { status: 'PAYMENT_FAILED', date: '2025-03-31T09:02:00' },
    ],
  },
  {
    id: 'PED-20250331-005',
    date: '2025-03-31',
    status: 'PAID',
    customerName: 'Fernanda Costa',
    items: [
      { productName: 'Suporte para Fone', quantity: 2, unitPrice: 39.9, image: productSuporte },
    ],
    total: 79.8,
    statusHistory: [
      { status: 'PENDING', date: '2025-03-31T11:00:00' },
      { status: 'PAID', date: '2025-03-31T11:05:00' },
    ],
  },
  {
    id: 'PED-20250401-006',
    date: '2025-04-01',
    status: 'INVENTORY_ISSUE',
    customerName: 'Rafael Lima',
    items: [
      { productName: 'Vaso Geométrico', quantity: 5, unitPrice: 49.9, image: productVaso },
      { productName: 'Luminária Lua', quantity: 2, unitPrice: 89.9, image: productLuminaria },
    ],
    total: 429.3,
    statusHistory: [
      { status: 'PENDING', date: '2025-04-01T08:30:00' },
      { status: 'INVENTORY_ISSUE', date: '2025-04-01T08:35:00' },
    ],
  },
  {
    id: 'PED-20250401-007',
    date: '2025-04-01',
    status: 'CANCELED',
    customerName: 'Patrícia Alves',
    items: [
      { productName: 'Vaso Geométrico', quantity: 1, unitPrice: 49.9, image: productVaso },
    ],
    total: 49.9,
    statusHistory: [
      { status: 'PENDING', date: '2025-04-01T13:00:00' },
      { status: 'CANCELED', date: '2025-04-01T15:00:00' },
    ],
  },
];