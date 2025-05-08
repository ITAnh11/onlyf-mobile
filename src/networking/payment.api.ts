import apiClient from "./apiclient";
import TokenService from "../services/token.service";

class PaymentApi {
    static async getPaymentLink(type: 'month' | 'year'): Promise<any> {
        try {
        const response = await apiClient.post(
            `/payment/create-checkout-session?type=${type}`,
            {},
            
        );
        return response.data;
        } catch (error) {
        console.error("Error getting payment link:", error);
        throw error;
        }
    }
}

export default PaymentApi;