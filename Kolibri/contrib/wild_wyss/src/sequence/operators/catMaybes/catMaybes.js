import { createMonadicSequence, iteratorOf } from "../../util/util.js";
import { catMaybes as arrCatMaybes }         from "../../../stdlib/stdlib.js";

export { catMaybes }

/**
 * The catMaybes function takes an {@link Iterable} of {@link MaybeType Maybes}
 * and returns an {@link Iterable} of all the {@link JustXType Just's} values.
 *
 * @function
 * @pure
 * @template _T_
 * @type {
              (iterable: Iterable<MaybeType<_T_>>)
 *         => SequenceType<_T_>
 *       }
 *
 * @example
 * const maybes = [Just(5), Just(3), Nothing];
 * const result = catMaybes(maybes);
 *
 * console.log(...result);
 * // => Logs '5, 3'
 */
const catMaybes = iterable => {

  const catMaybesIterator = () =>  {
    const inner = iteratorOf(iterable);

    const next = () => {
      while (true) {
        const { value, done } = inner.next();
        if (done) return { value: undefined, /** @type Boolean */ done };

        const result = arrCatMaybes([value]);
        if (result.length !== 0) {
          return { value: result[0], done: false };
        }
      }
    };

    return { next };
  };

  return createMonadicSequence(catMaybesIterator);
};