$(document).ready(function() {
    // Handling the click event for the delete button
    $('#tbody').on('click', '.remove', function () {
        console.log("removed");
        var id = $(this).attr("id");
        $(this).parent().parent().remove();
        
        $.ajax({
            type: "DELETE",
            data: { message: "deleted" },
            url: '/api/v1/cart/delete/' + `${id}`,
            success: function(data) {
                console.log(data);
            },
            error: function(data) {
                console.log("error message", data.responseText);
                alert(data.responseText);
            }
        });
    });

    // Handling the click event for the update quantity button
    $(".btn-warning").click(function() {
        const quantity = $(this).closest('tr').find('.quantity-input').val();
        console.log(quantity);

        // Get the cart_id from the button's data-id attribute
        var cart_id = $(this).data('id');

        // Validate the quantity
        if (!quantity || isNaN(quantity) || quantity <= 0) {
            alert('Please enter a valid quantity');
            return;
        }

        // Send the update request to the backend
        $.ajax({
            type: "PUT", // Make sure to use PUT for updating
            url: '/api/v1/cart/edit/' + `${cart_id}`, // Correct URL with cart_id
            data: { quantity: quantity }, // Send data as an object
            success: function(serverResponse) {
                if (serverResponse) {
                    console.log(serverResponse);
                    alert("Successfully updated quantity.");
                    // Optionally reload or redirect
                    // location.href = '/cart'; // Uncomment this to reload the cart page
                }
            },
            error: function(errorResponse) {
                if (errorResponse) {
                    alert(`Error updating equipment quantity: ${errorResponse.responseText}`);
                }
            }
        });
    });

    $(".btn-success").click(function() {
        

        $.ajax({
            type: "Post", // Make sure to use PUT for updating
            url: '/api/v1/order/new' , // Correct URL with cart_id
            data: { }, // Send data as an object
            success: function(serverResponse) {
                if (serverResponse) {
                    console.log(serverResponse);
                    alert("Order placed successfully. ");
                    location.href = '/cart';
                    // Optionally reload or redirect
                    // location.href = '/cart'; // Uncomment this to reload the cart page
                }
            },
            error: function(errorResponse) {
                if (errorResponse) {
                    alert(`Error placing the order: ${errorResponse.responseText}`);
                }
            }
        });
    });

});
