<?php
session_start();
header('Content-Type: application/json');

// Database connection function
function getDBConnection() {
    static $con = null;
    
    if ($con === null) {
        $host = "localhost";
        $user = "HBAdmin";
        $pass = "hb@Admin";
        $db = "hamsabeads";
        
        try {
            // Enable error reporting
            mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
            
            $con = mysqli_connect($host, $user, $pass, $db);
            
            if (!$con) {
                error_log("Connection Error: " . mysqli_connect_error());
                throw new Exception("Database connection failed: " . mysqli_connect_error());
            }
            
            // Set charset to utf8mb4
            if (!mysqli_set_charset($con, 'utf8mb4')) {
                error_log("Error setting charset: " . mysqli_error($con));
                throw new Exception("Error setting charset");
            }
            
            return $con;
            
        } catch (Exception $e) {
            error_log("Database Connection Error: " . $e->getMessage());
            throw new Exception("Database connection failed. Please check error logs.");
        }
    }
    
    return $con;
}

// Generate a random reset code
function generateResetCode() {
    return str_pad(rand(0, 999999), 6, '0', STR_PAD_LEFT);
}

// Generate a secure token
function generateResetToken() {
    return bin2hex(random_bytes(32));
}

// Send reset code email
function sendResetEmail($email, $code) {
    $to = $email;
    $subject = 'Password Reset Code - HAMSA BEADS';
    
    // HTML email body
    $htmlBody = "
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .code { font-size: 24px; font-weight: bold; color: #6f42c1; padding: 10px; background: #f8f9fa; border-radius: 5px; text-align: center; margin: 20px 0; }
                .footer { margin-top: 30px; font-size: 12px; color: #666; }
            </style>
        </head>
        <body>
            <div class='container'>
                <h2>Password Reset Request</h2>
                <p>You have requested to reset your password. Use the following code to proceed:</p>
                <div class='code'>$code</div>
                <p>This code will expire in 15 minutes.</p>
                <p>If you didn't request this reset, please ignore this email.</p>
                <div class='footer'>
                    <p>This is an automated message, please do not reply to this email.</p>
                </div>
            </div>
        </body>
        </html>
    ";

    // Plain text version
    $plainBody = "Your password reset code is: $code\n\nThis code will expire in 15 minutes.\n\nIf you didn't request this reset, please ignore this email.";

    // Email headers
    $headers = array(
        'MIME-Version: 1.0',
        'Content-type: text/html; charset=utf-8',
        'From: HAMSA BEADS <hamsabeads@gmail.com>',
        'Reply-To: hamsabeads@gmail.com',
        'X-Mailer: PHP/' . phpversion()
    );

    // Send email
    $success = mail($to, $subject, $htmlBody, implode("\r\n", $headers));

    if (!$success) {
        error_log("Email sending failed for address: $email");
        return false;
    }

    return true;
}

// Handle POST requests
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $con = getDBConnection();
        $action = $_POST['action'] ?? '';
        
        switch ($action) {
            case 'request_reset':
                $email = trim($_POST['email'] ?? '');
                
                if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
                    echo json_encode([
                        'status' => 'error',
                        'message' => 'Invalid email address'
                    ]);
                    exit();
                }
                
                // Check if email exists
                $stmt = mysqli_prepare($con, "SELECT userID FROM useraccount WHERE email = ?");
                mysqli_stmt_bind_param($stmt, "s", $email);
                mysqli_stmt_execute($stmt);
                $result = mysqli_stmt_get_result($stmt);
                
                if (mysqli_num_rows($result) === 0) {
                    echo json_encode([
                        'status' => 'error',
                        'message' => 'Email not found'
                    ]);
                    exit();
                }
                
                // Generate and store reset code
                $code = generateResetCode();
                $expiry = date('Y-m-d H:i:s', strtotime('+15 minutes'));
                
                $stmt = mysqli_prepare($con, "UPDATE useraccount SET reset_code = ?, reset_code_expiry = ? WHERE email = ?");
                mysqli_stmt_bind_param($stmt, "sss", $code, $expiry, $email);
                
                if (!mysqli_stmt_execute($stmt)) {
                    throw new Exception("Failed to store reset code");
                }
                
                // Send reset email
                if (!sendResetEmail($email, $code)) {
                    throw new Exception("Failed to send reset email");
                }
                
                echo json_encode([
                    'status' => 'success',
                    'message' => 'Reset code sent to your email'
                ]);
                break;
                
            case 'verify_code':
                $email = trim($_POST['email'] ?? '');
                $code = trim($_POST['code'] ?? '');
                
                if (empty($email) || empty($code)) {
                    echo json_encode([
                        'status' => 'error',
                        'message' => 'Email and code are required'
                    ]);
                    exit();
                }
                
                // Verify code
                $stmt = mysqli_prepare($con, "SELECT userID FROM useraccount WHERE email = ? AND reset_code = ? AND reset_code_expiry > NOW()");
                mysqli_stmt_bind_param($stmt, "ss", $email, $code);
                mysqli_stmt_execute($stmt);
                $result = mysqli_stmt_get_result($stmt);
                
                if (mysqli_num_rows($result) === 0) {
                    echo json_encode([
                        'status' => 'error',
                        'message' => 'Invalid or expired reset code'
                    ]);
                    exit();
                }
                
                // Generate and store reset token
                $token = generateResetToken();
                $tokenExpiry = date('Y-m-d H:i:s', strtotime('+5 minutes'));
                
                $stmt = mysqli_prepare($con, "UPDATE useraccount SET reset_token = ?, reset_token_expiry = ? WHERE email = ?");
                mysqli_stmt_bind_param($stmt, "sss", $token, $tokenExpiry, $email);
                
                if (!mysqli_stmt_execute($stmt)) {
                    throw new Exception("Failed to store reset token");
                }
                
                echo json_encode([
                    'status' => 'success',
                    'message' => 'Code verified successfully',
                    'token' => $token
                ]);
                break;
                
            case 'reset_password':
                $token = trim($_POST['token'] ?? '');
                $password = trim($_POST['password'] ?? '');
                $confirmPassword = trim($_POST['confirm_password'] ?? '');
                
                if (empty($token) || empty($password) || empty($confirmPassword)) {
                    echo json_encode([
                        'status' => 'error',
                        'message' => 'All fields are required'
                    ]);
                    exit();
                }
                
                if ($password !== $confirmPassword) {
                    echo json_encode([
                        'status' => 'error',
                        'message' => 'Passwords do not match'
                    ]);
                    exit();
                }
                
                if (strlen($password) < 8) {
                    echo json_encode([
                        'status' => 'error',
                        'message' => 'Password must be at least 8 characters long'
                    ]);
                    exit();
                }
                
                // Verify token and update password
                $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
                
                $stmt = mysqli_prepare($con, "UPDATE useraccount SET password = ?, reset_token = NULL, reset_token_expiry = NULL, reset_code = NULL, reset_code_expiry = NULL WHERE reset_token = ? AND reset_token_expiry > NOW()");
                mysqli_stmt_bind_param($stmt, "ss", $hashedPassword, $token);
                
                if (!mysqli_stmt_execute($stmt)) {
                    throw new Exception("Failed to update password");
                }
                
                if (mysqli_stmt_affected_rows($stmt) === 0) {
                    echo json_encode([
                        'status' => 'error',
                        'message' => 'Invalid or expired reset token'
                    ]);
                    exit();
                }
                
                echo json_encode([
                    'status' => 'success',
                    'message' => 'Password reset successfully'
                ]);
                break;
                
            default:
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Invalid action'
                ]);
                break;
        }
        
    } catch (Exception $e) {
        error_log("Password Reset Error: " . $e->getMessage());
        echo json_encode([
            'status' => 'error',
            'message' => 'An error occurred. Please try again later.'
        ]);
    }
} else {
    echo json_encode([
        'status' => 'error',
        'message' => 'Invalid request method'
    ]);
}
?> 