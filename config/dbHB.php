<?php
// Database connection function
function getDBConnection() {
    static $conn = null;
    
    if ($conn === null) {
        $conn = mysqli_connect("localhost", "HBAdmin", "hb@Admin", "hamsabeads");
        
        if (!$conn) {
            die("Database connection failed: " . mysqli_connect_error());
        }
    }
    
    return $conn;
}

// Generate formatted user ID (HB0000, HB0001, etc.)
function generateUserID() {
    $conn = getDBConnection();
    $sql = "SELECT MAX(CAST(SUBSTRING(userID, 3) AS UNSIGNED)) as max_num FROM useraccount";
    $result = mysqli_query($conn, $sql);
    
    if ($result && $row = mysqli_fetch_assoc($result)) {
        $next_num = ($row['max_num'] !== null) ? $row['max_num'] + 1 : 0;
    } else {
        $next_num = 0;
    }
    
    return "HB" . str_pad($next_num, 4, '0', STR_PAD_LEFT);
}

// Check if username or email already exists
function isUserExists($username, $email) {
    $conn = getDBConnection();
    $sql = "SELECT * FROM useraccount WHERE username = ? OR email = ?";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, "ss", $username, $email);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    
    return mysqli_num_rows($result) > 0;
}

// Get user by login (username or email)
function getUserByLogin($login) {
    $conn = getDBConnection();
    $is_email = filter_var($login, FILTER_VALIDATE_EMAIL);
    $field = $is_email ? "email" : "username";
    
    $sql = "SELECT * FROM useraccount WHERE $field = ?";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, "s", $login);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    
    return mysqli_fetch_assoc($result);
}

// Register new user
function registerUser($username, $email, $password) {
    $conn = getDBConnection();
    $userID = generateUserID();
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);
    
    $sql = "INSERT INTO useraccount (userID, username, email, password) VALUES (?, ?, ?, ?)";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, "ssss", $userID, $username, $email, $hashed_password);
    
    return mysqli_stmt_execute($stmt);
}
?>