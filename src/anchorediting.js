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

import { Plugin } from 'ckeditor5/src/core';
import { toWidget, Widget } from 'ckeditor5/src/widget'

import { name } from './anchor';

export default class AnchorEditing extends Plugin {
  static get requires() {
    return [Widget];
  }

  init() {
    const { editor } = this;
    const { conversion } = editor;

    editor.model.schema.register(name, {
      allowWhere: '$text',
      isInline: true,
      isObject: true,
      allowAttributes: ['id'],
    });

    conversion.for('upcast').elementToElement({
      view: {
        name: 'a',
        attributes: {id: true},
      },
      model: (viewElement, {writer}) => {
        return writer.createElement(name, {id: viewElement.getAttribute('id')});
      },
    });

    conversion.for('editingDowncast').elementToElement({
      model: name,
      view: (modelItem, {writer}) => {
        return toWidget(writer.createContainerElement('span', {class: 'image-inline anchor'}), writer, {label: name});
      },
    });

    conversion.for('dataDowncast').elementToElement({
      model: name,
      view: (modelItem, {writer}) => {
        return writer.createEmptyElement('a', {id: modelItem.getAttribute('id')});
      },
    });
  }
}
