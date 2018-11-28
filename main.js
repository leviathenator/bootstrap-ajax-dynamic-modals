var $ = jQuery.noConflict();
var debugOn = true;

var dynamodal =  {

    init: function(){

        var btns = $('*[data-event="openModal"]');
        btns.on('click', function(){
            var $this = $(this);
            dynamodal.clickModal($this);
        });
    },

	/**
	 * [callModal -  Programatically call modal window]
	 * @param {[element]} 	DOM element
	 * @param {[event]} 	callback 
	 * @return {[function]}	Calls OpenModal
	*/
	callModal: function(options, callback){

		var checkForExisting = function(){
			return new Promise(function (resolve, reject) {

				var existingModalCheck = $('.modal:not(.pass-on-existing)');
				
				if(debugOn){
					console.log('Checking for existing modal...');
					console.log(existingModalCheck);
				}

				if(existingModalCheck.length > 0){

					if(debugOn){
						console.log('Hiding Modal...');
					}

					existingModalCheck.modal('hide');
                    
                }
                
                resolve(true);
			});
		}

		var runOpenModal = function(){

			var target = options.target,
				templateName = options.template,
				append = (typeof options.append != 'undefined' ? options.append : ''),
				callback = (typeof options.callback === 'function' ? options.callback : false);

            $.get('/templates/'+templateName+(typeof append != 'undefined' ? append : ''), function(htm){

                if(htm && typeof htm == 'string'){

                    var template = dynamodal.handleTemplate(htm);

                    template = $(template).appendTo('body');
                    
                    var id = template.attr('id');

                    dynamodal.openModal(id, null, callback);
    
                }else{
                    if(debugOn){
                        console.log('Could not load template');
                    }
                }
			});
		}

		checkForExisting()
			.then(function(){

				if(debugOn){
					console.log('No modal existed or old modal is now closed...');
				}

				runOpenModal();
			});
	},

	/**
	 * [clickModal -  Call modal window on click event]
	 * @param {[element]} 	DOM element
	 * @param {[event]} 	callback 
	 * @return {[function]}	Calls OpenModal
	*/
	clickModal: function(element, callback){

		// Check if existing modal exists
		// If TRUE then hide old modal and open new modal.
		var checkForExisting = function(){
			return new Promise(function (resolve, reject) {

				var existingModalCheck = $('.modal').not('.pass-on-existing');
				
				if(debugOn){
					console.log('Checking for existing modal...');
					console.log(existingModalCheck);
				}

				if(existingModalCheck.length > 0){

					if(debugOn){
						console.log('Hiding Modal...');
					}

					existingModalCheck.modal('hide');
					
                }
                
                resolve(true);
			});
		}

		var runOpenModal = function(){

            if(debugOn){
                console.log('No modal existed or old modal is now closed...');
            }

			var elem = $(element),
				target = elem.data('target'),
				templateName = elem.data('template'),
				append = elem.data('append');

			$.get('/templates/'+templateName+(typeof append != 'undefined' ? append : ''), function(htm){

                if(htm && typeof htm == 'string'){

                    var template = dynamodal.handleTemplate(htm);

                    template = $(template).appendTo('body');
                    
                    var id = template.attr('id');

                    dynamodal.openModal(id, null, callback);
 
                }else{
                    if(debugOn){
                        console.log(htm);
                        console.log('Could not load template');
                    }
                }

			});
		}

		checkForExisting()
			.then(runOpenModal);
		
    },

	/**
	 * [openModal -  Open Modal window]
	 * @param {[object]} 	elem jQuery element 
	 * @param {[object]} 	opt array of options
	 * @param {[function]}  callback Callback
	*/
	openModal: function(id, opt, callback){
		
		var obj;			

		if (typeof opt === 'function' ) {
			var callback = opt;
		}else if(opt === 'undefined' || !opt){
			opt = {};
		}
		
		var options = {
			backdrop: 	(typeof opt.backdrop === 'undefined' ? 'static' : opt.backdrop),
			keyboard: 	(typeof opt.keyboard === 'undefined' ? true : opt.keyboard),
			focus: 	(typeof opt.focus === 'undefined' ? true : opt.focus),
			show: 	(typeof opt.show === 'undefined' ? true : opt.show),
		}

		obj = $('#'+id);

		obj.on('show.bs.modal', function (e) {
			// Add any functinality that needs to be instantiated once the modal is shown.
		});

		obj.on('hidden.bs.modal', function (e) {
			obj.modal('dispose');
			obj.remove();
		});

		obj.on('shown.bs.modal', function (e) {
			
			// Run your callback function. 
			if(typeof callback === 'function'){
				callback(obj);
			}
        });
        
		obj.modal(options);
    },
    
    /**
	 * [handleTemplate -  Open Modal window]
	 * @param {[string]} 	scriptID ID of the modal DIV element wrapper 
	 * @return {[object]}	jQuery object
	*/
    handleTemplate: function(scriptID){
		var template = $(scriptID);
		template = template.html();
		return $(template);
	},

}

jQuery(document).ready(dynamodal.init);