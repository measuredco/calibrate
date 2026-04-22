import { specToArgTypes, specToComponentDescription } from "../../helpers/spec";
import { CLBR_PROSE_SPEC, type ClbrProseProps, renderClbrProse } from "./prose";

const baseArgTypes = specToArgTypes(CLBR_PROSE_SPEC);

const meta = {
  argTypes: baseArgTypes,
  parameters: {
    docs: {
      description: {
        component: specToComponentDescription(CLBR_PROSE_SPEC),
      },
    },
    padding: "4.2rem 3rem",
  },
  title: "Typographic/Prose",
};

export default meta;

export const Default = {
  args: {
    align: "start",
    hangingIndent: undefined,
    measured: true,
    responsive: false,
    children: `<h1 id="an-h1-heading">An <code>h1</code> heading</h1>
<p>This is a paragraph, lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.</p>
<p><em>Emphasis</em>, <code>code</code>, <del>deleted</del>,  and <strong>bold</strong>.</p>
<p>Here’s a link to <a href="https://measured.co">a website</a>, to a <a href="/">local
doc</a>, and to a <a href="#an-h2-heading">section heading in the current
doc</a>. Here’s a footnote <sup><a href="#user-content-fn-1" id="user-content-fnref-1" data-footnote-ref="" aria-describedby="footnote-label">1</a></sup> and another one <sup><a href="#user-content-fn-2" id="user-content-fnref-2" data-footnote-ref="" aria-describedby="footnote-label">2</a></sup>. And an autolink literal <a href="https://measured.co">measured.co</a>.</p>
<p>Colour chips are supported <code>hotpink<span class="gfm-color-chip" style="background-color: #ff69b4;"></span></code> <code>#ff69b4<span class="gfm-color-chip" style="background-color: #ff69b4;"></span></code></p>
<p><small>I’m small.</small></p>
<h2 id="an-h2-heading">An <code>h2</code> heading</h2>
<blockquote>
<p>One more attribute the modern typographer must have: the capacity for taking great pains with seemingly unimportant detail.</p>
<p>To him, one typographical point must be as important as one inch, and he must harden his heart against the accusation of being too fussy.</p>
</blockquote>
<p><a href="http://www.germandesigners.net/designers/hans_peter_schmoller">Hans P. Schmoller</a>, in <i>Book Design Today</i>, <i>Printing Review</i>, Spring 1951</p>
<h3 id="an-h3-heading">An <code>h3</code> heading</h3>
<p>Itemised lists look like</p>
<ul>
<li>this one</li>
<li>that one</li>
<li>the other one</li>
</ul>
<p>Here’s a numbered list</p>
<ol>
<li>first item</li>
<li>second item</li>
<li>third item</li>
</ol>
<p>Now a nested list</p>
<ol>
<li>
<p>First, get these ingredients</p>
<ul>
<li>carrots</li>
<li>celery</li>
<li>lentils</li>
</ul>
</li>
<li>
<p>Boil some water.</p>
</li>
<li>
<p>Dump everything in the pot</p>
<p>Do not bump wooden spoon or it will fall</p>
</li>
</ol>
<ul class="contains-task-list">
<li class="task-list-item"><input type="checkbox" disabled=""> This</li>
<li class="task-list-item"><input type="checkbox" checked="" disabled=""> That</li>
</ul>
<h4 id="an-h4-heading">An <code>h4</code> heading</h4>
<p>Here’s some code samples</p>
<pre><code>define foo() {
  print "bar";
}
</code></pre>
<pre><code class="language-js"><span class="hljs-comment">/* JavaScript */</span>

<span class="hljs-variable">console</span>.<span class="hljs-title">log</span>(<span class="hljs-string">"oO0 iIlL1 g9qCGQ ~-+=&gt;-&gt;"</span>);

<span class="hljs-keyword">function</span> <span class="hljs-title">updateGutters</span>(<span class="hljs-params">cm</span>) {
  <span class="hljs-keyword">var</span> gutters = cm.<span class="hljs-property">display</span>.<span class="hljs-property">gutters</span>,
      specs = cm.<span class="hljs-property">options</span>.<span class="hljs-property">gutters</span>;

  <span class="hljs-title">removeChildren</span>(gutters);

  <span class="hljs-keyword">for</span> (<span class="hljs-keyword">var</span> i = <span class="hljs-number">0</span>; i &lt; specs.<span class="hljs-property">length</span>; ++i) {
    <span class="hljs-keyword">var</span> gutterClass = specs[i];
    <span class="hljs-keyword">var</span> gElt = gutters.<span class="hljs-title">appendChild</span>(
      <span class="hljs-title">elt</span>(
        <span class="hljs-string">"div"</span>,
        <span class="hljs-literal">null</span>,
        <span class="hljs-string">"CodeMirror-gutter "</span> + gutterClass
      )
    );
    <span class="hljs-keyword">if</span> (gutterClass == <span class="hljs-string">"CodeMirror-linenumbers"</span>) {
      cm.<span class="hljs-property">display</span>.<span class="hljs-property">lineGutter</span> = gElt;
      gElt.<span class="hljs-property">style</span>.<span class="hljs-property">width</span> = (cm.<span class="hljs-property">display</span>.<span class="hljs-property">lineNumWidth</span> || <span class="hljs-number">1</span>) + <span class="hljs-string">"px"</span>;
    }
  }
  gutters.<span class="hljs-property">style</span>.<span class="hljs-property">display</span> = i ? <span class="hljs-string">""</span> : <span class="hljs-string">"none"</span>;
  <span class="hljs-title">updateGutterSpace</span>(cm);

  <span class="hljs-keyword">return</span> <span class="hljs-literal">false</span>;
}
<span class="hljs-keyword">const</span> total = price * quantity + tax;
</code></pre>
<h5 id="an-h5-heading">An <code>h5</code> heading</h5>
<p>Images can be specified like so.</p>
<p><img src="https://res.cloudinary.com/measuredco/image/upload/f_auto,q_auto/v1734524207/social_ubhnos.png" alt="Measured"></p>
<p>A horizontal rule follows.</p>
<hr>
<h6 id="an-h6-heading">An <code>h6</code> heading</h6>
<p>Tables look like this</p>
<table><thead><tr><th align="left">Tables</th><th align="center">Are</th><th align="right">Cool</th></tr></thead><tbody><tr><td align="left">col 2 is</td><td align="center">centre-aligned</td><td align="right">£12</td></tr><tr><td align="left">col 3 is</td><td align="center">right-aligned</td><td align="right">£1600</td></tr><tr><td align="left">zebra stripes</td><td align="center">are neat</td><td align="right">£1</td></tr></tbody></table>
<p>Hamburgefonstiv</p>
<hr>
<ol>
<li>
<h2 id="first-h2-item">First <code>h2</code> item</h2>
<p>A short paragraph introducing the first item.</p>
<ul>
<li>
<p>A related bullet</p>
<ul>
<li>A nested bullet</li>
<li>Another nested bullet</li>
</ul>
</li>
<li>
<p>Another bullet</p>
</li>
</ul>
<ol>
<li>A nested numbered point</li>
<li>Another numbered point</li>
</ol>
<p>A closing paragraph with a bit more detail.</p>
</li>
<li>
<h2 id="second-h2-item">Second <code>h2</code> item</h2>
<p>Another paragraph to set the scene.</p>
<ul>
<li>Bullet one</li>
<li>Bullet two</li>
</ul>
<ol>
<li>Step one</li>
<li>Step two</li>
<li>Step three</li>
</ol>
<p>Final paragraph to wrap up this item.</p>
</li>
</ol>
<h2 id="smaller-ideas">Smaller ideas</h2>
<ol>
<li>
<h3 id="first-h3-item">First <code>h3</code> item</h3>
<p>A quick paragraph for the smaller section.</p>
<ul>
<li>A short bullet</li>
<li>Another bullet</li>
</ul>
<ol>
<li>First sub-step</li>
<li>Second sub-step</li>
</ol>
<p>Closing line for this item.</p>
</li>
<li>
<h3 id="second-h3-item">Second <code>h3</code> item</h3>
<p>Intro paragraph for the second <code>h3</code>.</p>
<ul>
<li>One bullet</li>
<li>Two bullet</li>
</ul>
<ol>
<li>Alpha</li>
<li>Beta</li>
<li>Gamma</li>
</ol>
<p>Final paragraph to finish.</p>
</li>
</ol>
<section data-footnotes="" class="footnotes"><h2 class="sr-only" id="footnote-label">Footnotes</h2>
<ol>
<li id="user-content-fn-1">
<p>Footnote text goes here. <a href="#user-content-fnref-1" data-footnote-backref="" aria-label="Back to reference 1" class="data-footnote-backref">↩</a></p>
</li>
<li id="user-content-fn-2">
<p>Another footnote <a href="#user-content-fnref-2" data-footnote-backref="" aria-label="Back to reference 2" class="data-footnote-backref">↩</a></p>
</li>
</ol>
</section>`,
  } satisfies ClbrProseProps,
  render: (args: ClbrProseProps) => renderClbrProse({ ...args }),
};
