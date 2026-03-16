import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { SystemVariableService } from '@/services/system-variable.service';
import { SystemVariableDTO } from '@/models/system-variable.model';

export const systemVariableKeys = {
  all: ['systemVariables'] as const,
  lists: () => [...systemVariableKeys.all, 'list'] as const,
  list: (params?: any) => [...systemVariableKeys.lists(), params] as const,
  details: () => [...systemVariableKeys.all, 'detail'] as const,
  detail: (id: string) => [...systemVariableKeys.details(), id] as const,
};

export function useSystemVariables(params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: systemVariableKeys.list(params),
    queryFn: () => SystemVariableService.listSystemVariables(params),
  });
}

export function useSystemVariable(id: string) {
  return useQuery({
    queryKey: systemVariableKeys.detail(id),
    queryFn: () => SystemVariableService.getSystemVariable(id),
    enabled: !!id,
  });
}

export function useSetSystemVariable() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, value }: { id: string; value: string }) => 
      SystemVariableService.setSystemVariable(id, value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: systemVariableKeys.lists() });
    },
  });
}

export function useUpdateSystemVariable() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, value }: { id: string; value: string }) => 
      SystemVariableService.updateSystemVariable(id, value),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: systemVariableKeys.lists() });
      if (data.id) {
        queryClient.invalidateQueries({ queryKey: systemVariableKeys.detail(data.id) });
      }
    },
  });
}

export function useDeleteSystemVariable() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => 
      SystemVariableService.deleteSystemVariable(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: systemVariableKeys.lists() });
    },
  });
}
