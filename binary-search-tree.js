class Node {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

class Tree {
  constructor(arr) {
    this.arr = arr;
    this.root = this.buildTree(this.arr);
  }

  buildTree(arr) {
    if (arr.length === 0) return null;
    //Remove duplicates and sort the array
    let noDuplicates = [];

    for (let i = 0; i < arr.length; i++) {
      if (!noDuplicates.includes(arr[i])) {
        noDuplicates.push(arr[i]);
      }
    }

    let sortedArr = noDuplicates.sort((a, b) => a - b);

    //Calculate the middle index of the array
    let mid = Math.floor(sortedArr.length / 2);

    //Create a new node with the value from the middle of the array
    let node = new Node(sortedArr[mid]);

    //Split the array into two parts
    let left = sortedArr.slice(0, mid);
    let right = sortedArr.slice(mid + 1);

    //Recursively call the buildTree method for each part of the array,
    //creating the left and right subtrees
    node.left = this.buildTree(left);
    node.right = this.buildTree(right);

    // Return the node — the root of the constructed (sub)tree,
    // with the left and right subtrees already created recursively
    return node;
  }

  insert(value) {
    if (this.root === null) {
      this.root = new Node(value);
    } else {
      return this.addNodeRec(this.root, value);
    }
  }

  addNodeRec(node, value) {
    if (node.value > value) {
      if (node.left === null) {
        node.left = new Node(value);
      } else {
        this.addNodeRec(node.left, value);
      }
    } else {
      if (node.right === null) {
        node.right = new Node(value);
      } else {
        this.addNodeRec(node.right, value);
      }
    }
  }

  deleteItem(value) {
    this.root = this.removeRec(this.root, value);
  }

  removeRec(node, value) {
    if (!node) return null;

    //Searching for our node
    if (node.value > value) {
      node.left = this.removeRec(node.left, value);
    } else if (node.value < value) {
      node.right = this.removeRec(node.right, value);
    } else {
      // If the target node has no children
      if (node.left === null && node.right === null) {
        return null;
      }

      // If the target node has only a left child
      else if (node.left !== null && node.right === null) {
        return node.left;
      }
      // If the target node has only a right child
      else if (node.left === null && node.right !== null) {
        return node.right;
      }

      // If the target node has two children
      else {
        // Find the smallest value in the right subtree
        let minNode = this.findMin(node.right);

        node.value = minNode.value;

        node.right = this.removeRec(node.right, minNode.value);
      }
    }
    return node;
  }

  findMin(node) {
    // Find the node with the minimum value — the leftmost node in the subtree
    if (node.left === null) {
      return node;
    }

    return this.findMin(node.left);
  }

  find(value) {
    // Traverse the tree until the desired node is found, then return it
    let current = this.root;

    while (current !== null) {
      if (current.value > value) {
        current = current.left;
      } else if (current.value < value) {
        current = current.right;
      } else {
        return current;
      }
    }
    return null;
  }

  levelOrder(callback) {
    // Create a queue for the nodes
    let queue = [this.root];

    while (queue.length !== 0) {
      // Take the first node from the queue
      let current = queue.shift();

      // Output the node
      callback(current);

      // If the node has a child, add it to the queue
      if (current.left) queue.push(current.left);
      if (current.right) queue.push(current.right);
    }
  }

  inOrder(callback, node = this.root) {
    // For each node, recursively traverse the left subtree,
    // then process the node itself (call the callback),
    // and after that, recursively traverse the right subtree.

    if (!callback) {
      throw new Error("No callback function passed!");
    }

    if (!node) return null;

    this.inOrder(callback, node.left);
    callback(node);
    this.inOrder(callback, node.right);
  }

  preOrder(callback, node = this.root) {
    if (!callback) {
      throw new Error("No callback function passed!");
    }

    if (!node) return null;

    callback(node);
    this.preOrder(callback, node.left);
    this.preOrder(callback, node.right);
  }

  postorder(callback, node = this.root) {
    if (!callback) {
      throw new Error("No callback function passed!");
    }

    if (!node) return null;

    this.postorder(callback, node.left);
    this.postorder(callback, node.right);
    callback(node);
  }

  height(value) {
    let node = this.find(value);

    if (!node) {
      return null;
    } else {
      return this.heightRec(node);
    }
  }

  heightRec(node) {
    // Recursively calculates the height of the subtree rooted at node.
    // The height of an empty subtree is -1.
    // For a non-empty node, height = 1 + the maximum height of its left and right subtrees.
    if (!node) return -1;
    return 1 + Math.max(this.heightRec(node.left), this.heightRec(node.right));
  }

  depth(value) {
    // Traverse the tree until the target node is found, incrementing the counter at each step
    let current = this.root;
    let count = 0;

    while (current !== null) {
      if (current.value > value) {
        count++;
        current = current.left;
      } else if (current.value < value) {
        count++;
        current = current.right;
      } else {
        return count;
      }
    }
    return null;
  }

  isBalanced(node = this.root) {
    if (!node) return true;

    let left = this.heightRec(node.left);
    let right = this.heightRec(node.right);

    let leftRec = this.isBalanced(node.left);
    let rightRec = this.isBalanced(node.right);

    if (Math.abs(left - right) <= 1 && leftRec && rightRec) {
      return true;
    } else {
      return false;
    }
  }

  rebalance() {
    let array = [];
    let balance = this.isBalanced();
    this.inOrder((node) => array.push(node.value));

    if (balance) {
      return;
    } else {
      this.root = this.buildTree(array);
    }
  }

  prettyPrint(node = this.root, prefix = "", isLeft = true) {
    if (node === null) {
      return;
    }
    if (node.right !== null) {
      this.prettyPrint(
        node.right,
        `${prefix}${isLeft ? "│   " : "    "}`,
        false
      );
    }
    console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.value}`);
    if (node.left !== null) {
      this.prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
    }
  }
}

const tree = new Tree([4, 5, 8, 9, 12, 54, 22, 11, 14, 17]);

tree.insert(77);
tree.insert(78);
tree.insert(79);
tree.insert(80);
tree.prettyPrint();

const balanced1 = tree.isBalanced();
if (balanced1) {
  console.log("Balanced!");
} else {
  console.log("Not Balanced!");
}

tree.rebalance();
tree.prettyPrint();

const balanced = tree.isBalanced();
if (balanced) {
  console.log("Balanced!");
} else {
  console.log("Not Balanced!");
}
