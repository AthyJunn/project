<?php
require_once 'dbHB.php';
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username'] ?? '');
    $password = trim($_POST['password'] ?? '');
    
    // Validate inputs
    $errors = [];
    
    if (empty($username)) {
        $errors[] = "Username is required";
    }
    
    if (empty($password)) {
        $errors[] = "Password is required";
    }
    
    if (empty($errors)) {
        try {
            // Get user from database
            $user = getUserByLogin($username);
            
            if ($user && password_verify($password, $user['password'])) {
                // Login successful
                $_SESSION['user_id'] = $user['userID'];
                $_SESSION['username'] = $user['username'];
                $_SESSION['email'] = $user['email'];
                
                echo json_encode([
                    'status' => 'success',
                    'message' => 'Login successful',
                    'user' => [
                        'username' => $user['username'],
                        'email' => $user['email']
                    ]
                ]);
                exit();
            } else {
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Invalid username or password'
                ]);
                exit();
            }
        } catch (Exception $e) {
            error_log("Login Error: " . $e->getMessage());
            echo json_encode([
                'status' => 'error',
                'message' => 'Login failed. Please try again later.'
            ]);
            exit();
        }
    }
    
    if (!empty($errors)) {
        echo json_encode([
            'status' => 'error',
            'message' => implode("\n", $errors)
        ]);
        exit();
    }
}
?>
