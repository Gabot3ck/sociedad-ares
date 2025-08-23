<?php
// reCAPTCHA v3
define('SECRET_KEY', 'VALUE');          // clave secreta del lado servidor

// SMTP (cPanel)
define('SMTP_HOST', 'MAIL_SMTP_HOST'); //Correo SMTP
define('SMTP_PORT', 587);                      // 587 + STARTTLS recomendado
define('SMTP_USER', 'MAIL_SMTP_USER'); // usuario SMTP
define('SMTP_PASS', 'MAIL_SMTP_PASS');    // cámbiala si la expusiste en algún lado
define('SMTP_FROM', 'MAIL_SMTP_FROM'); // opcional; mismo dominio/usuario


// Destinatario
define('TO_EMAIL', 'MAIL_TO_EMAIL');