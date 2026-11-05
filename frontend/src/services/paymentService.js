import api from './api';
import { isDemoMode } from './demoStore';

export const paymentService = {
  createPaymentIntent: (orderId) => {
    if (isDemoMode) return Promise.resolve({ data: { clientSecret: '' } });
    return api.post('/payment/create-payment-intent', { orderId });
  },
};
