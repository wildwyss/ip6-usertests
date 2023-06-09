import { SequencePrototype } from "../../constructors/sequence/Sequence.js";
import { toMonadicIterable } from "../../util/util.js";

export { pipe }

/**
 * Transforms the given {@link Iterable iterable} using the passed {@link SequenceOperation SequenceOperations}.
 *
 * @function
 * @pure
 * @type  { <_T_>
 *            (...transformers: SequenceOperation<*,*> )
 *            => (iterable: Iterable<_T_>)
 *            => (SequenceType<_T_> | *)
 *        }
 *
 * @example
 * const piped = pipe(
 *                retainAll(n => n % 2 === 0),
 *                map(n => 2*n),
 *                drop(2)
 *              )(Range(5));
 *
 * console.log(...piped);
 * // => Logs '0, 4, 8'
 */
const pipe = (...transformers) => iterable => {

  // assure that the iterable is monadic
  if (Object.getPrototypeOf(iterable) !== SequencePrototype) {
   iterable = toMonadicIterable(iterable);
  }

  for (const transformer of transformers) {
    iterable = transformer(iterable);
  }

  return /**@type {SequenceType} */ iterable;
};