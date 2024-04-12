<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer-master/PHPMailer-master/PHPMailerAutoload.php';

// Récupérez les données envoyées par la requête AJAX
$data = json_decode(file_get_contents('php://input'), true);

// Récupérez les valeurs saisies par l'utilisateur
$longueur = $data['longueur'];
$largeur = $data['largeur'];
$hauteur = $data['hauteur'];
$quantity = $data['quantity'];
$montant = $data['montant'];
$avecPieds = $data['avecPieds'];
$avecRoulettes = $data['avecRoulettes'];

// Configurez les informations d'envoi de l'e-mail
$to = "capitainecedric63@gmail.com";
$subject = "Nouvelle commande de bac à fleurs";
$message = "Longueur : " . $longueur . " mm\n";
$message .= "Largeur : " . $largeur . " mm\n";
$message .= "Hauteur : " . $hauteur . " mm\n";
$message .= "Quantité : " . $quantity . "\n";
$message .= "Montant : " . $montant . " euros\n";
$message .= "Avec pieds : " . ($avecPieds ? "Oui" : "Non") . "\n";
$message .= "Avec roulettes : " . ($avecRoulettes ? "Oui" : "Non") . "\n";

// Créer une nouvelle instance de PHPMailer
$mail = new PHPMailer(true);

try {
    // Configuration du serveur SMTP
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com'; // Remplacez par l'hôte SMTP
    $mail->SMTPAuth = true;
    $mail->Username = 'capitainecedric63@gmail.com'; // Remplacez par votre adresse e-mail
    $mail->Password = 'Anthonys1'; // Remplacez par votre mot de passe
    $mail->SMTPSecure = 'tls';
    $mail->Port = 587;

    // Destinataire et expéditeur
    $mail->setFrom('capitainecedric63@gmail.com', 'A-scoria');
    $mail->addAddress($to);
    
    // Contenu du message
    $mail->isHTML(false);
    $mail->Subject = $subject;
    $mail->Body = $message;

    // Envoyer l'e-mail
    $mail->send();
    
    http_response_code(200); // Envoi de l'e-mail réussi
} catch (Exception $e) {
    echo 'Erreur lors de l\'envoi de l\'e-mail : ' . $mail->ErrorInfo;
    http_response_code(500); // Erreur lors de l'envoi de l'e-mail
}
?>
