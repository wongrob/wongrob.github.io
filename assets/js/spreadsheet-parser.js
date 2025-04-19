const sheet_url = (
  "https://docs.google.com/spreadsheets/d/"
  + document.currentScript.getAttribute('sheet_id')
  + "/gviz/tq?tqx=out:json&sheet="
  + document.currentScript.getAttribute('sheet_name')
)
const element_id = document.currentScript.getAttribute('element_id');
const star_label_column = document.currentScript.getAttribute('star_label_column');
const x_label_column = document.currentScript.getAttribute('x_label_column');

function getFormattedData(sheet_data) {
  cols = []
  for (var i = 0; i < sheet_data.table.cols.length; i += 1) {
    if (sheet_data.table.cols[i].label == "") {
      continue
    }
    cols.push(sheet_data.table.cols[i].label)
  }

  var data = {};
  for (var i = 0; i < sheet_data.table.rows.length; i += 1) {
    if (sheet_data.table.rows[i].c[0] != null) {
      to_push = {};
      for (var j = 0; j < sheet_data.table.cols.length; j += 1) {
        if (sheet_data.table.rows[i].c[j] != null) {
          to_push[cols[j]] = sheet_data.table.rows[i].c[j].v
        }
      }
      data[i] = to_push
    }
  }

  return {
    col_labels: cols,
    formatted_data: data,
  }
}

fetch(sheet_url)
  .then(res => res.text())
  .then(text => {
    var sheet_data = JSON.parse(text.substring(47, text.length - 2))

    var parsed_sheet = getFormattedData(sheet_data)
    var col_labels = parsed_sheet.col_labels
    var data = parsed_sheet.formatted_data

    var animangaTable = document.createElement("table")
    animangaTable.style.fontSize = "0.5vw"
    var headerRow = document.createElement("tr")
    for (var label in col_labels) {
      var newElement = document.createElement("th")
      newElement.style.verticalAlign = "middle"
      newElement.style.textAlign = "center"
      newElement.innerHTML = col_labels[label]
      headerRow.appendChild(newElement)
    }
    animangaTable.appendChild(headerRow)
    for (var i in data) {
      var newRow = document.createElement("tr")
      for (var j = 0; j < col_labels.length; j += 1) {
        var newElement = document.createElement("td")
        newElement.style.verticalAlign = "middle"
        if (j != 0) {
          newElement.style.textAlign = "center"
        }
        if (col_labels[j] in data[i]) {
          text = data[i][col_labels[j]]
          if (col_labels[j] == star_label_column) {
            if (text === true) {
              newElement.innerHTML = "⭐"
            }
          } else if (text === true) {
            if (j % 2 == 0) {
              newElement.innerHTML = "✔️"
            } else {
              newElement.innerHTML = "✅"
            }
          } else if (text === false) {
            newElement.innerHTML = ""
          } else {
            newElement.innerHTML = text
          }
        } else if (col_labels[j] == x_label_column) {
          newElement.innerHTML = "❌"
        } else {
          newElement.innerHTML = ""
        }
        newRow.appendChild(newElement)
      }
      animangaTable.appendChild(newRow)
    }
    document.getElementById(element_id).appendChild(animangaTable)

  })