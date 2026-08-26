'use strict';

const test = require('node:test');
const assert = require('node:assert');
const { mangleTokens } = require('../src/services/tokenManglingService');

test('tokenManglingService - coordinated mangling of classes and ids across HTML, CSS, JS', () => {
  const html = '<div id="main-navigation-hero" class="feature-card-wrapper highlight-text">Content</div>';
  const css = '#main-navigation-hero { display: flex; } .feature-card-wrapper { padding: 20px; } .highlight-text { color: red; }';
  const js = 'document.querySelector("#main-navigation-hero"); document.querySelectorAll(".feature-card-wrapper");';

  const result = mangleTokens({ html, css, js });

  assert.ok(result.html);
  assert.ok(result.css);
  assert.ok(result.js);

  const outHtml = result.html.toString('utf8');
  const outCss = result.css.toString('utf8');
  const outJs = result.js.toString('utf8');

  // Verify that class names were shortened
  assert.ok(!outHtml.includes('feature-card-wrapper'));
  assert.ok(!outHtml.includes('main-navigation-hero'));
  assert.ok(!outCss.includes('feature-card-wrapper'));
  assert.ok(!outCss.includes('main-navigation-hero'));

  // Verify that the new identifiers match in HTML, CSS, and JS
  const mappedClass = result.tokenMap.classes['feature-card-wrapper'];
  assert.ok(mappedClass);
  assert.ok(outHtml.includes(`class="${mappedClass}`));
  assert.ok(outCss.includes(`.${mappedClass}`));
  assert.ok(outJs.includes(`.${mappedClass}`));

  const mappedId = result.tokenMap.ids['main-navigation-hero'];
  assert.ok(mappedId);
  assert.ok(outHtml.includes(`id="${mappedId}"`));
  assert.ok(outCss.includes(`#${mappedId}`));

  assert.ok(result.stats.savingsPercent > 0);
  assert.ok(result.stats.classesMangled >= 2);
  assert.ok(result.stats.idsMangled >= 1);
});
