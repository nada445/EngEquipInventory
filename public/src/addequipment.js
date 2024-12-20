// Wait until the DOM is ready
$(document).ready(function () {
    // Load categories into the category dropdown
    $.ajax({
      type: "GET",
      url: "/api/v1/categories/view",
      success: function (categories) {
        categories.forEach((category) => {
          $("#cat_id").append(
            `<option value="${category.category_id}">${category.category_name}</option>`
          );
        });
      },
      error: function (error) {
        console.error("Error loading categories:", error);
        alert("Failed to load categories.");
      },
    });
  
    // Load suppliers into the supplier dropdown
    $.ajax({
      type: "GET",
      url: "/api/v1/supplier/view",
      success: function (suppliers) {
        suppliers.forEach((supplier) => {
          $("#supp_id").append(
            `<option value="${supplier.supplier_id}">${supplier.supplier_name}</option>`
          );
        });
      },
      error: function (error) {
        console.error("Error loading suppliers:", error);
        alert("Failed to load suppliers.");
      },
    });
  
    // Handle form submission for adding equipment
    $("#add-equipment-form").on("submit", function (e) {
        e.preventDefault(); // Prevent the form from refreshing the page
    
        // Create a FormData object to handle form input
        let formData = new FormData();
        formData.append("equipment_name", $("#ename").val());
        formData.append("model_number", $("#mo_num").val());
        formData.append("purchase_date", $("#pur_date").val());
        formData.append("quantity", $("#quantity").val());
        formData.append("status", $("#status").val());
        formData.append("location", $("#loc").val());
        formData.append("category_ID", $("#cat_id").val());
        formData.append("supplier_id", $("#supp_id").val());
    
        // Add image only if a file is selected
        let imageFile = $("#image")[0].files[0];
        if (imageFile) {
            formData.append("image", imageFile);
        }
    
        // Send an AJAX POST request to add the new equipment
        $.ajax({
            type: "POST",
            url: "/api/v1/equipment/new",
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                alert("Equipment added successfully!");
                $("#add-equipment-form")[0].reset(); // Clear the form
            },
            error: function (error) {
                console.error("Error adding equipment:", error);
                alert("Failed to add equipment.");
            },
        });
    });
  });
  