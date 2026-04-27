export function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .trim()
        .replace(/\./g, " ")
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

export function shouldShowManagementNav(roleName: string | undefined | null): boolean {
    if (!roleName) return false;

    const managementRoles = ["Team Leads"];
    return managementRoles.includes(roleName);
}
