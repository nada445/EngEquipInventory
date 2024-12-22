$(document).ready(function() {
    // When the 'Add rating' button is clicked
    $(document).on('click', '.add-rating-btn', function() {
        const equipmentId = $(this).closest('tr').find('.equipment-id').val(); // Get equipment_id for this row
        const ratingBox = $('#rating-box-' + equipmentId); // Find the corresponding rating box
        $('.rating-box').hide(); // Hide all other rating boxes
        ratingBox.show(); // Show the selected rating box
    });

    // When the 'Submit Rating' button is clicked
    $(document).on('click', '.submit-rating', function() {
        const equipmentId = $(this).closest('.rating-box').find('.equipment-id').val(); // Get equipment_id
        const score = $('#rating-' + equipmentId).val(); // Get the score from the select
        const comment = $('#comment-' + equipmentId).val(); // Get the comment from the textarea

        // Send an AJAX request to submit the rating
        $.ajax({
            url: '/api/v1/rating/new', 
            type: 'POST',
            data: {
                equipment_id: equipmentId, 
                comment: comment,
                score: score
            },
            success: function(response) {
                alert('Rating submitted successfully');
                console.log('Rating submitted successfully:', response);
                $('#rating-box-' + equipmentId).hide(); // Hide the rating box after submitting
            },
            error: function(xhr, status, error) {
                console.error('XHR:', xhr);
                console.error('Status:', status);
                console.error('Error:', error);
                alert('There was an error submitting your rating. Please try again.');
            }
        });
    });

    // When the 'Close Rating' button is clicked
    $(document).on('click', '.close-rating-box', function() {
        const equipmentId = $(this).closest('.rating-box').find('.equipment-id').val(); // Get the equipment_id
        $('#rating-box-' + equipmentId).hide(); // Hide the rating box
    });
});
