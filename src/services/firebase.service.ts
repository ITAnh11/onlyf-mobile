import { storage } from '../services/firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import TokenService from './token.service';

class FirebaseService {
    //Trả về liên kết ảnh
    static  async uploadImage(uri: string): Promise<string | null> {
        try {
            const response = await fetch(uri);
            const blob = await response.blob();

            const filename = `onlyf/user_3/post/${Date.now()}.jpg`;
            const imageRef = ref(storage, filename);

            await uploadBytes(imageRef, blob);
            const downloadURL = await getDownloadURL(imageRef);

            return downloadURL;
        } catch (error) {
            console.error('Error uploading image:', error);
            return null;
        }
    }
}

export default new FirebaseService();