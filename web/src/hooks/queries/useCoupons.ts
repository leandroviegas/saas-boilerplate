import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CouponService } from '@/services/coupon.service';

export const couponKeys = {
  all: ['coupons'] as const,
  lists: () => [...couponKeys.all, 'list'] as const,
  list: (params?: any) => [...couponKeys.lists(), params] as const,
  details: () => [...couponKeys.all, 'detail'] as const,
  detail: (id: string) => [...couponKeys.details(), id] as const,
};

export function useCoupons(params?: any) {
  return useQuery({
    queryKey: couponKeys.list(params),
    queryFn: () => CouponService.listCoupons(params),
  });
}

export function useCoupon(id: string) {
  return useQuery({
    queryKey: couponKeys.detail(id),
    queryFn: () => CouponService.getCoupon(id),
    enabled: !!id,
  });
}

export function useCreateCoupon() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => CouponService.createCoupon(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: couponKeys.lists() });
    },
  });
}

export function useUpdateCoupon() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => CouponService.updateCoupon(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: couponKeys.lists() });
      queryClient.invalidateQueries({ queryKey: couponKeys.detail(variables.id) });
    },
  });
}

export function useDeleteCoupon() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => CouponService.deleteCoupon(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: couponKeys.lists() });
    },
  });
}

export function useIncrementCouponUsage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => CouponService.incrementUsage(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: couponKeys.lists() });
      if (data.id) {
        queryClient.invalidateQueries({ queryKey: couponKeys.detail(data.id) });
      }
    },
  });
}
