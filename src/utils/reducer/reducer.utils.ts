import { AnyAction } from 'redux';

// Matchable Type
// This type is useful to compare an Action creator function and 
// any other Action function
// This type allows the comparison because the type of the action creator function
// and the type of the action function are combined.
// This combination is useful only for the sake of performing the comparison.  
type Matchable<AC extends () => AnyAction> = AC & {
	type: ReturnType<AC>['type'];
	match(action: AnyAction): action is ReturnType<AC>;
}

// Matcher overload function for action creator functions with no parameters.
export function withMatcher<AC extends () => AnyAction 
	& { type: string }>(actionCreator: AC): Matchable<AC>;

// Matcher overload function for action creator functions with parameters.
export function withMatcher<AC extends (...args: any[]) => AnyAction 
	& { type: string }>(actionCreator: AC): Matchable<AC>;

// The withMatcher function
// The withMatcher function will be used by an action creator function 
// to check that an action function passed to it is of the same type. 
export function withMatcher(actionCreator: Function) {
	const type = actionCreator().type;
	return Object.assign(actionCreator, {
		type,
		match(action: AnyAction) {
			return action.type === type;
		}
	})
}

// type declaration for Action with Payload
export type ActionWithPayload<T, P> = {
	type: T;
	payload: P;
}

// type declaration for Action with no payload
export type Action<T> = {
	type: T;
}

// overloaded function for createAction for Actions with payloads
export function createAction<T extends string, P>(
		type: T, 
		payload: P
	): ActionWithPayload<T, P>;

// overloaded function for createAction for Actions with no payload
export function createAction<T extends string>(
		type: T, 
		payload: void
	): Action<T>;

// createAction function that returns an Action object. 
export function createAction<T extends string, P>(type: T, payload: P) {
	return { type, payload };
}