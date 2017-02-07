var inputIdName = "input";
var btnIdName = "button";
var lblIdName = "label";
var $form;

function checkLocalStorage(){
    if (typeof(Storage) !== "undefined") {
        return true;
    } else {
        // Sorry! No Web Storage support..
        console.log("No LocalStorage Support.");
        return false;
    }
}

function addInput(){

}

function saveInputs(){
    $('#noteForm input').each(function(){
        if("id" in this && "value" in this){
            if(this.id && this.value){
                localStorage.setItem(this.id, this.value);        
            }
        }
    });
}

function loadInputs(){
    var inputId;
    var btnId;
    var lblId;
    var noteInput;
    var noteCopy;
    
    for(i = 0; i < localStorage.length; i=i+1){
        inputId = inputIdName + i;
        btnId = btnIdName + i;
        lblId = lblIdName + i;

        localInputValue = localStorage.getItem(inputId);
        localLabelValue = localStorage.getItem(lblId);

        if(localInputValue){
            noteLabel = '<input class="label" type="text" id="'+lblId+'" name="'+lblId+'" value="'+localLabelValue+'"/>';
            noteInput = '<input type="text" id="'+inputId+'" name="'+inputId+'" value="'+localInputValue+'"/>';
            noteCopy = '<button id="'+btnId+'" data-clipboard-target="#'+inputId+'"><i class="fa fa-files-o" aria-hidden="true"></i></button>';
            
            $form.append(noteLabel);
            $form.append(noteInput);
            $form.append(noteCopy);
            $form.append("<br />");
        }
    }
}

function bindEvents(){
    $('#noteForm').submit(function(e){
        e.preventDefault();
    });

    $('#btnNew').click(function(){
        lblId = lblIdName + (localStorage.length - 1);
        inputId = inputIdName + (localStorage.length - 1);
        noteLabel = '<input class="label" type="text" id="'+lblId+'" name="'+lblId+'" value=""/>';
        noteInput = '<input type="text" id="'+inputId+'" name="'+inputId+'" value=""/>';

        $form.append(noteLabel);
        $form.append(noteInput);
    });

    $('#btnSave').click(function(){
        saveInputs();
    });
}
$(document).ready(function(){
    new Clipboard('button');
    $form= $('#noteForm');

    bindEvents();
    

    if(checkLocalStorage()){
        // loop the localStorage
        loadInputs();
    }
    


});
