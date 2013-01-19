// model
var Animal = Backbone.Model.extend({
  defaults: {
    category: '',
    name: '',
    picture: '',
    count: ''
  }, 
  
  initialize: function () { }
});

// animals collection
var AnimalsCollection = Backbone.Collection.extend({
	model: Animal,
	url: '/animals',
});

// category model
var AnimalCategory = Backbone.Model.extend({
  defaults: {
    animals: {},
    category: '',
    page: 0
  },
  
  initialize: function(args) {
    this.set({
      animals: new AnimalsCollection(args.models),
      category: args.category,
      url: '#' + this.get('category')
    });
    
    
    this.on('change', this.changed, this);
  },
  
  changed: function(model) {  
    this.get('animals').fetch({
      add: true, 
      data: {
        page: this.get('page'),
        category: this.get('category')
      }
    });
  },
  
  fetchNextPage: function() {
    this.set({
      page: this.get('page') + 1 
    });
  },
});

// animals category collection
var AnimalsCategoryCollection = Backbone.Collection.extend({
  model: AnimalCategory,
});




// animalModal view
AnimalModalView = Backbone.Marionette.ItemView.extend({
  template: '#animal_modal',
  
  events: {
    'click .delete' : 'deleteAnimal' 
  },
  
  deleteAnimal: function() {
    this.model.destroy();
  }
  
});

// animal view
AnimalView = Backbone.Marionette.ItemView.extend({
  template: '#animal',
  tagName: 'tr',
  className: 'animal',
  
  events: {
    'click' : 'openModal'
  },
  
  openModal: function() {
    App.modal.show(new AnimalModalView({ model: this.model }));
    App.router.navigate('#openModal');
  }
});

// animals view
AnimalsView = Backbone.Marionette.CompositeView.extend({
  tagName: 'table',
  className: 'animals-table',
  template: '#animals',
  itemView: AnimalView
});

// tab view
TabButtonView = Backbone.Marionette.ItemView.extend({
  template: '#tab_button',
  tagName: 'li',
  className: 'tab-button',
});

// tabs view
TabButtonsView = Backbone.Marionette.CompositeView.extend({
  template: '#tab_buttons',
  tagName: 'ul',
  className: 'tab-buttons',
  itemView: TabButtonView,
});

// layout 
AnimalsLayout = Backbone.Marionette.Layout.extend({
  template: "#animals_layout",
  tagName: 'section',
  
  regions: {
    tabs: "#tabs",
    content: "#content"
  }
});










App = new Backbone.Marionette.Application({categories: ['fish', 'mammals', 'birds']});
App.addInitializer(function(options) {
  App.categColl = new AnimalsCategoryCollection();
  //TODO: populate App.categColl options.categories
  _.each(App.categories, function(category) {
    App.categColl.add({category: category});
  });
  
  // all collection
  App.categColl.add({category: 'all'});
  
  // add the layout
  App.addRegions({mainRegion: '#main', modal: '#modal'});
  App.layout = new AnimalsLayout();
  App.mainRegion.show(App.layout);
  App.layout.render();
  App.layout.tabs.show(new TabButtonsView({collection: App.categColl}));
  
  // define routes
  App.router = new (Backbone.Marionette.AppRouter.extend({
    routes : {
      ':category/more' : 'loadMore',
      ':category' : 'showCategory',
    },
    
    getCategory: function(category) {
      return App.currentCategory = App.categColl.find(function(m) {
        return m.get('category') == category; 
      });
    },
    
    setButtons: function(category) {
      // set correct path for the more button
      $('#moreButton').attr({href: '#' + category + '/more'});
      
      // toggle active/inacitve
      $('.tab-buttons a').toggleClass('active', false);
      $('#tabButton' + category).toggleClass('active');
    },
    
    showCategory: function(category) {
      var categoryModel = this.getCategory(category);
      App.layout.content.show(
        new AnimalsView({ collection: categoryModel.get('animals') })
      );
      
      if(categoryModel.get('page') == 0)
        this.loadMore(category);
     
      this.setButtons(category);
    },
    
    loadMore: function (category) {
      this.getCategory(category).fetchNextPage();
      this.navigate(category);
    },
  }));
  Backbone.history.start();
});

// change the default underscore delimiters <%= %> to <@=@>, 
// prevent underscore template engine from conflicting with ERB syntex
_.templateSettings = {
  interpolate: /\[\%\=(.+?)\%\]/gim,
  evaluate: /\[\%(.+?)\%\]/gim,
  escape: /\[\%\-(.+?)\%\]/gim
};


$(document).ready(function(){
  App.start();
})