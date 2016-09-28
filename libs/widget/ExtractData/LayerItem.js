define([
  'dojo/_base/declare',
  'dijit/_WidgetBase',
  'dijit/_TemplatedMixin',
  'dijit/_WidgetsInTemplateMixin',
  'dojo/Evented',

  'dojo/_base/lang',
  'dojo/on',

  'dijit/form/CheckBox',

  'dojo/text!./LayerItem.html'
],

function(
  declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Evented,
  lang, on,
  CheckBox,
  template
) {

  return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Evented], {
    templateString: template,
    widgetsInTemplate: true,

    postCreate: function() {
      this.inherited(arguments);
      this.layer = this.layerDef.layer;
      if (this.layer) {
        // checkbox
        this.checkbox.set('checked', this.layer.visible);
        this.own(on(this.checkbox, 'change', lang.hitch(this, function(checked) {
          this.emit('changed', {
            isChecked: checked,
            layer: this.layer
          });
        })));

        // label
        this.label.innerHTML = this.layerDef.layer._params.title;
      }
    },

    startup: function() {
      //console.log('LayerListItem started');
    },

    isChecked: function() {
      return this.checkbox.checked;
    },

    getName: function() {
      return this.layer.name;
    }

  });

});
