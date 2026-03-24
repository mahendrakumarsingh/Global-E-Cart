// For possible future extensions (webhooks, verify payment) - placeholder
exports.webhook = (req, res) => {
  res.status(200).json({ message: 'Stripe webhook placeholder' });
};
