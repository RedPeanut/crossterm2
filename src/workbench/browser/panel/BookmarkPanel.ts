import { List } from '../../../base/browser/ui/List';
import * as dom from '../../../base/browser/dom';
import { Panel } from "../Panel";

export class BookmarkPanel extends Panel {
  static ID: string = 'panel.bookmark';

  container: HTMLElement;

  constructor() {
    super(BookmarkPanel.ID);
  }

  override create(parent: HTMLElement): void {
    super.create(parent);
    this.container = dom.append(parent, dom.$('.bookmark-panel'));
    const list = new List(this.container);
    list.render();
  }
}