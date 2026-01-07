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

/*
 * {
  "url": "https://a860-historicalvitalrecords.nyc.gov/view/139645",
  "success": true,
  "fields": {
    "name": "Hugo Sack",
    "soundex": "S200",
    "age": "",
    "type": "Birth Certificate",
    "borough": "Manhattan",
    "date": "1881-05-02",
    "certificate": "311036"
  }
}
 */

import { RT } from "../../../base/core/record_type.mjs";
import { ExtractedDataReader } from "../../../base/core/extracted_data_reader.mjs";

class NycvitalEdReader extends ExtractedDataReader {
  constructor(ed) {
    super(ed);
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////
  // Overrides of the relevant get functions used in commonGeneralizeData
  ////////////////////////////////////////////////////////////////////////////////////////////////////

  hasValidData() {
    if (!this.ed.success) {
      return false; //the extract failed, GeneralizedData is not even normally called in this case
    }

    return true;
  }

  getSourceType() {
    if (this.ed.fields && this.ed.fields["type"]) {
      return this.ed.fields["type"];
    }
    return "record";
  }

  getNameObj() {
    if (this.ed.fields && this.ed.fields["name"]) {
      return this.makeNameObjFromFullName(this.ed.fields["name"]);
    }
    return undefined;
  }

  getGender() {
    return "";
  }

  getEventDateObj() {
    return undefined;
  }

  getEventPlaceObj() {
    return undefined;
  }

  getLastNameAtBirth() {
    return "";
  }

  getLastNameAtDeath() {
    return "";
  }

  getMothersMaidenName() {
    return "";
  }

  getBirthDateObj() {
    if (this.ed.fields && this.ed.fields["type"] == "Birth Certificate") {
      return this.makeDateObjFromYyyymmddDate(this.ed.fields["date"], "-");
    }
    return undefined;
  }

  getBirthPlaceObj() {
    if (this.ed.fields && this.ed.fields["type"] == "Birth Certificate") {
      return this.makePlaceObjFromFullPlaceName("New York City, " + this.ed.fields["borough"]);
    }
    return undefined;
  }

  getDeathDateObj() {
    if (this.ed.fields && this.ed.fields["type"] == "Death Certificate") {
      return this.makeDateObjFromYyyymmddDate(this.ed.fields["date"], "-");
    }
    return undefined;
  }

  getDeathPlaceObj() {
    if (this.ed.fields && this.ed.fields["type"] == "Death Certificate") {
      return this.makePlaceObjFromFullPlaceName("New York City, " + this.ed.fields["borough"]);
    }
    return undefined;
  }

  getAgeAtEvent() {
    return "";
  }

  getAgeAtDeath() {
    if (this.ed.fields && this.ed.fields["type"] == "Death Certificate" && this.ed.fields["age"]) {
      return this.ed.fields["age"];
    }
    return "";
  }

  getRegistrationDistrict() {
    return "";
  }

  getRelationshipToHead() {
    return "";
  }

  getMaritalStatus() {
    return "";
  }

  getOccupation() {
    return "";
  }

  getSpouses() {
    return undefined;
  }

  getParents() {
    return undefined;
  }

  getHousehold() {
    return undefined;
  }

  getCollectionData() {
    return undefined;
  }
}

export { NycvitalEdReader };
