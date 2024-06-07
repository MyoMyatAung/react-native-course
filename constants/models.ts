export interface Post extends Response {
    creator: User;
    prompt: string;
    thumbnail: string;
    title: string;
    video: string;
}

export interface User extends Response {
    accountId: string;
    avatar: string;
    email: string;
    username: string;
}

export interface Response {
    $databaseId: string;
    $collectionId: string;
    $createdAt: string;
    $updatedAt: string;
    $id: string;
    $permissions: Array<string>;
}

export interface CreatePost {
    title: string;
    video: any;
    thumbnail: any;
    prompt: string
}