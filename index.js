const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const stripe = require('stripe')('sk_test_51OVBbFH0S2ts1MYetfq0WBHoT1IsqtvZyq89CxNLVnK1yDq2rwSbIxqqEcfQ37qoSNi4yKDC8tLHPttJXiRnkt2v004uFHTjW5');
const ElasticEmail = require('elastic-email');

// Initialiser Elastic Email avec la clé API
const elasticemail = new ElasticEmail('E18860258D539A9C5890BAD766D4FB74481D6E3AAAA2A5ABAA56A57C864660B7503305DC13631A0E40AB69EE38073A21');

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

// Route pour servir votre page HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'test.html'));
});

// Route pour le traitement des paiements avec Stripe
app.post('/create-checkout-session', async (req, res) => {
    try {
        // Votre logique de création de session de paiement avec Stripe
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Route pour l'envoi d'e-mails
app.post('/send-email', async (req, res) => {
    try {
        const { longueur, largeur, hauteur, quantity, avecPieds, avecRoulettes, prix } = req.body;

        const message = `
            Informations de commande :
            Longueur: ${longueur} mm
            Largeur: ${largeur} mm
            Hauteur: ${hauteur} mm
            Quantité: ${quantity}
            Avec pieds: ${avecPieds ? 'Oui' : 'Non'}
            Avec roulettes: ${avecRoulettes ? 'Oui' : 'Non'}
            Prix: ${prix} euros
        `;

        const options = {
            from: 'thingsarereal57@gmail.com',
            to: 'capitainecedric63@gmail.com',
            subject: 'Nouvelle commande',
            bodyText: message,
        };

        await elasticemail.send(options);
        res.status(200).send('E-mail envoyé avec succès !');
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'e-mail:', error);
        res.status(500).send('Une erreur est survenue lors de l\'envoi de l\'e-mail.');
    }
});

// Port d'écoute
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

