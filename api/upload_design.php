<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'config.php';

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed'
    ]);
    exit();
}

// Validate input
$title = $_POST['title'] ?? '';
$description = $_POST['description'] ?? '';
$price = $_POST['price'] ?? '';
$category = $_POST['category'] ?? '';
$architect_name = $_POST['architect_name'] ?? '';
$email = $_POST['email'] ?? '';

// Validate required fields
if (empty($title) || empty($description) || empty($price) || empty($category) || empty($architect_name) || empty($email)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Missing required fields'
    ]);
    exit();
}

// Validate email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Invalid email address'
    ]);
    exit();
}

// Validate price
if (!is_numeric($price) || $price <= 0) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Invalid price'
    ]);
    exit();
}

try {
    // Create uploads directory if it doesn't exist
    $uploads_dir = __DIR__ . '/../uploads';
    if (!is_dir($uploads_dir)) {
        mkdir($uploads_dir, 0755, true);
    }

    $images_dir = $uploads_dir . '/designs';
    $pdfs_dir = $uploads_dir . '/plans';

    if (!is_dir($images_dir)) {
        mkdir($images_dir, 0755, true);
    }
    if (!is_dir($pdfs_dir)) {
        mkdir($pdfs_dir, 0755, true);
    }

    // Handle image upload
    $image_filename = null;
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $image_file = $_FILES['image'];
        $allowed_image_types = ['image/jpeg', 'image/png', 'image/gif'];
        $max_image_size = 5 * 1024 * 1024; // 5MB

        if (!in_array($image_file['type'], $allowed_image_types)) {
            throw new Exception('Invalid image file type. Only JPG, PNG, and GIF are allowed.');
        }

        if ($image_file['size'] > $max_image_size) {
            throw new Exception('Image file size exceeds 5MB limit.');
        }

        $image_extension = pathinfo($image_file['name'], PATHINFO_EXTENSION);
        $image_filename = 'design_' . uniqid() . '.' . $image_extension;
        $image_path = $images_dir . '/' . $image_filename;

        if (!move_uploaded_file($image_file['tmp_name'], $image_path)) {
            throw new Exception('Failed to upload image file.');
        }
    } else {
        throw new Exception('Image file is required.');
    }

    // Handle PDF upload
    $pdf_filename = null;
    if (isset($_FILES['pdf_file']) && $_FILES['pdf_file']['error'] === UPLOAD_ERR_OK) {
        $pdf_file = $_FILES['pdf_file'];
        $allowed_pdf_type = 'application/pdf';
        $max_pdf_size = 50 * 1024 * 1024; // 50MB

        if ($pdf_file['type'] !== $allowed_pdf_type) {
            throw new Exception('Invalid PDF file type. Only PDF files are allowed.');
        }

        if ($pdf_file['size'] > $max_pdf_size) {
            throw new Exception('PDF file size exceeds 50MB limit.');
        }

        $pdf_filename = 'plans_' . uniqid() . '.pdf';
        $pdf_path = $pdfs_dir . '/' . $pdf_filename;

        if (!move_uploaded_file($pdf_file['tmp_name'], $pdf_path)) {
            throw new Exception('Failed to upload PDF file.');
        }
    } else {
        throw new Exception('PDF file is required.');
    }

    // Insert design into database
    $stmt = $pdo->prepare("
        INSERT INTO designs (
            title, description, price, category, 
            architect_name, email, image, pdf_file, 
            status, created_at
        ) VALUES (
            ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW()
        )
    ");

    $result = $stmt->execute([
        $title,
        $description,
        $price,
        $category,
        $architect_name,
        $email,
        $image_filename,
        $pdf_filename,
        'active'
    ]);

    if (!$result) {
        throw new Exception('Failed to save design to database.');
    }

    $design_id = $pdo->lastInsertId();

    // Send confirmation email to architect
    sendConfirmationEmail($architect_name, $email, $title, $price);

    echo json_encode([
        'success' => true,
        'message' => 'Design uploaded successfully! Your design is now visible on the marketplace.',
        'design_id' => $design_id,
        'image' => $image_filename,
        'pdf' => $pdf_filename
    ]);

} catch (Exception $e) {
    // Clean up uploaded files if database insert fails
    if (isset($image_path) && file_exists($image_path)) {
        unlink($image_path);
    }
    if (isset($pdf_path) && file_exists($pdf_path)) {
        unlink($pdf_path);
    }

    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}

function sendConfirmationEmail($name, $email, $title, $price) {
    $subject = "Design Upload Successful - NapoleonPlans 🎉";
    
    $message = "
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 5px; }
            .content { background: white; padding: 20px; margin-top: 20px; border-radius: 5px; }
            .footer { text-align: center; color: #666; margin-top: 20px; font-size: 12px; }
            .info-box { background: #f0f2ff; padding: 15px; border-radius: 5px; margin: 15px 0; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h1>Upload Successful! 🎉</h1>
            </div>
            <div class='content'>
                <p>Hello <strong>" . htmlspecialchars($name) . "</strong>,</p>
                
                <p>Your design has been successfully uploaded to NapoleonPlans marketplace!</p>
                
                <div class='info-box'>
                    <h3>Design Details:</h3>
                    <p><strong>Title:</strong> " . htmlspecialchars($title) . "</p>
                    <p><strong>Price:</strong> MWK " . number_format($price) . "</p>
                    <p><strong>Status:</strong> Active & Visible ✓</p>
                </div>
                
                <h3>What's Next?</h3>
                <ul>
                    <li>Your design is now visible to all marketplace visitors</li>
                    <li>Clients can view and purchase your design</li>
                    <li>You'll receive notifications for each purchase</li>
                    <li>Payments are processed instantly to your account</li>
                </ul>
                
                <p>You can view your uploaded designs and manage them from your dashboard.</p>
                
                <p>If you have any questions, contact us at <strong>support@napoleonplans.com</strong></p>
                
                <p>Happy selling!<br><strong>The NapoleonPlans Team</strong></p>
            </div>
            <div class='footer'>
                <p>© 2026 NapoleonPlans. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    ";

    $headers = "MIME-Version: 1.0\r\n";
    $headers .= "Content-type: text/html; charset=UTF-8\r\n";
    $headers .= "From: noreply@napoleonplans.com\r\n";
    $headers .= "Reply-To: support@napoleonplans.com\r\n";

    mail($email, $subject, $message, $headers);
}
?>
