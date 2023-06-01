import { from }      from "./Kolibri/contrib/wild_wyss/src/jinq/jinq.js";
import { JsonMonad } from "./Kolibri/contrib/wild_wyss/src/json/jsonMonad.js";

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
 * 2. JINQ - available function
 * 3. Examine some examples and learn from it
 * 4. It's your turn - solving exercises
 *
 */

// ------------------------------------------  MAYBE-TYPE  -------------------------------------------------------------

/**
 * 1. The Maybe-Type
 *
 * In this section, we learn how we can deal with maybe-types in javascript.
 * The maybe-type has two constructors: Just, which takes a value, and Nothing.
 * Assume, we have a function called openBabuschka which takes a babuschka as argument, and returns a maybe-type of
 * an inner babuschka.
 */
const openBabuschka = babuschka => {
  const newBabuschka = babuschka.open();
  if(newBabuschka === undefined){
    return Nothing;
  }
  return Just(newBabuschka);
};
 /**
 * Since this function returns a maybe-type, we need to know how to proceed with it.
 *
 * const maybeBabuschka = openBabuschka(Babuschka());
 *
 * But what actually is a maybe-type and how can we work with it?
 * To understand this in depth, please consider the following file: docs/Kolibri/docs/src/kolibri/lambda/church.js
 * As you can see it's all about functions.
 *
 * Just and Nothing are both functions, which takes 2 curried arguments, which are also functions.
 * These functions are the way, how we get a value (or not) from a maybe.
 *
 * Let's print our possibly present babuschka to the console.
 *
 *  maybeBabuschka
 *    (_ => console.log("no babuschka found"))   // Nothing case
 *    (bab => console.log("Hi, " + bab.name())); // Just case
 *
 * Nice, the maybe-type is hopefully clear, and we can proceed with the next section.
 */

// ------------------------------------------------  JINQ  -------------------------------------------------------------

/**
 * Having a closer look to JINQ.
 * With JINQ, you can process lists in a fluent way as you were working with database queries.
 * Suppose, you will filter a list of animals to find all delphins. We can do it as follows:
 *
 * from(animals)
 *   .select(x => x['type'])
 *   .where(type => type === 'delphin')
 *   .result();
 *
 * What we're doing here:
 * from:   takes a monadic type and adds further functionality to it
 * select: for each element, we map it to its object-property 'type', so now it's a list of animal types (you can also use map for this)
 * where:  it works like a filter, we're taking only the elements which matches the given predicate
 * result: returns the inner monadic type
 *
 * More JINQ functions:
 * inside:    applies a function to an element
 * pairWith:  the elements were combined with a new source of data.
 *            As result, we get all combinations of both dataset in pairs.
 * JsonMonad: this function is used to make json-data monadic (JINQ only work with monadic types)
 *
 * If you have some trouble, look at our implementation and its test-file, this may help you.
 * => docs/Kolibri/contrib/wild_wyss/src/jinq/
 *
 * Working with pairs:
 * Pairs are also built with functions. This means, you have accessor functions to get the value out of it.
 * Creating a Pair is made curried:
 * const pair = Pair("first")("second");
 *
 * Getting values from a pair:
 * const first = fst(pair);
 * const snd   = snd(pair);
 *
 * or in a more nicely way:
 * const [fst, snd] = pair;
 */

// ------------------------------------------------  Examples ----------------------------------------------------------

// Functions to read json file content. You don't have to change this.

/**
 * Loads a files from the given path. 
 * @param path - path to file
 * @return { Promise<String> }
 */
const fetchAndParseFile = async path =>
  fetch(path)
    .then(response => response.text())
    .then(text => JSON.parse(text));

// Fetching JSON Files located under resources
(async () => {
  const languages = await fetchAndParseFile('resources/languages.json');
  const devs      = await fetchAndParseFile('resources/developers.json');

  example1(languages);
  example2(devs);
  salaryFromMichael(devs);
  sophiasProgrammingLanguages(devs)(languages);
})();

/**
 * Example 1: How to work with jinq and maybe
 *
 * Prints all programming language id's to the console.
 * @param languages - programming languages
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
 * Prints all developer to the console, which have also a student id.
 * (Nothing's will automatically be removed)
 *
 * @param developers
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
 * These two collections are already loaded and ready to use. You may see them a few lines above.
 *
 * When solving, make notes if you spot anything that isn't clear or if you see things that we can improve.
 *
 * Exercise 1: Salary from Michael
 * Find the salary from Michael using the given Json-data called 'developers' and print it to the console.
 *
 * Exercise 2: Sophias programming languages
 * Print all Sophias favorite programming languages to the console.
 * For this exercise, you have to combine both datasets.
 *
 * Have fun!
 */

const salaryFromMichael = devs => {

  const maybeSalary =
    from(JsonMonad(devs))
      .where(p => p['name'] === "Michael Brown")
      .map(p => p['salary'])
      .result()
      .get();

  maybeSalary
    (_ => console.log("Something went wrong"))  // Nothing case
    (x => console.log(...x));                   /* Just case, result will be printed to the console */
};

const sophiasProgrammingLanguages = devs => languages => {

  const maybeLanguages =
    from(JsonMonad(devs))
      .where(p => p['name'] === "Sophia Davis")
      .map(p => p['favoriteLanguages'])
      .pairWith(JsonMonad(languages))
      .where(([x,y]) => x === y['id'])
      .map(([_,y]) => y['name'])
      .result()
      .get();

  maybeLanguages
    (_ => console.log("Something went wrong"))  // Nothing case
    (x => console.log(...x));                   // Just case, result will be printed to the console
};