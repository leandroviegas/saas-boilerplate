import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getRoles } from '@/api/generated/roles/roles';
import type {
  PostAdminRolesBody,
  PutAdminRolesSlugBody,
} from '@/api/generated/newChatbotAPI.schemas';

const rolesApi = getRoles();

// Query keys
export const roleKeys = {
  all: ['roles'] as const,
  lists: () => [...roleKeys.all, 'list'] as const,
  list: () => [...roleKeys.lists()] as const,
  details: () => [...roleKeys.all, 'detail'] as const,
  detail: (slug: string) => [...roleKeys.details(), slug] as const,
};

// Fetch all roles
export function useRoles() {
  return useQuery({
    queryKey: roleKeys.list(),
    queryFn: async () => {
      const response = await rolesApi.getAdminRoles();
      return response;
    },
  });
}

// Fetch single role by slug
export function useRole(slug: string) {
  return useQuery({
    queryKey: roleKeys.detail(slug),
    queryFn: async () => {
      const response = await rolesApi.getAdminRolesSlug(slug);
      return response.data;
    },
    enabled: !!slug,
  });
}

// Create role
export function useCreateRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (roleData: PostAdminRolesBody) => {
      const response = await rolesApi.postAdminRoles(roleData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleKeys.lists() });
    },
  });
}

// Update role
export function useUpdateRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ slug, updateData }: { slug: string; updateData: PutAdminRolesSlugBody }) => {
      const response = await rolesApi.putAdminRolesSlug(slug, updateData);
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: roleKeys.lists() });
      queryClient.invalidateQueries({ queryKey: roleKeys.detail(variables.slug) });
    },
  });
}

// Delete role
export function useDeleteRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (slug: string) => {
      await rolesApi.deleteAdminRolesSlug(slug);
      return slug;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleKeys.lists() });
    },
  });
}
