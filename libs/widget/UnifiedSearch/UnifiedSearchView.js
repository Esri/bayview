define([
  'dojo/_base/declare',
  'dojo/_base/event',
  'dojo/_base/lang',
  'dojo/dom-construct',
  'dojo/dom-class',
  'dojo/dom-style',
  'dojo/dom-attr',
  'dojo/on',
  'dojo/query',
  'dojo/keys',
  'dojo/on',
  'dojo/mouse',
  'dojo/topic',

  'dijit/_TemplatedMixin',
  'dijit/focus',
  'dijit/Tooltip',
  'dijit/registry',

  'esri/dijit/_EventedWidget',

  './ResultRow',

  'dojo/text!./templates/UnifiedSearchView.html'
], function (
  declare, dojoEvent, lang, domConstruct, domClass, domStyle, domAttr, on, dojoQuery, 
  dojoKeys, dojoOn, dojoMouse, topic, _TemplatedMixin, focusUtil, Tooltip, registry,
  _EventedWidget, ResultRow, template
) {
  
  return declare([_EventedWidget, _TemplatedMixin], {

    templateString: template,
    locModel: null,
    id: 'layerSearch',
    inputTimeout: setTimeout(function() {}, 100),
    inputValue: '',
    selectedResultRow: null,
    gridRows: [],

    constructor: function() {
      this.inherited(arguments);
    },

    postCreate: function() {
      this.inherited(arguments);
      this.inputNode.placeholder = this.searchConfig.placeholder;
      this.minChars = this.minChars;

      if (!_.isUndefined(this.searchConfig.geocode)) {
        if (this.searchConfig.geocode === false) {
          //domStyle.set(this.locatemeNode, 'display', 'none');
          domClass.add(this.locatemeNode, 'hidden');
        }
      }

      topic.subscribe('/AssetsManager/grid/updated', lang.hitch(this, function(sender, args) {
        this.gridRows = args.rows || [];
        this.updateGrids();
      }));

      this.clear();
    },

    startup: function() {
      this.inherited(arguments);
      this._addEventListeners();
      this._addTooltips();
    },

    updateGrids: function() {
      // update the current results view
      _.each(registry.findWidgets(this.resultsNode2), lang.hitch(this, function(widget) {
        var list = _.find(this.gridRows, lang.hitch(this, function(row) {
          return (widget.getId() === row.getId());
        }));
        var hasAction = _.isUndefined(list);
        widget.toggleActionButton(hasAction);
      }));
    },

    _addEventListeners: function() {
      // dojoOn(document, 'click', lang.hitch(this, this.clearResults));

      //dojoOn(this.viewWidget, 'mappanel-show', lang.hitch(this, this.focus));

      dojoOn(this.inputNode, 'keyup', lang.hitch(this, this.onInputKeyUp));
      dojoOn(this.inputNode, 'keydown', lang.hitch(this, this.onInputKeyDown));

      dojoOn(this.backNode, 'click', lang.hitch(this, this.onBackNodeClicked));

      dojoOn(this.submitNode, 'click', lang.hitch(this, this.onInputKeyUp));
      dojoOn(this.clearNode, 'click', lang.hitch(this, this.clear));

      dojoOn(this.locatemeNode, 'click', lang.hitch(this, this.locatmeClicked));

      dojoOn(this.btnAddAll, 'click', lang.hitch(this, this.btnAddAllClicked));
      dojoOn(this.btnZoomAll, 'click', lang.hitch(this, this.btnZoomAllClicked));

      dojoOn(document, 'keydown', lang.hitch(this, this.onDocumentKeyDown));
    },

    onDocumentKeyDown: function(evt) {
      console.log('key pressed: ', evt.keyCode);
      if (evt.keyCode === 191) {
        console.log('slash key pressed');
      }
    },

    _addTooltips: function() {
      Tooltip({
        connectId: [this.submitNode],
        label: 'Search',
        position: ['below'],
        showDelay: 0
      });
      Tooltip({
        connectId: [this.backNode],
        label: 'Back',
        position: ['below'],
        showDelay: 0
      });
      Tooltip({
        connectId: [this.clearNode],
        label: 'Clear',
        position: ['below'],
        showDelay: 0
      });
      Tooltip({
        connectId: [this.locatemeNode],
        label: 'Locate me',
        position: ['below'],
        showDelay: 0
      });
    },

    // public methods
    focus: function() {
      focusUtil.focus(this.inputNode);
      // this added delay allows for the map cover to slide up, possibly pushing the
      // input node out of view on iOS. we need to scroll back to it. the .focus event
      // WILL NOT BE TRIGGERED IN iOS FROM A SETTIMEOUT! (which is why it's not in the setTimeout)
      var self = this;
      setTimeout(function() {
        if (self.inputNode.scrollIntoViewIfNeeded) {
          self.inputNode.scrollIntoViewIfNeeded();
        } else if (self.inputNode.scrollIntoView) {
          self.inputNode.scrollIntoView();
        } else {
          console.warn('input node not visible, but scrollintoview not available. do something!');
        }
      }, 500);
    },

    blur: function() {
      console.debug('blur');
      this.inputNode.blur();
      this.clearResults();
    },

    locatmeClicked: function() {
      this.emit('locateme');
    },

    clear: function() {
      console.debug('clear');
      domAttr.set(this.inputNode, 'value', '');
      this.inputValue = '';
      domClass.remove(this.containerNode, 'has-input');
      domClass.remove(this.containerNode, 'populated');
      domClass.remove(this.containerNode, 'search-error');
      this.clearResults();
      this.focus();

      this.hideContainer1();
      this.hideContainer2();

      this.emit('clear');
    },

    clearResults: function() {
      domConstruct.empty(this.resultsNode);
      domConstruct.empty(this.resultsNode2);
      this.clearSearchError();
    },

    onInputKeyUp: function(evt) {
      if (!evt ||
        evt.ctrlKey ||
        evt.metaKey ||
        evt.altKey ||
        evt.keyCode === dojoKeys.copyKey ||
        evt.keyCode === dojoKeys.ALT ||
        evt.keyCode === dojoKeys.CTRL ||
        evt.keyCode === dojoKeys.META ||
        evt.keyCode === dojoKeys.SHIFT ||
        evt.keyCode === dojoKeys.UP_ARROW ||
        evt.keyCode === dojoKeys.DOWN_ARROW ||
        evt.keyCode === dojoKeys.LEFT_ARROW ||
        evt.keyCode === dojoKeys.RIGHT_ARROW ||
        evt.keyCode === dojoKeys.ENTER) {
        return;
      }

      this.clearInputTimeout();

      this.inputValue = this.inputNode.value || '';

      // TODO: handle enter and escape on inputNode
      if (this.inputValue === '') {
        console.debug('no string here');
        domClass.remove(this.containerNode, 'has-input');
        this.clearResults();
        return;
      } else if (evt.keyCode === dojoKeys.ESCAPE || evt.keyCode === dojoKeys.TAB) {
        this.clearResults();
        this.emit('search-cancel');
      } else if (this.inputValue.length < this.minChars) {
        this.clearResults();
        domClass.add(this.containerNode, 'has-input');
        console.debug('input too short', this.inputValue);
        return;
      } else {
        this.inputTimeout = setTimeout(lang.hitch(this, this.handleInput), this.searchConfig.searchDelay);
      }
    },

    handleInput: function() {
      this.showLoading();
      this.emit('input-change', this.inputValue);
    },

    showLoading: function() {
      domClass.add(this.containerNode, 'loading has-input');
    },

    hideLoading: function() {

    },

    setInputValue: function(value) {
      domAttr.set(this.inputNode, 'value', value);
    },

    // capture keydown for tab and arrow navigation.
    // for all other key events, wait 'til key up.
    onInputKeyDown: function(evt) {
      if (!evt) {
        return;
      }

      var resultList = dojoQuery('.LSResult', this.resultsNode);
      if (!resultList.length) {
        return;
      }

      switch (evt.keyCode) {
        case dojoKeys.TAB:
          // TODO
          console.debug('tab pressed. cancelled deferreds, hide menus.');
          break;

        case (dojoKeys.UP_ARROW):
          dojoEvent.stop(evt);
          resultList[resultList.length - 1].focus();
          break;

        case (dojoKeys.DOWN_ARROW):
          dojoEvent.stop(evt);
          resultList[0].focus();
          break;
      }
    },

    resultClickHandler: function(evt) {
      this.selectFeatureFromResult(evt.target);
    },

    resultKeydownHandler: function(evt) {
      if (evt.keyCode === dojoKeys.ENTER) {
        this.selectFeatureFromResult(evt.target);
        return;
      }

      if (evt.keyCode === dojoKeys.DOWN_ARROW || evt.keyCode === dojoKeys.UP_ARROW) {
        dojoEvent.stop(evt);
        this.adjustResultFocus(evt.keyCode, evt.target);
      }
    },

    adjustResultFocus: function(keyCode, resultEl) {
      var resultList = dojoQuery('.LSResult');
      var currentIndex = parseInt(domAttr.get(resultEl, 'data-idx'), 10);

      if ((keyCode === dojoKeys.DOWN_ARROW && currentIndex + 1 === resultList.length) ||
        (keyCode === dojoKeys.UP_ARROW && currentIndex === 0)) {
        this.inputNode.focus();
      } else {
        var newIndex = keyCode === dojoKeys.DOWN_ARROW ? currentIndex + 1 : currentIndex - 1;
        resultList[newIndex].focus();
      }
    },

    clearInputTimeout: function() {
      clearTimeout(this.inputTimeout);
    },

    showRowLoading: function(row) {
      this.selectedResultRow = row;
      this.selectedResultRow.showLoading();
    },

    hideRowLoading: function() {
      if (this.selectedResultRow !== null) {
        this.selectedResultRow.hideLoading();
      }
      this.selectedResultRow = null;
    },

    handleFormattedResults: function(results) {
      this.hideRowLoading();
      domClass.remove(this.containerNode, 'loading');
      domClass.add(this.containerNode, 'has-input');
      if (!results.length) {
        //this.handleNoResults();
        //return;
      }

      this.clearSearchError();

      domConstruct.empty(this.resultsNode);

      _.each(results, lang.hitch(this, function(resultObj, idx) {
        var row = new ResultRow({
          'inputValue': resultObj.label,
          'resultObj': resultObj,
          'index': idx,
          'map': this.map
        }).placeAt(this.resultsNode);
        this.own(on(row, 'itemclicked', lang.hitch(this, function(args) {
          this.showRowLoading(row);
          var resultObj = args.resultObj || {};
          this.emitItem(resultObj, resultObj.label);
        })));
        this.own(on(row, 'actionclicked', lang.hitch(this, function(args) {
          // doesn't exist at this level
        })));
        this.own(on(row, 'hover', lang.hitch(this, function(args) {
          this.emitHover(args.resultObj);
        })));
      }));

      this.showContainer1();
      //domClass.remove(this.resultsNodeWrapper, 'hidden');
    },

    handleFormattedResults2: function(results, strInput) {
      this.hideRowLoading();
      domClass.remove(this.containerNode, 'loading');
      domClass.add(this.containerNode, 'has-input');
      if (!results.length) {
        // this.handleNoResults();
        // return;
      }

      this.clearSearchError();

      domConstruct.empty(this.resultsNode2);

      _.each(results, lang.hitch(this, function(resultObj, idx) {
        var row = new ResultRow({
          'inputValue': this.inputValue,
          'resultObj': resultObj,
          'index': idx,
          'map': this.map
        }).placeAt(this.resultsNode2);
        this.own(on(row, 'iconclicked', lang.hitch(this, function(args) {
          var feature = args.feature;
          this.emit('zoomto', {
            'features': [feature]
          });
        })));
        this.own(on(row, 'itemclicked', lang.hitch(this, function(args) {
          if (args.resultObj.hasOwnProperty('obj')) {  
            var feature = args.resultObj.obj;
            this.emit('zoomto', {
              'features': [feature]
            });
          }
        })));
        this.own(on(row, 'actionclicked', lang.hitch(this, function(args) {
          this.showRowLoading(row);
          this.hideContainer2();
          var resultObj = args.resultObj || {};
          this.emitItem(resultObj, strInput);
        })));
        this.own(on(row, 'hover', lang.hitch(this, function(args) {
          this.emitHover(args.resultObj);
        })));

      }));

      this.updateGrids();

      domAttr.set(this.inputNode, 'value', strInput);
      domClass.add(this.containerNode, 'populated');
      this.hideContainer1();
      this.showContainer2();
      //domClass.add(this.resultsNodeWrapper, 'hidden');
    },

    showPopupHandler: function(strInput) {
      this.hideRowLoading();
      domClass.remove(this.containerNode, 'loading');
      domClass.add(this.containerNode, 'has-input');
      this.clearSearchError();
      domAttr.set(this.inputNode, 'value', strInput);
      domClass.add(this.containerNode, 'populated');
      this.hideContainer1();
      this.hideContainer2();
    },

    showContainer1: function() {
      domClass.remove(this.resultsNodeWrapper, 'hidden');
    },

    hideContainer1: function() {
      domClass.add(this.resultsNodeWrapper, 'hidden');
    },

    showContainer2: function() {
      domClass.remove(this.resultsNodeWrapper2, 'hidden');
    },

    hideContainer2: function() {
      domClass.add(this.resultsNodeWrapper2, 'hidden');
    },

    btnAddAllClicked: function() {
      _.each(registry.findWidgets(this.resultsNode2), lang.hitch(this, function(widget) {
        this.emitItem(widget.getResultObj());
      }));
    },

    btnZoomAllClicked: function() {
      var features = _.map(registry.findWidgets(this.resultsNode2), lang.hitch(this, function(widget) {
        return widget.getFeature();
      }));

      this.emit('zoomto', {
        'features': features
      });
    },

    emitHover: function(resultObj) {
      this.emit('hover-obj', {
        'oid': resultObj.oid,
        'layerId': resultObj.layer,
        'object': resultObj.obj
      });
    },

    emitItem: function(resultObj, labelText) {
      var labelText = labelText || '';
      this.emit('select-oid', {
        'oid': resultObj.oid,
        'lyr': resultObj.layer,
        'extent': resultObj.extent,
        'labelText': labelText, //domAttr.get(li, 'data-label'),
        'obj': resultObj.obj
      });
    },

    clearSearchError: function() {
      domClass.remove(this.containerNode, 'search-error');
    },

    handleNoResults: function() {
      domConstruct.empty(this.resultsNode);
      //domClass.add(this.containerNode, 'search-error');
    },

    onBackNodeClicked: function() {
      domAttr.set(this.inputNode, 'value', this.inputValue);
      domClass.remove(this.containerNode, 'populated');

      this.hideContainer2();
      this.showContainer1();

      this.inputNode.focus();
      topic.publish('/UnifiedSearch/back/clicked');
    },

    hide: function() {
      domClass.add(this.domNode, 'is-hidden');
    },

    show: function(){
      domClass.remove(this.domNode, 'is-hidden');
    }
  });
});
