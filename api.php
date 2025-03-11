<?php
require_once 'db_config.php';
header('Content-Type: application/json');

// Get all ninjas
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $sql = "SELECT * FROM ninjas";
    $result = $conn->query($sql);
    
    $ninjas = [];
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $ninjas[] = $row;
        }
    }
    
    echo json_encode($ninjas);
}

// Add a new ninja
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    // Check password
    if (!isset($data['password']) || $data['password'] !== 'naruto123') {
        echo json_encode(['success' => false, 'message' => 'Unauthorized access']);
        exit;
    }
    
    $ninja = $data['ninja'];
    
    $stmt = $conn->prepare("INSERT INTO ninjas (name, village, rank, age, height, hair, eyes, abilities, bounty, dangerLevel, imageUrl) 
                           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    
    $stmt->bind_param("sssssssssss", 
        $ninja['name'], 
        $ninja['village'], 
        $ninja['rank'], 
        $ninja['age'], 
        $ninja['height'], 
        $ninja['hair'],
        $ninja['eyes'],
        $ninja['abilities'],
        $ninja['bounty'],
        $ninja['dangerLevel'],
        $ninja['imageUrl']
    );
    
    if ($stmt->execute()) {
        $ninja['id'] = $stmt->insert_id;
        echo json_encode(['success' => true, 'ninja' => $ninja]);
    } else {
        echo json_encode(['success' => false, 'message' => $stmt->error]);
    }
    
    $stmt->close();
}

// Delete a ninja
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    parse_str(file_get_contents('php://input'), $data);
    
    // Check password
    if (!isset($data['password']) || $data['password'] !== 'naruto123') {
        echo json_encode(['success' => false, 'message' => 'Unauthorized access']);
        exit;
    }
    
    $id = $data['id'];
    
    $stmt = $conn->prepare("DELETE FROM ninjas WHERE id = ?");
    $stmt->bind_param("i", $id);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => $stmt->error]);
    }
    
    $stmt->close();
}

$conn->close();
?>