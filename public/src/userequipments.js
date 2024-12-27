$(document).ready(function () {

    // Perform search and filter combined
    function filterTable() {
        const searchTerm = $('#search-equipment').val().toLowerCase(); // Get the search term and convert it to lowercase
        const selectedCategory = $('#category-filter').val().toLowerCase();
        const selectedSupplier = $('#supplier-filter').val().toLowerCase();

        $('#tbody tr').each(function () {
            const equipmentName = $(this).find('td:first').text().toLowerCase(); // Get the equipment name from the first column
            const rowCategory = $(this).data('category').toLowerCase();
            const rowSupplier = $(this).data('supplier').toLowerCase();

            // Check if the row matches the category, supplier, and search term
            const categoryMatch = selectedCategory === 'all' || rowCategory === selectedCategory;
            const supplierMatch = selectedSupplier === 'all' || rowSupplier === selectedSupplier;
            const nameMatch = equipmentName.includes(searchTerm);

            if (categoryMatch && supplierMatch && nameMatch) {
                $(this).show(); // Show row if it matches the search term and filter criteria
            } else {
                $(this).hide(); // Hide row if it doesn't match
            }
        });
    }

    // Trigger filterTable whenever a filter or search term changes
    $('#search-equipment').on('input', function () {
        filterTable(); // Filter based on search term
    });

    $('#category-filter, #supplier-filter').on('change', function () {
        filterTable(); // Filter based on category and supplier
    });

    $('#tbody').on('click', '.btn-success', function () {
        const equipmentId = $(this).closest('td').find('.equipment-id').val(); // Retrieve value from hidden input
    
        // Default quantity (or dynamically retrieve it)
        const quantity = 1;

        // Send AJAX request
        $.ajax({
            type: "POST", // Use POST for creating new items
            url: '/api/v1/cart/new', // Replace with your actual backend endpoint
            data: {
                equipment_id: equipmentId, // Send equipment ID
                quantity: quantity, // Send quantity
            },
            success: function (serverResponse) {
                // Handle success
                console.log('Response from server:', serverResponse);
                alert("Successfully added to cart.");
            },
            error: function (errorResponse) {
                // Handle error
                console.error('Error adding to cart:', errorResponse.responseText);
                alert(`Error adding equipment to cart: ${errorResponse.responseText}`);
            }
        });
    });

    $(document).on('click', '.view-details-btn', function() {
        const equipmentId = $(this).closest('tr').find('.equipment-id').val(); // Get equipment_id for this row
        const detailsBox = $('#details-box-' + equipmentId); // Find the corresponding rating box
        $('.details-box').hide(); // Hide all other rating boxes
        detailsBox.show(); // Show the selected rating box
    });

    // When the 'Close Rating' button is clicked
    $(document).on('click', '.close-details-box', function() {
        const equipmentId = $(this).closest('.details-box').attr('id').split('-')[2]; // Extract equipment_id from the id of details-box
        $('#details-box-' + equipmentId).hide(); // Hide the corresponding details box
    });

});
