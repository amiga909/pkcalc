 if (!window.FileReader || !window.Blob) {
 	alert('The File APIs are not fully supported in this browser.');

 }

 $(document).ready(function() {
 	zip.workerScriptsPath = "assets/js/jszip/";
 	PkerJS.App.init();
//PkerJS.ErrorMessage.show("no data found for Player ", "sad");
//PkerJS.ErrorMessage.show("no data found for Player1 ", "sad"); 
 });

