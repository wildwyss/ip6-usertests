import {from} from "./Kolibri/contrib/wild_wyss/src/jinq/jinq.js";
import {JsonMonad} from "./Kolibri/contrib/wild_wyss/src/json/jsonMonad.js";
import * as _ from "./Kolibri/contrib/wild_wyss/src/iterator/iterator.js";

// --------------------------------------------  INTRO  ----------------------------------------------------------------

/**
 * Welcome & thanks that you will solve our user test, we appreciate it very much!
 * This user test is divided up in two parts:
 * 1. The power of lazy sequences
 * 2. The easy way to query different data structures
 */

// --------------------------------------------  PART I  ----------------------------------------------------------------

/**
 * In this project we built a set of functions to produce and transform lazy sequences.
 * A lazy sequence is a sequence of values, which never fully materialize itself in memory.
 * Therefore, lazy sequences can consist of infinite values.
 *
 * Such sequences can be created using a simple Constructor, taking three values:
 * 1. An initial value, which is the first value to be returned.
 * 2. An until function, which decides on behalf of the value if further elements can be generated, and returns false if not
 * 3. An incrementation function, which defines how the next value is calculated based on the current value.
 *
 * In the following you will solve small exercises based on lazy sequences.
 *
 * _Note:_ The lazy sequence module is imported as {@link _}. This way you can easily access all operations on sequences using `_.`;
 *         For example to call the function map just use `const mapped = _.map(x => 2*x)([1,2,3,4,5]);`
 *
 * _Note 2:_ Since sequences are lazy, there is no direct element access on a sequence.
 *           But you can easily deconstruct a sequence using the `...`-operator.
 *           For example with our previous mapped values just use `console.log(...mapped);` to log all values of the sequence to the console.
 *
 * _Note 3:_ Pay attention with infinite iterators, as they, when deconstructured try to eagerly evaluate each element of the sequence.
 *           This will go on forever and your browser will not respond anymore. use {@link _.take} to only evaluate a certain amount of values.
 */

// This is a simple example of such a lazy sequence, which produces the values from 0 to 100
const seq1 = _.Iterator(0, i => i + 1, i => i < 100);


/**
 * TODO: implement this function repeatF
 *
 * repeatF takes a function `f` and a value `x` as arguments and creates an infinite
 * sequence starting with `x` and applying `f` to the last returned value in each iteration.
 *
 * @template _T_
 * @param { (x:_T_) => _T_ } f - the function to apply in each iteration
 * @param { _T_ } x            - the initial value
 *
 * @returns { IteratorMonadType<_T_> }
 */
const repeatF = (f, x) => _.Iterator(x, f, _ => false);


/**
 * Halves the given value.
 * @param { Number } x
 * @returns { Number }
 */
const halve = x => x / 2;

/** TODO 2: implement this function halves
 *
 * halves is an infinite sequence which halves the initial value on each iteration.
 * The sequence should halve the previous value in each iteration. Use the function {@link halve}.
 *
 * @param   { Number } h0
 * @returns { IteratorMonadType<Number> }
 * @example
 * const h = _.halves(10);
 *
 * console.log(..._.take(2)(h));
 * // => Logs '10, 5'
 */
const halves = h0 => repeatF(halve, h0);


/** TODO 3:
 * Try out your code! Log some elements using `{@link _.take}` to the browser console!
 */
console.log(/**log the result of {@link halves} here*/);


/**
 *
 * Now that you have a feeling about sequences you are ready to solve an exercise with a little more complexity:
 * Given is the following function {@link diff}:
 *
 *
 * {@link diff} finds the slope of a given function f at given value x if h approaches 0.
 * So it is the basic formula to get the slope of a funciton.
 *
 * @callback
 * @type {
 *            (f: (x: Number) => Number)
 *         => (x: Number)
 *         => (h: Number)
 *         => Number
 * }
 *
 */
const diff = f => x => h => (f(x + h) - f(x)) / h;

/**
 * A simple function to calculate the derivative of.
 * @param  { Number } x
 * @return { Number }
 */
const f = x => x * x;

/**
 * TODO 4:
 * The problem with this function is, to determine an h that is close enough to zero.
 * Fortunately, we can use our function {@link halves} to generate smaller and smaller values from a given starting point h0!
 *
 *
 * Implement the following function {@link differentiate}, which takes a starting value h0, a function f and a value x.
 * This function will then return a Sequence of {@link Number Numbers} approaching closer and closer the real slope of f at the value x!
 * _Note:_ use {@link _.map} to map the function {@link diff} over the halves!
 *
 * _Note 2:_ Use the funciton {@link f} defined above to test your implementation.
 *           Since {@link differentiate} generates an infinite sequence, use again {@link _.take} to only take a certain amount of values.
 *
 * @type {
 *          (h0: Number)
 *       => (f: (x: Number) => Number)
 *       => (x: Number)
 *       => IteratorMonadType<Number>
 * }
 */
const differentiate = h0 => f => x => _.map(diff(f)(x))(halves(h0));


/**
 * TODO 5:
 * We can now differentiate which is great.
 * But it would even be better if we wouldn't get an infinite sequence of values, but only one value which is accurate enough.
 *
 * One can argue that the value has been calculated accurately enough if two values of the sequence have a difference smaller than a given epsilon.
 * Implement a function called {@link within} therefore, which takes an epsilon and returns a value, if two following elements of a sequence have a smaller difference than epsilon!
 *
 * _Note:_ use {@link _.uncons} to get the first element of a sequence. See it's JSDoc example to see how it works!
 *
 * @type {
 *      (eps: Number)
 *   => (sequence: IteratorMonadType<Number>)
 *   => Number
 * }
 *
 */
const within = eps => list => {
  const [a, rest] = _.uncons(list);
  const [b]       = _.uncons(rest);
  const diff      = Math.abs(a - b);

  if (diff <= eps) return b;
  return within(eps)(rest);
};


/**
 * TODO 6:
 *
 * Let's combine the created functions!
 *
 * Use your function {@link differentiate} to approximate the derivative of the function {@link f} at the point 1.0.
 * Use 0.5 as starting point for h0.
 *
 * Then pass the sequence to your function {@link within} to get the derivative with an approximation of 0.0001.
 *
 */
const derivativeSequence = differentiate(0.5)(f)(1.0);
const derivativeOfFAtX = within(0.0001)(derivativeSequence);

console.log(derivativeOfFAtX);

/**
 * Conclusion:
 * With lazy sequences it is very easy to calculate a derivative with arbitrary accuracy.
 * Additionally, it allows us to split the code into many small pieces. These are separately testable, changeable or extendable.
 *
 * Imagine you don't want to halve the original h0 but quarter it with each step. To do this, simply
 * modify the implementation of differentiate without changing any other code!
 * Or if you also want to integrate, you can reuse the sequence {@link halves} and the function {@link within}.
 */

// --------------------------------------------  INTRO  ----------------------------------------------------------------
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
 * With JINQ, you can process lists and other data sources in a fluent way as you were working with database queries.
 * Suppose, you want to filter a list of animals to find all dolphins. We can do it as follows:
 *
 * from(animals)
 *   .select(x => x['type'])
 *   .where(type => type === 'dolphin')
 *   .result();
 *
 * What is happening here?
 * from:   Takes a data source and adds further functionality to it.
 * select: For each element, we map it to its object-property 'type', so now it's a list of animal types (you can also use map for this).
 * where:  It works like a filter, we're taking only the elements which match the given predicate.
 * result: Returns a new datasource based on the previous operations.
 *
 * More JINQ functions:
 * inside:    Applies a function to an element, which turns the element in a new JINQ compatible data source.
 * pairWith:  The elements are combined with a new source of data.
 *            As result, we get all combinations of both dataset in pairs.
 *
 * If you are facing some troubles, look at our implementation and its test-file, this may help you.
 * => docs/Kolibri/contrib/wild_wyss/src/jinq/
 *
 * Working with pairs:
 * A pair represents a immutable data structure holding exactly two values.
 *
 * Create a pair using the following syntax:
 * const pair = Pair("first")("second");
 *
 * A value from a pair can be received using:
 * const value1 = fst(pair);
 * const value2 = snd(pair);
 *
 * ... or in a more nicely way:
 * const [value1, value2] = pair;
 */

/**
 * JSONMonad
 *
 * A great thing about JINQ is, that it can easily be used to process any lists of JavaScript objects.
 * For this reason, such a list must be wrapped with the constructor {@link JsonMonad}.
 * A JsonMonad is an {@link Iterable iterable object}, which, when iterating, returns element after element of the underlying list.
 */

// ------------------------------------------------  Examples ----------------------------------------------------------

// Functions to load a json file. You don't have to change this.

/**
 * Loads a file from the given path.
 * @template _T_
 * @param { String } path - path to file
 * @return { Promise<_T_> }
 */
const fetchAndParseFile = async path =>
  fetch(path)
    .then(response => response.text())
    .then(text => JSON.parse(text));

// Fetching JSON Files located under resources
(async () => {
  /**@type Array<LanguageType> */
  const languages = await fetchAndParseFile('resources/languages.json');
  /**@type Array<DeveloperType> */
  const devs = await fetchAndParseFile('resources/developers.json');

  example1(languages);
  example2(devs);
  salaryOfMichael(devs);
  sophiasProgrammingLanguages(devs, languages);
})();

/**
 * Example 1: How to work with jinq and maybe
 *
 * Prints all programming language id's to the console.
 * @param {Array<LanguageType>} languages - programming languages
 */
const example1 = languages => {
  const allIds =
    from(JsonMonad(languages))
      .select(x => x['id'])
      .result();

  console.log("language ids: ", ...allIds);
};

/**
 * Example 2: Dealing with absent values
 *
 * Prints all developer to the console, which have also a student id (not all developers have such an id,
 * but JINQ deals with it using the MaybeType.
 *
 * @param {Array<DeveloperType>}developers
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
 * Now it's time to put you in charge. Solve the following exercises.
 * For this purpose, we have some survey results from developers and stored it in a file developers.json.
 * Additionally, we provide a json-collection of programming languages.
 * These two collections are already loaded and ready to use. The code for this is located a few lines above.
 *
 * When solving, make notes if you spot anything that isn't clear or if you see things that we can improve.
 *
 * Have a look at the JSON files in the resources folder. Since these are results from a survey,
 * there were no mandatory fields and there are many nulls in it.
 *
 *
 *
 * Exercise 1: Salary from Michael
 * Find the salary from Michael using the given Json-data called 'developers' and print it to the console.
 *
 * Exercise 2: Sophias programming languages
 * Print all of Sophias favorite programming languages to the console.
 * For this exercise, you have to combine both datasets.
 *
 * Have fun!
 */

/**
 * @param { Array<DeveloperType> } devs
 * @returns void
 */
const salaryOfMichael = devs => {

  const salaryList =
    from(JsonMonad(devs))
      .where(p => p['name'] === "Michael Brown")
      .map(p => p['salary'])
      .result();

  console.log(...salaryList);
};


/**
 * @param { Array<DeveloperType> } devs
 * @param { Array<LanguageType> } languages
 * @returns void
 */
const sophiasProgrammingLanguages = (devs, languages) => {

  const sophiasLangauges =
    from(JsonMonad(devs))
      .where(dev => dev["name"] === "Sophia Davis")
      .map(sophia => sophia["favoriteLanguages"])
      .pairWith(JsonMonad(languages))
      .where(([id, language]) => id === language["id"])
      .select(([_, language]) => language["name"])
      .result();

  console.log(...sophiasLangauges);                   // Just case, result will be printed to the console
};
