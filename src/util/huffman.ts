export class TreeNode {
  left?: TreeNode | Leaf;
  right?: TreeNode | Leaf;
}

export class Leaf {
  value: number;

  constructor(val: number) {
    this.value = val;
  }
}

export class HuffmanTree {
  root = new TreeNode();

  static from(codeQuantities: number[], values: number[]): HuffmanTree {
    const tree = new HuffmanTree();

    let currQuantityI = 0;
    let currValueI = 0;

    while (currQuantityI < codeQuantities.length || currValueI < values.length) {
      if (codeQuantities[currQuantityI] === 0) {
        currQuantityI++;
        continue;
      }

      tree.createLeaf(values[currValueI], currQuantityI + 1);

      currValueI++;
      codeQuantities[currQuantityI]--;

    }

    return tree;
  }

  createLeaf(value: number, depth: number, currNode: TreeNode | Leaf = this.root): Leaf | null {
    if (currNode instanceof Leaf) return currNode;

    if (!currNode.left) {
      currNode.left = new TreeNode();
    }

    if (currNode.left instanceof Leaf) { } else {
      if (depth === 1) currNode.left = new Leaf(value);
      const res = this.createLeaf(value, depth - 1, currNode.left);
      if (res) return res;
    }

    if (!currNode.right) {
      currNode.right = new TreeNode();
    }

    if (currNode.right instanceof Leaf) { } else {
      if (depth === 1) currNode.right = new Leaf(value);
      const res = this.createLeaf(value, depth - 1, currNode.right);
      if (res) return res;
    }

    return null;
  }

  getValue() {
    let curr: TreeNode = this.root;
    return (code: number) => {
      if (code === 0) {
        if (!curr.left) throw new Error('Code is invalid');
        if (curr.left instanceof Leaf) return curr.left;
        curr = curr.left;
        return null;
      }
      if (code === 1) {
        if (!curr.right) throw new Error('Code is invalid');
        if (curr.right instanceof Leaf) return curr.right;
        curr = curr.right;
        return null;
      }
      throw new Error('Code is invalid');
    }
  }
}