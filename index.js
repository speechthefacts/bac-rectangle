const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');

const dotenv = require("dotenv");
dotenv.config();

const stripe = require('stripe')('sk_test_51OVBbFH0S2ts1MYe41bcBxWgthbhitxF0cr1gxtlGjfEF48HIUMC3RtrtTAvQcuaBxdAIWe0fSsRxMtA29sy16hS00aiDfmOJ1');

// Middleware
app.use(bodyParser.json());

// Routage vues
app.get('/bac_rectangle', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/bac_rectangle.html'));
});

app.get('/bac_rond', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/bac_rond.html'));
});

app.get('/brise_vue', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/brise_vue.html'));
});


const defaultPaymentParameters = {
    payment_method_types: ['card'],
    mode: 'payment',
    success_url: 'https://a-scoria.fr/success-payement', // URL de redirection après un paiement réussi
    cancel_url: 'https://a-scoria.fr/cancel-payement', // URL de redirection après l'annulation du paiement
    shipping_address_collection: {
        allowed_countries: ['FR'], // Définissez les pays autorisés pour l'adresse de livraison
    }
};
// Route pour le traitement des paiements avec Stripe
app.post('/create-checkout-session', async (req, res) => {
    try {
        defaultPaymentParameters["shipping"] = {
            address: {
                line1: req.body.adresseLivraison, // Utilisez l'adresse de livraison fournie dans la requête
            }
        };

        if (req.body.type == "bac_rectangle") {
            defaultPaymentParameters["line_items"] = [
                {
                    price_data: {
                        currency: 'eur',
                        product_data: {
                            name: 'Bacs à fleurs rectangles/carrés',
                        },
                        unit_amount: req.body.montant,
                    },
                    quantity: 1,
                }
            ];
            defaultPaymentParameters["metadata"] = { // Ajoutez les métadonnées ici
                longueur: req.body.longueur,
                largeur: req.body.largeur,
                hauteur: req.body.hauteur,
                quantity: req.body.quantity,
                avecPieds: req.body.avecPieds,
                avecRoulettes: req.body.avecRoulettes,
                livraisonDomicile : req.body.livraisonDomicile,
                retraitAtelier : req.body.retraitAtelier,
            };
        } else if (req.body.type == "bac_rond") {
            defaultPaymentParameters["line_items"] = [
                {
                    price_data: {
                        currency: 'eur',
                        product_data: {
                            name: 'Bacs à fleurs ronds', // Modifier le nom du produit pour les bacs ronds
                        },
                        unit_amount: req.body.montant,
                    },
                    quantity: 1,
                }
            ];
            defaultPaymentParameters["metadata"] = { // Ajoutez les métadonnées ici
                diametre: req.body.diametre, // Récupération du diamètre depuis le corps de la requête
                hauteur: req.body.hauteur, // Récupération de la hauteur depuis le corps de la requête
                quantity: req.body.quantity,    
                avecPieds:req.body.avecPieds,
                avecRoulettes: req.body.avecRoulettes,
                livraison : req.body.livraison,
                retrait : req.body.retrait,
            };
        } else if (req.body.type == "brise_vue") {
            defaultPaymentParameters["line_items"] = [
                {
                    price_data: {
                        currency: 'eur',
                        product_data: {
                            name: 'Brise-vues', // Nom du produit pour les brise-vues
                        },
                        unit_amount: req.body.montant,
                    },
                    quantity: 1,
                }
            ];
            defaultPaymentParameters["metadata"] = { // Ajoutez les métadonnées ici
                longueur: req.body.longueur, // Récupération de la longueur depuis le corps de la requête
                hauteur: req.body.hauteur, // Récupération de la hauteur depuis le corps de la requête
                motif: req.body.motif, // Récupération du motif depuis le corps de la requête
                livraisonDomicile : req.body.livraisonDomicile,
                retraitAtelier : req.body.retraitAtelier, 
                quantity: req.body.quantity,  
            };
        }

        const session = await stripe.checkout.sessions.create(defaultPaymentParameters);
        res.json({ id: session.id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Port d'écoute
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

