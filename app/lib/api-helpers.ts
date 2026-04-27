export function sanitizeArticlePayload(data: any) {
    return {
        title: data.title,
        slug: data.slug,
        status: data.status,
        content: data.content,
        category: data.category,
    };
}
