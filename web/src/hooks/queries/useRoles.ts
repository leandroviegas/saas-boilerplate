import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { RoleService } from '@/services/role.service';

export const roleKeys = {
  all: ['roles'] as const,
  lists: () => [...roleKeys.all, 'list'] as const,
  list: () => [...roleKeys.lists()] as const,
  details: () => [...roleKeys.all, 'detail'] as const,
  detail: (slug: string) => [...roleKeys.details(), slug] as const,
};

export function useRoles() {
  return useQuery({
    queryKey: roleKeys.list(),
    queryFn: () => RoleService.listRoles(),
  });
}

export function useRole(slug: string) {
  return useQuery({
    queryKey: roleKeys.detail(slug),
    queryFn: () => RoleService.getRole(slug),
    enabled: !!slug,
  });
}

export function useCreateRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => RoleService.createRole(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleKeys.lists() });
    },
  });
}

export function useUpdateRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ slug, data }: { slug: string; data: any }) => RoleService.updateRole(slug, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: roleKeys.lists() });
      queryClient.invalidateQueries({ queryKey: roleKeys.detail(variables.slug) });
    },
  });
}

export function useDeleteRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slug: string) => RoleService.deleteRole(slug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleKeys.lists() });
    },
  });
}
