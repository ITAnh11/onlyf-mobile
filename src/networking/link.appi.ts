import apiClient from "./apiclient";
import TokenService from "../services/token.service";

class LinkApi {
    static async getLink(): Promise<any> {
        try {
        const response = await apiClient.get(
            `/user/generate-invite-link`,
            {},
            
        );
        return response.data;
        } catch (error) {
        console.error("Error getting link:", error);
        throw error;
        }
    }
}

export default LinkApi;