///////////////////////////////////////////
// BASE JAVASCRIPT FUNCTIONALITY         //
///////////////////////////////////////////
//= require jquery
//= require jquery-ui
//= require bootstrap
//= require bootstrap-dropdown
//= require bootstrap-modal
//
///////////////////////////////////////////
// UTILITIES                             //
///////////////////////////////////////////
//= require tinymce-jquery

jQuery.fn.RichTextEditor = function (options) {
  $this = $(this);
  // fix tinymce bug with html5 and required fields
  if($this.is("[required]")){
      options.oninit = function(editor){
          $this.closest("form").find(":submit").on("click", function(){
            editor.save();
          });
      }
  }
  $this.tinymce(options);
}

jQuery.fn.scrollTo = function () {
  space_at_top = $('.navbar').height() + 20;
  $('html,body').animate({scrollTop: $(this).offset().top - space_at_top},'slow');
}

jQuery.fn.keepUpdatedFromUrl = function (url_to_load, frequency) {
	updateElementFromUrl($(this), url_to_load);
	setInterval(
		function() {
			updateElementFromUrl($(this), url_to_load);
		}, 
		frequency
	);
}

function updateElementFromUrl(element, url_to_load) {
	$.get(url_to_load, function(data) {
		element.html(data);
	});
}

function submitViaAjax(form) {
  $('#'+ form.attr('id') + '_spinner').removeClass('hide');
  console.log('Attempting to save via AJAX...');
  $.ajax({
    type: form.attr('method'),
    url: form.attr('action').replace('?', '.js?'),
    data: form.serialize(),
    dataType: 'script',
    success: function(response) {
      if(response) {
        console.log('Return script received.');
      } else {
        console.log('Failed to receive return script.');
      }
    },
    error: logError
  });
}
	
$('.delete-via-ajax').live('click', function(event){
	event.preventDefault();
	if(confirm($(this).attr('data-manual-confirm'))) {
		console.log('Attempting to delete via AJAX...');
		$.ajax({
			type: 'POST',
			data: {'_method': 'delete'},
			url: $(this).attr('href') + '.js',
		    dataType: 'script',
		    success: function(response) {
		      if(response) {
		        console.log('Return script received.');
		      } else {
		        console.log('Failed to receive return script.');
		      }
		    },
		    error: logError
		});
	}
})

$('.submit-via-ajax').live('submit', function(event){
  event.preventDefault();
  submitViaAjax($(this));
});

$('.submit-via-ajax').bind('form-pre-serialize', function(e) {
        tinyMCE.triggerSave();
});

$('.edit-via-ajax').live('click', function(){
  event.preventDefault();
  console.log('Attempting to retrieve edit form via AJAX...');
  $('#'+ $(this).attr('id') + '_spinner').removeClass('hide');
  $.ajax({
    type: $(this).attr('method'),
    url: $(this).attr('href').replace('?', '.js?'),
    dataType: 'script',
    success: function(response) {
      if(response) {
        console.log('Return script received.');
      } else {
        console.log('Failed to receive return script.');
      }
    },
    error: logError
  });
});

$('.act-via-ajax').live('click', function(event){
  event.preventDefault();
  console.log('Attempting to act via AJAX...');
  $this = $(this);
  $('#'+ $this.attr('id') + '_spinner').removeClass('hide');
  if($this.is("input") || $this.is("button")) {
  	action = $this.closest('form').attr('action');
  	method = $this.closest('form').attr('method');
  } else if ($this.is("a")) {
  	action = $this.attr('href');
  	method = $this.attr('data-method');
  } else {
  	console.log('Could not identify element type.');
  	return false;
  }
  $.ajax({
    type: method,
    url: action.replace('?', '.js?'),
    dataType: 'html',
    success: function(response) {
      if(response) {
        $this.effect("pulsate", { times:1 }, 250);
        $this.replaceWith(response);
        $('#' + $this.attr('id')).effect("pulsate", { times:2 }, 500);
      } else {
        console.log('Failed to receive return script.');
      }
    },
    error: logError
  });
});

function logError(jqXHR, textStatus, errorThrown) {
  console.log(jqXHR);
  console.log(textStatus);
  console.log(errorThrown);
}
