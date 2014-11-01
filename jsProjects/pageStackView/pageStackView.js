

    var StackView = (function () {
        /**
        * Creates and returns a new ScreenStack widget. A ScreenStack contains a stack of children elements,
        * the top most element in the stack is the only visible child. Additionally a bread-crumb type widget
        * that displays all children in the stack and allows for navigation down the stack. When a new child is selected
        * the stack pops the top most element until the selected child becomes the top-most element and is thus visible.
        * There is view tree to record the relitive of the screens, if the page changed, save the record to session storage.
        * @constructor
        * @param {IStackScreen} root - The root screen of the ScreenStack
        * @param {HTMLElement} page - (Optional) A page to be used as the ScreenStack container.
        */
        function StackView(root, domNode) {
            this.stack = [];
            this.titleNode = document.createElement("div");
            if (typeof root !== "object") {
                throw TypeError("Invalid root. Root must be an object.");
            }
            this.domNode = domNode || document.createElement("div");
            this.root = root//{ domNode: root.domNode, title: root.title };
            ;
            this.initialize();
        }
        StackView.prototype.initialize = function () {
            Dojo.Dom.addClass(this.domNode, "stackView");
            Dojo.Dom.addClass(this.titleNode, "title");
            this.domNode.appendChild(this.titleNode);
            this.domNode.appendChild(this.activeChild.domNode);
            this.createTitlePath();
        };
        StackView.prototype.render = function () {
        };
        StackView.prototype.destroy = function () {
            this.stack.forEach(function (child) {
                if (child.destroy) {
                    child.destroy();
                }
            });
            Dojo.Dom.empty(this.domNode);
        };
        StackView.prototype.pop = function () {
            this.removeChild(this.activeChild);
        };
        StackView.prototype.addChild = /** Adds an IStackScreen child to the ScreenStack. */
        function (child, title) {
            if (typeof child !== "object") {
                throw TypeError("Invalid type of child");
            }
            if (title == null && child.title == null) {
                throw TypeError("Invalid child. No title provided.");
            }
            //title = title || child.title;
            //child = child.domNode || child; //child may be a widget
            try {
                this.domNode.removeChild(this.activeChild.domNode);
            } catch (e) {
                console.error(e);
            }
            this.stack.push(child);
            this.domNode.appendChild(this.activeChild.domNode);
            this.activeChild.render();
            this.createTitlePath();
        };
        StackView.prototype.removeChild = /** Removes all child screens up to and including the specified child. */
        function (child) {
            var idx = 0;
            if (typeof child === "number") {
                idx = child;
            } else {
                idx = this.stack.indexOf(child);
            }
            if (this.stack.length < 2 || idx <= 0 || idx === this.stack.length) {
                return;
            }
            try {
                this.domNode.removeChild(this.activeChild.domNode);
                if (this.activeChild.destroy) {
                    this.activeChild.destroy();
                }
                while (this.stack.length > idx) {
                    this.stack.pop();
                }
            } catch (e) {
                console.error(e);
            }
            this.domNode.appendChild(this.activeChild.domNode);
            this.activeChild.render();
            this.createTitlePath();
        };
        StackView.prototype.hideTitlePath = function () {
            this.titleNode.style.display = "none";
        };
        StackView.prototype.showTitlePath = function () {
            this.titleNode.style.display = "block";
        };
        StackView.prototype.show = /** Changes parent element to "display: block;" */
        function () {
            Dojo.Dom.addClass(this.domNode, "hidden");
        };
        StackView.prototype.hide = /** Changes parent element to "display: none;". */
        function () {
            Dojo.Dom.removeClass(this.domNode, "hidden");
        };
        StackView.prototype.resize = function () {
        };
        StackView.prototype.createTitlePath = /** Generates the bread-crumb navigation in the top left of the ScreenStack */
        function () {
            var _this = this;
            Dojo.Dom.empty(this.titleNode)//remove previous path
            ;
            this.stack.forEach(function (pane, idx) {
                var link = document.createElement("span");
                Dojo.Dom.addClass(link, "link");
                link.innerText = pane.title;
                link.onclick = function () {
                    return _this.removeChild(idx + 1);
                };
                _this.titleNode.appendChild(link);
                if (idx < _this.stack.length - 1) {
                    var caret = document.createElement("span");
                    Dojo.Dom.addClass(caret, "caret");
                    caret.innerText = ">";
                    _this.titleNode.appendChild(caret);
                }
            });
        };
        Object.defineProperty(StackView.prototype, "count", {
            get: /** Returns the number of child screens in the ScreenStack */
            function () {
                return this.stack.length;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(StackView.prototype, "activeChild", {
            get: /** Returns the active IStackScreen child */
            function () {
                return this.stack[this.stack.length - 1];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(StackView.prototype, "root", {
            get: /** Returns the root IStackScreen */
            function () {
                return this.stack[0];
            },
            set: /** Sets the root IStackScreen */
            function (value) {
                if (typeof value !== "object" || value.domNode == null || value.title == null) {
                    throw TypeError("Unable to set root; root must be an IStackScreen.");
                }
                this.stack[0] = value;
            },
            enumerable: true,
            configurable: true
        });
        return StackView;
    })();
    exports.StackView = StackView;
})
//@ sourceMappingURL=stackView.js.map