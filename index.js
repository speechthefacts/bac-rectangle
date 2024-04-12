const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const stripe = require('stripe')('sk_test_51OVBbFH0S2ts1MYe41bcBxWgthbhitxF0cr1gxtlGjfEF48HIUMC3RtrtTAvQcuaBxdAIWe0fSsRxMtA29sy16hS00aiDfmOJ1');
const nodemailer = require('nodemailer');

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

// Route pour servir votre page HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'test.html'));
});

// Configuration du transporteur SMTP pour l'envoi d'e-mails
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'capitainecedric63@gmail.com', // Remplacez par votre adresse e-mail
        pass: 'Anthonys1', // Remplacez par votre mot de passe
    },
});

// Route pour le traitement des paiements avec Stripe et l'envoi d'e-mail
app.post('/create-checkout-session', async (req, res) => {
    try {
        // Logique pour créer une session de paiement avec Stripe
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'eur',
                        product_data: {
                            name: 'Bacs à fleurs rectangles/carrés',
                        },
                        unit_amount: req.body.montant,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: 'https://a-scoria.fr/success-payement', // URL de redirection après un paiement réussi
            cancel_url: 'https://a-scoria.fr/cancel-payement', // URL de redirection après l'annulation du paiement
            shipping_address_collection: {
                allowed_countries: ['FR'], // Définissez les pays autorisés pour l'adresse de livraison
            },
            shipping: {
                address: {
                    line1: req.body.adresseLivraison, // Utilisez l'adresse de livraison fournie dans la requête
                },
            },
        });

        // Logique pour envoyer un e-mail
        const mailOptions = {
            from: 'capitainecedric63@gmail.com', // Votre adresse e-mail
            to: 'capitainecedric63@gmail.com', // L'adresse e-mail de votre destinataire
            subject: 'Nouvelle commande de bac à fleurs',
            text: `Longueur: ${req.body.longueur} mm\nLargeur: ${req.body.largeur} mm\nHauteur: ${req.body.hauteur} mm\nQuantité: ${req.body.quantity}\nMontant: ${req.body.montant} euros\nAvec pieds: ${req.body.avecPieds ? "Oui" : "Non"}\nAvec roulettes: ${req.body.avecRoulettes ? "Oui" : "Non"}`,
        };

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.error('Erreur lors de l\'envoi de l\'e-mail:', error);
                res.status(500).json({ error: 'Erreur lors de l\'envoi de l\'e-mail' });
            } else {
                console.log('E-mail envoyé: ' + info.response);
                res.json({ id: session.id });
            }
        });
    } catch (err) {
        console.error('Erreur lors du traitement de la demande:', err.message);
        res.status(500).json({ error: 'Erreur lors du traitement de la demande' });
    }
});

// Port d'écoute
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

