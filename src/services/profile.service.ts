import * as SecureStore from 'expo-secure-store';

class ProfileService {
  private static ID_KEY = 'id';
  private static NAME_KEY = 'name';
  private static EMAIL_KEY = 'email';
  private static URL_PUBLIC_AVATAR_KEY = 'avatar';
  private static PHONE_KEY = 'phone';
  private static DOB_KEY = 'dob';
  private static USERNAME_KEY = 'username';

  static async saveProfile(data:any): Promise<void> {
    await SecureStore.setItemAsync(this.ID_KEY, data.user.id.toString());
    await SecureStore.setItemAsync(this.NAME_KEY, data.name);   
    await SecureStore.setItemAsync(this.EMAIL_KEY, data.user.email);
    await SecureStore.setItemAsync(this.URL_PUBLIC_AVATAR_KEY, data.avatar);
    await SecureStore.setItemAsync(this.PHONE_KEY, data.phone);
    await SecureStore.setItemAsync(this.DOB_KEY, data.dob);
    await SecureStore.setItemAsync(this.USERNAME_KEY, data.username);
    }

    static async getProfile(): Promise<any> {
    const id = await SecureStore.getItemAsync(this.ID_KEY);
    const name = await SecureStore.getItemAsync(this.NAME_KEY);
    const email = await SecureStore.getItemAsync(this.EMAIL_KEY);
    const avatar = await SecureStore.getItemAsync(this.URL_PUBLIC_AVATAR_KEY);
    const phone = await SecureStore.getItemAsync(this.PHONE_KEY);
    const dob = await SecureStore.getItemAsync(this.DOB_KEY);
    const username = await SecureStore.getItemAsync(this.USERNAME_KEY);
    if (!id || !name || !email || !avatar || !phone || !dob || !username) {
      return null;
    }

    return {
        id: id ? parseInt(id) : null,
        name: name,
        email: email,
        avatar: avatar,
        phone: phone,
        dob: dob,
        username: username,
        }
    }

    static async removeProfile(): Promise<void> {
        await SecureStore.deleteItemAsync(this.ID_KEY);
        await SecureStore.deleteItemAsync(this.NAME_KEY);
        await SecureStore.deleteItemAsync(this.EMAIL_KEY);
        await SecureStore.deleteItemAsync(this.URL_PUBLIC_AVATAR_KEY);
        await SecureStore.deleteItemAsync(this.PHONE_KEY);
        await SecureStore.deleteItemAsync(this.DOB_KEY);
        await SecureStore.deleteItemAsync(this.USERNAME_KEY);
        }
    
    static async getId(): Promise<number | null> {
        const id = await SecureStore.getItemAsync(this.ID_KEY);
        return id ? parseInt(id) : null;
    }

    static async getName(): Promise<string | null> {
        return await SecureStore.getItemAsync(this.NAME_KEY);
    }

    static async getEmail(): Promise<string | null> {
        return await SecureStore.getItemAsync(this.EMAIL_KEY);
    }

    static async getAvatar(): Promise<string | null> {
        return await SecureStore.getItemAsync(this.URL_PUBLIC_AVATAR_KEY);
    }

    static async getPhone(): Promise<string | null> {
        return await SecureStore.getItemAsync(this.PHONE_KEY);
    }

    static async getDob(): Promise<string | null> {
        return await SecureStore.getItemAsync(this.DOB_KEY);
    }

    static async getUsername(): Promise<string | null> {
        return await SecureStore.getItemAsync(this.USERNAME_KEY);
    }

    static async updateProfile(data:any): Promise<void> {
        if (data.name) {
            await SecureStore.setItemAsync(this.NAME_KEY, data.name);
        }
        if (data.email) {
            await SecureStore.setItemAsync(this.EMAIL_KEY, data.email);
        }
        if (data.avatar) {
            await SecureStore.setItemAsync(this.URL_PUBLIC_AVATAR_KEY, data.avatar);
        }
        if (data.phone) {
            await SecureStore.setItemAsync(this.PHONE_KEY, data.phone);
        }
        if (data.dob) {
            await SecureStore.setItemAsync(this.DOB_KEY, data.dob);
        }
        if (data.username) {
            await SecureStore.setItemAsync(this.USERNAME_KEY, data.username);
        }
    }
}
export default ProfileService;