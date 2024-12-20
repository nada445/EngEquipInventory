$(document).ready(function () {
    // Fetch and populate the user list
    function fetchUserList() {
        $.ajax({
            type: "GET",
            url: "/api/v1/users/view",
            success: function (data) {
                const userList = $('#user-list');
                userList.empty();

                // Populate the table with user data
                data.forEach(function (user) {
                    userList.append(
                        `<tr>
                            <td>${user.user_id}</td>
                            <td>${user.username}</td>
                            <td>${user.email}</td>
                            <td>${user.role}</td>
                            <td>
                                <button class="btn btn-warning edit-btn" data-id="${user.user_id}" data-toggle="modal" data-target="#edituserModal">Edit</button>
                                <button class="btn btn-danger delete-btn" data-id="${user.user_id}">Delete</button>
                            </td>
                        </tr>`
                    );
                });
            },
            error: function (error) {
                console.error("Error fetching users:", error);
                alert("Error fetching user list.");
            }
        });
    }

    // Initial fetch of user list
    fetchUserList();

    // Search for a user by ID
    $('#search-form').on('submit', function (e) {
        e.preventDefault(); // Prevent default form submission
        const userId = $('#search-input').val().trim();

        if (!userId) {
            alert("Please enter a user ID to search.");
            return;
        }

        $.ajax({
            type: "GET",
            url: `/api/v1/users/${userId}`,
            success: function (user) {
                const userList = $('#user-list');
                userList.empty();

                // Display the single user in the table
                userList.append(
                    `<tr>
                        <td>${user.user_id}</td>
                        <td>${user.username}</td>
                        <td>${user.email}</td>
                        <td>${user.role}</td>
                        <td>
                            <button class="btn btn-warning edit-btn" data-id="${user.user_id}" data-toggle="modal" data-target="#edituserModal">Edit</button>
                            <button class="btn btn-danger delete-btn" data-id="${user.user_id}">Delete</button>
                        </td>
                    </tr>`
                   
                );
            },
            error: function (error) {
                console.error("Error fetching user:", error);
                alert("User not found. Please try again.");
                fetchUserList(); // Refresh the full list on erro
               
            }
        });
    });
   

    // Open Edit Modal with User Details
    $('#user-list').on('click', '.edit-btn', function () {
        const userId = $(this).data('id');

        $.ajax({
            type: "GET",
            url: `/api/v1/users/${userId}`,
            success: function (data) {
                $('#edit-user-name').val(data.username);
                $('#edit-Role').val(data.role);
                $('#save-edit-btn').data('id', userId); // Store the user ID
            },
            error: function (error) {
                console.error("Error fetching user details:", error);
                alert("Error fetching user details. Please try again.");
            }
        });
    });

    // Save changes made to a user
    $('#save-edit-btn').on('click', function () {
        const userId = $(this).data('id');
        const updatedUser = {
            username: $('#edit-user-name').val(),
            role: $('#edit-Role').val()
        };

        $.ajax({
            type: "PUT",
            url: `/api/v1/users/${userId}`,
            data: updatedUser,
            success: function () {
                alert("User updated successfully.");
                $('#edituserModal').modal('hide'); // Close the modal
                fetchUserList(); // Refresh the user list
            },
            error: function (error) {
                console.error("Error updating user:", error);
                alert("Error updating user. Please try again.");
            }
        });
    });

    // Delete a user
    $('#user-list').on('click', '.delete-btn', function () {
        const userId = $(this).data('id');
        const row = $(this).closest('tr'); // Get the table row

        $.ajax({
            type: "DELETE",
            url: `/api/v1/users/${userId}`,
            success: function () {
                alert("User deleted successfully.");
                row.remove(); // Remove the row from the table
            },
            error: function (error) {
                console.error("Error deleting user:", error);
                alert("Error deleting user. Please try again.");
            }
        });
    });

    // Clear modal inputs when closed
    $('#edituserModal').on('hidden.bs.modal', function () {
        $('#edit-user-name').val('');
        $('#edit-Role').val('');
    });
    $('#search-input').val('');
});
