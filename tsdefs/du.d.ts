
declare module du {
	function toArray<T>(arrayLike: {length: number}): T[];
	function each<T>(arrayLike: {length: number}, fn: (el: any, ...any)=>T): T[];
	function id(): HTMLElement;
	function tag(tagName: string): HTMLCollection;
	function tag(el: HTMLElement, tagName: string): HTMLCollection;
	function className(className: string): HTMLCollection;
	function className(el: HTMLElement, className: string): HTMLCollection;
	function qs(query: string): HTMLElement;
	function qs(el: HTMLElement, query: string): HTMLElement;
	function qsa(query: string): HTMLElement;
	function qsa(el: HTMLElement, query: string): HTMLElement;
	function event(type: string, listener: (e: Event, ...any)=>any): void;
	function event(target: HTMLElement, type: string, listener: (e: Event, ...any)=>any): void;
}
