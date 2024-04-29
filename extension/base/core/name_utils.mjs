/*
MIT License

Copyright (c) 2020 Robert M Pavey

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

import { StringUtils } from "./string_utils.mjs";

const englishGivenNameAbbreviations = [
  {
    abbrev: "Abig",
    full: "Abigail",
  },
  {
    abbrev: "Abm",
    full: "Abraham",
  },
  {
    abbrev: "Abr",
    full: "Abraham",
  },
  {
    abbrev: "Agn",
    full: "Agnes",
  },
  {
    abbrev: "Alex",
    full: "Alexander",
  },
  {
    abbrev: "Alexr",
    full: "Alexander",
  },
  {
    abbrev: "Alf",
    full: "Alfred",
  },
  {
    abbrev: "Amb",
    full: "Ambrose",
  },
  {
    abbrev: "And",
    full: "Andrew",
  },
  {
    abbrev: "Ant",
    full: "Anthony",
  },
  {
    abbrev: "Art",
    full: "Arthur",
  },
  {
    abbrev: "Aug",
    full: "Augustus",
  },
  {
    abbrev: "Barb",
    full: "Barbara",
  },
  {
    abbrev: "Bart",
    full: "Bartholomew",
  },
  {
    abbrev: "Benj",
    full: "Benjamin",
  },
  {
    abbrev: "Benjm",
    full: "Benjamin",
  },
  {
    abbrev: "Brid",
    full: "Bridget",
  },
  {
    abbrev: "Cath",
    full: "Catherine",
  },
  {
    abbrev: "Chas",
    full: "Charles",
  },
  {
    abbrev: "Chr",
    full: "Christian",
  },
  {
    abbrev: "Clem",
    full: "Clement",
  },
  {
    abbrev: "Const",
    full: "Constance",
  },
  {
    abbrev: "Corn",
    full: "Cornelius",
  },
  {
    abbrev: "Danl",
    full: "Daniel",
  },
  {
    abbrev: "Dav",
    full: "David",
  },
  {
    abbrev: "Deb",
    full: "Deborah",
  },
  {
    abbrev: "Den",
    full: "Dennis",
  },
  {
    abbrev: "Doug",
    full: "Douglas",
  },
  {
    abbrev: "Dy",
    full: "Dorothy",
  },
  {
    abbrev: "Edm",
    full: "Edmund",
  },
  {
    abbrev: "Edr",
    full: "Edward",
  },
  {
    abbrev: "Edw",
    full: "Edward",
  },
  {
    abbrev: "Eliz",
    full: "Elizabeth",
  },
  {
    abbrev: "Elizth",
    full: "Elizabeth",
  },
  {
    abbrev: "Elnr",
    full: "Eleanor",
  },
  {
    abbrev: "Esth",
    full: "Esther",
  },
  {
    abbrev: "Ezek",
    full: "Ezekiel",
  },
  {
    abbrev: "Froo",
    full: "Franco",
  },
  {
    abbrev: "Fs",
    full: "Francis",
  },
  {
    abbrev: "Gab",
    full: "Gabriel",
  },
  {
    abbrev: "Geo",
    full: "George",
  },
  {
    abbrev: "Geof",
    full: "Geoffrey",
  },
  {
    abbrev: "Godf",
    full: "Godfrey",
  },
  {
    abbrev: "Greg",
    full: "Gregory",
  },
  {
    abbrev: "Gul",
    full: "William",
  },
  {
    abbrev: "Han",
    full: "Hannah",
  },
  {
    abbrev: "Hen",
    full: "Henry",
  },
  {
    abbrev: "Hel",
    full: "Helen",
  },
  {
    abbrev: "Herb",
    full: "Herbert",
  },
  {
    abbrev: "Hy",
    full: "Henry",
  },
  {
    abbrev: "Ioh",
    full: "John",
  },
  {
    abbrev: "Is",
    full: "Isaac",
  },
  {
    abbrev: "Isb",
    full: "Isabel",
  },
  {
    abbrev: "Jac",
    full: "James",
  },
  {
    abbrev: "Jas",
    full: "James",
  },
  {
    abbrev: "Jer",
    full: "Jeremiah",
  },
  {
    abbrev: "Jno",
    full: "John",
  },
  {
    abbrev: "Jon",
    full: "Jonathan",
  },
  {
    abbrev: "Jos",
    full: "Joseph",
  },
  {
    abbrev: "Josh",
    full: "Joshua",
  },
  {
    abbrev: "Josh",
    full: "Josiah",
  },
  {
    abbrev: "Jud",
    full: "Judith",
  },
  {
    abbrev: "Lau",
    full: "Laurence",
  },
  {
    abbrev: "Lawr",
    full: "Lawrence",
  },
  {
    abbrev: "Leon",
    full: "Leonard",
  },
  {
    abbrev: "Lyd",
    full: "Lydia",
  },
  {
    abbrev: "Margt",
    full: "Margaret",
  },
  {
    abbrev: "Math",
    full: "Matthias",
  },
  {
    abbrev: "Matt",
    full: "Matthew",
  },
  {
    abbrev: "Mau",
    full: "Maurice",
  },
  {
    abbrev: "Mich",
    full: "Michael",
  },
  {
    abbrev: "Micls",
    full: "Michael",
  },
  {
    abbrev: "Mix",
    full: "Michael",
  },
  {
    abbrev: "Mill",
    full: "Millicent",
  },
  {
    abbrev: "My",
    full: "Mary",
  },
  {
    abbrev: "Nath",
    full: "Nathaniel",
  },
  {
    abbrev: "Nich",
    full: "Nicholas",
  },
  {
    abbrev: "Nics",
    full: "Nicholas",
  },
  {
    abbrev: "Ol",
    full: "Oliver",
  },
  {
    abbrev: "Pat",
    full: "Patrick",
  },
  {
    abbrev: "Pen",
    full: "Penelope",
  },
  {
    abbrev: "Pet",
    full: "Peter",
  },
  {
    abbrev: "Phil",
    full: "Philip",
  },
  {
    abbrev: "Phin",
    full: "Phineas",
  },
  {
    abbrev: "Phyl",
    full: "Phyllis",
  },
  {
    abbrev: "Prisc",
    full: "Priscilla",
  },
  {
    abbrev: "Pru",
    full: "Prudence",
  },
  {
    abbrev: "Rach",
    full: "Rachel",
  },
  {
    abbrev: "Ray",
    full: "Raymond",
  },
  {
    abbrev: "Reb",
    full: "Rebecca",
  },
  {
    abbrev: "Reg",
    full: "Reginald",
  },
  {
    abbrev: "Ric",
    full: "Richard",
  },
  {
    abbrev: "Richd",
    full: "Richard",
  },
  {
    abbrev: "Robt",
    full: "Robert",
  },
  {
    abbrev: "Rog",
    full: "Roger",
  },
  {
    abbrev: "Saml",
    full: "Samuel",
  },
  {
    abbrev: "Sar",
    full: "Sarah",
  },
  {
    abbrev: "Silv",
    full: "Sylvester",
  },
  {
    abbrev: "Sim",
    full: "Simon",
  },
  {
    abbrev: "Sol",
    full: "Solomon",
  },
  {
    abbrev: "Ste",
    full: "Stephen",
  },
  {
    abbrev: "Susna",
    full: "Susanna",
  },
  {
    abbrev: "Theo",
    full: "Theodore",
  },
  {
    abbrev: "Thos",
    full: "Thomas",
  },
  {
    abbrev: "Tim",
    full: "Timothy",
  },
  {
    abbrev: "Urs",
    full: "Ursula",
  },
  {
    abbrev: "Val",
    full: "Valentine",
  },
  {
    abbrev: "Vinc",
    full: "Vincent",
  },
  {
    abbrev: "Walt",
    full: "Walter",
  },
  {
    abbrev: "Win",
    full: "Winifred",
  },
  {
    abbrev: "Wm",
    full: "William",
  },
  {
    abbrev: "Xpr",
    full: "Christopher",
  },
  {
    abbrev: "Xtian",
    full: "Christian",
  },
  {
    abbrev: "Xtopher",
    full: "Christopher",
  },
  {
    abbrev: "Zach",
    full: "Zachariah",
  },
];

const NameUtils = {
  convertNameFromAllCapsToMixedCase: function (string) {
    // Note: this is a complicated issue for names like:
    // MACGREGOR, MCLELLAN, MACKIE, MACHIN
    // O'CONNOR
    // If it is already mixed case then we should leave it how it is. Except for special cases
    // like "(Mrs) FRASER" in th surname
    // If it is all upper case then maybe there should be a user option to leave in upper case
    // Else can take a stab at it with a few rules and exceptions
    function shouldUpperCaseAfterMac(name) {
      // input is all lower case
      const exceptions = ["Macilbowie", "Mackenzie", "Macmaster", "Mackey", "Mackie", "Machin"];

      if (name.length < 5) {
        // exclude names like "Mack", "Mach"
        return false;
      }

      if (exceptions.includes(name)) {
        return false;
      }
      return true;
    }

    function shouldUpperCaseAfterMc(name) {
      const exceptions = ["Mcilbowie", "Mckenzie", "Mcmaster"];

      if (exceptions.includes(name)) {
        return false;
      }
      return true;
    }

    function shouldUpperCaseAfterO(name) {
      return true;
    }

    function shouldUpperCaseAfterApostrophe(name) {
      return true;
    }

    function shouldUpperCaseAfterHyphen(name) {
      return true;
    }

    function shouldUpperCaseAfterSlash(name) {
      return true;
    }

    if (!string || string.length == 0) {
      return string;
    }

    let originalStringClean = string.trim();

    let resultString = originalStringClean;

    // replace any multiple white spaces with one space
    resultString = resultString.replace(/\s+/g, " ");

    // Check for something in paraetheses at start (can happen the 1881 census on ScotP) see example in
    // test case census_lds_1881_mrs_fraser which has "(Mrs) FRASER" in th surname
    // Another example has "(A M) FRASER" in surname and "Donald" in forname.
    // For now remove anything in parens at start
    if (resultString.startsWith("(")) {
      let closeIndex = resultString.indexOf(")");
      if (closeIndex != -1) {
        resultString = resultString.substring(closeIndex + 1).trim();
        if (!resultString) {
          return originalStringClean;
        }
      }
    }

    // if there are any single periods in the name remove them, replacing with a space if needed
    // however if there are three periods like ... then leave them
    if (resultString.includes(".")) {
      resultString = resultString.replace(/([^\.])\.([^\.])/g, "$1 $2");
      resultString = resultString.replace(/^\.([^\.])/, "$1");
      resultString = resultString.replace(/([^\.])\.$/, "$1");
    }

    // if all the words in the string are already mixed case or all lower case do not change it.
    if (!StringUtils.isAllUppercase(resultString)) {
      let allWordsAreMixedOrLower = true;
      let words = resultString.split(" ");
      for (let word of words) {
        if (StringUtils.isAllUppercase(word)) {
          allWordsAreMixedOrLower = false;
        }
      }
      if (allWordsAreMixedOrLower) {
        return originalStringClean;
      }
    }

    if (resultString.length == 1) {
      return resultString[0].toUpperCase();
    }

    resultString = resultString.toLowerCase().trim();

    function upperCaseLetterAtIndex(toUpperIndex) {
      resultString =
        resultString.substring(0, toUpperIndex) +
        resultString[toUpperIndex].toUpperCase() +
        resultString.substring(toUpperIndex + 1);
    }

    var index = 0;
    do {
      upperCaseLetterAtIndex(index);

      let word = "";
      let nextSpaceIndex = resultString.indexOf(" ", index);
      if (nextSpaceIndex != -1) {
        word = resultString.substring(index, nextSpaceIndex);
      } else {
        word = resultString.substring(index);
      }

      // check for Mac or word
      if (word.startsWith("Mac") && word.length > 3 && word[3] != " ") {
        if (shouldUpperCaseAfterMac(word)) {
          upperCaseLetterAtIndex(index + 3);
        }
      } else if (word.startsWith("Mc") && word.length > 2 && word[2] != " ") {
        if (shouldUpperCaseAfterMc(word)) {
          upperCaseLetterAtIndex(index + 2);
        }
      } else if (word.startsWith("O'") && word.length > 2 && word[2] != " ") {
        if (shouldUpperCaseAfterO(word)) {
          upperCaseLetterAtIndex(index + 2);
        }
      } else if (word.includes("'") && word.length > 2 && word[2] != " ") {
        if (shouldUpperCaseAfterApostrophe(word)) {
          let quoteIndex = word.indexOf("'");
          if ((quoteIndex != -1) & (quoteIndex < word.length - 1)) {
            upperCaseLetterAtIndex(index + quoteIndex + 1);
          }
        }
      } else if (word.includes("-") && word.length > 2 && word[2] != " ") {
        if (shouldUpperCaseAfterHyphen(word)) {
          let quoteIndex = word.indexOf("-");
          while ((quoteIndex != -1) & (quoteIndex < word.length - 1)) {
            upperCaseLetterAtIndex(index + quoteIndex + 1);
            quoteIndex = word.indexOf("-", quoteIndex + 1);
          }
        }
      } else if (word.includes("/") && word.length > 2 && word[2] != " ") {
        if (shouldUpperCaseAfterSlash(word)) {
          let quoteIndex = word.indexOf("/");
          while ((quoteIndex != -1) & (quoteIndex < word.length - 1)) {
            upperCaseLetterAtIndex(index + quoteIndex + 1);
            quoteIndex = word.indexOf("/", quoteIndex + 1);
          }
        }
      } else if (word.startsWith("(") && word[1] != " ") {
        upperCaseLetterAtIndex(index + 1);
      }

      index = nextSpaceIndex;
      if (index != -1) {
        index++;
      }
    } while (index != -1);

    return resultString;
  },

  convertEnglishGivenNameFromAbbrevationToFull: function (abbrev) {
    if (!abbrev) {
      return "";
    }
    for (let entry of englishGivenNameAbbreviations) {
      if (abbrev == entry.abbrev) {
        return entry.full;
      }
    }
    return "";
  },

  convertEnglishGivenNameFromFullToAbbrevation: function (full) {
    if (!full) {
      return "";
    }
    for (let entry of englishGivenNameAbbreviations) {
      if (full == entry.full) {
        return entry.abbrev;
      }
    }
    return "";
  },
};

export { NameUtils };
