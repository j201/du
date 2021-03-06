/// <reference path="./du.d.ts"/>

var extendTest = du.getElementById('foo');
var arr: number[] = du.toArray<number>({length: 1, 0: 99});
var eachResult: number[] = du.each<number>({length: 1, 0: 99}, x => x);
var id: HTMLElement = du.id("foo");
var tags: HTMLCollection = du.tag("span");
var subTags: HTMLCollection = du.tag(id, "div");
var classes: HTMLCollection = du.className("bar");
var subClasses: HTMLCollection = du.className(id, "bar");
var query: HTMLElement = du.qs("#foo");
var subQuery: HTMLElement = du.qs(id, "#foo");
var queryAll: HTMLCollection = du.qsa(".bar");
var subQueryAll: HTMLCollection = du.qsa(id, ".bar");
var efn = e => console.log();
du.event('load', efn);
du.event(id, 'mouseover', efn);
du.load(efn);
du.click(efn);
du.click(id, efn);
du.rmEvent('keypress', efn);
du.rmEvent(id, 'focus', efn);
du.ready(efn);
var text: Text = du.textNode('baz');
var child: Text = du.setChild(id, text);
var appendedText: Text = du.appendText(id, "baz");
var prepended: Text = du.prepend(id, text);
var removed: HTMLElement = du.remove(du.id('ohno'));
var insertedAfter: Text = du.insertAfter(du.id('parent'), text, du.id('child'));
var setText: Text = du.setText(id, 'baz');
du.addClass(id, 'bar');
du.rmClass(id, 'bar');
var idHasClass: boolean = du.hasClass(id, 'bar');
