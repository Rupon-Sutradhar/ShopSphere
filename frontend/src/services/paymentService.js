import api from './api';

export const paymentService = {
  createPaymentIntent: (orderId) => {
    return api.post('/payment/create-payment-intent', { orderId });
  },
};
