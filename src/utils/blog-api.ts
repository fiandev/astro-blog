// const API_BASE_URL = "https://alfiansa.web.id/api";
const API_BASE_URL = "http://localhost:4322/api";

export interface BlogPost {
    id: string;
    title: string;
    slug: string;
    content: string;
    imageUrl: string;
    description?: string;
    category: string;
    published: boolean;
    createdAt: string;
    updatedAt: string;
}
interface ApiResponseIndex {
    success: boolean;
    data: BlogPost[];
}

interface ApiResponseDetail {
    success: boolean;
    data: BlogPost;
}

export const fetchBlogs = async (): Promise<BlogPost[]> => {
    try {
        let res = await fetch(`${API_BASE_URL}/public/blogs`);
        let data: ApiResponseIndex = await res.json();
        return data.data;
    } catch (error) {
        return [];
    }
};


export const fetchBlog = async (slug: string): Promise<BlogPost> => {
    try {
        let res = await fetch(`${API_BASE_URL}/public/blogs/${slug}`);
        let data: ApiResponseDetail = await res.json();
        return data.data;
    } catch (error) {
        return {} as BlogPost;
    }
};
