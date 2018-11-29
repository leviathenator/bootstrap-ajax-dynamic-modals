!function ($) {

	"use strict"; 

	var debugOn = true;

	var DynaModal = function (element, options) {
		this.init(element, options);
	};

	DynaModal.prototype =  {

		constructor: DynaModal,

		init: function(element, options){

			this.$element = $(element);
			this.options = $.extend({}, $.fn.dynamodal.defaults, typeof options == 'object' && options);
			this.args = $.extend({}, this.$element.data());
			this.stack = [];
			pushToDebug(this, 'dir');

			if(this.args.event == 'openModal'){
				this.clickModal();
			}
		},

		callModal: function(options, callback){

			this.closeOpenModals()
				.then(function(){
					this.getTemplate(element, callback);
				});

		},

		clickModal: function(){
			var self = this;
			self.closeOpenModals()
				.then(function(){
					self.getTemplate();
				});
		},

		openModal: function(id){
			
			var self = this,
				obj = $('#'+id);
				
			obj.on('show.bs.modal', function (e) {
				// Add any functinality that needs to be instantiated once the modal is shown.
			});

			obj.on('hidden.bs.modal', function (e) {
				self.destroyModal(obj);
			});

			obj.on('shown.bs.modal', function (e) {
				
				// Run your callback function. 
				if(typeof callback === 'function'){
					callback(obj);
				}
			});
			
			obj.modal(self.options);
		},

		getTemplate: function(){

				var self = this,
					elem = self.$element,
					target = self.args.target,
					templateName = self.args.template,
					append = self.args.append;

				$.get('/templates/'+templateName+(typeof append != 'undefined' ? append : ''), function(htm){

					if(htm && typeof htm == 'string'){

						var template = self.handleTemplate(htm);

						template = $(template).appendTo('body');
						
						var id = template.attr('id');

						self.openModal(id);
	
					}else{
						pushToDebug(htm);
						pushToDebug('Could not load template');
					}

				});

		},

		closeOpenModals: function(){

			var self = this;

			return new Promise(function (resolve, reject) {

				if(self.hasOpenModals()){

					pushToDebug('Hiding Modal...');
					
					$.each(self.getOpenModals(), function(){
						var $this = $(this);
						$this.modal('hide');
					});

					pushToDebug('No modal existed or old modal is now closed...');
				}
				resolve(true);
			});
		},

		getOpenModals: function () {
			return $('.modal.show');
		},

		hasOpenModals: function () {
			return $('.modal.show').length > 0;
		},

		destroyModal: function(obj){
			obj.modal('dispose');
			obj.remove();
		},

		handleTemplate: function(scriptID){
			var template = $(scriptID);
			template = template.html();
			return $(template);
		},

	};

	function pushToDebug(text, type){

		if(debugOn){
			switch(type){
				case 'error' :
					console.error(text);
					break;
				case 'warning' : 
					console.warn(text);
					break;
				case 'info' : 
					console.info(text);
					break;
				case 'dir' : 
					console.dir(text);
					break;
				case 'log' : 
				default :
					console.log(text);
					break;
			}
		}
	}

	$.fn.dynamodal = function (option, elemdata) {

		return this.each(function () {
			var $this = $(this),
				data = $this.data('event');

			if(!data){
				data = new ModalManager(this, option);
				if (typeof option === 'string') data[option].apply(data, [].concat(elemdata));
			}else{
				$this.on('click', function(){
					var data = new DynaModal(this, option);
					if (typeof option === 'string') data[option].apply(data, [].concat(elemdata));
				});
			}
		});
	};

	$.fn.dynamodal.defaults = {
		backdrop: 	'static',
		keyboard: 	true,
		focus: 		true,
		show: 		true
	};

	$.fn.dynamodal.Constructor = DynaModal

	$(function () {
		$(document).off('show.bs.modal').off('hidden.bs.modal');
	});

}(jQuery);

$('*[data-event="openModal"]').dynamodal();