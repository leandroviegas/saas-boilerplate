import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PaymentService } from '@/services/payment.service';

export const paymentKeys = {
  all: ['payment'] as const,
  products: (params?: any) => [...paymentKeys.all, 'products', params] as const,
  subscription: () => [...paymentKeys.all, 'subscription'] as const,
  transactions: (params?: any) => [...paymentKeys.all, 'transactions', params] as const,
};

export function usePaymentProducts(params?: any) {
  return useQuery({
    queryKey: paymentKeys.products(params),
    queryFn: () => PaymentService.listProducts(params),
  });
}

export function useSubscription() {
  return useQuery({
    queryKey: paymentKeys.subscription(),
    queryFn: () => PaymentService.getSubscription(),
  });
}

export function useTransactions(params?: any) {
  return useQuery({
    queryKey: paymentKeys.transactions(params),
    queryFn: () => PaymentService.listTransactions(params),
  });
}

export function useCreateCheckoutSession() {
  return useMutation({
    mutationFn: (data: any) => PaymentService.createCheckoutSession(data),
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
  });
}

export function useCancelSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => PaymentService.cancelSubscription(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.subscription() });
    },
  });
}
