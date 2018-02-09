/*
 * presen.js - a minimal presentation tool
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

var Presen = {pageSelector:'section, header, .page, .step'};

(function() {
  'use strict';

  function isAncestorOf(e1, e2) {
    for (; e2; e2 = e2.parentNode)
      if (e2 === e1) return true;
    return false;
  }

  function replaceTexts(query, text) {
    Array.prototype.forEach.call(document.body.querySelectorAll(query), x => {
      while (x.firstChild != null) x.removeChild(x.firstChild);
      x.appendChild(document.createTextNode(String(text)));
    });
  }

  function getCenterElem() {
    var center = {x: window.innerWidth / 2, y: window.innerHeight / 2};
    return document.elementFromPoint(center.x, center.y);
  }

  function isSlide(node) {
    return node.elem.nodeName === 'SECTION' || node.elem.nodeName === 'HEADER';
  }

  Presen.getPageTree = function() {
    var elems = document.body.querySelectorAll(Presen.pageSelector);
    var root = {elem:null, parent:null, children:[], nodes:[], slides:0};
    for (var i = 0; i < elems.length; i++) {
      root.nodes.push({elem:elems[i], parent:root, children:[], slides:0});
      for (var j = i; --j > 0; )
        if (isAncestorOf(elems[j], elems[i])) {
          root.nodes[i].parent = root.nodes[j];
          root.nodes[j].children.push(root.nodes[i]);
          break;
        }
      if (root.nodes[i].parent === root) 
        root.children.push(root.nodes[i]);
      if (isSlide(root.nodes[i]))
        root.nodes[i].parent.slides++;
    }
    return root;
  };

  Presen.setPosClass = function(node, k) {
    var classes = ['npre','ncur','nsuc','prec','curr','succ'];
    k = k == null ? k : classes[Math.sign(k) + 1 +(node.slides > 0 ? 0 : 3)];
    if (k && node.elem.classList.contains(k)) return;
    classes.forEach(x => { node.elem.classList.remove(x); });
    if (k) node.elem.classList.add(k);
  };

  function printPageNumber(tree) {
    var pages = tree.nodes.filter(x => isSlide(x) && x.slides === 0);
    replaceTexts('.presen_slide_index', pages.findIndex(x => x.i === 0) + 1);
    replaceTexts('.presen_slide_total', pages.length);
  }

  function showPage(currentElem, offset, tree) {
    tree = tree || Presen.getPageTree();
    var focus = tree.nodes.filter(e => e.children.length === 0);
    var i = focus.findIndex(e => e.elem === currentElem);
    var newPage = focus[Math.max(0, Math.min(focus.length - 1, i + offset))];
    if (newPage == null) return null;
    var pos = tree.nodes.indexOf(newPage);
    for (var j = 0; j < tree.nodes.length; j++)
      tree.nodes[j].i = j - pos;
    for (var n = newPage; n.elem != null; n = n.parent)
      n.i = 0;
    printPageNumber(tree);
    for (var k = 0; k < tree.nodes.length; k++)
      Presen.setPosClass(tree.nodes[k], tree.nodes[k].i);
    return newPage.elem;
  }

  function findPage(elem, tree) {
    while (elem && elem.nodeName !== 'SECTION') elem = elem.parentElement;
    var n = tree.nodes.find(x => x.elem === elem);
    while (n != null && n.children.length > 0) n = n.children[0];
    return n ? n.elem : null;
  }

  var currentElem = null;

  function setCurrentElem(elem, f) {
    if (currentElem == null && elem != null) {
      document.documentElement.classList.add('presen_mode');
      if (document.activeElement) document.activeElement.blur();
    } else if (currentElem != null && elem == null) {
      Presen.getPageTree().nodes.forEach(n => { Presen.setPosClass(n, null); });
      printPageNumber({nodes:[]});
      setTimeout(x => { x.scrollIntoView(true); if (f) f(); }, 0, currentElem);
      document.documentElement.classList.remove('presen_mode');
      document.body.classList.remove('presen_blackout');
    }
    currentElem = elem;
  }

  window.addEventListener('keydown', e => {
    if (currentElem == null) return;
    if (!document.body.classList.contains('presen_blackout') || e.key === 'b')
      switch (e.key) {
      case 'ArrowDown': case 'ArrowRight': case 'PageDown':
        setCurrentElem(showPage(currentElem, 1));
        break;
      case 'ArrowUp': case 'ArrowLeft': case 'PageUp':
        setCurrentElem(showPage(currentElem, -1));
        break;
      case 'b':
        document.body.classList.toggle('presen_blackout');
        break;
      default:
        setCurrentElem(null);
      }
    if (currentElem != null)
      e.preventDefault();
  });
  window.addEventListener('click', e => {
    if (currentElem == null || e.defaultPrevented || e.target.tabIndex < 0)
      return; /* this might be the only way to check focusable in safari */
    setCurrentElem(null, () => {
      e.target.dispatchEvent(new MouseEvent('click', e)); });
    e.preventDefault();
  });

  var touchPos = {b:0, e:0};
  window.addEventListener('touchstart', e => {
    if (currentElem == null) return;
    touchPos = {b:e.touches[0].clientX, e:e.touches[0].clientX};
  });
  window.addEventListener('touchmove', e => {
    if (currentElem == null) return;
    touchPos.e = e.touches[0].clientX;
  });
  window.addEventListener('touchend', e => {
    if (currentElem == null) return;
    var dx = touchPos.e - touchPos.b;
    if (dx < -window.innerWidth / 12 || window.innerWidth / 12 < dx)
      setCurrentElem(showPage(currentElem, -Math.sign(dx)));
  });

  window.addEventListener('load', e => {
    var p = document.createElement('A');
    p.appendChild(document.createTextNode('\u25b6'));
    p.className = 'presen_button';
    p.title = 'start presentation';
    var c = document.createElement('DIV');
    c.id = c.className = 'presen_toolbar';
    c.appendChild(p);
    document.body.appendChild(c);
    var s = x => e => { e.target.className = x; e.preventDefault(); };
    c.addEventListener('mousedown', s('presen_button_pressed'));
    c.addEventListener('mouseup', s('presen_button'));
    c.addEventListener('mouseout', s('presen_button'));
    p.addEventListener('click', e => {
      e.preventDefault();
      var tree = Presen.getPageTree();
      setCurrentElem(showPage(findPage(getCenterElem(), tree), 0, tree));
      var d = document.documentElement;
      d.classList.add('presen_mode_init');
      setTimeout(() => { d.classList.remove('presen_mode_init'); }, 100);
    });
  }, true);
})();
