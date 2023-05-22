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

import AnchorEditing from './anchorediting';
import AnchorUI from './anchorui';

export const name = 'anchor';
export const label = 'Anchor ID';

export default class Anchor extends Plugin {
  static get requires() {
    return [AnchorEditing, AnchorUI];
  }

  static get pluginName() {
    return 'Anchor';
  }
}
