<?php
// Contact form handler (requires a PHP host with mail() configured).

$sendTo       = 'natnial99@gmail.com';
$from         = 'Portfolio Contact Form <no-reply@natnial.com>';
$subjectLine  = 'New message from your portfolio';
$okMessage    = 'Thank you! Your message was sent and I will get back to you soon.';
$errorMessage = 'There was an error while sending your message. Please try again later or email natnial99@gmail.com.';

// remove line breaks so visitors cannot inject extra mail headers
function clean_line($value) {
    return trim(preg_replace('/[\r\n]+/', ' ', (string) $value));
}

try {
    $name    = clean_line($_POST['name'] ?? '');
    $email   = clean_line($_POST['email'] ?? '');
    $subject = clean_line($_POST['subject'] ?? '');
    $message = trim((string) ($_POST['message'] ?? ''));

    if ($name === '' || $message === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Invalid input');
    }

    $emailText  = "You have a new message from your portfolio contact form\n";
    $emailText .= "=====================================================\n";
    $emailText .= "Name: $name\nEmail: $email\nSubject: $subject\n\nMessage:\n$message\n";

    $headers = implode("\r\n", array(
        'Content-Type: text/plain; charset="UTF-8"',
        'From: ' . $from,
        'Reply-To: ' . $email,
    ));

    if (!mail($sendTo, $subjectLine, $emailText, $headers)) {
        throw new Exception('mail() failed');
    }

    $responseArray = array('type' => 'success', 'message' => $okMessage);
} catch (\Exception $e) {
    $responseArray = array('type' => 'danger', 'message' => $errorMessage);
}

if (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
    header('Content-Type: application/json');
    echo json_encode($responseArray);
} else {
    echo $responseArray['message'];
}
