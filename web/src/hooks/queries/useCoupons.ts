import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getCoupons } from '@/api/generated/coupons/coupons';
import type {
  GetAdminCouponsParams,
  PostAdminCouponsBody,
  PutAdminCouponsIdBody,
} from '@/api/generated/newChatbotAPI.schemas';

const couponsApi = getCoupons();

// Query keys
export const couponKeys = {
  all: ['coupons'] as const,
  lists: () => [...couponKeys.all, 'list'] as const,
  list: (params?: GetAdminCouponsParams) => [...couponKeys.lists(), params] as const,
  details: () => [...couponKeys.all, 'detail'] as const,
  detail: (id: string) => [...couponKeys.details(), id] as const,
};

// Fetch all coupons
export function useCoupons(params?: GetAdminCouponsParams) {
  return useQuery({
    queryKey: couponKeys.list(params),
    queryFn: async () => {
      const response = await couponsApi.getAdminCoupons(params);
      return response;
    },
  });
}

// Fetch single coupon by ID
export function useCoupon(id: string) {
  return useQuery({
    queryKey: couponKeys.detail(id),
    queryFn: async () => {
      const response = await couponsApi.getAdminCouponsId(id);
      return response.data;
    },
    enabled: !!id,
  });
}

// Create coupon
export function useCreateCoupon() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (couponData: PostAdminCouponsBody) => {
      const response = await couponsApi.postAdminCoupons(couponData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: couponKeys.lists() });
    },
  });
}

// Update coupon
export function useUpdateCoupon() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updateData }: { id: string; updateData: PutAdminCouponsIdBody }) => {
      const response = await couponsApi.putAdminCouponsId(id, updateData);
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: couponKeys.lists() });
      queryClient.invalidateQueries({ queryKey: couponKeys.detail(variables.id) });
    },
  });
}

// Delete coupon
// export function useDeleteCoupon() {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async (id: string) => {
//       await couponsApi.deleteAdminCouponsId(id);
//       return id;
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: couponKeys.lists() });
//     },
//   });
// }

// Increment usage
export function useIncrementCouponUsage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await couponsApi.postAdminCouponsIdIncrementUsage(id);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: couponKeys.lists() });
      if (data.id) {
        queryClient.invalidateQueries({ queryKey: couponKeys.detail(data.id) });
      }
    },
  });
}
