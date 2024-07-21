function Tree (array) {

    const tree = {
        root: null,


        buildTree: function (array) {
            array = sortNumbers(array);
        
            if (array.length === 0) {
                return null;
            }
        
            const middleIndex = Math.floor(array.length / 2);
            const rootElement = array[middleIndex];
            const leftHalf = array.slice(0, middleIndex);
            const rightHalf = array.slice(middleIndex + 1);
        
            const newNode = Node(
                rootElement,
                this.buildTree(leftHalf),
                this.buildTree(rightHalf)
            );
        
            return newNode;
        },

        insert: function (value) {
            const newNode = Node(value);

            if (this.root === null) {
                this.root = newNode;
                return;
            }
            let currentNode = this.root;
            
            while (true) {
                if (value < currentNode.value) {
                    if (currentNode.left === null) {
                        currentNode.left = newNode
                        break;
                    } else {
                        currentNode = currentNode.left;
                    }
                } else {
                    if (currentNode.right === null) {
                        currentNode.right = newNode
                        break;
                    } else {
                        currentNode = currentNode.right;
                    }
                }
            }
        },
        deleteItem: function (value) {
            if (this.root === null) {
                return;
            }

            let currentNode = this.root;
            let parentNode = null;
            let direction = '';

            function findMinValueNode(node) {
                let minValueNode = node;
                while (minValueNode.left !== null) {
                    minValueNode = minValueNode.left;
                }
                return minValueNode;
            }
            

            //find the correct node
            while (currentNode !== null && currentNode.value !== value) {
                parentNode = currentNode;
                if (value < currentNode.value) {
                    currentNode = currentNode.left;
                    direction = 'left';
                } else {
                    currentNode = currentNode.right;
                    direction = 'right';
                }
            }
            //if there is no node return
            if (currentNode === null) {
                return;
            }

            //remove node with no child
            if (currentNode.left === null && currentNode.right === null) {
                if (direction === 'left') {
                    parentNode.left = null
                } else {
                    parentNode.right = null;
                }
                currentNode = null;
            } else if (currentNode.left === null || currentNode.right === null) {//remove node with 1 child
                let childNode = (currentNode.left !== null) ? currentNode.left : currentNode.right;
                if (direction === 'left') {
                    parentNode.left = childNode;
                } else {
                    parentNode.right = childNode;
                }
            } else {
                let minValueNode = findMinValueNode(currentNode.right);
                console.log(minValueNode)
                currentNode.value = minValueNode.value;

                let parentNodeForMinValue = currentNode.right;
        
                while (parentNodeForMinValue.left !== null && parentNodeForMinValue.left !== minValueNode) {
                    parentNodeForMinValue = parentNodeForMinValue.left;
                }

                if (parentNodeForMinValue.left === minValueNode) {
                    parentNodeForMinValue.left = minValueNode.right;
                } else {
                    parentNodeForMinValue.right = minValueNode.right;
                }
            }
        },
        find: function (value) {

            let currentNode = this.root;
            
            while (currentNode !== null) {
                if (value === currentNode.value) {
                    return currentNode; // Found the node with the value
                } else if (value < currentNode.value) {
                    currentNode = currentNode.left;
                } else {
                    currentNode = currentNode.right;
                }
            }
            return null; // Value not found in the tree
        },
        levelOrder: function (node=this.root, callback) {
            if (node === null) {
                return;
            }
        
            let queue = [node];
        
            while (queue.length > 0) {
                let currentNode = queue.shift();
                callback(currentNode);
        
                if (currentNode.left !== null) {
                    queue.push(currentNode.left);
                }
                if (currentNode.right !== null) {
                    queue.push(currentNode.right);
                }
            }
        },
        preOrder: function (node=this.root, callback) {//this code will change
            if (node === null) {
                return;
            }
            callback(node)

            if (node.left !== null) {
                this.preOrder(node.left, callback)
            }
            if (node.right !== null) {
                this.preOrder(node.right, callback)
            }
        },
        inOrder: function (node = this.root, callback) {

            if (node === null) {
                return;
            }
            this.inOrder(node.left, callback)
            callback(node)
            this.inOrder(node.right, callback)
        },
        postOrder: function (node = this.root, callback) {

            if (node === null) {
                return;
            }
            this.postOrder(node.left, callback)
            this.postOrder(node.right, callback)
            callback(node)
        },
        height: function (node) {
            if (node === null) {
                return -1;
            }

            // Recursive calls to find the height of left and right subtrees
            let leftHeight = this.height(node.left);
            let rightHeight = this.height(node.right);
    
            // Return the maximum height of left and right subtrees plus 1 for the current node
            return Math.max(leftHeight, rightHeight) + 1;
        },
        depth: function (node) {
            let currentNode = this.root;
            let depth = 0;
            while (currentNode !== null) {
                if (node.value === currentNode.value) {
                    return depth;
                } else if (node.value < currentNode.value) {
                    depth++;
                    currentNode = currentNode.left;
                } else {
                    depth++;
                    currentNode = currentNode.right;
                }
            }
            return null;
        },
        isBalanced: function (node = this.root) {
            if (node === null) {
                return true;
            }
        
            // Calculate heights of left and right subtrees
            const leftSubtreeHeight = this.height(node.left);
            const rightSubtreeHeight = this.height(node.right);
        
            // Check if the current node is balanced
            if (Math.abs(leftSubtreeHeight - rightSubtreeHeight) <= 1 &&
                this.isBalanced(node.left) &&
                this.isBalanced(node.right)) {
                return true;
            }
        
            // If any subtree is not balanced, the whole tree is not balanced
            return false;
        },
        rebalance: function () {
            let sortedArray = [];

            this.inOrder(this.root, function(node) {
                sortedArray.push(node.value);
            });

            this.root = this.buildTree(sortedArray)
        }
    }
    tree.root = tree.buildTree(array);

    return tree;
}


function Node (value, left = null, right = null) {
    return {
        left: left,
        right: right,
        value: value,
    }
}

  const prettyPrint = (node, prefix = "", isLeft = true) => {////
    if (node === null) {
        return;
    }
    if (node.right !== null) {
        prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
    }
    console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.value}`);
    if (node.left !== null) {
        prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
    }
};
 

function sortNumbers(array) {
    return array.sort(function(a, b) {
        return a - b;
    });
}


// test

function getRandomArray(size, maxValue) {
    return Array.from({ length: size }, () => Math.floor(Math.random() * maxValue));
}

// Driver script
const tree = Tree(getRandomArray(10, 100));

console.log("Tree is balanced:", tree.isBalanced());

console.log("Level order:");
tree.levelOrder(tree.root, (node) => console.log(node.value));

console.log("Pre-order:");
tree.preOrder(tree.root, (node) => console.log(node.value));

console.log("Post-order:");
tree.postOrder(tree.root, (node) => console.log(node.value));

console.log("In-order:");
tree.inOrder(tree.root, (node) => console.log(node.value));

tree.insert(150);
tree.insert(200);
tree.insert(250);

console.log("Tree is balanced after inserting > 100:", tree.isBalanced());

tree.rebalance();

console.log("Tree is balanced after rebalancing:", tree.isBalanced());

console.log("Level order:");
tree.levelOrder(tree.root, (node) => console.log(node.value));

console.log("Pre-order:");
tree.preOrder(tree.root, (node) => console.log(node.value));

console.log("Post-order:");
tree.postOrder(tree.root, (node) => console.log(node.value));

console.log("In-order:");
tree.inOrder(tree.root, (node) => console.log(node.value));

/////////////////////////////////////////////////////////////////////////////////////////////
// Create a new tree with a specific set of values
const customTree = Tree([10, 5, 20, 3, 7, 15, 25]);

console.log("Custom Tree Structure:");
prettyPrint(customTree.root);

// Insert more values and print the tree structure
customTree.insert(12);
customTree.insert(8);
customTree.insert(30);

console.log("Custom Tree after insertions:");
prettyPrint(customTree.root);

// Rebalance the tree and print the tree structure
customTree.rebalance();

console.log("Custom Tree after rebalancing:");
prettyPrint(customTree.root);

// Delete nodes and print the tree structure
customTree.deleteItem(10); // Delete root
customTree.deleteItem(7);  // Delete leaf
customTree.deleteItem(25); // Delete node with one child

console.log("Custom Tree after deletions:");
prettyPrint(customTree.root);

// Additional cases with empty and single-node trees
const emptyTree = Tree([]);
console.log("Empty Tree:");
prettyPrint(emptyTree.root);

const singleNodeTree = Tree([42]);
console.log("Single Node Tree:");
prettyPrint(singleNodeTree.root);

// Test tree balance checks
console.log("Empty Tree is balanced:", emptyTree.isBalanced());
console.log("Single Node Tree is balanced:", singleNodeTree.isBalanced());

// Test tree height and depth functions
console.log("Height of custom tree:", customTree.height(customTree.root));
console.log("Depth of node with value 15:", customTree.depth(customTree.find(15)));
console.log("Depth of node with value 30:", customTree.depth(customTree.find(30)));
