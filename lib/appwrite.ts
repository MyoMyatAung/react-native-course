import { CreatePost, Post, User } from '@/constants/models';
import { Account, Avatars, Client, Databases, ID, ImageGravity, Query, Storage } from 'react-native-appwrite';

export const appwriteConfig = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.villa.aora',
    projectId: '66617124001d581a646f',
    databaseId: '666172ed001a61acd72a',
    userCollectionId: '66617339002166b6de7a',
    videoCollectionId: '6661736f00304b4df42f',
    storageId: '666175760032b6752e60'
}

// Init your React Native SDK
const client = new Client();

client
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId)
    .setPlatform(appwriteConfig.platform);

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);

export async function createUser(email: string, username: string, password: string): Promise<User> {
    try {
        const newAccount = await account.create(ID.unique(), email, password, username);
        if (!newAccount) {
            throw new Error("Error in registering account!");
        }
        const avatarUrl = avatars.getInitials(username);
        await signIn(email, password);
        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            {
                accountId: newAccount.$id,
                email: email,
                username,
                avatar: avatarUrl
            });

        return { ...newUser, accountId: newUser.accountId, email: newUser.email, avatar: newUser.avatar, username: newUser.username };
    } catch (error) {
        console.log(error);
        throw error
    }
}

export async function signIn(email: string, password: string) {
    try {
        const session = await account.createEmailPasswordSession(email, password);
        return session;
    } catch (error) {
        throw error;
    }
}

export async function getCurrentUser() {
    try {
        const currentAccount = await account.get();
        if (!currentAccount) {
            throw new Error('No User')
        }
        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]);

        if (!currentUser) {
            throw new Error('No User')
        }

        return currentUser.documents[0];
    } catch (error) {
        throw error;
    }
}

export const getAllPosts = async (): Promise<Array<Post>> => {
    try {
        const posts = await databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.videoCollectionId, [Query.orderDesc('$createdAt')]);
        return posts.documents.map((d) => {
            return {
                $collectionId: d.$collectionId,
                $createdAt: d.$createdAt,
                $databaseId: d.$databaseId,
                $id: d.$id,
                $permissions: d.$permissions,
                $updatedAt: d.$updatedAt,
                creator: d.creator,
                prompt: d.prompt,
                thumbnail: d.thumbnail,
                title: d.title,
                video: d.video
            }
        });
    } catch (error) {
        throw error;
    }
}

export const getLatestPosts = async (): Promise<Array<Post>> => {
    try {
        const posts = await databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.videoCollectionId, [Query.orderDesc('$createdAt'), Query.limit(7)]);
        return posts.documents.map((d) => {
            return {
                $collectionId: d.$collectionId,
                $createdAt: d.$createdAt,
                $databaseId: d.$databaseId,
                $id: d.$id,
                $permissions: d.$permissions,
                $updatedAt: d.$updatedAt,
                creator: d.creator,
                prompt: d.prompt,
                thumbnail: d.thumbnail,
                title: d.title,
                video: d.video
            }
        });
    } catch (error) {
        throw error;
    }
}

export const searchPosts = async (query: string): Promise<Array<Post>> => {
    try {
        const posts = await databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.videoCollectionId, [Query.search('title', query), Query.orderDesc('$createdAt')]);
        return posts.documents.map((d) => {
            return {
                $collectionId: d.$collectionId,
                $createdAt: d.$createdAt,
                $databaseId: d.$databaseId,
                $id: d.$id,
                $permissions: d.$permissions,
                $updatedAt: d.$updatedAt,
                creator: d.creator,
                prompt: d.prompt,
                thumbnail: d.thumbnail,
                title: d.title,
                video: d.video
            }
        });
    } catch (error) {
        throw error;
    }
}

export const getUserPosts = async (userId: string): Promise<Array<Post>> => {
    try {
        const posts = await databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.videoCollectionId, [Query.equal('creator', userId), Query.orderDesc('$createdAt')]);
        return posts.documents.map((d) => {
            return {
                $collectionId: d.$collectionId,
                $createdAt: d.$createdAt,
                $databaseId: d.$databaseId,
                $id: d.$id,
                $permissions: d.$permissions,
                $updatedAt: d.$updatedAt,
                creator: d.creator,
                prompt: d.prompt,
                thumbnail: d.thumbnail,
                title: d.title,
                video: d.video
            }
        });
    } catch (error) {
        throw error;
    }
}

export const signOut = async () => {
    try {
        const sessons = await account.deleteSession('current');
        return sessons;
    } catch (error) {
        throw error;
    }
}

export const getFilePreview = async (id: string, type: string) => {
    let fileUrl;
    try {
        if (type === 'video') {
            fileUrl = storage.getFileView(appwriteConfig.storageId, id);
        } else if (type === 'image') {
            fileUrl = storage.getFilePreview(appwriteConfig.storageId, id, 2000, 2000, ImageGravity.Top, 100);
        } else {
            throw new Error('Invalid file type')
        }

        if (!fileUrl) throw new Error;
        return fileUrl;
    } catch (error) {
        throw error;
    }
}

export const uploadFile = async (file: any, type: string) => {
    if (!file) return;

    const { mimeType, ...rest } = file;
    const asset = { type: mimeType, ...rest };

    try {
        const uploadedFile = await storage.createFile(appwriteConfig.storageId, ID.unique(), asset);
        const fileUrl = await getFilePreview(uploadedFile.$id, type);
        return fileUrl;
    } catch (error) {
        throw error;
    }
}

export const createVideo = async (form: CreatePost, userId: string) => {
    try {
        const [thumbnailUrl, videoUrl] = await Promise.all([
            uploadFile(form.thumbnail, 'image'),
            uploadFile(form.video, 'video'),
        ]);
        const newPost = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.videoCollectionId,
            ID.unique(),
            {
                title: form.title,
                prompt: form.prompt,
                video: videoUrl,
                thumbnail: thumbnailUrl,
                creator: userId
            });
        return newPost;
    } catch (error) {
        throw error
    }
}