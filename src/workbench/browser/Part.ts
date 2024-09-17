import { SplitViewItem } from "../../base/browser/ui/SplitView";
import { Component } from "../common/Component";

export interface PartOptions {}

class PartLayout {
  constructor(private options: PartOptions, private contentArea: HTMLElement | undefined) { }
}

export abstract class Part extends Component implements SplitViewItem {

  set size(size: number) {
    this._size = size;
  }

  get size(): number {
    return this._size;
  }

  get element(): HTMLElement {
    return this.contentArea;
  }

  set splitViewContainer(container: HTMLElement) {
    this._splitViewContainer = container;
  }

  abstract layoutContainer(offset: number): void;

  _size: number = 0;
  _splitViewContainer: HTMLElement | undefined;

  parent: HTMLElement | undefined;
  headerArea: HTMLElement | undefined;
  titleArea: HTMLElement | undefined;
  contentArea: HTMLElement | undefined;
  footerArea: HTMLElement | undefined;
  partLayout: PartLayout | undefined;

  role: string;
  classes: string[];
  options: object;

  constructor(parent: HTMLElement, id: string, role: string, classes: string[], options: object) {
    super(id);
    this.parent = parent;
    this.role = role;
    this.classes = classes;
    this.options = options;
  }

  create(): void {
    this.titleArea = this.createTitleArea();
    this.contentArea = this.createContentArea();
    // this.partLayout = new PartLayout(this.options, this.contentArea);
    this.titleArea && this.parent && this.parent.appendChild(this.titleArea);
    this.contentArea && this.parent && this.parent.appendChild(this.contentArea);
  }
  
  createTitleArea(): HTMLElement {
    // Method not implemented yet
    return null;
  }

  createContentArea(): HTMLElement {
    const part = document.createElement('div');
    part.classList.add('part', 'content-area', ...this.classes);
    part.id = this.getId();
    part.setAttribute('role', this.role);
    return part;
  }

  // abstract toJSON(): object;
}