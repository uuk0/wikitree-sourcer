/*
MIT License

Copyright (c) 2020-2025 Robert M Pavey and the wikitree-sourcer contributors.

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

let CONTENT_TRANSLATION = {
  "B": "Birth",
  "M": "Marriage",
  "D": "Death",
}

/**
 * {
  "url": "https://digi.ceskearchivy.cz/8639/86/2037/4583/5/0",
  "success": true,
  "metadata": {
    "seat": "Vyšší Brod",
    "time extent": "1809–1872",
    "content": "B",
    "district": "Český Krumlov",
    "book": "6",
    "church": "Roman Catholic Church"
  },
  "record_type": "Parish register",
  "page_number": "86"
}
 */
function buildCeskearcUrl(ed, builder) {
  return ed.url;
}

function buildSourceTitle(ed, gd, builder) {
  if (ed.metadata["original title"]) {
    builder.sourceTitle += ed.metadata["original title"] + " / ";
  }
  else if (ed.record_type) {
    builder.sourceTitle += ed.record_type + " / ";
  }

  if (ed.metadata.church) {
    builder.sourceTitle += ed.metadata.church + " / ";
  }

  if (ed.metadata.seat) {
    builder.sourceTitle += ed.metadata.seat + " / ";
  }
  if (ed.metadata.district) {
    builder.sourceTitle += ed.metadata.district + " / ";
  }
  if (ed.metadata.municipality) {
    builder.sourceTitle += ed.metadata.municipality + " / ";
  }

  if (ed.metadata.content) {
    builder.sourceTitle += (CONTENT_TRANSLATION[ed.metadata.content] || ed.metadata.content) + " / ";
  }

  if (ed.metadata["time extent"]) {
    builder.sourceTitle += ed.metadata["time extent"] + " / ";
  }

  if (builder.sourceTitle.substring(builder.sourceTitle.length - 3) == " / ") {
    builder.sourceTitle = builder.sourceTitle.substring(0, builder.sourceTitle.length - 3);
  }
}

function buildSourceReference(ed, gd, builder) {
  builder.addSourceReferenceField("Image", ed.page_number);
}

function buildRecordLink(ed, gd, builder) {
  var ceskearcUrl = buildCeskearcUrl(ed, builder);

  let recordLink;
  if (ed.record_type) {
    recordLink = "[" + ceskearcUrl + " Ceske Archivy / "+ed.record_type+"]";
  } else {
    recordLink = "[" + ceskearcUrl + " Ceske Archivy]";
  }
  builder.recordLinkOrTemplate = recordLink;
}

function buildCoreCitation(ed, gd, builder) {
  buildSourceTitle(ed, gd, builder);
  buildSourceReference(ed, gd, builder);
  buildRecordLink(ed, gd, builder);
  builder.addStandardDataString(gd);
}

function buildCitation(input) {
  return simpleBuildCitationWrapper(input, buildCoreCitation);
}

export { buildCitation };
