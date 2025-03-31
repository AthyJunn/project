<?php
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
                error_log("Error number: " . mysqli_connect_errno());
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
            error_log("Error Details: Host=$host, User=$user, Database=$db");
            throw new Exception("Database connection failed. Please check error logs.");
        }
    }
    
    return $con;
}

// Check connection and get a reference
try {
    $con = getDBConnection();
} catch (Exception $e) {
    error_log("Initial connection test failed: " . $e->getMessage());
    // Don't expose detailed error messages to the client
    die("Database connection failed. Please try again later.");
}

// Generate formatted user ID (HB0000, HB0001, etc.)
function generateUserID() {
    $con = getDBConnection();
    $sql = "SELECT MAX(CAST(SUBSTRING(userID, 3) AS UNSIGNED)) as max_num FROM useraccount";
    $result = mysqli_query($con, $sql);
    
    if ($result && $row = mysqli_fetch_assoc($result)) {
        $next_num = ($row['max_num'] !== null) ? $row['max_num'] + 1 : 0;
    } else {
        $next_num = 0;
    }
    
    return "HB" . str_pad($next_num, 4, '0', STR_PAD_LEFT);
}

// Check if username or email already exists
function isUserExists($username, $email) {
    $con = getDBConnection();
    $sql = "SELECT * FROM useraccount WHERE username = ? OR email = ?";
    $stmt = mysqli_prepare($con, $sql);
    
    if (!$stmt) {
        error_log("Prepare failed: " . mysqli_error($con));
        return true; // Return true to prevent registration on error
    }
    
    mysqli_stmt_bind_param($stmt, "ss", $username, $email);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    
    return mysqli_num_rows($result) > 0;
}

// Get user by login (username or email)
function getUserByLogin($login) {
    $con = getDBConnection();
    $is_email = filter_var($login, FILTER_VALIDATE_EMAIL);
    $field = $is_email ? "email" : "username";
    
    $sql = "SELECT * FROM useraccount WHERE $field = ?";
    $stmt = mysqli_prepare($con, $sql);
    
    if (!$stmt) {
        error_log("Prepare failed: " . mysqli_error($con));
        return null;
    }
    
    mysqli_stmt_bind_param($stmt, "s", $login);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    
    return mysqli_fetch_assoc($result);
}

// Register new user
function registerUser($username, $email, $password) {
    $con = getDBConnection();
    $userID = generateUserID();
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);
    
    $sql = "INSERT INTO useraccount (userID, username, email, password) VALUES (?, ?, ?, ?)";
    $stmt = mysqli_prepare($con, $sql);
    
    if (!$stmt) {
        error_log("Prepare failed: " . mysqli_error($con));
        return false;
    }
    
    mysqli_stmt_bind_param($stmt, "ssss", $userID, $username, $email, $hashed_password);
    $success = mysqli_stmt_execute($stmt);
    
    if (!$success) {
        error_log("Registration failed: " . mysqli_error($con));
    }
    
    return $success;
}

// Close database connection when script ends
function closeDBConnection() {
    global $con;
    if ($con) {
        mysqli_close($con);
    }
}

// Register shutdown function to ensure connection is closed
register_shutdown_function('closeDBConnection');
?>