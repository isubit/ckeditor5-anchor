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

import { LabeledFieldView, createLabeledInputText } from 'ckeditor5/src/ui';
import { label } from './anchor';
import ViewUtil from './utils/view';

export default class AnchorView extends ViewUtil {
  constructor(locale) {
    const input = new LabeledFieldView(locale, createLabeledInputText);
    input.label = locale.t(label);
    super(locale, input);
    this._anchorInputView = input;
  }

  _clear() {
    this._anchorInputView.fieldView.value = '';
  }
}
