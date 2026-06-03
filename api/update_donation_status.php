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

$input = json_decode(file_get_contents('php://input'), true);

// Validate input
if (!isset($input['donation_id']) || !isset($input['status']) || !isset($input['payment_id'])) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Missing required fields: donation_id, status, payment_id'
    ]);
    exit();
}

try {
    // Update donation status
    $stmt = $pdo->prepare("
        UPDATE donations 
        SET status = ?, payment_id = ?, paychange_response = ?, updated_at = NOW()
        WHERE id = ?
    ");

    $result = $stmt->execute([
        $input['status'],
        $input['payment_id'],
        isset($input['paychange_response']) ? json_encode($input['paychange_response']) : null,
        $input['donation_id']
    ]);

    if (!$result) {
        throw new Exception('Failed to update donation record');
    }

    // Fetch donation details for email
    $stmt2 = $pdo->prepare("SELECT * FROM donations WHERE id = ?");
    $stmt2->execute([$input['donation_id']]);
    $donation = $stmt2->fetch(PDO::FETCH_ASSOC);

    if (!$donation) {
        throw new Exception('Donation record not found');
    }

    // Send confirmation email only if status is completed
    if ($input['status'] === 'completed') {
        sendConfirmationEmail($donation);
    }

    echo json_encode([
        'success' => true,
        'message' => 'Donation status updated successfully',
        'donation_id' => $input['donation_id'],
        'status' => $input['status']
    ]);

} catch(Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}

function sendConfirmationEmail($donation) {
    $donorName = $donation['full_name'] ?? $donation['name'] ?? 'Valued Donor';
    $amount = $donation['amount'] ?? 0;
    $email = $donation['email'] ?? '';
    $paymentId = $donation['payment_id'] ?? 'N/A';

    if (empty($email)) {
        error_log('Cannot send email: No email address found for donation ID ' . $donation['id']);
        return;
    }

    $subject = "Thank You for Your Donation - NapoleonPlans 💝";
    
    $message = "
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9; }
            .header { background: #2c3e50; color: white; padding: 20px; text-align: center; border-radius: 5px; }
            .content { background: white; padding: 20px; margin-top: 20px; border-radius: 5px; }
            .footer { text-align: center; color: #666; margin-top: 20px; font-size: 12px; }
            .amount { font-size: 24px; font-weight: bold; color: #27ae60; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h1>Thank You for Your Generosity! 💝</h1>
            </div>
            <div class='content'>
                <p>Dear <strong>" . htmlspecialchars($donorName) . "</strong>,</p>
                
                <p>We are deeply grateful for your donation to NapoleonPlans!</p>
                
                <p style='text-align: center; margin: 30px 0;'>
                    <span class='amount'>MWK " . number_format($amount) . "</span>
                </p>
                
                <h3>Donation Details:</h3>
                <ul style='background: #f0f0f0; padding: 15px; border-radius: 5px;'>
                    <li><strong>Amount:</strong> MWK " . number_format($amount) . "</li>
                    <li><strong>Transaction ID:</strong> " . htmlspecialchars($paymentId) . "</li>
                    <li><strong>Date:</strong> " . date('F j, Y H:i') . "</li>
                    <li><strong>Status:</strong> Completed ✓</li>
                </ul>
                
                <p>Your support directly helps us:</p>
                <ul>
                    <li>Build better architecture marketplace features</li>
                    <li>Support architects and designers across Malawi and Africa</li>
                    <li>Improve security and payment processing</li>
                    <li>Expand to more countries and regions</li>
                </ul>
                
                <p>If you have any questions about your donation, feel free to reach out to us at <strong>support@napoleonplans.com</strong></p>
                
                <p>With gratitude,<br><strong>The NapoleonPlans Team</strong></p>
            </div>
            <div class='footer'>
                <p>© 2026 NapoleonPlans. All rights reserved.</p>
                <p>This is an automated email. Please do not reply directly.</p>
            </div>
        </div>
    </body>
    </html>
    ";

    $headers = "MIME-Version: 1.0\r\n";
    $headers .= "Content-type: text/html; charset=UTF-8\r\n";
    $headers .= "From: noreply@napoleonplans.com\r\n";
    $headers .= "Reply-To: support@napoleonplans.com\r\n";

    $success = mail($email, $subject, $message, $headers);
    
    if (!$success) {
        error_log('Failed to send confirmation email to: ' . $email);
    }
}
?>
