// var inputIdName = "input";
// var btnIdName = "button";
// var lblIdName = "label";
// var $form;

var categoryCounter = 0;
var notesCounter = 0;


/*
================
    Models
================
*/

/*    Note    */

function Note () {
    
    this.id = "";
    this.category = "";
    this.note = {
        label:"",
        value:""
    };
}

/*  Categories */
function Category () {
    this.name = "";
}


// function loadInputs(){
// -    var inputId;
// -    var btnId;
// -    var lblId;
// -    var noteInput;
// -    var noteCopy;
// -
// -    for(i = 0; i < localStorage.length; i=i+1){
// -        inputId = inputIdName + i;
// -        btnId = btnIdName + i;
// -        lblId = lblIdName + i;
// -
// -        localInputValue = localStorage.getItem(inputId);
// -        localLabelValue = localStorage.getItem(lblId);
// -
// -        if(localInputValue){
// -            noteLabel = '<input class="label" type="text" id="'+lblId+'" name="'+lblId+'" value="'+localLabelValue+'"/>';
// -            noteInput = '<input type="text" id="'+inputId+'" name="'+inputId+'" value="'+localInputValue+'"/>';
// -            noteCopy = '<button id="'+btnId+'" data-clipboard-target="#'+inputId+'"><i class="fa fa-files-o" aria-hidden="true"></i></button>';
// -
// -            $form.append(noteLabel);
// -            $form.append(noteInput);
// -            $form.append(noteCopy);
// -            $form.append("<br />");
// -        }
// -    }

function loadNotes(){
    
}

/*
    Updates the total count of notes
*/
// function updateTotalCount(store){
//     if(store){
//         var c = store.get("counter");
//         if(c){
//             store.set("counter", c+1);    
//         }else{
//             store.set("counter", 1);    
//         }
//     }
// }
function btnDeleteNote(e){
    $(e).parent().children("input").each(function(){
        store.remove($(this).attr("id"));
    });
    $(e).parent().remove();
    notesCounter -= 1;
    store.set("notesCounter", notesCounter);
}

function saveInputs(){
    $('#noteForm >div').each(function(){
        var catName = $(this).attr("class");
        var rows = $(this).children("div.row");
        
        $(rows).each(function(){
            var lbl = $(this).children("input")[0].value;
            var lblId = $(this).children("input")[0].id;
            var lblCat = $($(this).children("input")[0]).data("category");
            var note = $(this).children("input")[1].value;
            var noteId = $(this).children("input")[1].id;
            var noteCat = $($(this).children("input")[1]).data("category");

            
            // save label
            store.set(lblId, {"id":lblId, "value":lbl, "category": lblCat});
            // store note
            store.set(noteId, {"id":noteId, "value":note,"category": noteCat});
            
        });

        
    });

    store.set("notesCounter", notesCounter);
}

function bindEvents(){
    $('#noteForm').submit(function(e){
        e.preventDefault();
    });

    $('#btnNew').click(function(){
        var active = $('#activeCategory option:selected').val();
        
        var $active = $('#noteForm .'+active);
        if($active.length){
            // row
            var div = document.createElement("div");
            $(div).addClass("row");

            // create label
            var label = document.createElement("input");
            label.type="text";
            label.id="lbl"+notesCounter;
            label.name="lbl"+notesCounter;
            $(label).attr("data-category", active);
            label.value="";
            // create input
            var input = document.createElement("input");
            input.type="text";
            input.id="in"+notesCounter;
            input.name="in"+notesCounter;
            $(input).attr("data-category",active);
            input.value="";
            // create button
            btnId = "btn"+notesCounter;
            var btnCopy = '<button id="'+btnId+'" data-clipboard-target="#'+input.id+'"><i class="fa fa-files-o" aria-hidden="true"></i></button>';
            var btnDelete = '<button class="btnDeleteNote" onclick="btnDeleteNote(this)"><i class="fa fa-times" aria-hidden="true"></i></button>';
            
            // add elements to form
            $(div).append(label);
            $(div).append(input);
            $(div).append(btnCopy);
            $(div).append(btnDelete);

            $active.append(div);
            notesCounter += 1;
        }else{
            showMessage("Warning","Category not found.");
        }


    });


    $('#btnNewCategory').click(function(){
        $('#modalNewCategory').fadeIn("slow");
    });

    $('#modalNewCategory .confirmBtn').click(function(){
        var newCat = $('#formNewCategory input').val();
        if(newCat){
            categories = readCategories() || [];
            categories.push(newCat);    
            categoryCounter += 1;
            store.set('categoryCounter',categoryCounter);
            store.set('categories',categories);
            $(this).parent().fadeOut("slow");
        }else{
            showMessage("Warning", "Please insert a new Category.");
        }
        
        
    });

    $('.closeBtn').click(function(){
        $(this).parent().fadeOut("slow");
    });

    $('#btnSave').click(function(){
        saveInputs();
    });

    $('.btnDeleteCat').click(function(){

        var idCat = $(this).parent().text().slice(0,-1);
        var cats = store.getAll().categories;
        for(var i = 0; i < cats.length; i++){
            if(cats[i] == idCat){
                cats.splice(i,1);
                store.set("categories",cats);
                categoryCounter -= 1;
                store.set("categoryCounter",categoryCounter);
                break;
            }
        }
            
        $(this).parent().remove();
    });
}


/*
    Check local storage
*/
function checkLocalStorage() {
    if (!store.enabled) {
        alert('Local storage is not supported by your browser. Please disable "Private Mode", or upgrade to a modern browser.');
        return;
    }
}

/*
    Load Categories
*/
function readCategories(){
    if(store){
        return store.get("categories");
    }
}

/*
    Update Select
    Add 'options' to 'element'
*/
function updateSelect(element, options){
    var newOpt = '';
    if(element){
        for(i = 0; i < options.length; i++){
            newOpt = '<option value="'+options[i]+'">'+options[i]+'</option>';
            element.append(newOpt);
        }    
    }
}

function loadCategoriesContainers(categories){
    $form = $('#noteForm');
    for(i = 0; i< categories.length;i++){
        var myDiv = document.createElement("div");
        $(myDiv).addClass(categories[i]);
        var myTitle = document.createElement("h3");
        myTitle.innerHTML=categories[i];
        
        var deleteBtn = document.createElement("button");
        $(deleteBtn).addClass("btnDeleteCat").html("-");
        $(myTitle).append(deleteBtn);

        $(myDiv).append(myTitle);

        store.forEach(function(key,value){
            if(isNaN(value)){
                if("category" in value){
                    if(value.category == categories[i]){

                        if(value.id.startsWith("lbl")){
                            var noteId = value.id.slice(3);

                            var div = document.createElement("div");
                            $(div).addClass("row");

                            // note label
                            var input1 = document.createElement("input");
                            // note value
                            var input2 = document.createElement("input");
                            
                            

                            $(input1).attr("id",value.id);
                            $(input1).attr("name",value.id);
                            $(input1).attr("data-category",value.category);
                            $(input1).val(value.value);
                            var noteValue = store.get("in"+ noteId);
                            $(input2).attr("id",noteValue.id);
                            $(input2).attr("name",noteValue.id);
                            $(input2).attr("data-category",value.category);
                            $(input2).val(noteValue.value);
                           

                            // button copy
                            var btnCopy = '<button id="btn'+noteId+'" data-clipboard-target="#'+noteValue.id+'"><i class="fa fa-files-o" aria-hidden="true"></i></button>';

                            // button delete
                            var btnDelete = '<button class="btnDeleteNote" onclick="btnDeleteNote(this)"><i class="fa fa-times" aria-hidden="true"></i></button>';

                            $(div).append(input1);
                            $(div).append(input2);
                            $(div).append(btnCopy);
                            $(div).append(btnDelete);
                            $(myDiv).append(div);

                        }
                        

                    }
                }
            }
        });

        $form.append(myDiv);

        loadNotes();
    }
}

function init(){

    if(store.get("categoryCounter")){
        categoryCounter = store.get("categoryCounter");
    }else{
        store.set("categoryCounter",0);
    }

    if(store.get("notesCounter")){
        notesCounter = store.get("notesCounter");
    }else{
        store.set("notesCounter",0);
    }
}


$(document).ready(function(){
    new Clipboard('button');
    $form= $('#noteForm');
    

    

    checkLocalStorage();
    init();
    var categories = readCategories();
    if(categories){
        updateSelect($('#activeCategory'),categories);    
        loadCategoriesContainers(categories);    
    }else{
        // no categories found

    }

    bindEvents();

});

function showMessage(title,message){
    $('#modalMessage h1').html(title);
    $('#modalMessage p').html(message);
    $('#modalMessage').fadeIn("slow");
}
