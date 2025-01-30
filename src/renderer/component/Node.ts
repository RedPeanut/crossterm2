import { $, append } from "../util/dom";
import { ListItemElem } from "./List";
// import { TreeNodeData } from "./Tree";

export class Node {
  container: HTMLElement;

  element: HTMLElement;
  node: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  create(
    data: ListItemElem,
    level: number = 0,
    nodeRender: (data: ListItemElem) => HTMLElement | null,
    onDoubleClick: (id: string) => void
  ): void {
    const hasChildren = Array.isArray(data.children) && data.children.length > 0;

    const element = this.element = $('.wrapper');
    const node = this.node = $('.node');
    node.ondblclick = (e) => onDoubleClick(data.id);

    const content = $('.content');
    const header = $('.ln-header');
    if(hasChildren) {
      const arrow = $('.arrow' + data.isCollapsed ? '.collapsed' : '');
      arrow.innerHTML = '>';
      header.append(arrow);
    }
    content.append(header);

    const body = $('.ln-body');
    const listItem = nodeRender ? nodeRender(data) : data.title || `node#${data.id}`;
    body.append(listItem);
    content.append(body);

    if(hasChildren) {
      data.children.map((e) => {
        const _node = new Node(body);
        _node.create(e, level+1, nodeRender, onDoubleClick);
      });
    }
    append(node, content);
    append(element, node);
    append(this.container, element);
  }
}