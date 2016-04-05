define([
    'dojo/_base/declare',
    'dojo/topic'

  ],

  function(declare, topic

  ) {

    //Standard way to create singletons
    // see http://www.anujgakhar.com/2013/08/29/singletons-in-dojo/

    var AppModel = declare('app/model/AppModel', [],
      {

        //Model parts here


      });

    var _instance;
    if (!_instance) {
      _instance = new AppModel();

    }

    return _instance;
  });
