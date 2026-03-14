import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ProductService } from '@/services/product.service';

export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (params?: any) => [...productKeys.lists(), params] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
  prices: (params?: any) => [...productKeys.all, 'prices', params] as const,
};

export function useProducts(params?: any) {
  return useQuery({
    queryKey: productKeys.list(params),
    queryFn: () => ProductService.listProducts(params),
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => ProductService.getProduct(id),
    enabled: !!id,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => ProductService.createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => ProductService.updateProduct(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.detail(variables.id) });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ProductService.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
}

export function useSwitchProductActive() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ProductService.switchProductActive(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      if (data.id) {
        queryClient.invalidateQueries({ queryKey: productKeys.detail(data.id) });
      }
    }
  });
}

// Prices
export function useProductPrices(params?: any) {
  return useQuery({
    queryKey: productKeys.prices(params),
    queryFn: () => ProductService.listPrices(params),
  });
}

export function useCreateProductPrice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => ProductService.createPrice(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useUpdateProductPrice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => ProductService.updatePrice(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useDeleteProductPrice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ProductService.deletePrice(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useSwitchProductPriceActive() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ProductService.switchPriceActive(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  });
}
