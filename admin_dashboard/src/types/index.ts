export interface Rider {
  id: string;
  name: string;
  phone: string;
  email?: string;
  persona: 'qcommerce' | 'food_delivery';
  zone: string;
  riskScore: number;
  createdAt: string;
  status: 'active' | 'inactive' | 'suspended';
}

export interface Policy {
  id: string;
  riderId: string;
  riderName: string;
  persona: 'qcommerce' | 'food_delivery';
  zone: string;
  premium: number;
  coverage: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'expired' | 'cancelled';
  txHash?: string;
}

export interface Claim {
  id: string;
  policyId: string;
  riderId: string;
  riderName: string;
  triggerType: 'rain' | 'traffic' | 'surge' | 'accident';
  triggerValue: number;
  threshold: number;
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'processing' | 'paid';
  createdAt: string;
  processedAt?: string;
  txHash?: string;
  fraudScore?: number;
  aiDecision?: string;
}

export interface Trigger {
  id: string;
  type: 'rain' | 'traffic' | 'surge' | 'accident';
  zone: string;
  currentValue: number;
  threshold: number;
  isActive: boolean;
  lastUpdated: string;
  affectedPolicies: number;
}

export interface DashboardStats {
  totalPolicies: number;
  activePolicies: number;
  totalClaims: number;
  pendingClaims: number;
  totalPremiumCollected: number;
  totalClaimsPaid: number;
  activeRiders: number;
  avgRiskScore: number;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string;
    fill?: boolean;
  }[];
}

export interface ActivityLog {
  id: string;
  type: 'claim' | 'policy' | 'trigger' | 'rider';
  action: string;
  description: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}
