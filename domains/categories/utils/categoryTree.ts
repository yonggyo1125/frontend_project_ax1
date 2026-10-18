import { Category } from '@/domains/categories/types/category.types';

// DB에서 조회한 평면(Flat) 카테고리 배열을 해시 맵을 사용해
export function buildCategoryTree(flatCategories: Category[]): Category[] {
    const categoryMap = new Map<string, Category>();
    const roots: Category[] = [];

    // 모든 노드를 깊은 복사하여 Map에 등록
    for (const item of flatCategories) {
        categoryMap.set(item.id, {
            ...item,
            children: [],
        });
    }

    // parent_id를 기준으로 부모 노드의 children에 연결
    for (const item of flatCategories) {
        const node = categoryMap.get(item.id)!;
        if (item.parent_id && categoryMap.has(item.parent_id)) {
            const parent = categoryMap.get(item.parent_id)!;
            parent.children = parent.children || [];
            parent.children.push(node);
        } else if (!item.parent_id) {
            roots.push(node);
        }
    }

    // 각 계층별 sort_order 오름차순 정렬 및 빈 children 정리
    const sortRecursive = (nodes: Category[]) => {
        nodes.sort((a, b) => a.sort_order - b.sort_order);
        for (const node of nodes) {
            if (node.children && node.children.length > 0) {
                sortRecursive(node.children);
            } else {
                delete node.children;
            }
        }
    };

    sortRecursive(roots);
    return roots;
}

// 특정 카테고리 ID를 선택했을 때 본인 및 모든 하위(자식/손자) 카테고리 ID 목록을 반환합니다.
export function getDescendantCategoryIds(
    targetId: string,
    tree: Category[],
): string[] {
    const findNode = (id: string, nodes: Category[]): Category | null => {
        for (const node of nodes) {
            if (node.id === id) return node;
            if (node.children) {
                const found = findNode(id, node.children);
                if (found) return found;
            }
        }
        return null;
    };

    const collectIds = (node: Category): string[] => {
        const ids = [node.id];
        if (node.children) {
            for (const child of node.children) {
                ids.push(...collectIds(child));
            }
        }
        return ids;
    };

    const targetNode = findNode(targetId, tree);
    if (!targetNode) return [targetId];

    return collectIds(targetNode);
}
