class Node {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
    this.height = 1;
  }
}

class BalancedBST {
  constructor() {
    this.root = null;
  }

  getHeight(node) {
    return node ? node.height : 0;
  }

  getBalanceFactor(node) {
    return node ? this.getHeight(node.left) - this.getHeight(node.right) : 0;
  }

  updateHeight(node) {
    if (!node) return;
    node.height =
      Math.max(this.getHeight(node.left), this.getHeight(node.right)) + 1;
  }

  rotateRight(y) {
    const x = y.left;
    const T2 = x.right;

    x.right = y;
    y.left = T2;

    this.updateHeight(y);
    this.updateHeight(x);

    return x;
  }

  rotateLeft(x) {
    const y = x.right;
    const T2 = y.left;

    y.left = x;
    x.right = T2;

    this.updateHeight(x);
    this.updateHeight(y);

    return y;
  }

  insert(value) {
    this.root = this._insert(this.root, value);
    return this;
  }

  _insert(node, value) {
    if (!node) {
      return new Node(value);
    }

    if (value < node.value) {
      node.left = this._insert(node.left, value);
    } else if (value > node.value) {
      node.right = this._insert(node.right, value);
    } else {
      return node;
    }

    this.updateHeight(node);

    const balance = this.getBalanceFactor(node);

    if (balance > 1 && value < node.left.value) {
      return this.rotateRight(node);
    }

    if (balance < -1 && value > node.right.value) {
      return this.rotateLeft(node);
    }

    if (balance > 1 && value > node.left.value) {
      node.left = this.rotateLeft(node.left);
      return this.rotateRight(node);
    }

    if (balance < -1 && value < node.right.value) {
      node.right = this.rotateRight(node.right);
      return this.rotateLeft(node);
    }

    return node;
  }

  find(value) {
    return this._find(this.root, value);
  }

  _find(node, value) {
    if (!node) {
      return null;
    }

    if (value === node.value) {
      return node;
    }

    if (value < node.value) {
      return this._find(node.left, value);
    } else {
      return this._find(node.right, value);
    }
  }

  findMin(node) {
    let current = node;
    while (current && current.left) {
      current = current.left;
    }
    return current;
  }

  delete(value) {
    this.root = this._delete(this.root, value);
    return this;
  }

  _delete(node, value) {
    if (!node) {
      return null;
    }

    if (value < node.value) {
      node.left = this._delete(node.left, value);
    } else if (value > node.value) {
      node.right = this._delete(node.right, value);
    } else {
      if (!node.left) {
        return node.right;
      } else if (!node.right) {
        return node.left;
      }

      const successor = this.findMin(node.right);
      node.value = successor.value;

      node.right = this._delete(node.right, successor.value);
    }

    if (!node) {
      return null;
    }

    this.updateHeight(node);

    const balance = this.getBalanceFactor(node);

    if (balance > 1 && this.getBalanceFactor(node.left) >= 0) {
      return this.rotateRight(node);
    }

    if (balance > 1 && this.getBalanceFactor(node.left) < 0) {
      node.left = this.rotateLeft(node.left);
      return this.rotateRight(node);
    }

    if (balance < -1 && this.getBalanceFactor(node.right) <= 0) {
      return this.rotateLeft(node);
    }

    if (balance < -1 && this.getBalanceFactor(node.right) > 0) {
      node.right = this.rotateRight(node.right);
      return this.rotateLeft(node);
    }

    return node;
  }

  inorder() {
    const result = [];
    this._inorder(this.root, result);
    return result;
  }

  _inorder(node, result) {
    if (node) {
      this._inorder(node.left, result);
      result.push(node.value);
      this._inorder(node.right, result);
    }
  }
}

const bst = new BalancedBST();
bst.insert(10).insert(20).insert(30).insert(40).insert(50).insert(25);
console.log(bst.inorder()); // [10, 20, 25, 30, 40, 50]
console.log(bst.find(30)); // Node with value 30
bst.delete(30);
console.log(bst.inorder()); // [10, 20, 25, 40, 50]

module.exports = { BalancedBST };
