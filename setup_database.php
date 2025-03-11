<?php
require_once 'db_config.php';

// SQL to create table
$sql = "CREATE TABLE IF NOT EXISTS ninjas (
id INT(11) AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(255) NOT NULL,
village VARCHAR(50) NOT NULL,
rank VARCHAR(50) NOT NULL,
age INT(3),
height VARCHAR(50),
hair VARCHAR(100),
eyes VARCHAR(100),
abilities TEXT,
bounty VARCHAR(100),
dangerLevel INT(1) NOT NULL,
imageUrl TEXT
)";

if ($conn->query($sql) === TRUE) {
    echo "Table ninjas created successfully";
} else {
    echo "Error creating table: " . $conn->error;
}

$conn->close();
?>

