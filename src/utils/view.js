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

import { ButtonView, View, submitHandler } from 'ckeditor5/src/ui';
import { icons } from 'ckeditor5/src/core';

export default class ViewUtil extends View {
  constructor(locale, inputView, saveButton = true) {
    super(locale);
    const views = [inputView];
    if (saveButton) {
      const saveButtonView = this._createButton('Save', icons.check, 'ck-button-save');
      saveButtonView.type = 'submit';
      views.push(saveButtonView);
    }
    const cancelButtonView = this._createButton('Cancel', icons.cancel, 'ck-button-cancel');
    cancelButtonView.delegate('execute').to(this, 'cancel');
    views.push(cancelButtonView);

    const childViews = this.createCollection(views);
    this._childViews = childViews;

    this.setTemplate({
      tag: 'form',
      attributes: {class: ['ck', 'ck-abbr-form'], tabindex: '-1'},
      children: childViews,
    });
  }

  _focus() {
    this._childViews.first.focus();
  }

  _clear() {}

  render() {
    super.render();
    submitHandler({view: this});
  }

  _createButton(label, icon, className) {
    const button = new ButtonView();
    button.set({
      label,
      icon,
      tooltip: true,
      class: className,
    });
    return button;
  }
}
