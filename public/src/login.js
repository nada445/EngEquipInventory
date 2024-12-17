$(document).ready(function(){
    $("#submit").click(function() {
      const username = $('#username').val();
      const password = $('#password').val();

      const data = {
        username,
        password,
      };

      $.ajax({
        type: "POST",
        url: '/api/v1/user/login',
        data  ,
        success: function(serverResponse) {
          if(serverResponse) {
            alert("login successfully");
            console.log("got to dashboard")
            location.href = '/dashboard';
          }
        },
        error: function(errorResponse) {
          if(errorResponse) {
            alert(`User login error: ${errorResponse.responseText}`);
          }            
        }
      });
    });
  });