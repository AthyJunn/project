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
            // First check if it's an admin login
            $admin = getAdminByLogin($username);
            
            if ($admin && $admin['adminPW'] === $password) {
                // Admin login successful
                $_SESSION['user_id'] = $admin['adminID'];
                $_SESSION['username'] = $admin['adminName'];
                $_SESSION['email'] = $admin['adminMail'];
                $_SESSION['is_admin'] = true;
                
                echo json_encode([
                    'status' => 'success',
                    'message' => 'Admin login successful',
                    'user' => [
                        'username' => $admin['adminName'],
                        'email' => $admin['adminMail'],
                        'is_admin' => true
                    ]
                ]);
                exit();
            }
            
            // If not admin, check regular user login
            $user = getUserByLogin($username);
            
            if ($user && password_verify($password, $user['password'])) {
                // User login successful
                $_SESSION['user_id'] = $user['userID'];
                $_SESSION['username'] = $user['username'];
                $_SESSION['email'] = $user['email'];
                $_SESSION['is_admin'] = false;
                
                echo json_encode([
                    'status' => 'success',
                    'message' => 'Login successful',
                    'user' => [
                        'username' => $user['username'],
                        'email' => $user['email'],
                        'is_admin' => false
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
