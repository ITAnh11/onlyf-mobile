import apiClient from "./apiclient";
import TokenService from "../services/token.service";

class sharePostLink {
    static async getPostLink(postId: string | number, ownerId : string | number): Promise<any> {
        try {
        const response = await apiClient.get(
            `/post/generate-share-link?postId=${postId}&ownerId=${ownerId}`,
            {},
            
        );
        return response.data;
        } catch (error) {
        console.error("Error getting share post link:", error);
        throw error;
        }
    }
}

export default sharePostLink;