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
import { ExtractedDataReader } from "../../../base/core/extracted_data_reader.mjs";
import { StringUtils } from "../../../base/core/string_utils.mjs";
import { NameUtils } from "../../../base/core/name_utils.mjs";

function freebmdQuarterToGdQuarter(quarter) {
  let string = quarter.toLowerCase();
  switch (string) {
    case "mar":
      return 1;
    case "jun":
      return 2;
    case "sep":
      return 3;
    case "dec":
      return 4;
    default:
      return 1;
  }
}

class FreebmdEdReader extends ExtractedDataReader {
  constructor(ed) {
    super(ed);

    switch (ed.eventType) {
      case "birth":
        this.recordType = RT.BirthRegistration;
        break;
      case "marriage":
        this.recordType = RT.MarriageRegistration;
        break;
      case "death":
        this.recordType = RT.DeathRegistration;
        break;
    }
  }

  getCorrectlyCasedSurname() {
    let surname = this.ed.surname;
    if (StringUtils.isWordAllUpperCase(surname)) {
      surname = NameUtils.convertNameFromAllCapsToMixedCase(surname);
    }
    return surname;
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////
  // Overrides of the relevant get functions used in commonGeneralizeData
  ////////////////////////////////////////////////////////////////////////////////////////////////////

  hasValidData() {
    if (!this.ed.eventYear) {
      return false; //the extract failed to get enough useful data
    }
    return true;
  }

  getNameObj() {
    return this.makeNameObjFromForenamesAndLastName(this.ed.givenNames, this.getCorrectlyCasedSurname());
  }

  getEventDateObj() {
    return this.makeDateObjFromYearAndQuarter(this.ed.eventYear, freebmdQuarterToGdQuarter(this.ed.eventQuarter));
  }

  getLastNameAtBirth() {
    if (this.ed.eventType == "birth") {
      return this.getCorrectlyCasedSurname();
    }
    return "";
  }

  getLastNameAtDeath() {
    if (this.ed.eventType == "death") {
      return this.getCorrectlyCasedSurname();
    }
    return "";
  }

  getMothersMaidenName() {
    if (this.ed.mother) {
      return this.ed.mothersMaidenName;
    }
    return "";
  }

  getBirthDateObj() {
    if (this.ed.eventType == "birth") {
      return this.getEventDateObj();
    }

    if (this.ed.eventType == "death") {
      let date = this.ed.birthDate;
      if (date) {
        return this.makeDateObjFromDateString(date);
      }
    }
  }

  getDeathDateObj() {
    if (this.ed.eventType == "death") {
      return this.getEventDateObj();
    }
  }

  getAgeAtDeath() {
    let age = "";

    if (this.ed.eventType == "death") {
      let ageAtDeath = this.ed.ageAtDeath;
      if (ageAtDeath) {
        age = ageAtDeath;
      }
    }

    return age;
  }

  getRegistrationDistrict() {
    return this.ed.registrationDistrict;
  }

  getSpouses() {
    if (this.ed.spouse) {
      let spouseName = this.makeNameObjFromFullName(this.ed.spouse);
      let marriageDateObj = this.getEventDateObj();
      let marriagePlaceObj = this.getEventPlaceObj();
      let spouse = this.makeSpouseObj(spouseName, marriageDateObj, marriagePlaceObj);
      return [spouse];
    }
  }

  getCollectionData() {
    let collectionId = undefined;
    if (this.ed.eventType == "birth") {
      collectionId = "births";
    } else if (this.ed.eventType == "marriage") {
      collectionId = "marriages";
    } else if (this.ed.eventType == "death") {
      collectionId = "deaths";
    }

    // Collection
    if (collectionId) {
      let collectionData = {
        id: collectionId,
      };
      if (this.ed.referenceVolume) {
        collectionData.volume = this.ed.referenceVolume;
      }
      if (this.ed.referencePage) {
        collectionData.page = this.ed.referencePage;
      }

      return collectionData;
    }
  }
}

export { FreebmdEdReader };
