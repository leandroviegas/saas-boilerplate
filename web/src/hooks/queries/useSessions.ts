import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { SessionService } from '@/services/session.service';

export const sessionKeys = {
  all: ['sessions'] as const,
};

export function useSessions() {
  return useQuery({
    queryKey: sessionKeys.all,
    queryFn: () => SessionService.listSessions(),
  });
}

export function useRevokeSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => SessionService.revokeSession(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sessionKeys.all });
    },
  });
}
