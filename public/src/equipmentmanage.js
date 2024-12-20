$(document).ready(function () {
    // Fetch categories and populate the filter dropdown
    $.ajax({
        type: "GET",
        url: "/api/v1/categories/view",
        success: function (data) {
            const categorySelect = $('#filter-category');
            categorySelect.append('<option value="All Categories">All Categories</option>');
            data.forEach(function (category) {
                categorySelect.append(`<option value="${category.category_name}">${category.category_name}</option>`);
            });
        },
        error: function (error) {
            console.error("Error fetching categories:", error);
            alert("Error fetching categories.");
        }
    });

    // Fetch suppliers and populate the filter dropdown
    $.ajax({
        type: "GET",
        url: "/api/v1/supplier/view",
        success: function (data) {
            const supplierSelect = $('#filter-supplier');
            supplierSelect.append('<option value="All Suppliers">All Suppliers</option>');
            data.forEach(function (supplier) {
                supplierSelect.append(`<option value="${supplier.supplier_name}">${supplier.supplier_name}</option>`);
            });
        },
        error: function (error) {
            console.error("Error fetching suppliers:", error);
            alert("Error fetching suppliers.");
        }
    });

    // Function to fetch equipment list with optional filters
    function fetchEquipmentList(categoryFilter, supplierFilter) {
        $.ajax({
            type: "GET",
            url: "/api/v1/equipment/view",
            success: function (data) {
                const equipmentList = $('#equipment-list');
                equipmentList.empty();

                // Filter data based on selected filters
                const filteredData = data.filter(function (equipment) {
                    const categoryMatch = categoryFilter && categoryFilter !== 'All Categories' ? equipment.category_name === categoryFilter : true;
                    const supplierMatch = supplierFilter && supplierFilter !== 'All Suppliers' ? equipment.supplier_name === supplierFilter : true;
                    return categoryMatch && supplierMatch;
                });

                // Populate table with filtered data
                filteredData.forEach(function (equipment) {
                    equipmentList.append(
                        `<tr>
                            <td>${equipment.equipment_name}</td>
                            <td>${equipment.model_number}</td>
                            <td>${equipment.category_name}</td>
                            <td>${equipment.supplier_name}</td>
                            <td>
                               <button class="btn btn-info view-btn" data-id="${equipment.equipment_id}" data-toggle="modal" data-target="#equipmentModal">View</button>
                               <button class="btn btn-warning edit-btn" data-id="${equipment.equipment_id}" data-toggle="modal" data-target="#editEquipmentModal">Edit</button>
                               <button class="btn btn-danger remove" id="${equipment.equipment_id}">Delete</button>
                            </td>
                        </tr>`
                    );
                });
            },
            error: function (error) {
                console.error("Error fetching equipment:", error);
                alert("Error fetching equipment.");
            }
        });
    }

    // Initial fetch of equipment list
    fetchEquipmentList();

    // View Equipment Details
    $('#equipment-list').on('click', '.view-btn', function () {
        var id = $(this).data("id");

        $.ajax({
            type: "GET",
            url: "/api/v1/equipment/" + id,
            success: function (data) {
                if (data) {
                    $('#modal-equipment-name').text(data.equipment_name);
                    $('#modal-model-number').text(data.model_number);
                    $('#modal-category').text(data.category_name);
                    $('#modal-supplier').text(data.supplier_name);
                    $('#modal-quantity').text(data.quantity);
                    $('#modal-status').text(data.status);
                    $('#modal-location').text(data.location);
                    $('#modal-purchase-date').text(data.purchase_date);

                    // Set the image URL if it exists
                    if (data.image_url) {
                        $('#modal-equipment-image').attr('src', data.image_url);  // Base64 image
                    } else {
                        $('#modal-equipment-image').attr('src', 'path_to_default_image');  // Fallback image if no image is available
                    }
                } else {
                    alert("No data found for this equipment.");
                }
            },
            error: function (error) {
                console.error("Error fetching equipment details:", error);
                alert(`Error fetching equipment details: ${error.responseText}`);
            }
        });
    });

    // Edit Equipment Details
    $('#equipment-list').on('click', '.edit-btn', function () {
        var id = $(this).data("id");

        $.ajax({
            type: "GET",
            url: "/api/v1/equipment/" + id,
            success: function (data) {
                if (data) {
                    $('#edit-equipment-name').val(data.equipment_name);
                    $('#edit-quantity').val(data.quantity);
                    $('#edit-status').val(data.status);  // Set the selected value in the status dropdown
                    $('#edit-location').val(data.location);

                    // Store the equipment ID on the Save button
                    $('#save-edit-btn').data('id', id);

                    // Show the modal after data is loaded
                    $('#editEquipmentModal').modal('show');
                } else {
                    alert("No data found for this equipment.");
                }
            },
            error: function (error) {
                console.error("Error fetching equipment details:", error);
                alert(`Error fetching equipment details: ${error.responseText}`);
            }
        });
    });

    // Save Edited Equipment
    $('#save-edit-btn').click(function () {
        var id = $(this).data('id');
        var equipmentData = {
            equipment_name: $('#edit-equipment-name').val(),
            quantity: $('#edit-quantity').val(),
            status: $('#edit-status').val(),
            location: $('#edit-location').val(),
        };

        $.ajax({
            type: "PUT",
            url: "/api/v1/equipment/" + id,
            data: equipmentData,
            success: function (data) {
                alert("Equipment updated successfully.");
                $('#editEquipmentModal').modal('hide');
                fetchEquipmentList(); // Refresh the equipment list
            },
            error: function (error) {
                console.error("Error updating equipment:", error);
                alert(`Error updating equipment: ${error.responseText}`);
            }
        });
    });

    // Apply Filters on Change
    $('#filter-category, #filter-supplier').on('change', function () {
        const categoryFilter = $('#filter-category').val();
        const supplierFilter = $('#filter-supplier').val();
        fetchEquipmentList(categoryFilter, supplierFilter);
    });
});
