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

import { simpleBuildCitationWrapper } from "../../../base/core/citation_builder.mjs";

function getLink(ed, gd, builder, linkText) {
  let options = builder.getOptions();
  let wikipediaUrl = ed.url;
  let linkOption = options.citation_wikipedia_citationLinkType;

  if (ed.permalink && (linkOption == "permalink" || linkOption == "plainPermalink")) {
    wikipediaUrl = ed.permalink;
  }

  let lang = "";
  const url = ed.url;
  if (url) {
    // e.g. "https://de.wikipedia.org/wiki/Georg_Thoma"
    let prefix = url.replace(/^https?\:\/\/(\w+)\.wikipedia.*$/, "$1");
    if (prefix && prefix != url && prefix != "en") {
      lang = prefix;
    }
  }

  let recordLink = wikipediaUrl;
  if (linkOption == "permalink" || linkOption == "external") {
    recordLink = "[" + wikipediaUrl + " " + linkText + "]";
  } else if (linkOption == "special") {
    let wikiText = "Wikipedia:";
    if (lang) {
      wikiText += lang + ":";
    }

    if (linkText) {
      recordLink = "[[" + wikiText + ed.title + "|" + linkText + "]]";
    } else {
      recordLink = "[[" + wikiText + ed.title + "|Wikipedia]]";
    }
  }

  return recordLink;
}

function getWtfe(options) {
  let italicsOption = options.citation_wikipedia_citationUseItalics;

  if (italicsOption) {
    return "''Wikipedia, The Free Encyclopedia''";
  } else {
    return "Wikipedia, The Free Encyclopedia";
  }
}

function buildSourceTitle(ed, gd, builder) {
  let articleTitle = ed.title;
  let options = builder.getOptions();
  let linkOption = options.citation_wikipedia_citationLinkType;
  let linkLocationOption = options.citation_wikipedia_citationLinkLocation;

  if (articleTitle) {
    if (linkLocationOption == "title" && linkOption != "plainSimple" && linkOption != "plainPermalink") {
      let linkText = getLink(ed, gd, builder, articleTitle);
      builder.sourceTitle = 'Wikipedia contributors, "' + linkText + '"';
    } else {
      builder.sourceTitle = 'Wikipedia contributors, "' + articleTitle + '"';
    }
  } else {
    builder.sourceTitle = "Wikipedia contributors";
  }

  builder.putSourceTitleInQuotes = false;
}

function buildSourceReference(ed, gd, builder) {
  let options = builder.getOptions();
  let linkOption = options.citation_wikipedia_citationLinkType;
  let linkLocationOption = options.citation_wikipedia_citationLinkLocation;

  if (
    linkOption == "plainSimple" ||
    linkOption == "plainPermalink" ||
    linkLocationOption == "afterWikipedia" ||
    linkLocationOption == "afterWikipediaEntry"
  ) {
    builder.sourceReference = getWtfe(options);
  }
}

function buildRecordLink(ed, gd, builder) {
  let options = builder.getOptions();
  let wikipediaUrl = ed.url;
  let linkOption = options.citation_wikipedia_citationLinkType;
  let linkLocationOption = options.citation_wikipedia_citationLinkLocation;

  if (linkOption == "plainSimple" || linkOption == "plainPermalink") {
    builder.recordLinkOrTemplate = getLink(ed, gd, builder, "");
  } else if (linkLocationOption == "reference") {
    builder.recordLinkOrTemplate = getLink(ed, gd, builder, getWtfe(options));
  } else if (linkLocationOption == "title") {
    builder.recordLinkOrTemplate = getWtfe(options);
  } else if (linkLocationOption == "afterWikipedia") {
    builder.recordLinkOrTemplate = getLink(ed, gd, builder, "Wikipedia");
  } else if (linkLocationOption == "afterWikipediaEntry") {
    builder.recordLinkOrTemplate = getLink(ed, gd, builder, "Wikipedia Entry");
  }
}

function buildCoreCitation(ed, gd, builder) {
  // Example Chicago citation generated by WikiPedia:
  // Wikipedia contributors, "World War I," Wikipedia, The Free Encyclopedia, https://en.wikipedia.org/w/index.php?title=World_War_I&oldid=1180666851 (accessed October 20, 2023).
  buildSourceTitle(ed, gd, builder);
  buildSourceReference(ed, gd, builder);
  buildRecordLink(ed, gd, builder);
}

function buildCitation(input) {
  return simpleBuildCitationWrapper(input, buildCoreCitation);
}

export { buildCitation };
