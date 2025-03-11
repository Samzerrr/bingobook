<?php
$servername = "dpg-cv7t1vhc1ekc73d213gg-a";
$username = "bingo_book_fsc_user";
$password = "pbHgBTq6BvyMbiCSSDJDVPWVnqzqNwRf";
$dbname = "bingo_book_fsc";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
$conn->set_charset("utf8mb4");
?>

