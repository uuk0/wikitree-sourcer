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
import { RT } from "../../../base/core/record_type.mjs";
import { simpleBuildCitationWrapper } from "../../../base/core/citation_builder.mjs";

function buildSourceTitle(ed, gd, builder) {
  builder.sourceTitle += "New Zealand Births, Deaths & Marriages Online";
}

function buildSourceReference(ed, gd, builder) {
  if (ed.recordData) {
    let registrationNumber = ed.recordData["Registration Number"];
    if (registrationNumber) {
      let type = "";
      if (gd.recordType == RT.BirthRegistration) {
        type = "Birth ";
      } else if (gd.recordType == RT.DeathRegistration) {
        type = "Death ";
      } else if (gd.recordType == RT.MarriageRegistration) {
        type = "Marriage ";
      }
      builder.sourceReference = type + "Registration Number: " + registrationNumber;
    }
  }
}

function buildRecordLink(ed, gd, builder) {
  var nzbdmUrl = "https://www.bdmhistoricalrecords.dia.govt.nz/search";

  let recordLink = "[" + nzbdmUrl + " New Zealand BDM Online]";
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
