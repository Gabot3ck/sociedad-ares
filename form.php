<?php

ini_set('display_errors', 0);
error_reporting(E_ALL);

require_once __DIR__ . '/keys.php';
require __DIR__.'/libs/vendor/autoload.php'; // PHPMailer cargado por Composer

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;


if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['recaptcha_response'])){

  // Construir solicitud POST
  $recaptcha_url = 'https://www.google.com/recaptcha/api/siteverify';
  $recaptcha_secret = SECRET_KEY;
  $recaptcha_response = $_POST['recaptcha_response'];

  // Hacer la solicitud
  $recaptcha = file_get_contents($recaptcha_url . '?secret=' . $recaptcha_secret . '&response=' . $recaptcha_response);
  $recaptcha = json_decode($recaptcha);

  if ($recaptcha->score >= 0.5) {

    // Sanitizar entradas ---
    $nombre   = htmlspecialchars(trim($_POST["contacto_nombre"] ?? ""));
    $email    = filter_var($_POST["contacto_email"] ?? "", FILTER_SANITIZE_EMAIL);
    $asunto   = htmlspecialchars(trim($_POST["contacto_asunto"] ?? ""));
    $mensaje  = htmlspecialchars(trim($_POST["contacto_mensaje"] ?? ""));

    // -- Preparar correo con PHPMailer ---
    $mail = new PHPMailer(true);
    
    try {
      // Config SMTP
      $mail->isSMTP();
      $mail->Host       = SMTP_HOST;
      $mail->Port       = SMTP_PORT;
      $mail->SMTPAuth   = true;
      $mail->Username   = SMTP_USER;
      $mail->Password   = SMTP_PASS;
      $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS; // 587 = TLS
      $mail->SMTPAutoTLS = true;
      $mail->Timeout    = 10;

      // Remitente y destinatario
      $mail->setFrom(SMTP_USER, 'Formulario Web - Sociedad Ares');
      $mail->addAddress(TO_EMAIL);
      $mail->addReplyTo($email, $nombre);

      // Contenido
      $mail->isHTML(true);
      $mail->Subject = "[Formulario Web] " . $asunto;
      $mail->Body = '
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; background-color:#f7f7f7; padding:20px; }
            .container { max-width:600px; margin:auto; background:#ffffff; border-radius:8px; 
                        box-shadow:0 2px 6px rgba(0,0,0,0.1); padding:20px; }
            h2 { color:#333333; }
            .info { margin:15px 0; }
            .label { font-weight:bold; color:#555; }
            .value { margin-bottom:10px; }
            .footer { margin-top:20px; font-size:12px; color:#999; border-top:1px solid #eee; padding-top:10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>Nuevo mensaje desde el formulario de contacto</h2>
            <div class="info">
              <p class="label">Nombre:</p>
              <p class="value">'.htmlspecialchars($nombre).'</p>
            </div>
            <div class="info">
              <p class="label">Email:</p>
              <p class="value">'.htmlspecialchars($email).'</p>
            </div>
            <div class="info">
              <p class="label">Asunto:</p>
              <p class="value">'.htmlspecialchars($asunto).'</p>
            </div>
            <div class="info">
              <p class="label">Mensaje:</p>
              <p class="value">'.nl2br(htmlspecialchars($mensaje)).'</p>
            </div>
            <div class="footer">
              Este mensaje fue enviado desde el sitio web.<br>
            </div>
          </div>
        </body>
        </html>';

      $mail->send();
      header("Location: thankyou.html");
      exit;
    } catch (Exception $e) {
      echo "ERROR: ".$mail->ErrorInfo;
    }
  } else {
    echo "ERROR: Método no permitido.";
  }
} else {
  echo "ERROR: Método no permitido.";
}
