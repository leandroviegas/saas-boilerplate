import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getProducts } from '@/api/generated/products/products';
import type {
  GetAdminProductsParams,
  PostAdminProductsBody,
  PutAdminProductsIdBody,
} from '@/api/generated/newChatbotAPI.schemas';

const productsApi = getProducts();

// Query keys
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (params?: GetAdminProductsParams) => [...productKeys.lists(), params] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
};

// Fetch all products
export function useProducts(params?: GetAdminProductsParams) {
  return useQuery({
    queryKey: productKeys.list(params),
    queryFn: async () => {
      const response = await productsApi.getAdminProducts(params);
      return response;
    },
  });
}

// Fetch single product by ID
export function useProduct(id: string) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: async () => {
      const response = await productsApi.getAdminProductsId(id);
      return response.data;
    },
    enabled: !!id,
  });
}

// Create product
export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productData: PostAdminProductsBody) => {
      const response = await productsApi.postAdminProducts(productData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
}

// Update product
export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updateData }: { id: string; updateData: PutAdminProductsIdBody }) => {
      const response = await productsApi.putAdminProductsId(id, updateData);
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.detail(variables.id) });
    },
  });
}

// Delete product
export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await productsApi.deleteAdminProductsId(id);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
}

// Switch active status
export function useSwitchProductActive() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await productsApi.patchAdminProductsIdSwitchActive(id);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      if (data.id) {
        queryClient.invalidateQueries({ queryKey: productKeys.detail(data.id) });
      }
    }
  });
}
