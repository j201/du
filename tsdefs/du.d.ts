interface DuStatic extends Document {
	toArray<T>(arrayLike: {length: number}): T[];
	each<T>(arrayLike: {length: number}, fn: (el: any, ...any)=>T): T[];
	id(id: string): HTMLElement;
	tag(tagName: string): HTMLCollection;
	tag(el: HTMLElement, tagName: string): HTMLCollection;
	className(className: string): HTMLCollection;
	className(el: HTMLElement, className: string): HTMLCollection;
	qs(query: string): HTMLElement;
	qs(el: HTMLElement, query: string): HTMLElement;
	qsa(query: string): HTMLCollection;
	qsa(el: HTMLElement, query: string): HTMLCollection;
	event(type: string, listener: (e: Event, ...any)=>any): void;
	event(target: HTMLElement, type: string, listener: (e: Event, ...any)=>any): void;
	load(listener: (e: Event, ...any)=>any): void;
	click(listener: (e: Event, ...any)=>any): void;
	click(el: HTMLElement, listener: (e: Event, ...any)=>any): void;
	rmEvent(type: string, listener: (e: Event, ...any)=>any): void;
	rmEvent(target: HTMLElement, type: string, listener: (e: Event, ...any)=>any): void;
	ready(listener: (e: Event, ...any)=>any): void;
	clear(): void; // Doesn't actually exist on du, just to make TypeScript happy
	clear(node: Node): Node[];
	setChild<T extends Node>(node: Node, child: T): T;
	textNode(text: string): Text;
	appendText(node: Node, text: string): Text;
	prepend<T extends Node>(node: Node, child: T): T;
	remove<T extends Node>(node: T): T;
	insertAfter<T extends Node>(node: Node, newNode: T, refNode: Node): T;
	setText(node: Node, text: string): Text;
	addClass(el: HTMLElement, ...string): void;
	rmClass(el: HTMLElement, ...string): void;
}

declare var du: DuStatic; 
declare module "du" {
	export = du;
}
