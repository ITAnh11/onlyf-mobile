import { storage } from '../services/firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import ProfileService from './profile.service';

export class FirebaseService {
    //Trả về liên kết ảnh từ bài post

    static async uploadImage_post(uri: string): Promise<{ pathImage: string; urlPublicImage: string } | null> {
        
        try {
            const response = await fetch(uri);
            const blob = await response.blob();

            const ID = await ProfileService.getId();

            const pathImage = `onlyf/user_${ID}/post/${Date.now()}.jpg`;
            const imageRef = ref(storage, pathImage);

            await uploadBytes(imageRef, blob);
            const urlPublicImage = await getDownloadURL(imageRef);

            return { pathImage, urlPublicImage };
        } catch (error) {
            console.error('Error uploading image:', error);
            return null;
        }
    }

    //Trả về liên kết ảnh từ avatar
    static async uploadImage_avatar(uri: string): Promise<{ pathImage: string; urlPublicImage: string } | null> {
        try {
            const response = await fetch(uri);
            const blob = await response.blob();

            const pathImage = `onlyf/user_${ProfileService.getId()}/avartar/${Date.now()}.jpg`;
            const imageRef = ref(storage, pathImage);

            await uploadBytes(imageRef, blob);
            const urlPublicImage = await getDownloadURL(imageRef);

            return { pathImage, urlPublicImage };
        } catch (error) {
            console.error('Error uploading image:', error);
            return null;
        }
    }

}

