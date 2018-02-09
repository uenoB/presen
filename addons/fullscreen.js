/*
 * fullscreen.js - the full-screen button
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

  function toggleFullscreen() {
    var d = document, e = document.documentElement;
    var request = e.requestFullscreen || e.mozRequestFullScreen ||
                  e.webkitRequestFullScreen || e.msRequestFullscreen;
    var exit = d.exitFullscreen || d.mozCancelFullScreen ||
               d.webkitExitFullscreen || d.msExitFullscreen;
    var fullscreen = d.fullscreenElement || d.mozFullScreenElement ||
                     d.webkitFullscreenElement || d.msFullscreenElement;
    fullscreen ? exit.call(d) : request.call(e);
  }

  window.addEventListener('load', e => {
    var c = document.getElementById('presen_toolbar');
    var f = document.createElement('A');
    f.appendChild(document.createTextNode('\u2b1a'));
    f.title = 'full screen';
    f.className = 'presen_button';
    c.insertBefore(f, c.firstChild);
    f.addEventListener('click', toggleFullscreen);
  });
})();
