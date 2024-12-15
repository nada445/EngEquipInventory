$(document).ready(function(){
    // #submit means id = "submit"
    $("#add").click(function() {
      console.log("here");
      const equipment_name = $('#ename').val();
      const model_number = $('#mo_num').val();        
      const purchase_date = $('#pur_date').val();
      const quantity = $('#quantity').val();
      const status = $('#status').val();
      const location = $('#loc').val();
      const category_ID = $('#cat_id').val();
      const supplier_id = $('#supp_id').val();
      const image =  $('#image')[0].files[0];

      if(!equipment_name  || !model_number || !purchase_date || !quantity || !status || !location || !category_ID || !supplier_id){
        alert("missing info");
        return;
      }
      
        const formData = new FormData();  // Use FormData to handle the file upload
        formData.append('equipment_name', equipment_name);
        formData.append('model_number', model_number);
        formData.append('purchase_date', purchase_date);
        formData.append('quantity', quantity);
        formData.append('status', status);
        formData.append('location', location);
        formData.append('category_ID', category_ID);
        formData.append('supplier_id', supplier_id);
        formData.append('image', image);  // Append the image file
        if (image) {
            formData.append('image', image);
        }

      
      
        $.ajax({
            type: "POST",
            url: '/api/v1/equipment/new',
            data: formData,
            contentType: false,  // Don't set content-type for multipart/form-data
            processData: false,  // Prevent jQuery from processing the data
            success: function(data) {
                // Clear input fields
                $('#equipment_name').val("");
                $('#model_number').val("");
                $('#purchase_date').val("");
                $('#quantity').val("");
                $('#status').val("");
                $('#location').val("");
                $('#category_ID').val("");
                $('#supplier_id').val("");
                $('#image').val("");  // Reset image input field

                console.log("Message from server", data);
                alert(data.message);  // Display the message from the server
            },
        error : function(data){
          alert(data.responseText);
        }
      });
    });

    $('#tbody').on('click', '.remove', function () {
    
        var id = $(this).attr("id");
        $(this).parent().parent().remove();
        $.ajax({
        type: "DELETE",
        data : { message : "deleted"},
        url: '/api/v1/equipment/'+`${id}`,
        success: function(data){
            console.log(data);
        },
        error: function(data){
            console.log("error message" , data.responseText)
            alert(data.responseText);
        }
      });
      });


      $("#add").click(function() {
        const id = $('#eid').val();  // Assuming 'eid' is the equipment ID
        console.log("here", id);
    
        const equipment_name = $('#equipment_name').val();
        const model_number = $('#model_number').val();        
        const purchase_date = $('#purchase_date').val();
        const quantity = $('#quantity').val();
        const status = $('#status').val();
        const location = $('#location').val();
        const category_ID = $('#category_ID').val();
        const supplier_id = $('#supplier_id').val();
        
        // Check if at least one field is filled
        if (!equipment_name && !model_number && !purchase_date && !quantity && !status && !location && !category_ID && !supplier_id) {
            alert("Please provide at least one field to update.");
            return;
        }
    
        // Prepare the object with only the fields that are provided
        const equipmentObj = {};
    
        if (equipment_name) equipmentObj.equipment_name = equipment_name;
        if (model_number) equipmentObj.model_number = model_number;
        if (purchase_date) equipmentObj.purchase_date = purchase_date;
        if (quantity) equipmentObj.quantity = quantity;
        if (status) equipmentObj.status = status;
        if (location) equipmentObj.location = location;
        if (category_ID) equipmentObj.category_ID = category_ID;
        if (supplier_id) equipmentObj.supplier_id = supplier_id;
    
        // Send the update request with the object containing only provided parameters
        $.ajax({
            type: "PUT",
            url: `/api/v1/equipment/${id}`,
            data: equipmentObj,
            success: function(data) {
                if (data) {
                    console.log(data);
                    alert("Successfully updated");
                }
            },
            error: function(data) {
                console.log(data.responseText);
                alert(data.responseText);
            }
        });
    });
    
  
});