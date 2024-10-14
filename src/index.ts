import { Definable } from "./Definable";
import { DefinableReference } from "./DefinableReference";
import { definableExists } from "./definableExists";
import { definables } from "./definables";
import { getDefinable } from "./getDefinable";
import { getDefinables } from "./getDefinables";
import { getDefinablesCount } from "./getDefinablesCount";

declare global {
  interface Window {
    definables: Map<string, Map<string, Definable>>;
  }
}
if (typeof window !== "undefined") {
  window.definables = definables;
}

export {
  Definable,
  definableExists,
  DefinableReference,
  definables,
  getDefinable,
  getDefinables,
  getDefinablesCount,
};
