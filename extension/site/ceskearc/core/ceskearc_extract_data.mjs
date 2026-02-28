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

function extractData(document, url) {
  var result = {};

  if (url) {
    result.url = url;
  }
  result.success = false;

  let metadata_table = document.querySelector("div[id=\"top\"] > table.titulek_popis");
  if (!metadata_table) {
    alert("error");
    return result;
  }

  result.metadata = {};
  let key = null;
  for (let element of metadata_table.querySelectorAll("td")) {
    if (element.attributes["class"].textContent.trim().toLowerCase() == "titulek_popis_nadpis1") {
      key = element.textContent.trim().toLowerCase();
    }
    else if (element.attributes["class"].textContent.trim().toLowerCase() == "titulek_popis_polozka0") {
      result.record_type = element.textContent.trim();
    }
    else {
      result.metadata[key] = element.textContent.trim();
    }
  }

  let image_iframe = document.querySelector("iframe[id=\"ram\"]");
  if (image_iframe) {
    let image_document = image_iframe.contentDocument;
    let image_number_element = image_document.querySelector("div[id=\"x1\"] > form[name=\"formular\"] > span > a > select");
    result.page_number = image_number_element.value;
  }

  result.success = true;

  return result;
}

export { extractData };
