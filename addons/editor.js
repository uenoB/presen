/*
 * editor.js - an instant slide editor
 * Copyright (C) 2018 Katsuhiro Ueno
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

(function() {
  'use strict';

  function newSlide() {
    var s = document.createElement('SECTION');
    var h = document.createElement('H2');
    var p = document.createElement('PRE');
    var t1 = document.createElement('TEXTAREA');
    var t2 = document.createElement('TEXTAREA');
    t1.rows = 1;
    h.appendChild(t1);
    p.appendChild(t2);
    s.appendChild(document.createTextNode('\n'));
    s.appendChild(h);
    s.appendChild(document.createTextNode('\n'));
    s.appendChild(p);
    s.appendChild(document.createTextNode('\n'));
    var footer = Array.prototype.find.call(document.body.childNodes, x =>
      x.nodeType === Node.ELEMENT_NODE && x.nodeName === 'FOOTER');
    document.body.insertBefore(s, footer);
    document.body.insertBefore(document.createTextNode('\n\n'), footer);
    t1.value = 'Slide ' + Presen.getPageTree().children.length;
    t2.value = 'put something here';
    s.scrollIntoView(true);
  }

  function download(e) {
    var a = document.body.querySelectorAll('textarea');
    Array.prototype.forEach.call(a, x => {
      while (x.firstChild) x.removeChild(x.firstChild);
      var s = x.value;
      if (s.charAt(0) !== '\n') s = '\n' + s;
      if (s.charAt(s.length - 1) !== '\n') s = s + '\n';
      x.appendChild(document.createTextNode(s));
    });
    var toolbar = document.getElementById('presen_toolbar');
    var toolbarParent = toolbar.parentNode;
    var toolbarNext = toolbar.nextSibling;
    if (toolbar) toolbarParent.removeChild(toolbar);
    var s = new XMLSerializer().serializeToString(document);
    if (toolbar) toolbarParent.insertBefore(toolbar, toolbarNext);
    var b = new Blob([s], {'type':'text/html'});
    e.target.href = window.URL.createObjectURL(b);
    e.target.download = window.location.pathname.replace(/^.*\//, '');
  }

  function createButton(name, title, face) {
    var e = document.createElement(name);
    e.appendChild(document.createTextNode(face));
    e.className = 'presen_button';
    e.title = title;
    var t = document.getElementById('presen_toolbar');
    t.insertBefore(e, t.firstChild);
    return e;
  }

  window.addEventListener('load', e => {
    var n = createButton('A', 'add a new slide', '+');
    var d = createButton('A', 'download', '\u2b07');
    n.addEventListener('click', newSlide);
    d.addEventListener('click', download);
  });
})();
