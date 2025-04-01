<?php
session_start();
require_once 'db_connect.php';

header('Content-Type: application/json');

function generateResetCode() {
    return str_pad(rand(0, 999999), 6, '0', STR_PAD_LEFT);
}

function sendResetEmail($email, $code) {
    $to = $email;
    $subject = "Password Reset Code - HAMSA BEADS";
    $message = "Your password reset code is: $code\n\n";
    $message .= "This code will expire in 15 minutes.\n";
    $message .= "If you didn't request this reset, please ignore this email.";
    $headers = "From: noreply@hamsabeads.com";

    return mail($to, $subject, $message, $headers);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';
    
    switch ($action) {
        case 'request_reset':
            $email = $_POST['email'] ?? '';
            
            if (empty($email)) {
                echo json_encode(['status' => 'error', 'message' => 'Email is required']);
                exit;
            }

            // Check if email exists in database
            $stmt = $conn->prepare("SELECT id FROM useraccount WHERE email = ?");
            $stmt->bind_param("s", $email);
            $stmt->execute();
            $result = $stmt->get_result();

            if ($result->num_rows === 0) {
                echo json_encode(['status' => 'error', 'message' => 'Email not found']);
                exit;
            }

            // Generate reset code
            $resetCode = generateResetCode();
            $expiry = date('Y-m-d H:i:s', strtotime('+15 minutes'));

            // Store reset code in database
            $stmt = $conn->prepare("UPDATE useraccount SET reset_code = ?, reset_code_expiry = ? WHERE email = ?");
            $stmt->bind_param("sss", $resetCode, $expiry, $email);
            $stmt->execute();

            // Send reset email
            if (sendResetEmail($email, $resetCode)) {
                echo json_encode(['status' => 'success', 'message' => 'Reset code sent to your email']);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Failed to send reset code']);
            }
            break;

        case 'verify_code':
            $email = $_POST['email'] ?? '';
            $code = $_POST['code'] ?? '';

            if (empty($email) || empty($code)) {
                echo json_encode(['status' => 'error', 'message' => 'Email and code are required']);
                exit;
            }

            // Verify code
            $stmt = $conn->prepare("SELECT id FROM useraccount WHERE email = ? AND reset_code = ? AND reset_code_expiry > NOW()");
            $stmt->bind_param("ss", $email, $code);
            $stmt->execute();
            $result = $stmt->get_result();

            if ($result->num_rows === 0) {
                echo json_encode(['status' => 'error', 'message' => 'Invalid or expired reset code']);
                exit;
            }

            // Generate temporary token for password reset
            $token = bin2hex(random_bytes(32));
            $tokenExpiry = date('Y-m-d H:i:s', strtotime('+5 minutes'));

            // Store token in database
            $stmt = $conn->prepare("UPDATE useraccount SET reset_token = ?, reset_token_expiry = ? WHERE email = ?");
            $stmt->bind_param("sss", $token, $tokenExpiry, $email);
            $stmt->execute();

            echo json_encode(['status' => 'success', 'message' => 'Code verified successfully', 'token' => $token]);
            break;

        case 'reset_password':
            $token = $_POST['token'] ?? '';
            $password = $_POST['password'] ?? '';
            $confirmPassword = $_POST['confirm_password'] ?? '';

            if (empty($token) || empty($password) || empty($confirmPassword)) {
                echo json_encode(['status' => 'error', 'message' => 'All fields are required']);
                exit;
            }

            if ($password !== $confirmPassword) {
                echo json_encode(['status' => 'error', 'message' => 'Passwords do not match']);
                exit;
            }

            if (strlen($password) < 8) {
                echo json_encode(['status' => 'error', 'message' => 'Password must be at least 8 characters long']);
                exit;
            }

            // Verify token and update password
            $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
            $stmt = $conn->prepare("UPDATE useraccount SET password = ?, reset_token = NULL, reset_token_expiry = NULL, reset_code = NULL, reset_code_expiry = NULL WHERE reset_token = ? AND reset_token_expiry > NOW()");
            $stmt->bind_param("ss", $hashedPassword, $token);
            $stmt->execute();

            if ($stmt->affected_rows > 0) {
                echo json_encode(['status' => 'success', 'message' => 'Password reset successfully']);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Invalid or expired reset token']);
            }
            break;

        default:
            echo json_encode(['status' => 'error', 'message' => 'Invalid action']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
}

$conn->close();
?> 