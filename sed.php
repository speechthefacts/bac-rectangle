<?php
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

// Envoyez l'e-mail (vous devrez peut-être configurer les paramètres SMTP)
if (mail($to, $subject, $message)) {
    http_response_code(200); // Envoi de l'e-mail réussi
} else {
    http_response_code(500); // Erreur lors de l'envoi de l'e-mail
}