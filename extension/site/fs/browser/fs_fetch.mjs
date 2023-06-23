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

import { extractDataFromFetch } from "../core/fs_extract_data.mjs";
import { generalizeData, generalizeDataGivenRecordType } from "../core/fs_generalize_data.mjs";
import { buildCitation } from "../core/fs_build_citation.mjs";
import { buildHouseholdTable } from "/base/core/table_builder.mjs";
import { WTS_Date } from "../../../base/core/wts_date.mjs";
import {
  saveCitation,
  buildHouseholdTableString,
  buildCitationObjectForTable,
} from "/base/browser/popup/popup_citation.mjs";

import { displayMessage } from "/base/browser/popup/popup_menu_building.mjs";

async function fetchFsSourcesJson(sourceIdList) {
  if (!sourceIdList || sourceIdList.length == 0) {
    return { success: false };
  }

  let fetchUrl = "https://www.familysearch.org/service/tree/links/sources/";

  for (let sourceId of sourceIdList) {
    fetchUrl += "," + sourceId;
  }

  console.log("fetchUrl is");
  console.log(fetchUrl);

  let fetchOptionsHeaders = {
    accept: "application/x-gedcomx-v1+json, application/json",
    "accept-language": "en",
    from: "fsSearch.record.getGedcomX@familysearch.org",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
  };

  let fetchOptions = {
    headers: fetchOptionsHeaders,
    referrerPolicy: "strict-origin-when-cross-origin",
    body: null,
    method: "GET",
    mode: "cors",
    credentials: "include",
  };

  let response = await fetch(fetchUrl, fetchOptions).catch((err) => {
    console.log("Fetch threw an exception, message is: " + err.message);
    console.log(err);
    return { success: false };
  });

  console.log("response is");
  console.log(response);

  // On Firefox it may return zero any time you use "no-cors"
  if (response.status !== 200) {
    console.log("Looks like there was a problem. Status Code: " + response.status);
    return { success: false };
  }

  // Examine the text in the response
  let data = await response.text();

  console.log("data is:");
  console.log(data);

  if (data.startsWith(`{`)) {
    const jsonData = data;
    const dataObj = JSON.parse(jsonData);

    console.log("dataObj is:");
    console.log(dataObj);

    if (dataObj) {
      return { success: true, dataObj: dataObj };
    }
  } else {
    console.log("response does not look like JSON");
  }

  return { success: false };
}

async function fetchRecords(sources, options) {
  if (sources.length == 0) {
    return;
  }

  let message = "Fetching FamilySearch records";

  displayMessage(message);

  console.log("fetchRecords, sources is: ");
  console.log(sources);

  for (let source of sources) {
    message += ".";
    displayMessage(message);

    let uri = source.uri.uri;

    let fetchType = "record";

    let fetchUrl = uri;
    console.log("doFetch, fetchUrl is: " + fetchUrl);

    if (!fetchUrl.includes("familysearch.org/")) {
      continue;
    }

    fetchUrl = fetchUrl.replace(/\/familysearch.org/, "/www.familysearch.org");

    console.log("doFetch, fetchUrl is: " + fetchUrl);

    let fetchOptionsHeaders = {
      accept: "application/x-gedcomx-v1+json, application/json",
      "accept-language": "en",
      from: "fsSearch.record.getGedcomX@familysearch.org",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
    };

    let fetchOptions = {
      headers: fetchOptionsHeaders,
      referrerPolicy: "strict-origin-when-cross-origin",
      body: null,
      method: "GET",
      mode: "cors",
      credentials: "include",
    };

    try {
      let response = await fetch(fetchUrl, fetchOptions);

      console.log("doFetch, response.status is: " + response.status);

      if (response.status !== 200) {
        console.log("Looks like there was a problem. Status Code: " + response.status);
        return {
          success: false,
          errorCondition: "FetchError",
          status: response.status,
        };
      }

      let jsonData = await response.text();

      console.log("doFetch: response text is:");
      console.log(jsonData);

      if (!jsonData || jsonData[0] != `{`) {
        console.log("The response text does not look like JSON");
        //console.log(jsonData);
        return { success: false, errorCondition: "NotJSON" };
      }

      const dataObj = JSON.parse(jsonData);

      console.log("dataObj is:");
      console.log(dataObj);

      // support having multiple data objects for separate API queries
      let dataObjects = {
        dataObj: dataObj,
      };

      source.dataObjects = dataObjects;
    } catch (error) {
      console.log("fetch failed, error is:");
      console.log(error);
      return { success: false };
    }
  }
}

function sortSourcesUsingFsSortKeys(result) {
  function compareSortKeys(a, b) {
    if (a.sortKey) {
      if (b.sortKey) {
        if (a.sortKey < b.sortKey) {
          return -1;
        } else if (a.sortKey > b.sortKey) {
          return 1;
        }
        return 0;
      } else {
        return -1;
      }
    } else if (b.sortKey) {
      return 1;
    }

    return 0;
  }

  // sort the sources
  result.sources.sort(compareSortKeys);
  console.log("getFsPlainInlineCitations: sorted sources:");
  console.log(result.sources);
}

function getFsPlainInlineCitations(result, ed) {
  sortSourcesUsingFsSortKeys(result);

  let citationsString = "";

  for (let source of result.sources) {
    if (source.citation) {
      if (citationsString) {
        citationsString += "\n\n";
      }
      citationsString += "<ref>\n";
      citationsString += source.citation.trim();
      citationsString += "\n</ref>";
    }
  }

  result.citationsString = citationsString;
}

function getFsPlainSourceCitations(result, ed) {
  sortSourcesUsingFsSortKeys(result);

  let citationsString = "";

  for (let source of result.sources) {
    if (source.citation) {
      citationsString += "* ";
      citationsString += source.citation.trim();
      citationsString += "\n";
    }
  }

  result.citationsString = citationsString;
}

function sortSourcesUsingFsSortKeysAndFetchedRecords(result) {
  function compareFunction(a, b) {
    if (a.generalizeData) {
      if (b.generalizeData) {
        let eventDataA = a.generalizeData.inferEventDate();
        let eventDataB = b.generalizeData.inferEventDate();
        if (eventDataA && eventDataB) {
          return WTS_Date.compareDateStrings(eventDataA, eventDataB);
        }
      }
    }

    if (a.sortKey && b.sortKey) {
      if (a.sortKey < b.sortKey) {
        return -1;
      } else if (a.sortKey > b.sortKey) {
        return 1;
      }
      return 0;
    }

    if (a.sortYear && b.sortYear) {
      if (a.sortYear < b.sortYear) {
        return -1;
      } else if (a.sortYear > b.sortYear) {
        return 1;
      }
      return 0;
    }

    if (a.sortYear) {
      return -1;
    } else if (b.sortYear) {
      return 1;
    }

    return 0;
  }

  // sort the sources
  result.sources.sort(compareFunction);
  console.log("getFsPlainInlineCitations: sorted sources:");
  console.log(result.sources);
}

async function getNarrativeCitations(result, ed, gd, options) {
  // fetch additional records where possible
  await fetchRecords(result.sources, options);

  for (let source of result.sources) {
    if (source.dataObjects) {
      let extractedData = extractDataFromFetch(undefined, source.dataObjects, "record", options);
      if (extractedData) {
        source.extractedData = extractedData;

        let generalizedData = generalizeData({ extractedData: extractedData });
        if (generalizedData) {
          source.generalizedData = generalizedData;

          let type = "narrative"; // "inline", "narrative" or "source"

          let householdTableString = buildHouseholdTableString(
            extractedData,
            generalizedData,
            type,
            buildHouseholdTable
          );

          const input = {
            extractedData: extractedData,
            generalizedData: generalizedData,
            runDate: new Date(),
            type: type,
            dataCache: undefined,
            options: options,
            householdTableString: householdTableString,
          };
          const citationObject = buildCitation(input);
          citationObject.generalizedData = generalizedData;
          source.citationObject = citationObject;
        }
      }
    } else if (source.citation) {
      // we don't have an FS fetch object, see what we can do my parsing FS citation string
      if (/^"[^"]+"\s+\d\d\d\d http/.test(source.citation)) {
        let year = source.citation.replace(/^"[^"]+"\s+(\d\d\d\d) http.*$/, "$1");
        if (year && year != source.citation) {
          source.sortYear = year;
        }
        let firstSentence = source.citation.replace(/^"([^"]+)"\s+\d\d\d\d http.*$/, "$1");
        if (firstSentence && firstSentence != source.citation) {
          source.firstSentence = firstSentence;
        }
        let link = source.citation.replace(/^"[^"]+"\s+\d\d\d\d (http.*)\. Accessed.*$/, "$1");
        if (link && link != source.citation) {
          source.link = link;
        }

        let title = source.title;
        if (!title) {
          title = source.firstSentence;
        }
        if (title) {
          let joinIndex = title.search(/\s+in\s+the\s+/);
          if (joinIndex != -1) {
            source.prefName = title.substring(0, joinIndex);
          }
        }
      }
    }
  }

  sortSourcesUsingFsSortKeysAndFetchedRecords(result);

  let citationsString = "";

  for (let source of result.sources) {
    if (source.citationObject) {
      if (citationsString) {
        citationsString += "\n\n";
      }
      citationsString += source.citationObject.citation;
    } else if (source.citation) {
      if (citationsString) {
        citationsString += "\n\n";
      }
      if (source.prefName) {
        citationsString += source.prefName;
      } else {
        citationsString += "This person";
      }
      citationsString += " was in a record";
      if (source.sortYear) {
        citationsString += " in " + source.sortYear;
      }
      citationsString += ".";
      citationsString += "<ref>\n";
      citationsString += source.citation.trim();
      citationsString += "\n</ref>";
    }
  }

  result.citationsString = citationsString;
}

async function fetchFsSources(input) {
  let ed = input.extractedData;
  let gd = input.generalizedData;
  let options = input.options;

  let sourcesObj = await fetchFsSourcesJson(ed.sourceIds);

  let result = { success: false };

  if (sourcesObj.success) {
    let sources = sourcesObj.dataObj.sources;

    result.sources = [];

    for (let source of sources) {
      let sourceObj = {};

      function addField(fieldName) {
        if (source[fieldName]) {
          sourceObj[fieldName] = source[fieldName];
        }
      }
      addField("citation");
      addField("title");
      addField("uri");

      if (source.event) {
        if (source.event.sortKey) {
          sourceObj.sortKey = source.event.sortKey;
        }
        if (source.event.sortYear) {
          sourceObj.sortYear = source.event.sortYear;
        }
      }

      result.sources.push(sourceObj);
    }

    let citationType = options.addMerge_fsAllCitations_citationType;

    switch (citationType) {
      case "fsPlainInline":
        getFsPlainInlineCitations(result, ed);
        break;
      case "fsPlainSource":
        getFsPlainSourceCitations(result, ed);
        break;
      case "narrative":
        await getNarrativeCitations(result, ed, gd, options);
        break;
      case "inline":
        break;
      case "source":
        break;
    }

    result.success = true;
  }

  return result;
}

export { fetchFsSources };
