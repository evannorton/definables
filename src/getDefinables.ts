export const getDefinables = <T extends Definable>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- The args are not relevant to this function.
  prototype: new (...args: any[]) => T,
): ReadonlyMap<string, T> => {
  const retrievedDefinables: Map<string, T> = new Map();
  definables
    .get(prototype.name)
    ?.forEach((definable: Definable, id: string): void => {
      retrievedDefinables.set(id, definable as T);
    });
  return retrievedDefinables;
};