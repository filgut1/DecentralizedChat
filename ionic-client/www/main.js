(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"],{

/***/ 0:
/*!***************************!*\
  !*** multi ./src/main.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! D:\Code\DecentralizedChat\ionic-client\src\main.ts */"zUnb");


/***/ }),

/***/ "0Jz7":
/*!****************************************!*\
  !*** ./src/app/_helpers/gun.helper.ts ***!
  \****************************************/
/*! exports provided: on$, once$ */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "on$", function() { return on$; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "once$", function() { return once$; });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! rxjs */ "qCKp");
/* harmony import */ var underscore_underscore_esm__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! underscore/underscore-esm */ "qcZ9");


function on$(node, cleanup = true, opts = {}) {
    return Object(rxjs__WEBPACK_IMPORTED_MODULE_0__["fromEventPattern"])(handler => {
        // there is no way to off() an on() until at least one value is trigerred
        // so that we can access the event listener to off() it
        const signal = { stop: false };
        node.on((data, key, at, ev) => {
            if (signal.stop) {
                ev.off();
            }
            else {
                // modifying data directly does not seem to work...
                handler(cleanup ? Object(underscore_underscore_esm__WEBPACK_IMPORTED_MODULE_1__["pick"])(data, (v, k, o) => v !== null && k !== '_') : data);
            }
        }, opts);
        return signal;
    }, (handler, signal) => { signal.stop = true; });
}
function once$(node) {
    return new rxjs__WEBPACK_IMPORTED_MODULE_0__["Observable"](o => node.once(v => {
        o.next(v);
        o.complete();
    }));
}


/***/ }),

/***/ "5ZPe":
/*!**********************************************!*\
  !*** ./src/app/_services/account.service.ts ***!
  \**********************************************/
/*! exports provided: AccountService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AccountService", function() { return AccountService; });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! rxjs */ "qCKp");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _app_services__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @app/_services */ "J9tS");
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @ionic/angular */ "TEn/");




class AccountService {
    constructor(gunDB, navCtrl) {
        this.gunDB = gunDB;
        this.navCtrl = navCtrl;
        this.userSubject = new rxjs__WEBPACK_IMPORTED_MODULE_0__["BehaviorSubject"](JSON.parse(localStorage.getItem('user')));
        this.user = this.userSubject.asObservable();
    }
    get userValue() {
        return this.userSubject.value;
    }
    login(username, password) {
        return this.gunDB.authenticate(username, password)
            .then((user) => {
            this.userSubject.next(user);
            return user;
        });
    }
    logout() {
        // remove user from local storage and set current user to null
        localStorage.removeItem('user');
        this.userSubject.next(null);
        this.gunDB.logout();
        this.navCtrl.navigateRoot(['/login']);
    }
    register(user) {
        return this.gunDB.createUser(user);
    }
    getCurrentUserProfile() {
        return this.gunDB.getCurrentUserProfile();
    }
}
AccountService.ɵfac = function AccountService_Factory(t) { return new (t || AccountService)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵinject"](_app_services__WEBPACK_IMPORTED_MODULE_2__["GunDB"]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵinject"](_ionic_angular__WEBPACK_IMPORTED_MODULE_3__["NavController"])); };
AccountService.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjectable"]({ token: AccountService, factory: AccountService.ɵfac, providedIn: 'root' });


/***/ }),

/***/ "7JE1":
/*!*******************************!*\
  !*** ./node_modules/gun sync ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

function webpackEmptyContext(req) {
	var e = new Error("Cannot find module '" + req + "'");
	e.code = 'MODULE_NOT_FOUND';
	throw e;
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = "7JE1";

/***/ }),

/***/ "9VjZ":
/*!********************************************************!*\
  !*** ./src/app/conversation/conversation.component.ts ***!
  \********************************************************/
/*! exports provided: ConversationComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ConversationComponent", function() { return ConversationComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "mrSG");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ "qCKp");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _app_services__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @app/_services */ "J9tS");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/router */ "tyNb");
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @ionic/angular */ "TEn/");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/common */ "ofXK");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/forms */ "3Pt+");








const _c0 = ["scrollBottom"];
const _c1 = function (a0, a1) { return { "my_message": a0, "other_message": a1 }; };
function ConversationComponent_ion_row_8_ion_col_1_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "ion-col", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](1, "span", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](3, "br");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](4, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](6, "div", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](8, "date");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
} if (rf & 2) {
    const message_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]().$implicit;
    const ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction2"](7, _c1, !ctx_r3.isReceivedMessage(message_r2), ctx_r3.isReceivedMessage(message_r2)));
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"]("", message_r2.from, ":");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](message_r2.message);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind2"](8, 4, message_r2.ts, "shortTime"));
} }
function ConversationComponent_ion_row_8_ion_col_2_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "ion-col", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](1, "span", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](3, "br");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](4, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](6, "div", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](8, "date");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
} if (rf & 2) {
    const message_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]().$implicit;
    const ctx_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction2"](7, _c1, !ctx_r4.isReceivedMessage(message_r2), ctx_r4.isReceivedMessage(message_r2)));
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"]("", message_r2.from, ":");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](message_r2.message);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind2"](8, 4, message_r2.ts, "shortTime"));
} }
const _c2 = function (a0, a1) { return { "ion-align-self-start": a0, "ion-align-self-end": a1 }; };
function ConversationComponent_ion_row_8_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "ion-row", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](1, ConversationComponent_ion_row_8_ion_col_1_Template, 9, 10, "ion-col", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](2, ConversationComponent_ion_row_8_ion_col_2_Template, 9, 10, "ion-col", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
} if (rf & 2) {
    const message_r2 = ctx.$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction2"](3, _c2, ctx_r1.isReceivedMessage(message_r2), !ctx_r1.isReceivedMessage(message_r2)));
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx_r1.isReceivedMessage(message_r2));
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", !ctx_r1.isReceivedMessage(message_r2));
} }
class ConversationComponent {
    constructor(db, accountService, router) {
        this.db = db;
        this.accountService = accountService;
        this.router = router;
        this.loading = false;
        this.messageContent = '';
        this.user = this.accountService.userValue;
    }
    ngOnInit() {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            this.currentConvo = this.router.getCurrentNavigation().extras.state;
            const epub = this.currentConvo.epub;
            this.loading = true;
            const [msgPathsFrom, msgPathsTo] = yield Promise.all([
                this.db.$once(this.db.messagesFrom(epub)),
                this.db.$once(this.db.messagesTo(epub)),
            ]);
            // Create a flattened array of message paths 
            const msgPaths = [].concat.apply([], [
                ...Object.values(msgPathsFrom),
                ...Object.values(msgPathsTo)
            ]);
            // Need to load and sort existing messages first
            this.conversation = yield this.loadMessages(msgPaths);
            this.loading = false;
            this.messagesSubscription = new rxjs__WEBPACK_IMPORTED_MODULE_1__["Observable"](o => {
                let stopped = false;
                this.db.messagesFrom(epub).map().on((data, key, at, ev) => Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
                    if (stopped) {
                        o.complete();
                        return ev.off();
                    }
                    const res = yield this.db.decryptMessage(JSON.parse(data));
                    // Check for duplicate messages just in case
                    if (!this.conversation.some(e => e.uuid === res.uuid)) {
                        o.next(res);
                    }
                }), { change: true });
                return () => {
                    stopped = true;
                };
            }).subscribe(d => this.conversation.push(d));
        });
    }
    ngAfterViewChecked() {
        this.scrollToBottom();
    }
    ionViewDidEnter() {
        this.scrollToBottom();
    }
    scrollToBottom() {
        try {
            this.scrollBottom.scrollToBottom(300);
        }
        catch (err) { }
    }
    ngOnChanges(changes) {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            if (changes.currentConvo.currentValue) {
                const epub = changes.currentConvo.currentValue.epub;
                this.loading = true;
                const [msgPathsFrom, msgPathsTo] = yield Promise.all([
                    this.db.$once(this.db.messagesFrom(epub)),
                    this.db.$once(this.db.messagesTo(epub)),
                ]);
                // Create a flattened array of message paths 
                const msgPaths = [].concat.apply([], [
                    ...Object.values(msgPathsFrom),
                    ...Object.values(msgPathsTo)
                ]);
                // Need to load and sort existing messages first
                this.conversation = yield this.loadMessages(msgPaths);
                this.loading = false;
                this.messagesSubscription = new rxjs__WEBPACK_IMPORTED_MODULE_1__["Observable"](o => {
                    let stopped = false;
                    this.db.messagesFrom(epub).map().on((data, key, at, ev) => Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
                        if (stopped) {
                            o.complete();
                            return ev.off();
                        }
                        const res = yield this.db.decryptMessage(JSON.parse(data));
                        // Check for duplicate messages just in case
                        if (!this.conversation.some(e => e.uuid === res.uuid)) {
                            o.next(res);
                        }
                    }), { change: true });
                    return () => {
                        stopped = true;
                    };
                }).subscribe(d => this.conversation.push(d));
                // Subscribe to new messages
                /* this.db.on$(this.db.messagesFrom(epub).map(),
                  {change: true}).subscribe(async data => {
                    const res = await this.db.decryptMessage(JSON.parse(data));
                    // Check for duplicate messages just in case
                    if (!this.conversation.some(e => e.uuid === res.uuid)) {
                      this.conversation.push(res);
                    }
                  });
                  */
            }
        });
    }
    loadMessages(messages) {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            const decryptPromises = [];
            for (let message of messages) {
                message = JSON.parse(message);
                if (this.isReceivedMessage(message)) {
                    decryptPromises.push(this.db.decryptMessage(message));
                }
                else {
                    decryptPromises.push(this.db.decryptMyOwnMessage(message));
                }
            }
            const final = yield Promise.all(decryptPromises);
            return final.sort((a, b) => a.ts - b.ts);
        });
    }
    sendMessage() {
        console.log(this.messageContent);
        const ts = (new Date()).getTime();
        if (this.currentConvo) {
            this.db.sendMessage(this.currentConvo.epub, this.currentConvo.alias, this.messageContent, ts);
            this.conversation.push({
                from: this.db.myAlias,
                ts: ts,
                message: this.messageContent
            });
            this._clearChat();
        }
    }
    isReceivedMessage(message) {
        return this.user.alias !== message.from;
    }
    _clearChat() {
        this.messageContent = '';
    }
}
ConversationComponent.ɵfac = function ConversationComponent_Factory(t) { return new (t || ConversationComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_app_services__WEBPACK_IMPORTED_MODULE_3__["GunDB"]), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_app_services__WEBPACK_IMPORTED_MODULE_3__["AccountService"]), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_4__["Router"])); };
ConversationComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({ type: ConversationComponent, selectors: [["app-conversation"]], viewQuery: function ConversationComponent_Query(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵviewQuery"](_c0, 1);
    } if (rf & 2) {
        let _t;
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵloadQuery"]()) && (ctx.scrollBottom = _t.first);
    } }, inputs: { currentConvo: "currentConvo" }, features: [_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵNgOnChangesFeature"]], decls: 14, vars: 4, consts: [["slot", "start", "defaultHref", "/"], ["scrollBottom", ""], ["class", "message", 3, "ngClass", 4, "ngFor", "ngForOf"], ["no-lines", ""], ["type", "text", "placeholder", "Message", "name", "messageContent", 3, "ngModel", "ngModelChange"], ["ion-button", "", "clear", "", "color", "primary", 3, "disabled", "click"], ["name", "send"], [1, "message", 3, "ngClass"], ["size", "9", 3, "ngClass", 4, "ngIf"], ["offset", "3", "size", "9", 3, "ngClass", 4, "ngIf"], ["size", "9", 3, "ngClass"], [1, "user_name"], [1, "time"], ["offset", "3", "size", "9", 3, "ngClass"]], template: function ConversationComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "ion-header");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](1, "ion-toolbar");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](2, "ion-back-button", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](3, "ion-title");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](5, "ion-content", null, 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](7, "ion-grid");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](8, ConversationComponent_ion_row_8_Template, 3, 6, "ion-row", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](9, "ion-footer");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](10, "ion-item", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](11, "ion-input", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("ngModelChange", function ConversationComponent_Template_ion_input_ngModelChange_11_listener($event) { return ctx.messageContent = $event; });
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](12, "button", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function ConversationComponent_Template_button_click_12_listener() { return ctx.sendMessage(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](13, "ion-icon", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"](" ", ctx.currentConvo && ctx.currentConvo.alias, " ");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngForOf", ctx.conversation);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngModel", ctx.messageContent);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("disabled", ctx.messageContent === "");
    } }, directives: [_ionic_angular__WEBPACK_IMPORTED_MODULE_5__["IonHeader"], _ionic_angular__WEBPACK_IMPORTED_MODULE_5__["IonToolbar"], _ionic_angular__WEBPACK_IMPORTED_MODULE_5__["IonBackButton"], _ionic_angular__WEBPACK_IMPORTED_MODULE_5__["IonBackButtonDelegate"], _ionic_angular__WEBPACK_IMPORTED_MODULE_5__["IonTitle"], _ionic_angular__WEBPACK_IMPORTED_MODULE_5__["IonContent"], _ionic_angular__WEBPACK_IMPORTED_MODULE_5__["IonGrid"], _angular_common__WEBPACK_IMPORTED_MODULE_6__["NgForOf"], _ionic_angular__WEBPACK_IMPORTED_MODULE_5__["IonFooter"], _ionic_angular__WEBPACK_IMPORTED_MODULE_5__["IonItem"], _ionic_angular__WEBPACK_IMPORTED_MODULE_5__["IonInput"], _ionic_angular__WEBPACK_IMPORTED_MODULE_5__["TextValueAccessor"], _angular_forms__WEBPACK_IMPORTED_MODULE_7__["NgControlStatus"], _angular_forms__WEBPACK_IMPORTED_MODULE_7__["NgModel"], _ionic_angular__WEBPACK_IMPORTED_MODULE_5__["IonIcon"], _ionic_angular__WEBPACK_IMPORTED_MODULE_5__["IonRow"], _angular_common__WEBPACK_IMPORTED_MODULE_6__["NgClass"], _angular_common__WEBPACK_IMPORTED_MODULE_6__["NgIf"], _ionic_angular__WEBPACK_IMPORTED_MODULE_5__["IonCol"]], pipes: [_angular_common__WEBPACK_IMPORTED_MODULE_6__["DatePipe"]], styles: [".user_name[_ngcontent-%COMP%] {\n  color: #afafaf;\n}\n.message[_ngcontent-%COMP%] {\n  padding: 10px !important;\n  transition: all 250ms ease-in-out !important;\n  border-radius: 10px !important;\n  margin-bottom: 4px !important;\n}\n.my_message[_ngcontent-%COMP%] {\n  background: #4b4bf2 !important;\n  color: #000 !important;\n}\n.other_message[_ngcontent-%COMP%] {\n  background: #dcdcdc !important;\n  color: #000 !important;\n}\n.time[_ngcontent-%COMP%] {\n  color: #afafaf;\n  float: right;\n  font-size: small;\n}\n.message_row[_ngcontent-%COMP%] {\n  background-color: #fff;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbnZlcnNhdGlvbi5jb21wb25lbnQubGVzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNFLGNBQUE7QUFDRjtBQUNBO0VBQ0Usd0JBQUE7RUFDQSw0Q0FBQTtFQUNBLDhCQUFBO0VBQ0EsNkJBQUE7QUFDRjtBQUNBO0VBQ0UsOEJBQUE7RUFDQSxzQkFBQTtBQUNGO0FBQ0E7RUFDRSw4QkFBQTtFQUNBLHNCQUFBO0FBQ0Y7QUFDQTtFQUNFLGNBQUE7RUFDQSxZQUFBO0VBQ0EsZ0JBQUE7QUFDRjtBQUNBO0VBQ0Usc0JBQUE7QUFDRiIsImZpbGUiOiJjb252ZXJzYXRpb24uY29tcG9uZW50Lmxlc3MiLCJzb3VyY2VzQ29udGVudCI6WyIudXNlcl9uYW1lIHtcbiAgY29sb3I6ICNhZmFmYWY7XG59XG4ubWVzc2FnZSB7XG4gIHBhZGRpbmc6IDEwcHggIWltcG9ydGFudDtcbiAgdHJhbnNpdGlvbjogYWxsIDI1MG1zIGVhc2UtaW4tb3V0ICFpbXBvcnRhbnQ7XG4gIGJvcmRlci1yYWRpdXM6IDEwcHggIWltcG9ydGFudDtcbiAgbWFyZ2luLWJvdHRvbTogNHB4ICFpbXBvcnRhbnQ7XG59XG4ubXlfbWVzc2FnZSB7XG4gIGJhY2tncm91bmQ6IHJnYig3NSwgNzUsIDI0MikgIWltcG9ydGFudDtcbiAgY29sb3I6ICMwMDAgIWltcG9ydGFudDtcbn1cbi5vdGhlcl9tZXNzYWdlIHtcbiAgYmFja2dyb3VuZDogI2RjZGNkYyAhaW1wb3J0YW50O1xuICBjb2xvcjogIzAwMCAhaW1wb3J0YW50O1xufVxuLnRpbWUge1xuICBjb2xvcjogI2FmYWZhZjtcbiAgZmxvYXQ6IHJpZ2h0O1xuICBmb250LXNpemU6IHNtYWxsO1xufVxuLm1lc3NhZ2Vfcm93IHtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZjtcbn0iXX0= */"] });


/***/ }),

/***/ "9vUh":
/*!****************************************!*\
  !*** ./src/app/home/home.component.ts ***!
  \****************************************/
/*! exports provided: HomeComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HomeComponent", function() { return HomeComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "mrSG");
/* harmony import */ var _app_contacts_add_edit_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @app/contacts/add-edit.component */ "eVEn");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _app_services__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @app/_services */ "J9tS");
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ionic/angular */ "TEn/");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/forms */ "3Pt+");
/* harmony import */ var _chats_chats_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../chats/chats.component */ "wxUJ");







class HomeComponent {
    constructor(accountService, modalController) {
        this.accountService = accountService;
        this.modalController = modalController;
        this.loading = false;
        this.user = this.accountService.userValue;
    }
    newChat() {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            const modal = yield this.modalController.create({
                component: _app_contacts_add_edit_component__WEBPACK_IMPORTED_MODULE_1__["AddEditComponent"],
                swipeToClose: true
            });
            return yield modal.present();
        });
    }
    logout() {
        this.accountService.logout();
    }
}
HomeComponent.ɵfac = function HomeComponent_Factory(t) { return new (t || HomeComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_app_services__WEBPACK_IMPORTED_MODULE_3__["AccountService"]), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_ionic_angular__WEBPACK_IMPORTED_MODULE_4__["ModalController"])); };
HomeComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({ type: HomeComponent, selectors: [["ng-component"]], decls: 23, vars: 1, consts: [["href", "https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css", "rel", "stylesheet"], ["slot", "end"], [3, "click"], ["name", "create-outline"], ["fullscreen", "", 1, "ion-padding"], ["slot", "bottom"], ["tab", ""], ["name", "chatbox-outline"], ["name", "log-out-outline"], [1, "input-group"], [3, "currentConvo", "currentConvoChange", "curentConvoChange"]], template: function HomeComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](0, "link", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](1, "ion-app");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](2, "ion-header");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](3, "ion-toolbar");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](4, "ion-buttons", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](5, "ion-button", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function HomeComponent_Template_ion_button_click_5_listener() { return ctx.newChat(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](6, "ion-icon", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](7, "ion-content", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](8, "ion-tabs");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](9, "ion-tab-bar", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](10, "ion-tab-button", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](11, "ion-icon", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](12, "ion-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](13, "Chats");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](14, "ion-badge");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](15, "6");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](16, "ion-tab-button", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function HomeComponent_Template_ion_tab_button_click_16_listener() { return ctx.logout(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](17, "ion-icon", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](18, "ion-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](19, "Logout");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](20, "form", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](21, "ion-searchbar");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](22, "app-chats", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("currentConvoChange", function HomeComponent_Template_app_chats_currentConvoChange_22_listener($event) { return ctx.currentConvo = $event; })("curentConvoChange", function HomeComponent_Template_app_chats_curentConvoChange_22_listener($event) { return ctx.currentConvo = $event; });
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](22);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("currentConvo", ctx.currentConvo);
    } }, directives: [_ionic_angular__WEBPACK_IMPORTED_MODULE_4__["IonApp"], _ionic_angular__WEBPACK_IMPORTED_MODULE_4__["IonHeader"], _ionic_angular__WEBPACK_IMPORTED_MODULE_4__["IonToolbar"], _ionic_angular__WEBPACK_IMPORTED_MODULE_4__["IonButtons"], _ionic_angular__WEBPACK_IMPORTED_MODULE_4__["IonButton"], _ionic_angular__WEBPACK_IMPORTED_MODULE_4__["IonIcon"], _ionic_angular__WEBPACK_IMPORTED_MODULE_4__["IonContent"], _ionic_angular__WEBPACK_IMPORTED_MODULE_4__["IonTabs"], _ionic_angular__WEBPACK_IMPORTED_MODULE_4__["IonTabBar"], _ionic_angular__WEBPACK_IMPORTED_MODULE_4__["IonTabButton"], _ionic_angular__WEBPACK_IMPORTED_MODULE_4__["IonLabel"], _ionic_angular__WEBPACK_IMPORTED_MODULE_4__["IonBadge"], _angular_forms__WEBPACK_IMPORTED_MODULE_5__["ɵangular_packages_forms_forms_y"], _angular_forms__WEBPACK_IMPORTED_MODULE_5__["NgControlStatusGroup"], _angular_forms__WEBPACK_IMPORTED_MODULE_5__["NgForm"], _ionic_angular__WEBPACK_IMPORTED_MODULE_4__["IonSearchbar"], _ionic_angular__WEBPACK_IMPORTED_MODULE_4__["TextValueAccessor"], _chats_chats_component__WEBPACK_IMPORTED_MODULE_6__["ChatsComponent"]], encapsulation: 2 });


/***/ }),

/***/ "AytR":
/*!*****************************************!*\
  !*** ./src/environments/environment.ts ***!
  \*****************************************/
/*! exports provided: environment */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "environment", function() { return environment; });
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
const environment = {
    production: false
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.


/***/ }),

/***/ "Dgtq":
/*!**********************************!*\
  !*** ./src/app/_models/alert.ts ***!
  \**********************************/
/*! exports provided: Alert, AlertType */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Alert", function() { return Alert; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AlertType", function() { return AlertType; });
class Alert {
    constructor(init) {
        Object.assign(this, init);
    }
}
var AlertType;
(function (AlertType) {
    AlertType[AlertType["Success"] = 0] = "Success";
    AlertType[AlertType["Error"] = 1] = "Error";
    AlertType[AlertType["Info"] = 2] = "Info";
    AlertType[AlertType["Warning"] = 3] = "Warning";
})(AlertType || (AlertType = {}));


/***/ }),

/***/ "J9tS":
/*!************************************!*\
  !*** ./src/app/_services/index.ts ***!
  \************************************/
/*! exports provided: AccountService, AlertService, GunDB */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _account_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./account.service */ "5ZPe");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "AccountService", function() { return _account_service__WEBPACK_IMPORTED_MODULE_0__["AccountService"]; });

/* harmony import */ var _alert_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./alert.service */ "f5O9");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "AlertService", function() { return _alert_service__WEBPACK_IMPORTED_MODULE_1__["AlertService"]; });

/* harmony import */ var _services_gundb__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../_services/gundb */ "SvPT");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GunDB", function() { return _services_gundb__WEBPACK_IMPORTED_MODULE_2__["GunDB"]; });






/***/ }),

/***/ "SvPT":
/*!************************************!*\
  !*** ./src/app/_services/gundb.ts ***!
  \************************************/
/*! exports provided: GunDB */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GunDB", function() { return GunDB; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "mrSG");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ "qCKp");
/* harmony import */ var underscore_underscore_esm__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! underscore/underscore-esm */ "qcZ9");
/* harmony import */ var uuid__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! uuid */ "4USb");
/* harmony import */ var gun_gun__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! gun/gun */ "JZNI");
/* harmony import */ var gun_gun__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(gun_gun__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/core */ "fXoL");






__webpack_require__(/*! gun/sea */ "md/m");
class GunDB {
    constructor() {
        this.gun = gun_gun__WEBPACK_IMPORTED_MODULE_4__('http://192.168.0.15:3001/gun');
        this.sea = gun_gun__WEBPACK_IMPORTED_MODULE_4__["SEA"];
        this.gunUser = this.gun.user();
        this.gunUser.recall({ sessionStorage: true });
    }
    isLoggedIn() {
        return this.gunUser.is;
    }
    get myEpub() { return this.gunUser.is.epub; }
    get myAlias() { return this.gunUser.is.alias; }
    messagesFrom(epub) {
        return this.gun.get('convos').get('to').get(this.myEpub).get('from').get(epub);
    }
    messagesTo(epub) {
        return this.gunUser.get('sent').get(epub);
    }
    authenticate(username, password) {
        return new Promise((resolve, reject) => {
            this.gunUser.auth(username, password, ack => {
                if (ack.err && !this.gunUser.is) {
                    reject(ack.err);
                }
                else {
                    resolve(this.gunUser.is);
                }
            });
        });
    }
    createUser(user) {
        return new Promise((resolve, reject) => {
            this.gunUser.create(user.alias, user.password, ack => {
                if (ack.err) {
                    reject(ack.err);
                }
                else {
                    this.gunUser.auth(user.alias, user.password, (ack) => Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
                        const { alias } = user; // Don't store the password!
                        this.gun.get('users')
                            .get(alias)
                            .put({ epub: ack.sea.epub, alias });
                        resolve(this.gunUser.is);
                    }));
                }
            });
        });
    }
    addContact(alias, epub) {
        if (this.isLoggedIn()) {
            const contact = this.gun.get('users').get(alias);
            return new Promise(resolve => {
                this.gunUser.get('contacts').set(contact, () => resolve(true));
            });
        }
    }
    $getAllContacts() {
        if (this.isLoggedIn()) {
            const node = this.gunUser.get('contacts');
            return this.$once(node);
        }
        else {
            return Promise.reject();
        }
    }
    getCurrentUserProfile() {
        if (this.isLoggedIn()) {
            return new Promise(resolve => {
                this.gunUser.get('profile').once(data => {
                    resolve(data);
                });
            });
        }
        else {
            return Promise.reject();
        }
    }
    // Find and subscribe to user
    $findUserByAlias(alias) {
        if (this.isLoggedIn()) {
            return new Promise((resolve, reject) => {
                this.gun.get('users').get(alias).once(d => {
                    d ? resolve(this.cleanup(d)) : reject(d);
                });
            });
        }
    }
    sendMessage(epub, alias, message, ts) {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            if (this.isLoggedIn()) {
                const secret = yield this.sea.secret(epub, this.gunUser._.sea);
                const enc = yield this.sea.encrypt(message, secret);
                const encForMe = yield this.sea.encrypt(message, this.gunUser._.sea);
                const uuid = Object(uuid__WEBPACK_IMPORTED_MODULE_3__["v4"])();
                this.gunUser
                    .get('sent')
                    .get(epub)
                    .get(uuid)
                    .put(JSON.stringify({
                    from: this.myAlias,
                    epub: this.myEpub,
                    ts: ts,
                    uuid,
                    message: encForMe
                }));
                this.gun
                    .get('convos')
                    .get('to')
                    .get(epub)
                    .get('from')
                    .get(this.myEpub)
                    .get(uuid)
                    .put(JSON.stringify({
                    from: this.myAlias,
                    epub: this.myEpub,
                    ts: ts,
                    uuid,
                    message: enc
                }));
            }
        });
    }
    decryptMyOwnMessage(messageObj) {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            messageObj.message = yield this.sea.decrypt(messageObj.message, this.gunUser._.sea);
            return messageObj;
        });
    }
    decryptMessage(messageObj) {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            const secret = yield this.sea.secret(messageObj.epub, this.gunUser._.sea);
            messageObj.message = yield this.sea.decrypt(messageObj.message, secret);
            return messageObj;
        });
    }
    onAuth$() {
        return new rxjs__WEBPACK_IMPORTED_MODULE_1__["Observable"](o => this.gun.on('auth', ack => {
            o.next(ack);
            o.complete();
        }));
    }
    $onAuth() {
        // Create a promise that rejects in <ms> milliseconds
        let timeout = new Promise((resolve, reject) => {
            let id = setTimeout(() => {
                clearTimeout(id);
                reject('Timed out in ' + 1000 + 'ms.');
            }, 1000);
        });
        const promise = new Promise(resolve => {
            this.gun.on('auth', ack => {
                if (!ack.err) {
                    localStorage.setItem('user', JSON.stringify({
                        alias: ack.put.alias,
                        epub: ack.sea.epub,
                        pub: ack.sea.pub
                    }));
                    resolve({
                        alias: ack.put.alias,
                        epub: ack.sea.epub,
                        pub: ack.sea.pub
                    });
                }
            });
        });
        return Promise.race([
            promise,
            timeout
        ]);
    }
    on$(node, opts = {}) {
        return new rxjs__WEBPACK_IMPORTED_MODULE_1__["Observable"](o => {
            let stopped = false;
            node.on((data, key, at, ev) => {
                if (stopped) {
                    o.complete();
                    return ev.off();
                }
                o.next(this.cleanup(data));
            }, opts);
            return () => {
                // Caller unsubscribe
                stopped = true;
            };
        });
    }
    $once(node) {
        return new Promise(resolve => {
            node.once(data => resolve(this.cleanup(data)));
        });
    }
    once$(node) {
        return new rxjs__WEBPACK_IMPORTED_MODULE_1__["Observable"](o => node.once(data => {
            o.next(this.cleanup(data));
            o.complete();
        }));
    }
    cleanup(data) {
        return Object(underscore_underscore_esm__WEBPACK_IMPORTED_MODULE_2__["pick"])(data, (v, k, o) => v !== null && k !== '_');
    }
    logout() {
        this.gunUser.leave();
    }
}
GunDB.ɵfac = function GunDB_Factory(t) { return new (t || GunDB)(); };
GunDB.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdefineInjectable"]({ token: GunDB, factory: GunDB.ɵfac, providedIn: 'root' });


/***/ }),

/***/ "Sy1n":
/*!**********************************!*\
  !*** ./src/app/app.component.ts ***!
  \**********************************/
/*! exports provided: AppComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppComponent", function() { return AppComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "mrSG");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _services__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_services */ "J9tS");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common */ "ofXK");
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ionic/angular */ "TEn/");





function AppComponent_ion_app_0_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "ion-app", 1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](1, "alert");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](2, "ion-router-outlet");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
} }
class AppComponent {
    constructor(accountService, db) {
        this.accountService = accountService;
        this.db = db;
        this.loading = false;
        this.accountService.user.subscribe(x => this.user = x);
    }
    ngOnInit() {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            if (this.user && !this.db.isLoggedIn()) {
                this.loading = true;
                yield this.db.$onAuth();
                this.loading = false;
            }
            // In case of refresh, need to wait for authentication
            // to occurr again automatically since user.recall({sessionStorage: true}) was used
        });
    }
    logout() {
        this.accountService.logout();
    }
}
AppComponent.ɵfac = function AppComponent_Factory(t) { return new (t || AppComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_services__WEBPACK_IMPORTED_MODULE_2__["AccountService"]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_services__WEBPACK_IMPORTED_MODULE_2__["GunDB"])); };
AppComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({ type: AppComponent, selectors: [["app-root"]], decls: 1, vars: 1, consts: [["class", "app-container", 4, "ngIf"], [1, "app-container"]], template: function AppComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](0, AppComponent_ion_app_0_Template, 3, 0, "ion-app", 0);
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", !ctx.loading);
    } }, directives: [_angular_common__WEBPACK_IMPORTED_MODULE_3__["NgIf"], _ionic_angular__WEBPACK_IMPORTED_MODULE_4__["IonApp"], _ionic_angular__WEBPACK_IMPORTED_MODULE_4__["IonRouterOutlet"]], styles: ["\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJhcHAuY29tcG9uZW50LmNzcyJ9 */"] });


/***/ }),

/***/ "XgRA":
/*!***********************************!*\
  !*** ./src/app/_helpers/index.ts ***!
  \***********************************/
/*! exports provided: AuthGuard, on$, once$ */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _auth_guard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./auth.guard */ "p3Fh");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "AuthGuard", function() { return _auth_guard__WEBPACK_IMPORTED_MODULE_0__["AuthGuard"]; });

/* harmony import */ var _gun_helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./gun.helper */ "0Jz7");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "on$", function() { return _gun_helper__WEBPACK_IMPORTED_MODULE_1__["on$"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "once$", function() { return _gun_helper__WEBPACK_IMPORTED_MODULE_1__["once$"]; });





/***/ }),

/***/ "YF+o":
/*!********************************************!*\
  !*** ./src/app/account/login.component.ts ***!
  \********************************************/
/*! exports provided: LoginComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LoginComponent", function() { return LoginComponent; });
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/forms */ "3Pt+");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "tyNb");
/* harmony import */ var _app_services__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @app/_services */ "J9tS");
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ionic/angular */ "TEn/");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/common */ "ofXK");







function LoginComponent_div_10_div_1_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, "Alias is required");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
} }
function LoginComponent_div_10_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](1, LoginComponent_div_10_div_1_Template, 2, 0, "div", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx_r0.f.alias.errors.required);
} }
function LoginComponent_div_15_div_1_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, "Password is required");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
} }
function LoginComponent_div_15_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](1, LoginComponent_div_15_div_1_Template, 2, 0, "div", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx_r1.f.password.errors.required);
} }
function LoginComponent_span_18_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](0, "span", 15);
} }
const _c0 = function (a0) { return { "is-invalid": a0 }; };
class LoginComponent {
    constructor(formBuilder, route, router, accountService) {
        this.formBuilder = formBuilder;
        this.route = route;
        this.router = router;
        this.accountService = accountService;
        this.loading = false;
        this.submitted = false;
    }
    ngOnInit() {
        this.form = this.formBuilder.group({
            alias: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_0__["Validators"].required],
            password: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_0__["Validators"].required]
        });
    }
    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }
    onSubmit() {
        this.submitted = true;
        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }
        this.loading = true;
        this.accountService.login(this.f.alias.value, this.f.password.value)
            .then(user => {
            // get return url from query parameters or default to home page
            const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
            this.router.navigateByUrl(returnUrl);
        }).catch(err => {
            // this.alertService.error(err);
            this.loading = false;
        });
    }
}
LoginComponent.ɵfac = function LoginComponent_Factory(t) { return new (t || LoginComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_forms__WEBPACK_IMPORTED_MODULE_0__["FormBuilder"]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_2__["ActivatedRoute"]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_app_services__WEBPACK_IMPORTED_MODULE_3__["AccountService"])); };
LoginComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({ type: LoginComponent, selectors: [["ng-component"]], decls: 22, vars: 11, consts: [[1, "card"], [1, "card-header"], [1, "card-body"], [3, "formGroup", "ngSubmit"], [1, "form-group"], ["for", "alias"], ["type", "text", "formControlName", "alias", 1, "form-control", 3, "ngClass"], ["class", "invalid-feedback", 4, "ngIf"], ["for", "password"], ["type", "password", "formControlName", "password", 1, "form-control", 3, "ngClass"], [1, "btn", "btn-primary", 3, "disabled"], ["class", "spinner-border spinner-border-sm mr-1", 4, "ngIf"], ["routerLink", "../register", 1, "btn", "btn-link"], [1, "invalid-feedback"], [4, "ngIf"], [1, "spinner-border", "spinner-border-sm", "mr-1"]], template: function LoginComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "ion-content");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](1, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](2, "h4", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](3, "Login");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](4, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](5, "form", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("ngSubmit", function LoginComponent_Template_form_ngSubmit_5_listener() { return ctx.onSubmit(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](6, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](7, "label", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](8, "Alias");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](9, "input", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](10, LoginComponent_div_10_Template, 2, 1, "div", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](11, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](12, "label", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](13, "Password");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](14, "input", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](15, LoginComponent_div_15_Template, 2, 1, "div", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](16, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](17, "button", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](18, LoginComponent_span_18_Template, 1, 0, "span", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](19, " Login ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](20, "a", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](21, "Register");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("formGroup", ctx.form);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpureFunction1"](7, _c0, ctx.submitted && ctx.f.alias.errors));
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.submitted && ctx.f.alias.errors);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpureFunction1"](9, _c0, ctx.submitted && ctx.f.password.errors));
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.submitted && ctx.f.password.errors);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("disabled", ctx.loading);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.loading);
    } }, directives: [_ionic_angular__WEBPACK_IMPORTED_MODULE_4__["IonContent"], _angular_forms__WEBPACK_IMPORTED_MODULE_0__["ɵangular_packages_forms_forms_y"], _angular_forms__WEBPACK_IMPORTED_MODULE_0__["NgControlStatusGroup"], _angular_forms__WEBPACK_IMPORTED_MODULE_0__["FormGroupDirective"], _angular_forms__WEBPACK_IMPORTED_MODULE_0__["DefaultValueAccessor"], _angular_forms__WEBPACK_IMPORTED_MODULE_0__["NgControlStatus"], _angular_forms__WEBPACK_IMPORTED_MODULE_0__["FormControlName"], _angular_common__WEBPACK_IMPORTED_MODULE_5__["NgClass"], _angular_common__WEBPACK_IMPORTED_MODULE_5__["NgIf"], _angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterLinkWithHref"], _ionic_angular__WEBPACK_IMPORTED_MODULE_4__["RouterLinkDelegate"]], encapsulation: 2 });


/***/ }),

/***/ "ZAI4":
/*!*******************************!*\
  !*** ./src/app/app.module.ts ***!
  \*******************************/
/*! exports provided: AppModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppModule", function() { return AppModule; });
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/platform-browser */ "jhN1");
/* harmony import */ var _app_routing_module__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./app-routing.module */ "vY5A");
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app.component */ "Sy1n");
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @ionic/angular */ "TEn/");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/forms */ "3Pt+");
/* harmony import */ var _services__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./_services */ "J9tS");
/* harmony import */ var _home__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./home */ "wn6f");
/* harmony import */ var _chats_chats_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./chats/chats.component */ "wxUJ");
/* harmony import */ var _conversation_conversation_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./conversation/conversation.component */ "9VjZ");
/* harmony import */ var _contacts_add_edit_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./contacts/add-edit.component */ "eVEn");
/* harmony import */ var _account_login_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./account/login.component */ "YF+o");
/* harmony import */ var _account_register_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./account/register.component */ "q8HH");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/core */ "fXoL");














class AppModule {
}
AppModule.ɵfac = function AppModule_Factory(t) { return new (t || AppModule)(); };
AppModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵdefineNgModule"]({ type: AppModule, bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_2__["AppComponent"]] });
AppModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵdefineInjector"]({ providers: [
        _services__WEBPACK_IMPORTED_MODULE_5__["GunDB"]
    ], imports: [[
            _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["BrowserModule"],
            _app_routing_module__WEBPACK_IMPORTED_MODULE_1__["AppRoutingModule"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_4__["ReactiveFormsModule"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_4__["FormsModule"],
            _ionic_angular__WEBPACK_IMPORTED_MODULE_3__["IonicModule"].forRoot()
        ]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵsetNgModuleScope"](AppModule, { declarations: [_app_component__WEBPACK_IMPORTED_MODULE_2__["AppComponent"],
        _account_login_component__WEBPACK_IMPORTED_MODULE_10__["LoginComponent"],
        _account_register_component__WEBPACK_IMPORTED_MODULE_11__["RegisterComponent"],
        _home__WEBPACK_IMPORTED_MODULE_6__["HomeComponent"],
        _chats_chats_component__WEBPACK_IMPORTED_MODULE_7__["ChatsComponent"],
        _conversation_conversation_component__WEBPACK_IMPORTED_MODULE_8__["ConversationComponent"],
        _contacts_add_edit_component__WEBPACK_IMPORTED_MODULE_9__["AddEditComponent"]], imports: [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["BrowserModule"],
        _app_routing_module__WEBPACK_IMPORTED_MODULE_1__["AppRoutingModule"],
        _angular_forms__WEBPACK_IMPORTED_MODULE_4__["ReactiveFormsModule"],
        _angular_forms__WEBPACK_IMPORTED_MODULE_4__["FormsModule"], _ionic_angular__WEBPACK_IMPORTED_MODULE_3__["IonicModule"]] }); })();


/***/ }),

/***/ "eVEn":
/*!************************************************!*\
  !*** ./src/app/contacts/add-edit.component.ts ***!
  \************************************************/
/*! exports provided: AddEditComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AddEditComponent", function() { return AddEditComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "mrSG");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ "3Pt+");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "tyNb");
/* harmony import */ var _app_services__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @app/_services */ "J9tS");
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @ionic/angular */ "TEn/");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/common */ "ofXK");








function AddEditComponent_div_5_div_1_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1, "Alias is required");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
} }
function AddEditComponent_div_5_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](1, AddEditComponent_div_5_div_1_Template, 2, 0, "div", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx_r0.f.alias.errors.required);
} }
function AddEditComponent_span_7_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](0, "span", 9);
} }
const _c0 = function (a0) { return { "is-invalid": a0 }; };
class AddEditComponent {
    constructor(formBuilder, route, router, accountService, db, modalController) {
        this.formBuilder = formBuilder;
        this.route = route;
        this.router = router;
        this.accountService = accountService;
        this.db = db;
        this.modalController = modalController;
        this.loading = false;
        this.submitted = false;
    }
    ngOnInit() {
        this.isAddMode = !this.id;
        this.form = this.formBuilder.group({
            alias: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required]
        });
        if (!this.isAddMode) {
            this.accountService.getCurrentUserProfile()
                .then(x => this.form.patchValue(x));
        }
    }
    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }
    onSubmit() {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            this.submitted = true;
            // stop here if form is invalid
            if (this.form.invalid) {
                return;
            }
            const res = yield this.db.$findUserByAlias(this.f.alias.value);
            if (res) {
                yield this.db.addContact(this.f.alias.value, res.epub);
                this.router.navigate(['../../'], { relativeTo: this.route });
            }
            else {
                // this.alertService.error('User not found');
            }
            this.loading = false;
        });
    }
    dismiss() {
        // using the injected ModalController this page
        // can "dismiss" itself and optionally pass back data
        this.modalController.dismiss({
            'dismissed': true
        });
    }
}
AddEditComponent.ɵfac = function AddEditComponent_Factory(t) { return new (t || AddEditComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormBuilder"]), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_3__["ActivatedRoute"]), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_3__["Router"]), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_app_services__WEBPACK_IMPORTED_MODULE_4__["AccountService"]), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_app_services__WEBPACK_IMPORTED_MODULE_4__["GunDB"]), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_ionic_angular__WEBPACK_IMPORTED_MODULE_5__["ModalController"])); };
AddEditComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({ type: AddEditComponent, selectors: [["ng-component"]], decls: 11, vars: 7, consts: [[3, "formGroup", "ngSubmit"], ["for", "alias"], ["type", "text", "formControlName", "alias", 1, "form-control", 3, "ngClass"], ["class", "invalid-feedback", 4, "ngIf"], [1, "btn", "btn-primary", 3, "disabled"], ["class", "spinner-border spinner-border-sm mr-1", 4, "ngIf"], ["routerLink", "/users", 1, "btn", "btn-link"], [1, "invalid-feedback"], [4, "ngIf"], [1, "spinner-border", "spinner-border-sm", "mr-1"]], template: function AddEditComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "ion-content");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](1, "form", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("ngSubmit", function AddEditComponent_Template_form_ngSubmit_1_listener() { return ctx.onSubmit(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](2, "label", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](3, "Alias");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](4, "input", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](5, AddEditComponent_div_5_Template, 2, 1, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](6, "button", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](7, AddEditComponent_span_7_Template, 1, 0, "span", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](8, " Add ");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](9, "a", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](10, "Cancel");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("formGroup", ctx.form);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction1"](5, _c0, ctx.submitted && ctx.f.alias.errors));
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx.submitted && ctx.f.alias.errors);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("disabled", ctx.loading);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx.loading);
    } }, directives: [_ionic_angular__WEBPACK_IMPORTED_MODULE_5__["IonContent"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__["ɵangular_packages_forms_forms_y"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__["NgControlStatusGroup"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormGroupDirective"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__["DefaultValueAccessor"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__["NgControlStatus"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControlName"], _angular_common__WEBPACK_IMPORTED_MODULE_6__["NgClass"], _angular_common__WEBPACK_IMPORTED_MODULE_6__["NgIf"], _angular_router__WEBPACK_IMPORTED_MODULE_3__["RouterLinkWithHref"], _ionic_angular__WEBPACK_IMPORTED_MODULE_5__["RouterLinkDelegate"]], encapsulation: 2 });


/***/ }),

/***/ "f5O9":
/*!********************************************!*\
  !*** ./src/app/_services/alert.service.ts ***!
  \********************************************/
/*! exports provided: AlertService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AlertService", function() { return AlertService; });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! rxjs */ "qCKp");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs/operators */ "kU1M");
/* harmony import */ var _app_models__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @app/_models */ "nPby");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ "fXoL");




class AlertService {
    constructor() {
        this.subject = new rxjs__WEBPACK_IMPORTED_MODULE_0__["Subject"]();
        this.defaultId = 'default-alert';
    }
    // enable subscribing to alerts observable
    onAlert(id = this.defaultId) {
        return this.subject.asObservable().pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["filter"])(x => x && x.id === id));
    }
    // convenience methods
    success(message, options) {
        this.alert(new _app_models__WEBPACK_IMPORTED_MODULE_2__["Alert"](Object.assign(Object.assign({}, options), { type: _app_models__WEBPACK_IMPORTED_MODULE_2__["AlertType"].Success, message })));
    }
    error(message, options) {
        this.alert(new _app_models__WEBPACK_IMPORTED_MODULE_2__["Alert"](Object.assign(Object.assign({}, options), { type: _app_models__WEBPACK_IMPORTED_MODULE_2__["AlertType"].Error, message })));
    }
    info(message, options) {
        this.alert(new _app_models__WEBPACK_IMPORTED_MODULE_2__["Alert"](Object.assign(Object.assign({}, options), { type: _app_models__WEBPACK_IMPORTED_MODULE_2__["AlertType"].Info, message })));
    }
    warn(message, options) {
        this.alert(new _app_models__WEBPACK_IMPORTED_MODULE_2__["Alert"](Object.assign(Object.assign({}, options), { type: _app_models__WEBPACK_IMPORTED_MODULE_2__["AlertType"].Warning, message })));
    }
    // main alert method    
    alert(alert) {
        alert.id = alert.id || this.defaultId;
        this.subject.next(alert);
    }
    // clear alerts
    clear(id = this.defaultId) {
        this.subject.next(new _app_models__WEBPACK_IMPORTED_MODULE_2__["Alert"]({ id }));
    }
}
AlertService.ɵfac = function AlertService_Factory(t) { return new (t || AlertService)(); };
AlertService.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineInjectable"]({ token: AlertService, factory: AlertService.ɵfac, providedIn: 'root' });


/***/ }),

/***/ "jZhJ":
/*!*********************************!*\
  !*** ./src/app/_models/user.ts ***!
  \*********************************/
/*! exports provided: User */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "User", function() { return User; });
class User {
}


/***/ }),

/***/ "kLfG":
/*!*****************************************************************************************************************************************!*\
  !*** ./node_modules/@ionic/core/dist/esm lazy ^\.\/.*\.entry\.js$ include: \.entry\.js$ exclude: \.system\.entry\.js$ namespace object ***!
  \*****************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./ion-action-sheet.entry.js": [
		"dUtr",
		"common",
		0
	],
	"./ion-alert.entry.js": [
		"Q8AI",
		"common",
		1
	],
	"./ion-app_8.entry.js": [
		"hgI1",
		"common",
		2
	],
	"./ion-avatar_3.entry.js": [
		"CfoV",
		"common",
		3
	],
	"./ion-back-button.entry.js": [
		"Nt02",
		"common",
		4
	],
	"./ion-backdrop.entry.js": [
		"Q2Bp",
		5
	],
	"./ion-button_2.entry.js": [
		"0Pbj",
		"common",
		6
	],
	"./ion-card_5.entry.js": [
		"ydQj",
		"common",
		7
	],
	"./ion-checkbox.entry.js": [
		"4fMi",
		"common",
		8
	],
	"./ion-chip.entry.js": [
		"czK9",
		"common",
		9
	],
	"./ion-col_3.entry.js": [
		"/CAe",
		10
	],
	"./ion-datetime_3.entry.js": [
		"WgF3",
		"common",
		11
	],
	"./ion-fab_3.entry.js": [
		"uQcF",
		"common",
		12
	],
	"./ion-img.entry.js": [
		"wHD8",
		13
	],
	"./ion-infinite-scroll_2.entry.js": [
		"2lz6",
		14
	],
	"./ion-input.entry.js": [
		"ercB",
		"common",
		15
	],
	"./ion-item-option_3.entry.js": [
		"MGMP",
		"common",
		16
	],
	"./ion-item_8.entry.js": [
		"9bur",
		"common",
		17
	],
	"./ion-loading.entry.js": [
		"cABk",
		"common",
		18
	],
	"./ion-menu_3.entry.js": [
		"kyFE",
		"common",
		19
	],
	"./ion-modal.entry.js": [
		"TvZU",
		"common",
		20
	],
	"./ion-nav_2.entry.js": [
		"vnES",
		"common",
		21
	],
	"./ion-popover.entry.js": [
		"qCuA",
		"common",
		22
	],
	"./ion-progress-bar.entry.js": [
		"0tOe",
		"common",
		23
	],
	"./ion-radio_2.entry.js": [
		"h11V",
		"common",
		24
	],
	"./ion-range.entry.js": [
		"XGij",
		"common",
		25
	],
	"./ion-refresher_2.entry.js": [
		"nYbb",
		"common",
		26
	],
	"./ion-reorder_2.entry.js": [
		"smMY",
		"common",
		27
	],
	"./ion-ripple-effect.entry.js": [
		"STjf",
		28
	],
	"./ion-route_4.entry.js": [
		"k5eQ",
		"common",
		29
	],
	"./ion-searchbar.entry.js": [
		"OR5t",
		"common",
		30
	],
	"./ion-segment_2.entry.js": [
		"fSgp",
		"common",
		31
	],
	"./ion-select_3.entry.js": [
		"lfGF",
		"common",
		32
	],
	"./ion-slide_2.entry.js": [
		"5xYT",
		33
	],
	"./ion-spinner.entry.js": [
		"nI0H",
		"common",
		34
	],
	"./ion-split-pane.entry.js": [
		"NAQR",
		35
	],
	"./ion-tab-bar_2.entry.js": [
		"knkW",
		"common",
		36
	],
	"./ion-tab_2.entry.js": [
		"TpdJ",
		"common",
		37
	],
	"./ion-text.entry.js": [
		"ISmu",
		"common",
		38
	],
	"./ion-textarea.entry.js": [
		"U7LX",
		"common",
		39
	],
	"./ion-toast.entry.js": [
		"L3sA",
		"common",
		40
	],
	"./ion-toggle.entry.js": [
		"IUOf",
		"common",
		41
	],
	"./ion-virtual-scroll.entry.js": [
		"8Mb5",
		42
	]
};
function webpackAsyncContext(req) {
	if(!__webpack_require__.o(map, req)) {
		return Promise.resolve().then(function() {
			var e = new Error("Cannot find module '" + req + "'");
			e.code = 'MODULE_NOT_FOUND';
			throw e;
		});
	}

	var ids = map[req], id = ids[0];
	return Promise.all(ids.slice(1).map(__webpack_require__.e)).then(function() {
		return __webpack_require__(id);
	});
}
webpackAsyncContext.keys = function webpackAsyncContextKeys() {
	return Object.keys(map);
};
webpackAsyncContext.id = "kLfG";
module.exports = webpackAsyncContext;

/***/ }),

/***/ "nPby":
/*!**********************************!*\
  !*** ./src/app/_models/index.ts ***!
  \**********************************/
/*! exports provided: Alert, AlertType, User */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _alert__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./alert */ "Dgtq");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Alert", function() { return _alert__WEBPACK_IMPORTED_MODULE_0__["Alert"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "AlertType", function() { return _alert__WEBPACK_IMPORTED_MODULE_0__["AlertType"]; });

/* harmony import */ var _user__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./user */ "jZhJ");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "User", function() { return _user__WEBPACK_IMPORTED_MODULE_1__["User"]; });





/***/ }),

/***/ "p3Fh":
/*!****************************************!*\
  !*** ./src/app/_helpers/auth.guard.ts ***!
  \****************************************/
/*! exports provided: AuthGuard */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AuthGuard", function() { return AuthGuard; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "mrSG");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "tyNb");
/* harmony import */ var _app_services__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @app/_services */ "J9tS");
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ionic/angular */ "TEn/");





class AuthGuard {
    constructor(router, accountService, db, navCtrl) {
        this.router = router;
        this.accountService = accountService;
        this.db = db;
        this.navCtrl = navCtrl;
    }
    canActivate(route, state) {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            try {
                const user = this.accountService.userValue || (yield this.db.$onAuth());
                if (user) {
                    // authorised so return true
                    return true;
                }
            }
            catch (err) {
                // not logged in so redirect to login page with the return url
                this.navCtrl.navigateRoot(['/login']);
                this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
                return false;
            }
            // not logged in so redirect to login page with the return url
            this.navCtrl.navigateRoot(['/login']);
            this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
            return false;
        });
    }
}
AuthGuard.ɵfac = function AuthGuard_Factory(t) { return new (t || AuthGuard)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵinject"](_angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵinject"](_app_services__WEBPACK_IMPORTED_MODULE_3__["AccountService"]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵinject"](_app_services__WEBPACK_IMPORTED_MODULE_3__["GunDB"]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵinject"](_ionic_angular__WEBPACK_IMPORTED_MODULE_4__["NavController"])); };
AuthGuard.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjectable"]({ token: AuthGuard, factory: AuthGuard.ɵfac, providedIn: 'root' });


/***/ }),

/***/ "q8HH":
/*!***********************************************!*\
  !*** ./src/app/account/register.component.ts ***!
  \***********************************************/
/*! exports provided: RegisterComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RegisterComponent", function() { return RegisterComponent; });
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/forms */ "3Pt+");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "tyNb");
/* harmony import */ var _app_services__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @app/_services */ "J9tS");
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ionic/angular */ "TEn/");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/common */ "ofXK");







function RegisterComponent_div_10_div_1_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, "Alias is required");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
} }
function RegisterComponent_div_10_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](1, RegisterComponent_div_10_div_1_Template, 2, 0, "div", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx_r0.f.alias.errors.required);
} }
function RegisterComponent_div_15_div_1_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, "Password is required");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
} }
function RegisterComponent_div_15_div_2_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, "Password must be at least 6 characters");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
} }
function RegisterComponent_div_15_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](1, RegisterComponent_div_15_div_1_Template, 2, 0, "div", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](2, RegisterComponent_div_15_div_2_Template, 2, 0, "div", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx_r1.f.password.errors.required);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx_r1.f.password.errors.minlength);
} }
function RegisterComponent_span_18_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](0, "span", 15);
} }
const _c0 = function (a0) { return { "is-invalid": a0 }; };
class RegisterComponent {
    constructor(formBuilder, route, router, accountService) {
        this.formBuilder = formBuilder;
        this.route = route;
        this.router = router;
        this.accountService = accountService;
        this.loading = false;
        this.submitted = false;
    }
    ngOnInit() {
        this.form = this.formBuilder.group({
            alias: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_0__["Validators"].required],
            password: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_0__["Validators"].required, _angular_forms__WEBPACK_IMPORTED_MODULE_0__["Validators"].minLength(6)]]
        });
    }
    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }
    onSubmit() {
        this.submitted = true;
        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }
        this.loading = true;
        this.accountService.register(this.form.value).then(() => {
            // this.alertService.success('Registration successful', { keepAfterRouteChange: true });
            this.router.navigate(['../login'], { relativeTo: this.route });
        }).catch(err => {
            // this.alertService.error(err);
            this.loading = false;
        });
    }
}
RegisterComponent.ɵfac = function RegisterComponent_Factory(t) { return new (t || RegisterComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_forms__WEBPACK_IMPORTED_MODULE_0__["FormBuilder"]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_2__["ActivatedRoute"]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_app_services__WEBPACK_IMPORTED_MODULE_3__["AccountService"])); };
RegisterComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({ type: RegisterComponent, selectors: [["ng-component"]], decls: 22, vars: 11, consts: [[1, "card"], [1, "card-header"], [1, "card-body"], [3, "formGroup", "ngSubmit"], [1, "form-group"], ["for", "alias"], ["type", "text", "formControlName", "alias", 1, "form-control", 3, "ngClass"], ["class", "invalid-feedback", 4, "ngIf"], ["for", "password"], ["type", "password", "formControlName", "password", 1, "form-control", 3, "ngClass"], [1, "btn", "btn-primary", 3, "disabled"], ["class", "spinner-border spinner-border-sm mr-1", 4, "ngIf"], ["routerLink", "../login", 1, "btn", "btn-link"], [1, "invalid-feedback"], [4, "ngIf"], [1, "spinner-border", "spinner-border-sm", "mr-1"]], template: function RegisterComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "ion-content");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](1, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](2, "h4", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](3, "Register");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](4, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](5, "form", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("ngSubmit", function RegisterComponent_Template_form_ngSubmit_5_listener() { return ctx.onSubmit(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](6, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](7, "label", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](8, "Alias");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](9, "input", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](10, RegisterComponent_div_10_Template, 2, 1, "div", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](11, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](12, "label", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](13, "Password");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](14, "input", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](15, RegisterComponent_div_15_Template, 3, 2, "div", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](16, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](17, "button", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](18, RegisterComponent_span_18_Template, 1, 0, "span", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](19, " Register ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](20, "a", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](21, "Cancel");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("formGroup", ctx.form);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpureFunction1"](7, _c0, ctx.submitted && ctx.f.alias.errors));
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.submitted && ctx.f.alias.errors);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpureFunction1"](9, _c0, ctx.submitted && ctx.f.password.errors));
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.submitted && ctx.f.password.errors);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("disabled", ctx.loading);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.loading);
    } }, directives: [_ionic_angular__WEBPACK_IMPORTED_MODULE_4__["IonContent"], _angular_forms__WEBPACK_IMPORTED_MODULE_0__["ɵangular_packages_forms_forms_y"], _angular_forms__WEBPACK_IMPORTED_MODULE_0__["NgControlStatusGroup"], _angular_forms__WEBPACK_IMPORTED_MODULE_0__["FormGroupDirective"], _angular_forms__WEBPACK_IMPORTED_MODULE_0__["DefaultValueAccessor"], _angular_forms__WEBPACK_IMPORTED_MODULE_0__["NgControlStatus"], _angular_forms__WEBPACK_IMPORTED_MODULE_0__["FormControlName"], _angular_common__WEBPACK_IMPORTED_MODULE_5__["NgClass"], _angular_common__WEBPACK_IMPORTED_MODULE_5__["NgIf"], _angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterLinkWithHref"], _ionic_angular__WEBPACK_IMPORTED_MODULE_4__["RouterLinkDelegate"]], encapsulation: 2 });


/***/ }),

/***/ "vY5A":
/*!***************************************!*\
  !*** ./src/app/app-routing.module.ts ***!
  \***************************************/
/*! exports provided: AppRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppRoutingModule", function() { return AppRoutingModule; });
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/router */ "tyNb");
/* harmony import */ var _home__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./home */ "wn6f");
/* harmony import */ var _app_conversation_conversation_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @app/conversation/conversation.component */ "9VjZ");
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./_helpers */ "XgRA");
/* harmony import */ var _account_login_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./account/login.component */ "YF+o");
/* harmony import */ var _account_register_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./account/register.component */ "q8HH");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/core */ "fXoL");








const routes = [
    { path: '', component: _home__WEBPACK_IMPORTED_MODULE_1__["HomeComponent"], canActivate: [_helpers__WEBPACK_IMPORTED_MODULE_3__["AuthGuard"]] },
    { path: 'conversation', component: _app_conversation_conversation_component__WEBPACK_IMPORTED_MODULE_2__["ConversationComponent"], canActivate: [_helpers__WEBPACK_IMPORTED_MODULE_3__["AuthGuard"]] },
    { path: 'login', component: _account_login_component__WEBPACK_IMPORTED_MODULE_4__["LoginComponent"] },
    { path: 'register', component: _account_register_component__WEBPACK_IMPORTED_MODULE_5__["RegisterComponent"] },
    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];
class AppRoutingModule {
}
AppRoutingModule.ɵfac = function AppRoutingModule_Factory(t) { return new (t || AppRoutingModule)(); };
AppRoutingModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdefineNgModule"]({ type: AppRoutingModule });
AppRoutingModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdefineInjector"]({ imports: [[_angular_router__WEBPACK_IMPORTED_MODULE_0__["RouterModule"].forRoot(routes)], _angular_router__WEBPACK_IMPORTED_MODULE_0__["RouterModule"]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵsetNgModuleScope"](AppRoutingModule, { imports: [_angular_router__WEBPACK_IMPORTED_MODULE_0__["RouterModule"]], exports: [_angular_router__WEBPACK_IMPORTED_MODULE_0__["RouterModule"]] }); })();


/***/ }),

/***/ "wn6f":
/*!*******************************!*\
  !*** ./src/app/home/index.ts ***!
  \*******************************/
/*! exports provided: HomeComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _home_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./home.component */ "9vUh");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "HomeComponent", function() { return _home_component__WEBPACK_IMPORTED_MODULE_0__["HomeComponent"]; });




/***/ }),

/***/ "wxUJ":
/*!******************************************!*\
  !*** ./src/app/chats/chats.component.ts ***!
  \******************************************/
/*! exports provided: ChatsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ChatsComponent", function() { return ChatsComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "mrSG");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _app_services__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @app/_services */ "J9tS");
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @ionic/angular */ "TEn/");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common */ "ofXK");






const _c0 = function (a0) { return { "active-user": a0 }; };
function ChatsComponent_ion_item_sliding_1_Template(rf, ctx) { if (rf & 1) {
    const _r3 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "ion-item-sliding", 1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function ChatsComponent_ion_item_sliding_1_Template_ion_item_sliding_click_0_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r3); const key_r1 = ctx.$implicit; const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](); return ctx_r2.loadConvo(ctx_r2.chats.get(key_r1)); });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](1, "ion-item-options", 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](2, "ion-item-option", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function ChatsComponent_ion_item_sliding_1_Template_ion_item_option_click_2_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r3); const key_r1 = ctx.$implicit; const ctx_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](); return ctx_r4.loadConvo(ctx_r4.chats.get(key_r1)); });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](3, "Chat");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](4, "ion-item");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](5, "ion-label");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](7, "ion-item-options", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](8, "ion-item-option", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function ChatsComponent_ion_item_sliding_1_Template_ion_item_option_click_8_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r3); const ctx_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](); return ctx_r5.share(ctx_r5.item); });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](9, "Delete");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
} if (rf & 2) {
    const key_r1 = ctx.$implicit;
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpureFunction1"](2, _c0, ctx_r0.currentConvo && ctx_r0.currentConvo.epub === ctx_r0.chats.get(key_r1).epub));
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx_r0.chats.get(key_r1).alias);
} }
class ChatsComponent {
    constructor(db, modalController, navCtrl) {
        this.db = db;
        this.modalController = modalController;
        this.navCtrl = navCtrl;
        this.currentConvoChange = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"]();
        this.loading = false;
        this.chats = new Map();
    }
    ngOnInit() {
        this.db.on$(this.db.gunUser.get('contacts')).subscribe(res => {
            Object.keys(res).forEach((path) => Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
                const userPath = this.db.gun.get(path);
                const user = yield this.db.$once(userPath);
                this.chats.set(path, {
                    epub: user.epub,
                    alias: user.alias
                });
            }));
        });
        // Subscribe to my received messages table
        /* const contacts = this.db.gunUser
            .get('contacts');
        this.contacts$ = on$(contacts, true);
        this.contacts$.subscribe(this.handleNewContactChat.bind(this)); */
    }
    loadConvo(user) {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            /* this.currentConvoChange.emit(user);
            const modal = await this.modalController.create({
              component: ConversationComponent,
              swipeToClose: true,
              componentProps: { currentConvo: user }
            });
            return await modal.present();
            */
            this.navCtrl.navigateForward(['conversation'], { state: user });
        });
    }
    handleNewContactChat(data) {
        for (const [key, value] of Object.entries(data)) {
            this.db.gunUser.get('contacts').get(key).once(c => {
                this.chats.set(key, c.epub);
                this.loading = false;
            });
        }
    }
}
ChatsComponent.ɵfac = function ChatsComponent_Factory(t) { return new (t || ChatsComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_app_services__WEBPACK_IMPORTED_MODULE_2__["GunDB"]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_ionic_angular__WEBPACK_IMPORTED_MODULE_3__["ModalController"]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_ionic_angular__WEBPACK_IMPORTED_MODULE_3__["NavController"])); };
ChatsComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({ type: ChatsComponent, selectors: [["app-chats"]], inputs: { currentConvo: "currentConvo" }, outputs: { currentConvoChange: "currentConvoChange" }, decls: 2, vars: 1, consts: [[3, "ngClass", "click", 4, "ngFor", "ngForOf"], [3, "ngClass", "click"], ["side", "start"], [3, "click"], ["side", "end"], ["color", "danger", 3, "click"]], template: function ChatsComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "ion-list");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](1, ChatsComponent_ion_item_sliding_1_Template, 10, 4, "ion-item-sliding", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngForOf", ctx.chats.keys());
    } }, directives: [_ionic_angular__WEBPACK_IMPORTED_MODULE_3__["IonList"], _angular_common__WEBPACK_IMPORTED_MODULE_4__["NgForOf"], _ionic_angular__WEBPACK_IMPORTED_MODULE_3__["IonItemSliding"], _angular_common__WEBPACK_IMPORTED_MODULE_4__["NgClass"], _ionic_angular__WEBPACK_IMPORTED_MODULE_3__["IonItemOptions"], _ionic_angular__WEBPACK_IMPORTED_MODULE_3__["IonItemOption"], _ionic_angular__WEBPACK_IMPORTED_MODULE_3__["IonItem"], _ionic_angular__WEBPACK_IMPORTED_MODULE_3__["IonLabel"]], encapsulation: 2 });


/***/ }),

/***/ "zUnb":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/platform-browser */ "jhN1");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app/app.module */ "ZAI4");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./environments/environment */ "AytR");




if (_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].production) {
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["enableProdMode"])();
}
_angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["platformBrowser"]().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_2__["AppModule"])
    .catch(err => console.error(err));


/***/ }),

/***/ "zn8P":
/*!******************************************************!*\
  !*** ./$$_lazy_route_resource lazy namespace object ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncaught exception popping up in devtools
	return Promise.resolve().then(function() {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "zn8P";

/***/ })

},[[0,"runtime","vendor"]]]);
//# sourceMappingURL=main.js.map