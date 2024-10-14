import { Definable } from "./Definable";
import { getDefinables } from "./getDefinables";

export const definableExists = <T extends Definable>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- The args are not relevant to this function.
  prototype: new (...args: any[]) => T,
  id: string,
): boolean => getDefinables(prototype).has(id);
