<?php
require_once 'dbHB.php';
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $password = trim($_POST['password'] ?? '');
    $confirm_password = trim($_POST['confirm_password'] ?? '');
    
    // Validate inputs
    $errors = [];
    
    if (empty($username)) {
        $errors[] = "Username is required";
    } elseif (strlen($username) < 3) {
        $errors[] = "Username must be at least 3 characters long";
    }
    
    if (empty($email)) {
        $errors[] = "Email is required";
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = "Invalid email format";
    }
    
    if (empty($password)) {
        $errors[] = "Password is required";
    } elseif (strlen($password) < 8) {
        $errors[] = "Password must be at least 8 characters";
    }
    
    if ($password !== $confirm_password) {
        $errors[] = "Passwords do not match";
    }
    
    if (empty($errors)) {
        try {
            // Test database connection first
            $con = getDBConnection();
            if (!$con) {
                throw new Exception("Could not connect to database");
            }

            // Check if username or email already exists
            if (isUserExists($username, $email)) {
                // Check specifically which one exists
                $user = getUserByLogin($username);
                if ($user) {
                    echo "Username already exists";
                    exit();
                }
                
                $user = getUserByLogin($email);
                if ($user) {
                    echo "Email already exists";
                    exit();
                }
            } else {
                // Attempt to register the user
                if (registerUser($username, $email, $password)) {
                    $_SESSION['registration_success'] = true;
                    echo "success";
                    exit();
                } else {
                    throw new Exception("Failed to create user account");
                }
            }
        } catch (Exception $e) {
            error_log("Registration Error: " . $e->getMessage());
            // Check for specific MySQL errors
            if ($e->getCode() == 1062) {
                echo "Username or email already exists";
            } else if ($e->getCode() == 1045) {
                echo "Database access denied. Please contact administrator.";
            } else {
                echo "Registration failed: " . $e->getMessage();
            }
            exit();
        }
    }

    // If there are validation errors, return them
    if (!empty($errors)) {
        echo implode("\n", $errors);
        exit();
    }
}
?>