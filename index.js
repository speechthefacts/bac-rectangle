const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const stripe = require('stripe')('sk_test_51OVBbFH0S2ts1MYetfq0WBHoT1IsqtvZyq89CxNLVnK1yDq2rwSbIxqqEcfQ37qoSNi4yKDC8tLHPttJXiRnkt2v004uFHTjW5');

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
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'eur',
                        product_data: {
                            name: 'Bac à fleurs',
                        },
                        unit_amount: req.body.montant,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: 'https://a-scoria.fr/success-payement',
            cancel_url: 'https://a-scoria.fr/cancel-payement',
        });

        res.json({ sessionId: session.id }); // Envoyer l'ID de la session
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Port d'écoute
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

