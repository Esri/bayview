define([
  'dojo/_base/declare'
], function(declare) {
  var PortalUserModel = declare('app/Model/PortalUserModel', [], {

    _portalUser: null,

    setPortalUser: function(portalUser) {
      this._portalUser = portalUser;
    },

    getPortalUrl: function() {
      return this._portalUser.portal.portalUrl;
    },

    getArcgisUrl: function() {
      return this.getPortalUrl() + '/content/items';
    },

    getUsername: function() {
      return this._portalUser.username || '';
    },

    getGroups: function() {
      return this._portalUser.getGroups();
    }

  });

  var _instance;

  if (!_instance) {
    _instance = new PortalUserModel();

  }

  return _instance;
});
