import apiClient from "./apiclient";
import TokenService from "../services/token.service";
import ProfileService from "../services/profile.service";

class ProfileApi {   
    static async getProfile(): Promise<any> {
        const accessToken = await TokenService.getAccessToken();
        if (!accessToken) {
            throw new Error("No access token found");
        }
        else 
        try {
            const response = await apiClient.get("/userprofile/get-profile",{
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            const data = await response.data;
            await ProfileService.saveProfile(data);
        } catch (error) {
            console.error("Error loading profile:", error);
            throw error;
        } }

}

export default ProfileApi;