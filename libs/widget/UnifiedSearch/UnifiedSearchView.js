define([
  'dojo/_base/declare',
  'dojo/_base/event',
  'dojo/_base/lang',
  'dojo/dom-construct',
  'dojo/dom-class',
  'dojo/dom-attr',

  'dojo/query',
  'dojo/keys',
  'dojo/on',

  'esri/dijit/_EventedWidget',
  'dijit/_TemplatedMixin',
  'dijit/focus',
  'dijit/Tooltip',

  'dojo/text!./UnifiedSearchView.html'
],

function(
  declare, dojoEvent, lang, domConstruct, domClass, domAttr,
  dojoQuery, dojoKeys, dojoOn,
  _EventedWidget, _TemplatedMixin, focusUtil, Tooltip,
  template)
{

  return declare([_EventedWidget, _TemplatedMixin], {

    templateString: template,
    locModel: null,
    id: 'layerSearch',
    inputTimeout: setTimeout(function() {}, 100),
    inputValue: '',
    minChars: 2,

    constructor: function() {
      this.inherited(arguments);
    },

    postCreate: function() {
      this.inherited(arguments);
      this.inputNode.placeholder = this.searchConfig.placeholder;
    },

    startup: function() {
      this.inherited(arguments);
      this._addEventListeners();
      this._addTooltips();
    },

    _addEventListeners: function() {
      // dojoOn(document, 'click', lang.hitch(this, this.clearResults));

      //dojoOn(this.viewWidget, 'mappanel-show', lang.hitch(this, this.focus));

      dojoOn(this.inputNode, 'keyup', lang.hitch(this, this.onInputKeyUp));
      dojoOn(this.inputNode, 'keydown', lang.hitch(this, this.onInputKeyDown));

      dojoOn(this.backNode, 'click', lang.hitch(this, this.onBackNodeClicked));

      dojoOn(this.submitNode, 'click', lang.hitch(this, this.onInputKeyUp));
      dojoOn(this.clearNode, 'click', lang.hitch(this, this.clear));

    //   dojoOn(this.locatemeNode, 'click', lang.hitch(this, this.locatmeClicked));

      dojoOn(this.resultsNode, 'click', lang.hitch(this, this.resultClickHandler));
      dojoOn(this.resultsNode, 'keydown', lang.hitch(this, this.resultKeydownHandler));

      dojoOn(this.resultsNode2, 'click', lang.hitch(this, this.resultClickHandler));
      dojoOn(this.resultsNode2, 'keydown', lang.hitch(this, this.resultKeydownHandler));
    },

    _addTooltips: function() {
      new Tooltip({
        connectId: [this.submitNode],
        label: 'Search',
        position: ['below'],
        showDelay: 0
      });
      new Tooltip({
        connectId: [this.backNode],
        label: 'Back',
        position: ['below'],
        showDelay: 0
      });
      new Tooltip({
        connectId: [this.clearNode],
        label: 'Clear',
        position: ['below'],
        showDelay: 0
      });
    //   new Tooltip({
    //     connectId: [this.locatemeNode],
    //     label: 'Locate me',
    //     position: ['below'],
    //     showDelay: 0
    //   });
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
      this.emit('clear');
    },

    clearResults: function() {
      domConstruct.empty(this.resultsNode);
      domConstruct.empty(this.resultsNode2);
      this.clearSearchError();
    },

    openFeatureDetails: function(searchString) {
        var fixedString = searchString.replace(/<(?:.|\n)*?>/gm, '');
        domAttr.set(this.inputNode, 'value', fixedString);
        this.inputValue = fixedString;
        domClass.remove(this.containerNode, 'populated');
        domClass.remove(this.containerNode, 'search-error');
        this.clearResults();
        this.focus();
        this.emit('clear');
    },

    // is this function being called at all??
    hideResultsNode: function() {
      domClass.add(this.resultsContainer, 'hide');
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
        evt.keyCode === dojoKeys.RIGHT_ARROW) {
        return;
      }

    //   if (evt.keyCode === dojoKeys.ENTER) {
    //       this.handleInput();
    //   }

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
      domClass.add(this.containerNode, 'loading has-input');
      this.emit('input-change', this.inputValue);
    },

    showClearBtn: function() {
      domClass.add(this.containerNode, 'has-input');
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

    tempLi: null,
    setLoadingIcon: function(li) {
      this.tempLi = li;
      domClass.remove(li.children[0]);
      domClass.add(li.children[0], 'search-results-icon fa fa-refresh fa-spin');
    },

    restoreLoadingIcon: function() {
      if (this.tempLi !== null) {
        domClass.remove(this.tempLi.children[0]);
        domClass.add(this.tempLi.children[0], domAttr.get(this.tempLi, 'data-iconclass'));
        domClass.add(this.tempLi.children[0], 'search-results-icon');
      }
    },

    selectFeatureFromResult: function(target) {
      var li = dojoQuery(target).closest('li')[0];
      console.debug('li: ', domAttr.get(li, 'data-oid'), domAttr.get(li, 'data-lyr'));
      this.setLoadingIcon(li);
      var labelText = li.innerText || li.textContent;
      if (!labelText) {
        console.warn('aw crap, need to find li text some other way');
        labelText = 'Browser error!';
      }

      labelText = labelText.trim ? labelText.trim() : labelText.replace(/^\s+|\s+$/g, '');

      //console.debug('the extent that is being emitted', domAttr.get(li, 'data-extent'));
      this.emit('select-oid', {
        oid: domAttr.get(li, 'data-oid'),
        lyr: domAttr.get(li, 'data-lyr'),
        // TODO the extent is causing issues with the deatails panel
        extent: domAttr.get(li, 'data-extent'),
        //extent: null,
        labelText: domAttr.get(li, 'data-label'),
        obj: domAttr.get(li, 'data-obj')
      });
    },

    clearInputTimeout: function() {
      clearTimeout(this.inputTimeout);
    },

    handleFormattedResults: function(results) {
      domClass.remove(this.containerNode, 'loading');
      domClass.add(this.containerNode, 'has-input');
      if (!results.length) {
        this.handleNoResults();
        return;
      }

      this.clearSearchError();

      var regex = new RegExp('(' + this.inputValue + ')', 'gi');

      var resultsUL = domConstruct.create('ul', {
        'class': 'resultsList'
      });

      _.each(results, function(resultObj, idx) {
        var formattedLabel = resultObj.label.replace(regex, '<strong>$1</strong>');

        domConstruct.create('li', {
          'class': 'LSResult',
          'data-oid': resultObj.oid,
          'data-lyr': resultObj.layer,
          'data-idx': idx,
          'data-label': formattedLabel,
          'data-extent': resultObj.extent,
          'data-iconclass': resultObj.iconClass,
          'data-obj': resultObj.obj,
          'tabindex': '0',
          innerHTML:  '<span class="search-results-icon ' + resultObj.iconClass + '"></span> ' + formattedLabel + '</li>'
        }, resultsUL);
      });

      domConstruct.empty(this.resultsNode);
      domConstruct.place(resultsUL, this.resultsNode);
      domClass.remove(this.resultsNode, 'hidden');
    },

    handleFormattedResults2: function(results, strInput) {
        //console.log('handleFormattedResults2');
      this.restoreLoadingIcon();
      domClass.remove(this.containerNode, 'loading');
      domClass.add(this.containerNode, 'has-input');
      if (!results.length) {
        this.handleNoResults();
        return;
      }

      this.clearSearchError();

      var regex = new RegExp('(' + this.inputValue + ')', 'gi');

      var resultsUL = domConstruct.create('ul', {
        'class': 'resultsList'
      });

      _.each(results, function(resultObj, idx) {
        var formattedLabel = resultObj.label.replace(regex, '<strong>$1</strong>');

        domConstruct.create('li', {
          'class': 'LSResult',
          'data-oid': resultObj.oid,
          'data-lyr': resultObj.layer,
          'data-idx': idx,
          'data-label': formattedLabel,
          'data-extent': resultObj.extent,
          'data-iconclass': resultObj.iconClass,
          'data-obj': resultObj.obj,
          'tabindex': '0',
          innerHTML:  '<span class="search-results-icon ' + resultObj.iconClass + '"></span> ' + formattedLabel + '</li>'
        }, resultsUL);
      });

      domConstruct.empty(this.resultsNode2);
      domConstruct.place(resultsUL, this.resultsNode2);
      domAttr.set(this.inputNode, 'value', strInput);
      domClass.add(this.containerNode, 'populated');
      domClass.add(this.resultsNode, 'hidden');
    },

    clearSearchError: function() {
      domClass.remove(this.containerNode, 'search-error');
    },

    handleNoResults: function() {
      domConstruct.empty(this.resultsNode);
      domClass.add(this.containerNode, 'search-error');
    },

    onBackNodeClicked: function() {
      domAttr.set(this.inputNode, 'value', this.inputValue);
      domClass.remove(this.containerNode, 'populated');
      domConstruct.empty(this.resultsNode2);
      domClass.remove(this.resultsNode, 'hidden');
      this.inputNode.focus();
    },

    hide: function() {
        domClass.add(this.unifiedsearchContainer, 'is-hidden');
    },

    show: function() {
        domClass.remove(this.unifiedsearchContainer, 'is-hidden');
    }

  });
});
