export const treeToList = (treeData, list = [], parent = {
	id: null,
	name: ''
}) => {
	treeData.forEach(node => {
		// 复制当前节点，并添加父节点信息（如果有）
		const currentNode = {
			...node,
			parent: parent
		};
		// 将当前节点添加到列表中
		list.push(currentNode);
		// 如果当前节点有子节点，则递归调用函数
		if (currentNode.children && currentNode.children.length > 0) {
			treeToList(currentNode.children, list, currentNode);
		}
	});
	return list;
}