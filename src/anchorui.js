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
import { ClickObserver } from 'ckeditor5/src/engine';
import { ButtonView, ContextualBalloon, clickOutsideHandler } from 'ckeditor5/src/ui';

import { name } from './anchor';
import AnchorView from './anchorview';
import AnchorLinkView from './anchorlinkview';
import icon from '../icons/anchor.svg';
import linkIcon from '../icons/anchor-link.svg';

export default class AnchorUI extends Plugin {
  static get requires() {
    return [ContextualBalloon];
  }

  init() {
    const { editor } = this;
    const { model, t } = editor;
    const { selection } = model.document;
    editor.editing.view.addObserver(ClickObserver);

    const balloon = editor.plugins.get(ContextualBalloon);
    const formView = new AnchorView(editor.locale);
    const linkView = new AnchorLinkView(editor.locale);

    this._balloon = balloon;
    this._formView = formView;
    this._linkView = linkView;

    const submit = 'submit', cancel = 'cancel', execute = 'execute';

    formView.on(submit, () => {
      model.change((writer) => {
        const id = formView._anchorInputView.fieldView.element.value;
        if (id) {
          model.insertContent(writer.createElement(name, {id}), selection.getFirstPosition());
          this._linkButton.isVisible = true;
        }
        this._hideUI(formView);
      });
    });
    formView.on(cancel, () => this._hideUI(formView));

    linkView.on(submit, () => {
      model.change((writer) => {
        if (linkView._selectedElement) {
          editor.execute('link', '#' + linkView._selectedElement);
        }
        linkView._selectedElement = undefined;
        this._hideUI(linkView);
      });
    });
    linkView.on(cancel, () => this._hideUI(linkView));

    for (const view of [formView, linkView]) {
      clickOutsideHandler({
        emitter: view,
        activator: () => balloon.visibleView == view,
        contextElements: [balloon.view.element],
        callback: () => this._hideUI(view),
      });
    }

    const { componentFactory } = editor.ui;

    componentFactory.add(name, () => {
      const button = new ButtonView();

      button.set({
        label: t('Anchor'),
        icon,
        tooltip: true,
      });

      button.on(execute, () => this._showFormUI(selection.getSelectedElement()));

      return button;
    });

    componentFactory.add(name + '_link', () => {
      const button = new ButtonView();

      button.set({
        label: t('Anchor Link'),
        icon: linkIcon,
        tooltip: true,
        isVisible: false,
      });

      button.on(execute, () => this._showLinkUI());

      this._linkButton = button;

      return button;
    });

    editor.once('ready', () => {
      if (this._getAnchors(true)) {
        this._linkButton.isVisible = true;
      }
    });

    editor.editing.view.document.on('click', () => {
      const selectedModelElement = selection.getSelectedElement();
      if (selectedModelElement) {
        this._showFormUI(selectedModelElement);
      }
    });
  }

  _getAnchors(p = false) {
    const { model } = this.editor;

    const result = [];
    const range = model.createRangeIn(model.document.getRoot());
    for (const value of range.getWalker({ignoreElementEnd: true})) {
      if (value.item.is('element', name)) {
        if (p) {
          return true;
        }
        result.push(value.item.getAttribute('id'));
      }
    }
    return !p && result;
  }

  _showUI(view) {
    const { editor } = this;
    const { view: editingView } = editor.editing;
    const position = {target: () => editingView.domConverter.viewRangeToDom(editingView.document.selection.getFirstRange())};

    this._balloon.add({
      view,
      position,
    });

    view._focus();
  }

  _showFormUI(element = undefined) {
    const { _formView: formView } = this;

    if (element) {
      if (!element.is('element', name)) {
        return;
      }
      formView._anchorInputView.fieldView.value = element.getAttribute('id');
    }

    this._showUI(formView);
  }

  _showLinkUI() {
    this._linkView._setItems(this._getAnchors());
    this._showUI(this._linkView);
  }

  _hideUI(view) {
    view._clear();
    view.element.reset();
    this._balloon.remove(view);
    this.editor.editing.view.focus();
  }
}
