import { from }       from "./Kolibri/contrib/wild_wyss/src/jinq/jinq.js";
import { JsonMonad }  from "./Kolibri/contrib/wild_wyss/src/json/jsonMonad.js";
import * as _         from "./Kolibri/contrib/wild_wyss/src/iterator/iterator.js";
import { arrayEq }    from "./Kolibri/docs/src/kolibri/util/arrayFunctions.js";
import { isIterable } from "./Kolibri/contrib/wild_wyss/src/iterator/util/util.js";

/**
 * Utility function that helps to find your way through the examples.
 * @type {(...data: Array) => any }
 */
const TODO = data => console.log("TODO:", data); // we will use this later; don't worry for now

/**
 * Utility function to check the results of your test.
 * @template _T_
 * @param { Array<*> | Iterable<*> | _T_ } actual
 * @param { Array<*> | Iterable<*> | _T_ } expected
 * @param { String }              name
 */
const assert = (actual, expected, name) => {
  const bothIterable = isIterable(actual) && expected;
  let equal = actual === expected;
  if (bothIterable) {
    actual = [..._.take(10)(actual)];
    expected = [..._.take(10)(expected)];
    equal = arrayEq(actual)(expected);
  }
  if (equal) {
    console.log(`OK: ${name}`);
  } else {
    console.error(`${name}: not working yet! Expected: ${expected}, but got ${actual}`);
  }
};
// --------------------------------------------  INTRO  ----------------------------------------------------------------

/**
 * Welcome & thanks that you will solve our user test, we appreciate your time very much!
 * This user test is divided up into two parts:
 * 1. The power of lazy sequences
 * 2. The easy way to query different data structures
 *
 * At the end of the user test we will ask you to fill out a questionnaire.
 * You may want to take notes along the way about what you like or what bothers you while solving the tasks.
 * Basically, we are interested in all information concerning our API.
 *
 * We are very grateful for your feedback, because it helps to make the API more understandable and robust.
 * Thank you in advance!
 *
 */

// --------------------------------------------  PART I  ---------------------------------------------------------------

/**
 * In this project we have built a set of functions to produce and transform lazy sequences.
 * A lazy sequence is a sequence of values that never fully materializes in memory.
 * Therefore, lazy sequences can provide a large - even infinite - amount of values.
 *
 * Such sequences can be created using a constructor, taking three values:
 * 1. An initial value, which is the first value to be held by this sequence
 * 2. An "until" function, which decides whether further elements can be generated.
 *    The "until" function takes the current value as its parameter and returns
 *    true if the sequence should proceed, false if not.
 * 3. An incrementation function, which defines how the next value is calculated based on the current value.
 *
 * In the following we ask you to solve small exercises based on lazy sequences.
 *
 */

/**
 *
 * Please have a look at this simple example of such a lazy sequence, which produces the values from 0 to 100.
 *
 * _Note 1:_ The lazy sequence module is imported as {@link _}. This way you can easily access all operators on
 *           sequences using `_.`; For example: to call the function "map" just use
 *           `const mapped = _.map(x => 2*x)([1,2,3,4,5]);`.
 *           hint: Operations defined for sequences (such as `map`) can be used on any standard JavaScript {@link Iterable}.
 *           That means that you can also use them to transform any standard JS arrays, HTMLCollections and so on.
 *
 * _Note 2:_ Since sequences are lazy, there is no direct element access on a sequence.
 *           But you can easily deconstruct a sequence using the `...`-operator.
 *           In our previously mapped values just use `console.log(...mapped);` to log all values of the
 *           sequence to the console.
 *
 * _Note 3:_ Pay attention with infinite iterators, as they, when deconstructed, try to eagerly evaluate each element of
 *           the sequence. This will go on forever and your browser will not respond anymore. Use {@link _.take} to only
 *           evaluate a certain amount of values.
 *
 * @type { IteratorMonadType<Number> }
 *
 */
const seq1 = _.Iterator(0, i => i + 1, i => i > 100);
console.log("A simple sequence from 0 to 100:", ...seq1);

/**
 * TODO 1: Now follows the first task: implement this function {@link repeatF} which returns an {@link IteratorMonadType }.
 * Like in the example above - use the {@link _.Iterator}!
 *
 * {@link repeatF} takes a function `f` and a value `x` as arguments and creates an infinite
 * sequence starting with `x` and applying `f` to the last returned value in each iteration.
 *
 * @template _T_
 * @param { (x:_T_) => _T_ } f - the function to apply in each iteration
 * @param { _T_ } x            - the initial value
 *
 * @returns { IteratorMonadType<_T_> }
 * @example
 * const parabola = x => x + 1;
 * const repeated = repeatF(parabola, 0);
 *
 * console.log(..._.take(4)(repeated));
 * // => Logs '0 1 2 3'
 */
const repeatF = (f, x) => _.Iterator(x, f, _ => false);


// Your solution will be tested against:
assert(
  _.take(3) ( repeatF(x => x + 2, 10) ),
  [10,12,14],
  "repeatF"
);

/**
 * (You don't have to change this.)
 *
 * Halves the given value.
 * @param   { Number } x
 * @returns { Number }
 */
const halve = x => x / 2;

/** TODO 2: implement this function halves, to create a simple sequence
 *
 * halves shall be an infinite sequence which halves the previous value in each iteration.
 * Use the function {@link halve} defined above.
 *
 * @param   { Number } h0
 * @returns { IteratorMonadType<Number> }
 * @example
 * const h = halves(10);
 *
 * console.log(..._.take(2)(h));
 * // => Logs '10, 5'
 */
const halves = h0 => repeatF( halve, h0);

// Your solution will be tested against:
assert(
  _.take(3)( halves(10) ),
  [10, 5, 2.5],
  "halves"
);

/**
 * (You don't have to change this.)
 *
 * Now that you have a feeling about sequences you are ready to solve an exercise with a little more complexity:
 * Given is the following function {@link slope}:
 *
 * {@link slope} finds the slope of a given function parabola at a given value x, with h approaching 0.
 *
 * @type {
 *            (parabola: (x: Number) => Number)
 *         => (x: Number)
 *         => (h: Number)
 *         => Number
 * }
 */
const slope = f => x => h => (f(x + h) - f(x)) / h;

/**
 * (You don't have to change this.)
 *
 * An example function - we will calculate its derivative later.
 * @param  { Number } x
 * @return { Number }
 */
const parabola = x => x * x;

/**
 * TODO 3: finding a good h
 * The difficulty when using this function is, to determine an h that is close enough to zero.
 * Fortunately, we can use our function {@link halves} to generate smaller and smaller values from a given starting
 * point h0!
 *
 *
 * Implement the following function {@link differentiate}, which takes a starting value `h0`, a function `parabola` and a value
 * `x`.This function will then return a Sequence of {@link Number Numbers} approaching closer and closer to the real
 * slope of `parabola` at the value `x`!
 *
 * _Note:_ use {@link _.map} to map the function {@link slope} over the halves!
 *
 * _Note 2:_ Use the function {@link parabola} defined above to test your implementation.
 *           Since {@link differentiate} generates an infinite sequence, use again {@link _.take} to only take a certain
 *           amount of values.
 *
 * @type {
 *          (h0: Number)
 *       => (f: (x: Number) => Number)
 *       => (x: Number)
 *       => IteratorMonadType<Number>
 * }
 *
 * @example
 * const diffs = differentiate(0.5)(parabola)(1);
 * console.log(..._.take(5)(diffs));
 *
 * // => Logs '2.5, 2.25, 2.125, 2.0625, 2.03125'
 */
const differentiate = h0 => f => x => _.map ( slope(f)(x) ) (halves(h0));

// Your solution will be tested against:
const diffs = differentiate(0.5)(parabola)(1);
assert(
  _.take(3)( diffs ),
  [2.5, 2.25, 2.125],
  "differentiate"
);

/**
 * TODO 4: finding more accurate slopes
 * We can now differentiate which is great.
 * But it would even be better if we wouldn't get an infinite sequence of values, but only one value which is accurate
 * enough.
 *
 * One can argue that the value has been calculated accurately enough if two values of the sequence have a difference
 * smaller than a given epsilon. Implement a function called {@link within}, which takes an epsilon and
 * returns a value, if two following elements of a sequence have a smaller difference than epsilon!
 *
 * _Note:_ use {@link _.uncons} to get the first element of a sequence. See it's JSDoc example to see how it works!
 *
 * @type {
 *      (eps: Number)
 *   => (sequence: IteratorMonadType<Number>)
 *   => Number
 * }
 *
 * @example
 * const smallDifference = within(0.1)(halves(10));
 * console.log(smallDifference);
 * // => Logs '0.078125'
 */
const within = eps => sequence => {
  const [a, rest] = _.uncons(sequence);
  const [b]       = _.uncons(rest);
  const diff      = Math.abs(a - b);

  if (diff <= eps) return b;
  return within(eps)(rest);
};

// Your solution will be tested against:
const smallDifference = within(0.1)(halves(10));
assert(
  smallDifference,
  0.078125,
  "within"
);

/**
 * TODO 5: Cool! We are almost finished with part 1! Now let's combine the created functions for a stunning effect!
 *
 * Use your function {@link differentiate} to approximate the slope of the function {@link parabola} at the point `1.0`.
 * Use `0.5` as starting point for `h0`.
 *
 * Then pass the sequence to your function {@link within} to get the slope with an approximation of `0.000_1`.
 *
 */
const slopeOfFAtX = within(0.000_1)(diffs);

// Your solution will be tested against:
assert(
  slopeOfFAtX,
  2.00006103515625,
  "Approximated Slope");

/**
 * Conclusion:
 * With lazy sequences it is very easy to calculate slopes of functions with arbitrary accuracy.
 * Additionally, it allows us to split the code into many small pieces. They make good modules
 * since they are separately testable, changeable or extendable.
 *
 * Imagine you don't want to halve the original h0 but quarter it with each step. To do this, simply
 * modify the implementation of differentiate without changing any other code!
 * You can even integrate by reusing the sequence {@link halves} and the function {@link within}.
 *
 * An example how this works for integration can be found at:
 * https://www.cs.kent.ac.uk/people/staff/dat/miranda/whyfp90.pdf in the chapter 4.3 "Numerical Integration"
 *
 */

// --------------------------------------------  PART II  --------------------------------------------------------------
/**
 * INTRO - User-test Part 2
 *
 * Congratulation, you solved the first part of the user-tests successfully.
 * The second part is all about JINQ. JINQ is our implementation of LINQ.
 * LINQ (Language Integrated Query) is a toolbox to process data from different sources.
 * If you wish more information, please consider the following link:
 * https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/concepts/linq/
 *
 * Before we start, we need to acquire some additional knowledge to solve the user-test exercises.
 *
 * Content of the following section:
 * 1. JINQ - available functions
 * 2. Examine some examples and learn from it
 * 3. It's your turn - solving exercises
 */

// ------------------------------------------------  JINQ  -------------------------------------------------------------

/**
 * Having a closer look at JINQ.
 * With JINQ, you can process lists and other data sources in a fluent way as if you were working with database queries.
 * Suppose, you want to filter a list of animals to find all dolphins. We can do it as follows:
 *
 * from(animals)
 *   .select(x => x['type'])
 *   .where(type => type === 'dolphin')
 *   .result();
 *
 * What is happening here?
 * from:   Takes a data source and adds further functionality to it.
 * select: For each element, we map it to its object-property 'type', so now it's a list of animal types (you can also
 *         use map for this).
 * where:  It works like a filter, we're taking only the elements which match the given predicate.
 * result: Returns a new datasource based on the previous operations.
 *
 * More JINQ functions:
 * inside:    Applies a function `f` to each element. `f` turns the element in a new JINQ compatible data source.
 * pairWith:  The elements of the current data source are combined with a new JINQ compatible data source.
 *            As result, we get all combinations of both datasets in pairs.
 *
 * If you are facing some troubles, look at our implementation and its test-file, this may help you.
 * => Kolibri/contrib/wild_wyss/src/jinq/
 *
 * Working with pairs:
 * A pair represents an immutable data structure holding exactly two values.
 *
 * Create a pair using the following syntax:
 * const pair = Pair("first")("second");
 *
 * The values from a pair can be received using:
 * const value1 = fst(pair);
 * const value2 = snd(pair);
 *
 * ... or in a nicer way:
 * const [value1, value2] = pair;
 */

/**
 * JSONMonad
 *
 * A great thing about JINQ is, that it can easily be used to process any lists of JavaScript objects.
 * For this reason, such a list must be wrapped with the constructor {@link JsonMonad}.
 * A JsonMonad is an {@link Iterable iterable object}, which, when iterating, returns element after element of the
 * underlying list.
 */

// ------------------------------------------------  Examples ----------------------------------------------------------

/**
 * (You don't have to change this.)
 *
 * Example 1: How to work with jinq
 *
 * Prints all programming language id's to the console.
 * @param {Array<LanguageType>} languages - programming languages
 */
const example1 = languages => {
  const allIds =
    from(JsonMonad(languages))
      .select(x => x['id'])
      .result(); // unwrap JsonMonad again

  console.log("language ids: ", ...allIds); // JsonMonad is iterable
};

/**
 * (You don't have to change this.)
 *
 * Example 2: Dealing with absent values
 *
 * Prints all developers to the console, which also have a student id
 * (Not all developers have such an id, but JINQ deals with that!)
 *
 * @param { Array<DeveloperType> } developers
 */
const example2 = developers => {
  const allIds =
    from(JsonMonad(developers))
      .select(x => x['switch-edu-id'])
      .result();

  console.log("student ids: ", ...allIds);
};


// -------------------------------------------------  YOUR TURN --------------------------------------------------------
/**
 * Now you are in charge. Solve the following exercises.
 * For this purpose, we have some survey results from developers and stored it in a file resources/developers.json.
 *
 * Additionally, we provide a json-collection of programming languages (resources/languages.json).
 * These two collections are already loaded and ready to use. The code for this is located at the end of the file.
 *
 * When solving, please keep notes about anything that we can improve.
 *
 * Have a look at the JSON files in the resources folder. Since these are results from a survey,
 * there were no mandatory fields and there are many nulls in it.
 *
 * Have fun!
 */

/**
 * TODO 1: Salary of Michael
 * Find the salary of Michael using the given Json-data called 'developers' and print it to the console.
 * @param { Array<DeveloperType> } devs
 * @returns MonadType
 *
 * @example
 * const salary = salaryOfMichael(devs);
 * console.log(...salary);
 * // => Logs '70000'
 */
const salaryOfMichael = devs =>
   from(JsonMonad(devs))
      .where( dev => dev.name != null)
      .where( dev => dev.name.startsWith("Michael"))
      .select(dev => dev.salary)
      .result();

// salaryOfMichael gets evaluated at the end of the file. 'Salary of Michael: 70000'
// will be printed to the console if everything is ok.

/**
 * TODO 2: Sophia's programming languages
 * Print all of Sophia's favorite programming languages to the console.
 * For this exercise, you have to combine both datasets.
 *
 * @param { Array<DeveloperType> } devs
 * @param { Array<LanguageType> } languages
 * @returns { MonadType }
 *
 * @example
 * const langs = sophiasProgrammingLanguages(devs, languages);
 * console.log(...langs);
 * // => Logs 'C++, Haskell'
 */
const sophiasProgrammingLanguages = (devs, languages) =>
    from(JsonMonad(devs))
      .where   ( dev    => dev.name === "Sophia Davis")
      .map     ( sophia => sophia.favoriteLanguages)
      .pairWith( JsonMonad(languages) )
      .where   ( ([langId, language]) => langId === language.id )
      .select  ( ([     _, language]) => language.name )
      .result  ();

// sophiasProgrammingLanguages gets evaluated at the end of the file. 'Sophias languages: C++, Haskell'
// will be printed to the console if everything is ok.

/**
 * Conclusion:
 * As you can see, you can easily process any JSON-structures!
 * This works because {@link JsonMonad} extends a given object by certain functionality (called monadic).
 * Since JINQ only operates on this monadic interface, every object or data structures complying to this monadic
 * interface can be processed using JINQ!
 *
 * {@link IteratorMonadType} complies to this monadic interface as well and can therefore be processed using JINQ.
 *
 * This means, you can enhance any data structure in this way and use it with JINQ, without changing the implementation
 * of JINQ!
 *
 * Isn't that great?
 */




// --------------------------------------------  Functions to load a json file --------------------------------------------------------------
/**
 * (You don't have to change this.)
 *
 * Loads a file from the given path.
 * @template _T_
 * @param { String } path - path to file
 * @return { Promise<_T_> }
 */
const fetchAndParseFile = async path =>
  fetch(path)
    .then(response => response.text())
    .then(text => JSON.parse(text));


/**
 * Fetches json files asynchronously.
 * This function will be executed immediately and run all JINQ code.
 */
(async () => {
  /**@type Array<LanguageType> */
  const languages = await fetchAndParseFile('resources/languages.json');
  /**@type Array<DeveloperType> */
  const devs = await fetchAndParseFile('resources/developers.json');

  example1(languages);
  example2(devs);
  console.log("Salary of Michael: ", ...salaryOfMichael(devs));
  console.log("Sophias languages: ", ...sophiasProgrammingLanguages(devs, languages));
})();

