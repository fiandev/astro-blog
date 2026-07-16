const API_BASE_URL = "https://alfiansa.web.id/api";
// const API_BASE_URL = "http://localhost:4322/api";

export interface BlogPost {
    id: string;
    title: string;
    slug: string;
    content: string;
    imageUrl: string;
    heroImage?: string;
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

function refineImagePath (imageUrl: string): string {
    return imageUrl.replace("../../", "/")
}

export const fetchBlogs = async (): Promise<BlogPost[]> => {
    try {
        let res = await fetch(`${API_BASE_URL}/public/blogs`);
      let json: ApiResponseIndex = await res.json();

       return json.data.map(post => {
          return {
              ...post,
              heroImage: refineImagePath(post.imageUrl),
          };
      });
    } catch (error) {
        return [];
    }
};

export const fetchBlog = async (slug: string): Promise<BlogPost> => {
    try {
        let res = await fetch(`${API_BASE_URL}/public/blogs/${slug}`);
        let data: ApiResponseDetail = await res.json();

      console.log(JSON.stringify({
          ...data.data,
          heroImage: refineImagePath(data.data.imageUrl),
      }, null, 2))
        return {
            ...data.data,
            heroImage: refineImagePath(data.data.imageUrl),
        };
    } catch (error) {
        return {} as BlogPost;
    }
};
