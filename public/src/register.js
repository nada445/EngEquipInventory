$(document).ready(function(){

    // Handle Registration Button Click
    $("#register").click(function() {
      const username = $('#name').val();
      const email = $('#email').val();
      const password = $('#password').val();
      const role= "standard_user";

      const data = {
        username,
        email,
        password,
        role
      };

      $.ajax({
        type: "POST",
        url: '/api/v1/user/new',
        data : data,
        success: function(serverResponse) {
          if(serverResponse) {
            console.log(serverResponse);
            alert("successfully registered user")
            location.href = '/';
          }
        },
        error: function(errorResponse) {
          if(errorResponse) {
            alert(`Error Register User: ${errorResponse.responseText}`);
          }            
        }
      });
    });      
  });