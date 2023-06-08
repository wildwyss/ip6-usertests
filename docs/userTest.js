import { from }      from "./Kolibri/contrib/wild_wyss/src/jinq/jinq.js";
import { JsonMonad } from "./Kolibri/contrib/wild_wyss/src/json/jsonMonad.js";
import * as _        from "./Kolibri/contrib/wild_wyss/src/iterator/iterator.js";
import {createMonadicIterable} from "./Kolibri/contrib/wild_wyss/src/iterator/util/util.js";

// --------------------------------------------  INTRO  ----------------------------------------------------------------

const within = eps => list => {
  const [a, rest] = _.uncons(list);
  const [b]       = _.uncons(rest);
  const diff      = Math.abs(a - b);

  if (diff <= eps) return b;
  return within(eps)(rest);
};

const diff = f => x => h => (f(x + h) - f(x)) / h;

const repeatFIterator = f => start => {
  const iterator = () => {
   let nextValue = start;

   const next = () => {
     const value = nextValue;
     nextValue = f(nextValue);
     return { value, done: false}
   };
   return { next };
  };
  return createMonadicIterable(iterator);
};

const f = x => x*x;
const halve = x => x / 2;
// console.log(...take(10)(repeatFIterator(halve)(10)));
const differentiate = h0 => f => x => _.map(diff(f)(x))(repeatFIterator(halve)(h0));
console.log(within(0.0001)(differentiate(0.5)(f)(0)));

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
 * 1. Is something in it or not, the maybe type
 * 2. JINQ - available functions
 * 3. Examine some examples and learn from it
 * 4. It's your turn - solving exercises
 *
 */

// ------------------------------------------  MAYBE-TYPE  -------------------------------------------------------------

/**
 * 1. The Maybe-Type
 *
 * In this section, we learn how we can deal with maybe-types in JavaScript.
 * The maybe-type has two constructors: Just, which takes a value, and Nothing.
 * Assume, we have a function called openBabuschka which takes a Babuschka as argument and opens it.
 * If there is another Babschuka inside it will be returned wrapped with Just. Otherwise, Nothing will be returned.
 * As you can see, the maybe-type is a way to deal with values that might not be present.
 *
 * Don't know what a Babuschka is? See: https://de.wikipedia.org/wiki/Matrjoschka
 */
const openBabuschka = babuschka => {
  const innerBabuschka = babuschka.open();
  if (innerBabuschka === undefined){
    return Nothing;
  }
  return Just(innerBabuschka);
};

/**
 * Since this function returns a maybe-type, we need to know how to proceed with it.
 *
 * const maybeBabuschka = openBabuschka(Babuschka());
 *
 * But what can we do with this maybeBabuschka which might be there or not.
 *
 * Somehow we need to distinguish if a value is present or not.
 * This can simply be done, by passing to functions to the Babuschka:
 *
 *  maybeBabuschka
 *    (_ => console.log("no babuschka found"))   // Nothing case
 *    (bab => console.log("Hi, " + bab.name())); // Just case
 *
 * If a Babuschka is present, its name is printend to the console.
 *
 * But why should you use the mabye-type?
 * If a function returns a maybe, it forces you to handle possible failures represented as Nothing.
 * This leads to additional safety.
 *
 * _Note_: * To understand in depth how maybe is implemented in JavasScript (which is not required for this exercise), please consider the following file: docs/Kolibri/docs/src/kolibri/lambda/church.js
 *
 *
 * Nice, the maybe-type is hopefully clear, and we can proceed with the next section.
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
  const devs      = await fetchAndParseFile('resources/developers.json');

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
  const maybeAllIds =
    from(JsonMonad(languages))
      .select(x => x['id'])
      .result()
      .get();

  maybeAllIds
    (_ => console.log("Something went wrong"))    // Nothing case
    (x => console.log("language id's: " , ...x)); // Just case, result will be printed to the console
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
  const maybeAllIds =
    from(JsonMonad(developers))
      .select(x => x['switch-edu-id'])
      .result()
      .get();

  maybeAllIds
    (_ => console.log("Something went wrong"))         // Nothing case
    (x => console.log("student id's: " , String(x))); // Just case, result will be printed to the console
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

  const maybeSalary =
    from(JsonMonad(devs))
      .where(p => p['name'] === "Michael Brown")
      .map(p => p['salary'])
      .result()
      .get();

  maybeSalary
    (_ => console.log("Michaels salary"))  // Nothing case
    (x => console.log(...x));                   /* Just case, result will be printed to the console */
};


/**
 * @param { Array<DeveloperType> } devs
 * @param { Array<LanguageType> } languages
 * @returns void
 */
const sophiasProgrammingLanguages = (devs, languages) => {

  const maybeLanguages =
    from(JsonMonad(devs))
      .where(dev => dev["name"] === "Sophia Davis")
      .map(sophia => sophia["favoriteLanguages"])
      .pairWith(JsonMonad(languages))
      .where(([id, language]) => id === language["id"])
      .select(([_, language]) => language["name"])
      .result().get();

  maybeLanguages
    (_ => console.log("Something went wrong"))  // Nothing case
    (x => console.log(...x));                   // Just case, result will be printed to the console
};









































