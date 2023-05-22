/* Copyright (C) 2022-2023 Iowa State University of Science and Technology

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 2 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.  */

import { LabeledFieldView, Model, createLabeledDropdown, addListToDropdown } from 'ckeditor5/src/ui';
import { Collection } from 'ckeditor5/src/utils';
import { label } from './anchor';
import ViewUtil from './utils/view';

export default class AnchorLinkView extends ViewUtil {
  constructor(locale) {
    const input = new LabeledFieldView(locale, createLabeledDropdown);
    input.label = locale.t(label);

    const { fieldView } = input;
    fieldView.buttonView.withText = true;
    fieldView.on('execute', (evt) => {
      this._selectedElement = evt.source.element.textContent;
    });

    super(locale, input, false);
    this._fieldView = fieldView;
  }

  _setItems(list) {
    this._fieldView.panelView.children.clear();
    const collection = new Collection();
    for (const item of list) {
      collection.add({
        type: 'button',
        model: new Model({
          withText: true,
          label: item,
          type: 'submit',
        }),
      });
    }
    addListToDropdown(this._fieldView, collection);
  }
}
