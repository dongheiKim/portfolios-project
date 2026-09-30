export function shouldClearUserScopedState(
  previousUserId: number | null,
  nextUserId: number | null,
): boolean {
  return previousUserId !== null && previousUserId !== nextUserId;
}
