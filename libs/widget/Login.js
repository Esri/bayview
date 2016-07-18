/**
 * Esri © 2014
 **/

define([
  'dojo/_base/declare',
  'dijit/_WidgetBase',
  'dijit/_TemplatedMixin',
  'dijit/_WidgetsInTemplateMixin',
	'dojo/on',
	'dojo/dom-attr',
	'dojo/_base/lang',

	'dojo/text!./Login/Login.html',
	'dojo/i18n!./Login/nls/Strings',

	'dijit/form/Form',
	'dijit/form/Button',
	'dijit/form/ValidationTextBox'
],

function(
	declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, on, domAttr, lang,
	template, i18n,
	Form, Button, ValidationTextBox
) {

  // main geolocation widget
  return declare('app.Login', [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
    templateString: template,
    widgetsInTemplate: true,
    i18n: i18n,
    ischecked: true,
    tooltip: null,

    postCreate: function() {
      this.inherited(arguments);
      on(this.loginForm, 'submit', lang.hitch(this, function(evt) {
        this.validateUser();
        //prevent submit button from refreshing the page
        evt.preventDefault();
      }));
    },

    startup: function() {
      this.usernameInput.focus();
      console.log('Login page started');
    },

    validateUser: function() {
      domAttr.set(this.loginButton, 'disabled', 'disabled');
      domAttr.set(this.loginButton, 'label', 'Doing stuff');
      //Perform user validation stuff then clear the loading screen
      this.controller._clearLoadingScreen();
    }

  });

});
