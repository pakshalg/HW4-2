/*
NAME:  Pakshal Gandhi
SID:   01772844
EMAIL: Pakshal_Gandhi@student.uml.edu
FILE:  js.js

Last modified: 11/29/24
*/


$(document).ready(function () {
  let tabCounter = 0;

  // Initialize Tabs
  $("#tabs").tabs();

  // Initialize sliders and sync with input fields
  $("#xMinSlider").slider({
    min: -50,
    max: 50,
    value: 0,
    slide: function (event, ui) {
      $("#xMin").val(ui.value).trigger("input");
    }
  });
  $("#xMaxSlider").slider({
    min: -50,
    max: 50,
    value: 0,
    slide: function (event, ui) {
      $("#xMax").val(ui.value).trigger("input");
    }
  });
  $("#yMinSlider").slider({
    min: -50,
    max: 50,
    value: 0,
    slide: function (event, ui) {
      $("#yMin").val(ui.value).trigger("input");
    }
  });
  $("#yMaxSlider").slider({
    min: -50,
    max: 50,
    value: 0,
    slide: function (event, ui) {
      $("#yMax").val(ui.value).trigger("input");
    }
  });

  // Update sliders when input values are changed
  $("#xMin").on("input", function () {
    $("#xMinSlider").slider("value", $(this).val());
  });
  $("#xMax").on("input", function () {
    $("#xMaxSlider").slider("value", $(this).val());
  });
  $("#yMin").on("input", function () {
    $("#yMinSlider").slider("value", $(this).val());
  });
  $("#yMax").on("input", function () {
    $("#yMaxSlider").slider("value", $(this).val());
  });

  // Add a new tab
  function addTab(xMin, xMax, yMin, yMax, tableHTML) {
    tabCounter++;
    const tabId = `tab-${tabCounter}`;
    const tabTitle = `${xMin}-${xMax} x ${yMin}-${yMax}`;
    const tabContent = `<div class="table-container">${tableHTML}</div>`;

    // Add tab header
    $("#tabs ul").append(
      `<li id="${tabId}-li">
            <a href="#${tabId}">${tabTitle}</a>
            <input type="checkbox" class="tab-checkbox" data-tab="${tabId}">
        </li>`
    );

    // Add tab content
    $("#tabs").append(`<div id="${tabId}">${tabContent}<button class="delete-tab" data-tab="${tabId}">Delete Tab</button></div>`);

    // Refresh Tabs
    $("#tabs").tabs("refresh");

    // Activate new tab
    $("#tabs").tabs("option", "active", tabCounter);

    // Bind delete button to this tab
    $(`#${tabId}`).on("click", ".delete-tab", function () {
      deleteTab(tabId);
    });
  }

  // Delete a specific tab
  function deleteTab(tabId) {
    $(`#${tabId}-li`).remove(); // Remove the tab header
    $(`#${tabId}`).remove(); // Remove the tab content
    $("#tabs").tabs("refresh");
  }

  // Delete selected tabs
  $("#selectDeleteTabs").on("click", function () {
    $(".tab-checkbox:checked").each(function () {
      const tabId = $(this).data("tab");
      deleteTab(tabId);
    });
  });

  // Delete all tabs
  $("#deleteAllTabs").on("click", function () {
    $(".tab-checkbox").each(function () {
      const tabId = $(this).data("tab");
      deleteTab(tabId);
    });
  });
  
  // Validation for form
  $('#inputNum').validate({
    rules: {
      xMin: { required: true, number: true, range: [-50, 50] },
      xMax: { required: true, number: true, range: [-50, 50], greaterThan: "#xMin" },
      yMin: { required: true, number: true, range: [-50, 50] },
      yMax: { required: true, number: true, range: [-50, 50], greaterThan: "#yMin" }
    },
    messages: {
      xMin: { required: "Please enter row min.", number: "Enter a valid number.", range: "Number must be between -50 and 50." },
      xMax: { required: "Please enter row max.", number: "Enter a valid number.", range: "Number must be between -50 and 50.", greaterThan: "Row max cannot be greater than row min!" },
      yMin: { required: "Please enter column min.", number: "Enter a valid number.", range: "Number must be between -50 and 50." },
      yMax: { required: "Please enter column max.", number: "Enter a valid number.", range: "Number must be between -50 and 50.", greaterThan: "Column max cannot be greater than column min!" }
    },
    errorPlacement: function (error, element) {
      if (element.next("div").length) {
        error.insertAfter(element.next("div")); // Insert error after the next div (slider)
      } else {
        error.insertAfter(element); // Default placement for other elements
      }
    },
    submitHandler: function (form) {
      const xMin = parseInt($("#xMin").val());
      const xMax = parseInt($("#xMax").val());
      const yMin = parseInt($("#yMin").val());
      const yMax = parseInt($("#yMax").val());
      const tableHTML = generateMultiplicationTable(xMin, xMax, yMin, yMax);
      addTab(xMin, xMax, yMin, yMax, tableHTML);
    },
  });

  // Update the active tab table on input change
  $("#xMin, #xMax, #yMin, #yMax").on("input", function () {

    const $form = $("#inputNum"); // Reference the form
    // Check if the checkbox is checked
    if ($("#realtimeUpdate").is(":checked")) {
      // Trigger validation on the form or specific inputs
      const isFormValid = $form.valid();
      if (isFormValid) {

        const childNodes = $("#tabs")[0].childNodes;

        const lastTab = $("#tabs .ui-tabs-panel").eq(childNodes.length - 5); // Find last tab content

        // Check if the active tab contains a table
        const tableContainer = lastTab.find(".table-container");

        if (tableContainer.length > 0) {
          const xMin = parseInt($("#xMin").val());
          const xMax = parseInt($("#xMax").val());
          const yMin = parseInt($("#yMin").val());
          const yMax = parseInt($("#yMax").val());

          // Regenerate the table
          const newTableHTML = generateMultiplicationTable(xMin, xMax, yMin, yMax);

          // Replace the table content in the active tab
          tableContainer.html(`${newTableHTML}<button class="delete-tab" data-tab="${lastTab.attr("id")}">Delete Tab</button>`);
        }
      }
    }
  });

  // Custom validation method
  $.validator.addMethod("greaterThan", function (value, element, param) {
    return parseInt(value) >= parseInt($(param).val());
  }, "This value must be greater than or equal to the minimum value.");
});

// Generate Multiplication Table
function generateMultiplicationTable(xMin, xMax, yMin, yMax) {
  let tableHTML = "<table>";
  tableHTML += "<tr><th></th>";
  for (let x = xMin; x <= xMax; x++) {
    tableHTML += `<th>${x}</th>`;
  }
  tableHTML += "</tr>";
  for (let y = yMin; y <= yMax; y++) {
    tableHTML += `<tr><th>${y}</th>`;
    for (let x = xMin; x <= xMax; x++) {
      tableHTML += `<td>${x * y}</td>`;
    }
    tableHTML += "</tr>";
  }
  tableHTML += "</table>";
  return tableHTML;
}
