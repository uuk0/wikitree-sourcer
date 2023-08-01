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

import { RT, RecordSubtype } from "../../../base/core/record_type.mjs";
import { ExtractedDataReader } from "../../../base/core/extracted_data_reader.mjs";
import { NameObj } from "../../../base/core/generalize_data_utils.mjs";
import { separateFullNameIntoParts } from "./wiewaswie_name_utils.mjs";

const FT = {
  forenames: "forenames",
  fullName: "fullName",
  gender: "gender",
  age: "age",
  personFather: "personFather",
  personMother: "personMother",
  personBride: "personBride",
  personBrideFather: "personBrideFather",
  personBrideMother: "personBrideMother",
  personSpouse: "personSpouse",
};

// Document types
const typeData = {
  "BS Geboorte": {
    // Birth certificates
    enDocumentType: "Birth certificates",
    recordType: RT.BirthRegistration,
    nameFormat: "full",
    labels: {
      en: {
        fullName: ["Child"],
        gender: ["Gender"],
        personFather: ["Father"],
        personMother: ["Mother"],
      },
      nl: {
        fullName: ["Kind"],
        gender: ["Geslacht"],
        personFather: ["Vader"],
        personMother: ["Moeder"],
      },
    },
  },
  "BS Huwelijk": {
    // Marriage certificates
    enDocumentType: "Marriage certificates",
    recordType: RT.Marriage,
    fixedGender: "male", // the primary person is always the groom
    nameFormat: "full",
    labels: {
      en: {
        fullName: ["Groom"],
        age: ["Age"],
        personBride: ["Bride"],
        personFather: ["Father of the groom"],
        personMother: ["Mother of the groom"],
        personBrideFather: ["Father of the bride"],
        personBrideMother: ["Mother of the bride"],
      },
      nl: {
        fullName: ["Bruidegom"],
        age: ["Leeftijd"],
        personBride: ["Bruid"],
        personFather: ["Vader van de bruidegom"],
        personMother: ["Moeder van de bruidegom"],
        personBrideFather: ["Vader van de bruid"],
        personBrideMother: ["Moeder van de bruid"],
      },
    },
  },
  "BS Overlijden": {
    // Death certificates
    enDocumentType: "Death certificates",
    recordType: RT.DeathRegistration,
    nameFormat: "full",
    labels: {
      en: {
        fullName: ["Deceased"],
        gender: ["Gender"],
        age: ["Age"],
        personFather: ["Father"],
        personMother: ["Mother"],
      },
      nl: {
        fullName: ["Overledene"],
        gender: ["Geslacht"],
        age: ["Leeftijd"],
        personFather: ["Vader"],
        personMother: ["Moeder"],
      },
    },
  },

  "DTB Dopen": {
    // Baptismal registers
    enDocumentType: "Baptismal Registers",
    recordType: RT.Baptism,
    nameFormat: "forenamesOnly",
    labels: {
      en: {
        forenames: ["Dopeling"],
        personFather: ["Father"],
        personMother: ["Mother"],
      },
      nl: {
        forenames: ["Dopeling"],
        personFather: ["Vader"],
        personMother: ["Moeder"],
      },
    },
  },
  "DTB Trouwen": {
    // Marriage registers
    enDocumentType: "Marriage Registers",
    recordType: RT.Marriage,
    fixedGender: "male", // the primary person is always the groom
    nameFormat: "full",
    labels: {
      en: {
        fullName: ["Groom"],
        age: ["Age"],
        personBride: ["Bride"],
        personFather: ["Father of the groom"],
        personMother: ["Mother of the groom"],
        personBrideFather: ["Father of the bride"],
        personBrideMother: ["Mother of the bride"],
      },
      nl: {
        fullName: ["Bruidegom"],
        age: ["Leeftijd"],
        personBride: ["Bruid"],
        personFather: ["Vader van de bruidegom"],
        personMother: ["Moeder van de bruidegom"],
        personBrideFather: ["Vader van de bruid"],
        personBrideMother: ["Moeder van de bruid"],
      },
    },
  },
  "DTB Begraven": {
    // Burial registers
    enDocumentType: "Burial Registers",
    recordType: RT.Burial,
    nameFormat: "full",
    labels: {
      en: {
        fullName: ["Deceased"],
        gender: ["Gender"],
        age: ["Age"],
        personSpouse: ["Widow"],
        personFather: ["Father"], // Note can have an entry "Vader/moeder" but can't parse them apart
        personMother: ["Mother"],
      },
      nl: {
        fullName: ["Overledene"],
        gender: ["Geslacht"],
        age: ["Leeftijd"],
        personSpouse: ["Weduwe"],
        personFather: ["Vader"],
        personMother: ["Moeder"],
      },
    },
  },
  "DTB Overig": {
    // Church membership register
    enDocumentType: "Church Membership Registers",
    recordType: RT.OtherChurchEvent,
    recordSubtype: RecordSubtype.MemberRegistration,
    nameFormat: "full",
    labels: {
      en: {
        fullName: ["Man:"],
        gender: ["Gender"],
        personSpouse: ["Wife"],
      },
      nl: {
        fullName: ["Man:"],
        gender: ["Geslacht"],
        personSpouse: ["Vrouw"],
      },
    },
  },

  // other document types in alphabetical order
  "Beroep en bedrijf": {
    // Profession and business
    enDocumentType: "Profession and Business",
    recordType: RT.Employment,
    nameFormat: "full",
    labels: {
      en: {
        fullName: ["Registered", "Opvarende"],
        gender: ["Gender"],
        personSpouse: ["Wife"],
      },
      nl: {
        fullName: ["Geregistreerde", "Opvarende"],
        gender: ["Geslacht"],
        personSpouse: ["Vrouw"],
      },
    },
  },
  Bevolkingsregister: {
    // Population register
    enDocumentType: "Population Registers",
    recordType: RT.PopulationRegister,
    nameFormat: "full",
    labels: {
      en: {
        fullName: ["Registered", "Persoon in bevolkingsregister"],
      },
      nl: {
        fullName: ["Geregistreerde", "Persoon in bevolkingsregister"],
      },
    },
  },
  Bidprentjes: {
    // Prayer cards (Faire-parts)
    enDocumentType: "Prayer Cards",
    recordType: RT.Death,
    nameFormat: "full",
    labels: {
      en: {
        fullName: ["Deceased"],
        personSpouse: ["Partner"],
      },
      nl: {
        fullName: ["Overledene"],
        personSpouse: ["Partner"],
      },
    },
  },
  Collecties: {
    // Miscellaneous collections
    enDocumentType: "Miscellaneous Collections",
    recordType: RT.Unclassified,
  },
  Familieadvertenties: {
    // Family announcements
    enDocumentType: "Family Announcements",
    recordTypeFromEvent: { Geboorte: RT.Birth, Overlijden: RT.Death },
    nameFormat: "full",
    labels: {
      en: {
        fullName: ["Main character"],
      },
      nl: {
        fullName: ["Hoofdpersoon"],
      },
    },
  },
  "Fiscaal en financieel": {
    // Tax and financial records
    enDocumentType: "Tax and Financial Registers",
    recordTypeFromEvent: { Haardstedegeld: RT.Tax, patentvermelding: RT.Patent, Grondschatting: RT.LandTax },
    nameFormat: "full",
    labels: {
      en: {
        fullName: ["Vermeld", "Aangeslagene", "Resident"],
      },
      nl: {
        fullName: ["Vermeld", "Aangeslagene", "Bewoner"],
      },
    },
  },
  Instellingsregister: {
    // Institutional register - I can no longer find any examples
    enDocumentType: "Institutional Registers",
    recordType: RT.Unclassified,
  },
  "Memories van Successie": {
    // Memories of succession - Death duties file
    enDocumentType: "Death Duties Files",
    recordType: RT.Death,
    nameFormat: "full",
    labels: {
      en: {
        fullName: ["Deceased"],
      },
      nl: {
        fullName: ["Overledene"],
      },
    },
  },
  Militairen: {
    // Military sources
    enDocumentType: "Military sources",
    recordType: RT.Military,
  },
  "Misdaad en straf": {
    // Crime and punishment
    enDocumentType: "Crime and Punishment",
    recordType: RT.CriminalRegister,
  },
  "Notariële archieven": {
    // Notarial archives
    enDocumentType: "Notarial Archives",
    recordType: RT.Unclassified,
  },
  "Onroerend goed": {
    // Real estate
    enDocumentType: "Real Estate",
    recordType: RT.Unclassified,
  },
  "Rechterlijke archieven": {
    // Court registers
    enDocumentType: "Court Registers",
    recordType: RT.Unclassified,
  },
  "Sociale zorg": {
    // Social care
    enDocumentType: "Social Care",
    recordType: RT.Unclassified,
  },
  Slavernijbronnen: {
    // Slavery records
    enDocumentType: "Slavery Records",
    recordType: RT.Unclassified,
  },
  "Tweede Wereldoorlog": {
    // World War II
    enDocumentType: "World War II",
    recordType: RT.Military,
  },
  "Vestiging en vertrek": {
    // Migration
    enDocumentType: "Migration",
    recordTypeFromEvent: { Vertrek: RT.Emigration },
  },
  "VOC Opvarenden": {
    // VOC Passengers (United East India Company Passengers or Dutch East India Company passengers)
    enDocumentType: "Dutch East India Company Passengers",
    recordType: RT.PassengerList,
  },
};

function cleanAge(age) {
  if (!age) {
    return "";
  }

  age = age.trim();
  age = age.replace("dagen", "days");
  age = age.replace("jaar", "years");

  if (age.endsWith(" years")) {
    age = age.substring(0, age.length - 6).trim();
  }

  return age;
}

class WiewaswieEdReader extends ExtractedDataReader {
  constructor(ed) {
    super(ed);

    // determine document type, event type and hence record type
    this.documentType = this.extractSourceFieldByDataKey("DocumentType");
    this.eventType = this.extractEventFieldByDataKey("Event");

    if (this.documentType) {
      this.typeData = typeData[this.documentType];
      if (this.typeData) {
        this.recordType = this.typeData.recordType;
        this.recordSubtype = this.typeData.recordSubtype;

        if (!this.recordType) {
          if (this.typeData.recordTypeFromEvent && this.eventType) {
            this.recordType = this.typeData.recordTypeFromEvent[this.eventType];
          }
        }
        if (!this.recordType) {
          this.recordType = this.typeData.recordTypeDefault;
        }

        if (!this.recordType) {
          this.recordType = RT.Unclassified;
        }
      }
    }

    // determine if the record is in English or Dutch
    this.lang = "";
    const urlPrefix = "https://www.wiewaswie.nl/";
    if (ed.url && ed.url.startsWith(urlPrefix)) {
      let urlRemainder = ed.url.substring(urlPrefix.length);
      if (urlRemainder.startsWith("en")) {
        this.lang = "en";
      } else if (urlRemainder.startsWith("nl")) {
        this.lang = "nl";
      }
    }
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////
  // Helper functions
  ////////////////////////////////////////////////////////////////////////////////////////////////////
  extractFieldByDataKey(fieldArray, lastPartOfDataKey) {
    const dataKey = "SourceDetail." + lastPartOfDataKey;
    for (let field of fieldArray) {
      if (field.dataKey == dataKey) {
        return field.value;
      }
    }
  }

  extractSourceFieldByDataKey(lastPartOfDataKey) {
    return this.extractFieldByDataKey(this.ed.sourceList, lastPartOfDataKey);
  }

  extractEventFieldByDataKey(lastPartOfDataKey) {
    return this.extractFieldByDataKey(this.ed.eventList, lastPartOfDataKey);
  }

  extractFieldByFieldType(fieldArray, fieldType) {
    let labels = [];
    if (this.typeData.labels && this.typeData.labels[this.lang]) {
      if (this.typeData.labels[this.lang][fieldType]) {
        labels = this.typeData.labels[this.lang][fieldType];
      }
    }

    if (labels && labels.length > 0) {
      for (let field of fieldArray) {
        for (let label of labels) {
          if (field.label == label) {
            return field.value;
          }
        }
      }
    }
  }

  extractPersonFieldByFieldType(person, fieldType) {
    return this.extractFieldByFieldType(person, fieldType);
  }

  extractIndexedPersonFieldByFieldType(personIndex, fieldType) {
    if (this.ed.people.length <= personIndex) {
      return;
    }
    let person = this.ed.people[personIndex];
    return this.extractPersonFieldByFieldType(person, fieldType);
  }

  extractPersonFieldByDataKey(person, lastPartOfDataKey) {
    return this.extractFieldByDataKey(person, lastPartOfDataKey);
  }

  extractIndexedPersonFieldByDataKey(personIndex, lastPartOfDataKey) {
    if (this.ed.people.length <= personIndex) {
      return;
    }
    let person = this.ed.people[personIndex];
    return this.extractPersonFieldByDataKey(person, lastPartOfDataKey);
  }

  findPersonByFirstFieldType(fieldType) {
    if (!this.ed.people || !this.ed.people.length) {
      return;
    }

    let labels = [];
    if (this.typeData.labels && this.typeData.labels[this.lang]) {
      if (this.typeData.labels[this.lang][fieldType]) {
        labels = this.typeData.labels[this.lang][fieldType];
      }
    }

    if (labels && labels.length > 0) {
      for (let person of this.ed.people) {
        for (let label of labels) {
          if (person[0].label == label) {
            return person;
          }
        }
      }
    }
  }

  makeNameObjFromFullName(fullNameString) {
    if (fullNameString) {
      let nameObj = new NameObj();

      fullNameString = fullNameString.trim();

      // sometimes there is a prefix on the start of the name. e.g:
      //   de erfgenamen van + Nicolaas Hendrik van der Wal, wedr. van Cornelia Weydom
      // which translates to:
      //   the heirs of + Nicolaas Hendrik van der Wal, wedr. by Cornelia Weydom
      // Maybe this should be handled at a higher level? But it works here for now.
      const sentencePrefixes = ["de erfgenamen van ", "+ "];
      for (let prefix of sentencePrefixes) {
        if (fullNameString.startsWith(prefix)) {
          let newFullName = fullNameString.substring(prefix.length).trim();
          if (newFullName) {
            fullNameString = newFullName;
          }
        }
      }

      // sometimes the name that was extracted is actially several peoples names
      // e.g.: "Erven Johanna Maria Pekstok wed. Curtius van Weijler"
      const nameSeparators = [" wed ", " wed. ", " wedr ", "wedr. ", ", "];
      for (let nameSeparator of nameSeparators) {
        let separatorIndex = fullNameString.indexOf(nameSeparator);
        if (separatorIndex != -1) {
          let newFullName = fullNameString.substring(0, separatorIndex).trim();
          if (newFullName) {
            fullNameString = newFullName;
          }
        }
      }

      // remove endings that can be left - like , or .
      const endingsToRemove = [",", "."];
      for (let ending of endingsToRemove) {
        if (fullNameString.endsWith(ending)) {
          let newFullName = fullNameString.substring(0, fullNameString.length - ending.length).trim();
          if (newFullName) {
            fullNameString = newFullName;
          }
        }
      }

      nameObj.setFullName(fullNameString);

      // in order to search *from* wiewaswie it halps to be smart about how to separate
      // the forenames and last name when using name prefixes. I guess this code could be in
      // generalizeDataUtils and used in Dutch profiles
      let parts = separateFullNameIntoParts(fullNameString);
      if (parts) {
        if (parts.forenames) {
          nameObj.setForenames(parts.forenames);
        }
        if (parts.lastName) {
          nameObj.setLastName(parts.lastName);
        }
      }

      return nameObj;
    }
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////
  // Overrides of the relevant get functions used in commonGeneralizeData
  ////////////////////////////////////////////////////////////////////////////////////////////////////

  hasValidData() {
    if (!this.ed.success) {
      return false; //the extract failed, GeneralizedData is not even normally called in this case
    }

    if (!this.documentType) {
      return false;
    }

    if (!this.lang) {
      return false;
    }

    if (!this.typeData) {
      return false;
    }

    return true;
  }

  getSourceType() {
    return "record";
  }

  getNameObj() {
    let nameObj = undefined;
    if (this.typeData.nameFormat == "full") {
      let name = this.extractIndexedPersonFieldByFieldType(0, FT.fullName);
      nameObj = this.makeNameObjFromFullName(name);
    } else if (this.typeData.nameFormat == "forenamesOnly") {
      let forenames = this.extractIndexedPersonFieldByFieldType(0, FT.forenames);
      nameObj = this.makeNameObjFromForenames(forenames);
    }

    if (!nameObj) {
      // can't find name in person fields, extract it from the title
      let title = this.ed.title;
      if (title) {
        const prefix = this.documentType + " met ";
        if (title.startsWith(prefix)) {
          let name = title.substring(prefix.length);
          nameObj = this.makeNameObjFromFullName(name);
        }
      }
    }

    return nameObj;
  }

  getGender() {
    if (this.typeData.fixedGender) {
      return this.typeData.fixedGender;
    }

    let gender = this.extractIndexedPersonFieldByFieldType(0, "Gender");

    if (!gender) {
      gender = this.extractIndexedPersonFieldByFieldType(0, FT.gender);
    }

    if (gender == "Man") {
      return "male";
    } else if (gender == "Vrouw") {
      return "female";
    }

    return "";
  }

  getEventDateObj() {
    let ddmmyyyDate = this.extractEventFieldByDataKey("EventDate");
    if (!ddmmyyyDate) {
      ddmmyyyDate = this.extractSourceFieldByDataKey("RegistrationDate");
    }
    return this.makeDateObjFromDdmmyyyyDate(ddmmyyyDate, "-");
  }

  getEventPlaceObj() {
    let eventPlace = this.extractEventFieldByDataKey("EventPlace");
    let documentPlace = this.extractSourceFieldByDataKey("DocumentPlace");
    let region = this.extractSourceFieldByDataKey("CollectionRegion");

    let placeString = "";
    if (eventPlace) {
      if (documentPlace) {
        if (eventPlace != documentPlace) {
          placeString += eventPlace + ", " + documentPlace;
        } else {
          placeString += eventPlace;
        }
      } else {
        placeString += eventPlace;
      }
    } else if (documentPlace) {
      placeString += documentPlace;
    }

    if (region && !placeString.endsWith(region)) {
      if (placeString) {
        placeString += ", ";
      }
      placeString += region;
    }

    if (placeString) {
      placeString += ", ";
    }
    placeString += "Nederland";

    return this.makePlaceObjFromFullPlaceName(placeString);
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
    let ddmmyyyDate = this.extractIndexedPersonFieldByDataKey(0, "BirthDate");
    return this.makeDateObjFromDdmmyyyyDate(ddmmyyyDate, "-");
  }

  getBirthPlaceObj() {
    let place = this.extractIndexedPersonFieldByDataKey(0, "BirthPlace");
    let placeObj = this.makePlaceObjFromFullPlaceName(place);
    return placeObj;
  }

  getDeathDateObj() {
    let ddmmyyyDate = this.extractIndexedPersonFieldByDataKey(0, "DeathDate");

    if (!ddmmyyyDate) {
      if (this.documentType == "BS Overlijden") {
        ddmmyyyDate = this.extractEventFieldByDataKey("EventDate");
      }
    }
    return this.makeDateObjFromDdmmyyyyDate(ddmmyyyDate, "-");
  }

  getDeathPlaceObj() {
    let place = this.extractIndexedPersonFieldByDataKey(0, "DeathPlace");
    let placeObj = this.makePlaceObjFromFullPlaceName(place);
    return placeObj;
  }

  getAgeAtEvent() {
    let age = this.extractIndexedPersonFieldByFieldType(0, FT.age);
    return cleanAge(age);
  }

  getAgeAtDeath() {
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
    let occupation = this.extractIndexedPersonFieldByDataKey(0, "Profession");
    return occupation;
  }

  getSpouseObj(eventDateObj, eventPlaceObj) {
    let bride = this.findPersonByFirstFieldType(FT.personBride);
    if (bride) {
      let brideName = this.extractPersonFieldByFieldType(bride, FT.personBride);
      let spouseNameObj = this.makeNameObjFromFullName(brideName);
      let age = this.extractPersonFieldByFieldType(bride, FT.age);
      let spouseObj = this.makeSpouseObj(spouseNameObj, eventDateObj, eventPlaceObj, age);

      if (spouseObj) {
        spouseObj.personGender = "female";

        let fatherName = "";
        let motherName = "";
        let father = this.findPersonByFirstFieldType(FT.personBrideFather);
        if (father) {
          fatherName = this.extractPersonFieldByFieldType(father, FT.personBrideFather);
        }
        let mother = this.findPersonByFirstFieldType(FT.personBrideMother);
        if (mother) {
          motherName = this.extractPersonFieldByFieldType(mother, FT.personBrideMother);
        }
        let brideParents = this.makeParentsFromFullNames(fatherName, motherName);
        if (brideParents) {
          spouseObj.parents = brideParents;
        }
      }

      return spouseObj;
    }

    // for a death or burial or other records it can give the spouse
    let spouse = this.findPersonByFirstFieldType(FT.personSpouse);
    if (spouse) {
      let spouseName = this.extractPersonFieldByFieldType(spouse, FT.personSpouse);
      let spouseNameObj = this.makeNameObjFromFullName(spouseName);
      let spouseObj = this.makeSpouseObj(spouseNameObj);
      return spouseObj;
    }
  }

  getParents() {
    let fatherName = "";
    let motherName = "";
    let father = this.findPersonByFirstFieldType(FT.personFather);
    if (father) {
      fatherName = this.extractPersonFieldByFieldType(father, FT.personFather);
    }
    let mother = this.findPersonByFirstFieldType(FT.personMother);
    if (mother) {
      motherName = this.extractPersonFieldByFieldType(mother, FT.personMother);
    }

    return this.makeParentsFromFullNames(fatherName, motherName);
  }

  getHousehold() {
    if (this.documentType == "Bevolkingsregister") {
      if (this.ed.people.length > 1) {
        let householdArray = [];
        let fields = ["name"];

        for (let person of this.ed.people) {
          let name = this.extractPersonFieldByFieldType(person, FT.fullName);
          if (name) {
            let householdMember = { name: name };

            function addMemberField(reader, dataKey, fieldName, isDate = false) {
              let value = reader.extractPersonFieldByDataKey(person, dataKey);
              if (value) {
                if (isDate) {
                  let dateObj = reader.makeDateObjFromDdmmyyyyDate(value, "-");
                  if (dateObj) {
                    value = dateObj.getDateString();
                  }
                }
                householdMember[fieldName] = value;
                if (!fields.includes(fieldName)) {
                  fields.push(fieldName);
                }
              }
            }

            addMemberField(this, "Profession", "profession");
            addMemberField(this, "BirthDate", "birthDate", true);
            addMemberField(this, "BirthPlace", "birthPlace");

            householdArray.push(householdMember);
          }
        }

        let result = {};
        result.members = householdArray;
        result.fields = fields;
        return result;
      }
    }
    return undefined;
  }

  getCollectionData() {
    return undefined;
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////
  // Functions to support build citation
  ////////////////////////////////////////////////////////////////////////////////////////////////////

  getSourceTitle() {
    let title = this.documentType;
    if (this.typeData && this.typeData.enDocumentType) {
      title += " (" + this.typeData.enDocumentType + ")";
    }
    return title;
  }

  getSourceReference() {
    let registrationNumber = this.extractSourceFieldByDataKey("RegistrationNumber");
    let book = this.extractSourceFieldByDataKey("Book");
    let institution = this.extractSourceFieldByDataKey("HeritageInstitutionName");

    let collection = this.extractSourceFieldByDataKey("Collection");
    if (collection) {
      const prefix = "Archiefnaam: ";
      if (collection.startsWith(prefix)) {
        collection = collection.substring(prefix.length);
      }
      let remainderIndex = collection.search(/\,\s+[^,:]+\:/);
      if (remainderIndex != -1) {
        collection = collection.substring(0, remainderIndex);
      }
    }

    if (institution && collection) {
      let string = institution + ", Collection: " + collection;

      if (registrationNumber) {
        string += ", Registration number: " + registrationNumber;
      }
      if (book) {
        string += ", Book: " + book;
      }
      return string;
    }
  }

  getExternalLink() {
    let externalLink = {
      link: "",
      text: "",
    };

    if (this.ed.originalSourceLink) {
      externalLink.link = this.ed.originalSourceLink;

      externalLink.text = "External Record";
      let institution = this.extractSourceFieldByDataKey("HeritageInstitutionName");
      if (institution) {
        externalLink.text = institution + " Record";
      }

      return externalLink;
    }
  }
}

export { WiewaswieEdReader };
