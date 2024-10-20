import { activitybarPartServiceId, getService, setService, workbenchLayoutServiceId } from '../../../service';
import { HorizontalViewItem } from '../../../base/browser/ui/SplitView';
import { ACTIVITYBAR_WIDTH, WorkbenchLayoutService } from '../layout/Workbench';
import { Part } from '../Part';
import { BookmarkComposite } from '../composite/BookmarkComposite';
import { SampleComposite } from '../composite/SampleComposite';
import { ActivitybarItem, ActivitybarItemImpl } from './item/ActivitybarItem';

export interface ActivitybarPartService {
  addItem(ul:HTMLElement, item: any): void;
  updateChecked(id: string, checked: boolean): void;
}

export class ActivitybarPart extends Part implements ActivitybarPartService {

  // workbenchLayoutService: WorkbenchLayoutService;

  constructor(parent: HTMLElement, id: string, role: string, classes: string[], options: object) {
    super(parent, id, role, classes, options);
    this.size = ACTIVITYBAR_WIDTH;
    // this.workbenchLayoutService = getService(workbenchLayoutServiceId);
    setService(activitybarPartServiceId, this);
  }

  /* layoutContainer(offset: number): void {
    this._splitViewContainer.style.left = `${offset}px`;
    this._splitViewContainer.style.width = `${this._size}px`;
  } */

  override createContentArea(): HTMLElement {
    const part = super.createContentArea();

    /* const ul = document.createElement('ul');
    ul.className = 'actions-container';

    let actionList = [
      {
        title: 'Bookmarks',
        composite: BookmarkComposite,
        codicon: 'info',
        onClick: (e: any) => {
          // 
        }
      },
      {
        title: 'Sample',
        composite: SampleComposite,
        codicon: 'info',
        onClick: (e: any) => {}
      },
    ];

    actionList.forEach((item) => {
      const li = document.createElement('li');
      li.classList.add(...'activitybar-item'.split(' '));
      li.addEventListener('click', item.onClick);
      const a = document.createElement('a');
      a.classList.add(...`codicon codicon-${item.codicon}`.split(' '));
      li.appendChild(a);
      ul.appendChild(li);
    });

    part.appendChild(ul); */

    return part;
  }

  itemMap = new Map<string, ActivitybarItem>();

  addItem(ul: HTMLElement, item: any): void {
    let activitybarItem = this.itemMap.get(item.id);
    if(!activitybarItem) {
      let impl: ActivitybarItem = new ActivitybarItemImpl(ul, item.id, item.composite);
      impl.append(item.onClick, item.codicon);
      this.itemMap.set(item.id, impl);
    }
  }

  updateChecked(id: string, checked: boolean): void {
    let impl = this.itemMap.get(id);
    if(impl) {
      impl.updateChecked(checked);
    }
  }

}