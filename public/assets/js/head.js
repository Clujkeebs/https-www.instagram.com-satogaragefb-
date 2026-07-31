/**
 * Tiny blocking script, loaded in <head> before the page paints.
 *
 * It does two things for the scroll-reveal animation, both about failing safe:
 *
 * 1. Adds .has-js. The stylesheet only hides .reveal elements under .has-js, so
 *    with scripting off nothing is ever stuck at opacity 0. Running before first
 *    paint also avoids a flash of content appearing and then being hidden.
 *
 * 2. Sets an independent backstop timer. main.js normally reveals sections as
 *    they scroll into view, but if it fails to load or throws, this still shows
 *    everything. It deliberately does not depend on main.js in any way.
 */
document.documentElement.classList.add('has-js');

setTimeout(function revealBackstop() {
  var hidden = document.querySelectorAll('.reveal:not(.is-visible)');
  for (var i = 0; i < hidden.length; i += 1) {
    hidden[i].classList.add('is-visible');
  }
}, 3000);
