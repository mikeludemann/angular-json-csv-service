import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class JsonCsvService {

	constructor() { }

		csv2json(csv){

			var lines = csv.split('\n');

			var result = [];

			var headers=lines[0].split(',');
			lines.splice(0, 1);

			lines.forEach(function(line) {

				var obj = {};

				var currentline = line.split(',');

				headers.forEach(function(header, i) {

					obj[header] = currentline[i];

				});

				result.push(obj);

			});

			return result;

			// return JSON.stringify(result);
		}

		csv2array( strData, strDelimiter ){

			strDelimiter = (strDelimiter || ",");

			var objPattern = new RegExp(
				(
					"(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
					"(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
					"([^\"\\" + strDelimiter + "\\r\\n]*))"
				),
				"gi"
			);

			var arrData = [];
			var headers = [];
			var headersFound = false;
			var headerIndex = 0;

			var arrMatches = null;

			while (arrMatches = objPattern.exec( strData )){

				var strMatchedDelimiter = arrMatches[ 1 ];

				if (strMatchedDelimiter.length && strMatchedDelimiter !== strDelimiter){

					arrData.push( {} );
					headersFound = true;
					headerIndex = 0;

				}

				var strMatchedValue;

				if (arrMatches[ 2 ]){

					strMatchedValue = arrMatches[ 2 ].replace(new RegExp( "\"\"", "g" ),"\"");

				} else {

					strMatchedValue = arrMatches[ 3 ];

				}

				if (!headersFound) {

					headers.push(strMatchedValue);

				} else {

					arrData[arrData.length -1][headers[headerIndex]] = strMatchedValue;
					headerIndex ++;

				}

			}

			return( arrData );

		}

		csvFileToJSON(file) {

			if (!window.FileReader || !window.File) {

				return Promise.reject('Does not support File API');

			}
			if (!(file instanceof File)) {

				return Promise.reject('Not a file');

			}

			return new Promise(function(resolve, reject) {

				var reader = new FileReader();

				reader.onerror = function(err) {

					reject(err);

				};

				reader.onload = function() {

					var text = reader.result;

					resolve(this.csv2array(text, ","));

				};

				reader.readAsText(file);

			});

		}

		json2csv(objArray) {
			var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
			var txt = '';

			for (var i = 0; i < array.length; i++) {

				var line = '';

				for (var index in array[i]) {

					if (line != '') line += ','

					line += array[i][index];

				}

				txt += line + '\r\n';

			}

			return txt;

		}

		exportCSVFile(headers, items, fileTitle) {
			if (headers) {

				items.unshift(headers);

			}

			var jsonObject = JSON.stringify(items);

			var csv = this.json2csv(jsonObject);

			var exportedFilenmae = fileTitle + '.csv' || 'export.csv';

			var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

			if (navigator.msSaveBlob) {

				navigator.msSaveBlob(blob, exportedFilenmae);

			} else {

				var link = document.createElement("a");

				if (link.download !== undefined) {

					var url = URL.createObjectURL(blob);

					link.setAttribute("href", url);
					link.setAttribute("download", exportedFilenmae);
					link.style.visibility = 'hidden';
					document.body.appendChild(link);
					link.click();
					document.body.removeChild(link);

				}

			}

		}

}
