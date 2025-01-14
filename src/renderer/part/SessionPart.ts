import { Orientation } from '../component/Sash';
import { isSplitItem, SplitItem } from '../Types';
import { $ } from '../util/dom';
import { SplitViewItemView } from '../component/SplitView';
import { Part } from '../Part';
import { GroupView } from './view/GroupView';
import { GridView } from '../component/GridView';
import { Service, sessionPartServiceId, setService } from '../Service';
import { TerminalItem } from '../../common/Types';

export interface SessionPartService extends Service {
  createTerminal(): void;
  getServices(): void;
  makeOverlayVisible(b: boolean): void;
}

export class SessionPart extends Part implements SessionPartService {

  override layout(offset: number, size: number): void {
    // console.log('[SessionPart] layout() is called ..');
    // console.log({ offset, size });
    if(this.gridView) {
      this.gridView.layout(offset, size);
    }
  }

  /* layoutContainer(offset: number): void {
    this._splitViewContainer.style.left = `${offset}px`;
    this._splitViewContainer.style.width = `${this._size}px`;
  } */

  /* initial case
  tree: SplitItem = { mode: 'horizontal', list: [] }; */
  /* case1. single multi tab
  tree: SplitItem = {
    mode: 'horizontal',
    list:[
      [{uid:'a1',selected:false},{uid:'a2',selected:true,active:true}]
    ]
  }; //*/
  ///* case2. single split
  tree: SplitItem = {
    // mode: 'horizontal',
    mode: 'vertical',
    list:[
      [{uid:'a1',selected:false},{uid:'a2',selected:true,active:true}],
      [{uid:'b1',selected:true}]
    ]
  }; //*/
  /* case3. split vertical in right pane
  tree: SplitItem = {
    mode: 'horizontal',
    list:[
      [{uid:'b1',selected:true}],
      {
        mode:'vertical',
        list:[
          [{uid:'a1',selected:true}],
          [{uid:'a2',selected:true,active:true}]
        ]
      },
    ]
  }; //*/

  constructor(parent: HTMLElement, id: string, role: string, classes: string[], options: object) {
    super(parent, id, role, classes, options);
    // this.size = SESSION_WIDTH;
    this.sizeType = 'fill_parent';
    this.border = true;
    setService(sessionPartServiceId, this);
  }

  renderTreeList(container: HTMLElement, parent: SplitItem, depth: number): SplitViewItemView[] {
    let result: SplitViewItemView[] = [];
    for(let i = 0; i < parent.list.length; i++) {
      let item = parent.list[i];

      let className = '';
      let style;
      if(parent.list) {
        const sizeProperty = parent.mode === 'vertical' ? 'height' : 'width';
        const size = Math.floor(100 / parent.list.length) + '%';
        style = { [sizeProperty]: size };
      }

      if(isSplitItem(item)) {
        item = item as SplitItem;
        const orientation = item.mode === 'vertical' ? Orientation.VERTICAL : Orientation.HORIZONTAL;
        const gridView = new GridView(null, { orientation: orientation, style: style, length: result.length });
        const element = gridView.create();
        const results: SplitViewItemView[] = this.renderTreeList(null, item, depth+1);
        if(results.length > 0) {
          for(let i = 0; i < results.length; i++)
            gridView.addView(results[i]);
          result.push(gridView);
        }
      } else {
        const groupView = new GroupView(null, item as TerminalItem[], { style: style });
        const element = groupView.create();
        result.push(groupView);
      }
    }
    return result;
  }

  // splitView: SplitView<SplitViewItemView>;
  gridView: GridView | undefined;

  renderTreeRoot(container: HTMLElement, root: SplitItem, depth: number): HTMLElement[] {
    let result: HTMLElement[] = [];
    // console.log(isSplitItem(root));
    // if(isSplitItem(root)) {
      const orientation = root.mode === 'vertical' ? Orientation.VERTICAL : Orientation.HORIZONTAL;
      const gridView = this.gridView = new GridView(null, { orientation: orientation, length: root.list.length });
      const element = gridView.create();
      const results: SplitViewItemView[] = this.renderTreeList(null, root, depth+1);
      if(results.length > 0) {
        // element.style.width = '100%';
        // element.style.height = '100%';
        for(let i = 0; i < results.length; i++)
          gridView.addView(results[i]);
        result.push(gridView.element);
      }
      /* const splitView = this.splitView = new SplitView(container, { orientation: orientation });
      const results: SplitViewItemView[] = this.renderTreeList(container, root, depth+1);
      if(results.length > 0) {
        for(let i = 0; i < results.length; i++)
          splitView.addView(results[i]);
        // result.push(this.element);
      } */
    // } else {
    //   const wrapper = $('.wrapper');
    //   const results: SplitViewItemView[] = this.renderTreeList(wrapper, root, depth+1);
    //   if(results.length > 0) {
    //     for(let i = 0; i < results.length; i++)
    //       wrapper.appendChild(results[i].element);
    //     result.push(wrapper);
    //   }
    // }
    return result;
  }

  override createContentArea(): HTMLElement {
    // console.log('[SessionPart] createContentArea() is called ..');
    const container: HTMLElement = super.createContentArea();
    const results: HTMLElement[] = this.renderTreeRoot(container, this.tree, 0);
    for(let i = 0; i < results.length; i++)
      container.appendChild(results[i]);
    return container;
  }

  createTerminal(): void {
    const viewItems = this.gridView.splitView.viewItems;
    for(let i = 0; i < viewItems.length; i++) {
      // console.log(this.gridView.splitView.viewItems[i].view instanceof GroupView);
      // console.log(this.gridView.splitView.viewItems[i] instanceof SplitViewItem);
      if(this.gridView.splitView.viewItems[i].view instanceof GroupView) {
        const v: GroupView = this.gridView.splitView.viewItems[i].view as GroupView;
        for(let j = 0; j < v.terms.terms.length; j++) {
          v.terms.terms[j].createTerminal();
        }
      }
    }
  }

  getServices(): void {
    const viewItems = this.gridView.splitView.viewItems;
    for(let i = 0; i < viewItems.length; i++) {
      // console.log(this.gridView.splitView.viewItems[i].view instanceof GroupView);
      // console.log(this.gridView.splitView.viewItems[i] instanceof SplitViewItem);
      if(this.gridView.splitView.viewItems[i].view instanceof GroupView) {
        const v: GroupView = this.gridView.splitView.viewItems[i].view as GroupView;
        for(let j = 0; j < v.tabs.tabs.length; j++) {
          v.tabs.tabs[j].getServices();
        }
      }
    }
  }

  makeOverlayVisible(b: boolean): void {
    const viewItems = this.gridView.splitView.viewItems;
    for(let i = 0; i < viewItems.length; i++) {
      // console.log(this.gridView.splitView.viewItems[i].view instanceof GroupView);
      // console.log(this.gridView.splitView.viewItems[i] instanceof SplitViewItem);
      if(this.gridView.splitView.viewItems[i].view instanceof GroupView) {
        const v: GroupView = this.gridView.splitView.viewItems[i].view as GroupView;
        v.terms.wrapper.style.display = b ? 'block' : 'none';
      }
    }
  }
}