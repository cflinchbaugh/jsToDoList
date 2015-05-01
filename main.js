//All desired functionality successfully implemented

//Establish Local Storage
function run(){
    if (Storage){  //(typeof(Storage) !== "undefined") {  //if (Storage !== void 0) {  //if (Storage)
        //ToDo List
        //get the ToDo items saved in localstorage

        if (localStorage.getItem("toDoStorage")){
            var retrievedToDoStorage = localStorage.getItem("toDoStorage"),
                parsedToDoStorage = JSON.parse(retrievedToDoStorage),
                i = 0,
                retrievedRCStorage = localStorage.getItem("RCStorage"),
                parsedRCStorage = JSON.parse(retrievedRCStorage);
                localToDoArray = [],
                localRCArray = [];

            if (parsedToDoStorage.length){
                var parsedToDolength = parsedToDoStorage.length;
            } else {
                var parsedToDolength = 0;
            }

            if (parsedRCStorage !== null){
                var parsedRClength = parsedRCStorage.length;
            } else {
                var parsedRClength = 0;
            }

            //Add back into the ToDoList
            if (parsedToDoStorage !== null && parsedToDolength !== 0) { //if (parsedToDoStorage && parsedToDoStorage.length) {}
                for (i = 0; i < parsedToDolength; i++) { //if i is declared ahead you can remove i = 0;
                    addItem(parsedToDoStorage[i]);          
                }
            }

            //Recently Complete List
            //get the RecentlyCompleted items saved in localstorage

            //Add back into the RecentlyCompletedTasks
            if (parsedRCStorage !== null && parsedRClength !== 0) {
                for (i = 0; i < parsedRClength; i++) {
                    addStoredRCItem(parsedRCStorage[i]);
                }
            }
        //If storage has not yet been established
        } else {
            var firstItem = {'one':1},
                retrievedToDoStorage = localStorage.setItem("toDoStorage", JSON.stringify(firstItem));
        }
    } else {
        alert("Sorry, your browser does not support Web Storage; upgrade for crying out loud!");
    }

//Create temporary localToDoArray and pull content in from local storage
if (parsedToDoStorage !== null && parsedToDolength !== 0) {
    for (i = 0; i < parsedToDolength; i++) {
        localToDoArray[i] = parsedToDoStorage[i];
    }
}


//Create temporary localRCArray and pull content in from local storage
if (parsedRCStorage !== null && parsedRClength !== 0) {
    for (i = 0; i < parsedRClength; i++) {
        localRCArray[i] = parsedRCStorage[i];
    }
}

//Add new toDoItem from dialog box
var toDoSubmit = $('#toDoSubmit');
$(toDoSubmit).on("click", function() {
    var toDoItem = document.getElementById("ToDo").value;

    if (toDoItem !== "") {   //empty strings are false, so this could just be if (toDoItem)
        //Append to localToDoArray
        localToDoArray[localToDoArray.length] = toDoItem;

        //Update toDoStorage
        localStorage.setItem("toDoStorage", JSON.stringify(localToDoArray));

        //Add to live list
        addItem(toDoItem);
    }
});

//Create and append the actual item toDoItem
//var addItem = function addItem(toDoItem) {
function addItem(toDoItem) {    
    var toDoItemDiv = document.createElement("div"),
        check = document.createElement("button"),
        completeButtonText = document.createElement("input"),
        listItem = document.createElement("li");
    
    //Create container div
    toDoItemDiv.className = "toDoItemDiv";

    //Create Checkbox
    completeButtonText.type = "checkbox";
    completeButtonText.className = "chk";
    completeButtonText.setAttribute('readonly', 'true');
    check.appendChild(completeButtonText);

    check.id = "completeID";

    //Create the list item and add the appropriate attributes
    listItem.className = "listClass";
    listItem.setAttribute('contenteditable', 'true');
    listItem.setAttribute('onDblclick', '$(this).focus();');

    //Verify the item isn't blank and add it to the list
    listItem.textContent = toDoItem;
    toDoItemDiv.appendChild(check);
    toDoItemDiv.appendChild(listItem);
    list.appendChild(toDoItemDiv);

    //Clear the text box
    document.getElementById("ToDo").value = "";
}

// Complete checked
$('#completeCheckedBtn').on("click", function() {
    $(".chk:checked").each(function() {
        var $cacheThis = $(this),
            completeMe = $cacheThis.closest(".toDoItemDiv").find("li").text(),
            //Used to remove item from localStoredArray
            index = localToDoArray.indexOf(completeMe);

        $cacheThis.prop('checked', false);

        if (completeMe !== "") {
            //Append to localRCArray
            localRCArray[localRCArray.length] = completeMe;

            //Update RCStorage
            localStorage.setItem("RCStorage", JSON.stringify(localRCArray));

            //Update localStoredArray
            if (index > -1) {
                //Remove item from localToDoArray
                localToDoArray.splice(index, 1);

                //Update toDoStorage
                localStorage.setItem("toDoStorage", JSON.stringify(localToDoArray));
            }

            //Add to live list
            completeMe = $cacheThis.closest(".toDoItemDiv");
            console.log("completeMe: ");
            console.log($cacheThis.id);
            addRCItem(completeMe);
        }
    });
});

function addRCItem(rcItem) {
    //cache var $rcItem = $(rcItem) (naming convention)
    var $cacheRCItem = $(rcItem);
    //Update the class
    $cacheRCItem.removeClass('toDoItemDiv');
    $cacheRCItem.addClass('rcItemDiv');

    //Update the button id
    $cacheRCItem.find("button").attr("id", "RCID");

    $("#recentlyCompletedTasks").append($cacheRCItem);
}

function addStoredRCItem(rcItem) {
    var rcItemDiv = document.createElement("div"),
        check = document.createElement("button"),
        completeButtonText = document.createElement("input"),
        listItem = document.createElement("li");
    
    //Create container div
    rcItemDiv.className = "rcItemDiv";

    //Create Checkbox
    completeButtonText.type = "checkbox";
    completeButtonText.className = "chk";
    completeButtonText.setAttribute('readonly', 'true');
    check.appendChild(completeButtonText);
    check.id = "RCID";

    //Create the list item and add the appropriate attributes
    listItem.className = "listClass";
    listItem.setAttribute('contenteditable', 'true');
    listItem.setAttribute('onDblclick', '$(this).focus();');

    //Verify the item isn't blank and add it to the list
    listItem.textContent = rcItem;
    rcItemDiv.appendChild(check);
    rcItemDiv.appendChild(listItem);
    recentlyCompletedTasks.appendChild(rcItemDiv);

}

// Restore checked
$('#restoreButton').on("click", function() {
    $(".chk:checked").each(function() {
        var $cacheThis = $(this),
            restoreMe = $cacheThis.parent().parent().children(".listClass").text();

        $cacheThis.prop('checked', false);

        if (restoreMe !== "") {
            //Append to localToDoArray
            localToDoArray[localToDoArray.length] = restoreMe;

            //Update RCStorage
            localStorage.setItem("toDoStorage", JSON.stringify(localToDoArray));

            //Remove from localRCArray
            var index = localRCArray.indexOf(restoreMe);

            //Update localRCArray
            if (index > -1) {
                //Remove item from localToDoArray
                localRCArray.splice(index, 1);

                //Update toDoStorage
                localStorage.setItem("RCStorage", JSON.stringify(localRCArray));
            }

            //Add to live list
            restoreMe = $cacheThis.closest(".rcItemDiv");

            //Update the class
            restoreMe.removeClass('rcItemDiv');
            restoreMe.addClass('toDoItemDiv');

            //Update the button id
            restoreMe.find("button").attr("id", "completeID");

            $("#list").append(restoreMe);
        }
    });
});

//Remove focus on button click
$("button").on("click", function() {
    $("button").blur();
});

//To Do Check all button
$('#toDoCheckAllBtn').on("click", function() {
    $(this).closest("#toDoWrapper").find(".chk").prop('checked', true);     //if this is actually an ID (only used once), don't need to use THIS
});

//To Do Uncheck all button
$('#toDoUncheckAllBtn').on("click", function() {
    $(this).closest("#toDoWrapper").find(".chk").prop('checked', false);
});

//Recently Completed Check all button
$('#RCcheckAllBtn').on("click", function() {
    $(this).closest("#recentlyCompletedWrapper").find(".chk").prop('checked', true);
});

//Recently Completed Uncheck all button
$('#RCuncheckAllBtn').on("click", function() {
    $(this).closest("#recentlyCompletedWrapper").find(".chk").prop('checked', false);
});

//Submit on "Enter"
$('#ToDo').keypress(function(e) {
    if (e.which == 13) {
        $("#toDoSubmit").click()
    }
});

// Enable sorting
$("#list, #recentlyCompletedTasks").sortable();

//Update local storage when sorting ToDoList
$("#list").on("sortupdate", function(event, ui) {
    var updateToDO = false;

    $("li").each(function(index) {
        var cacheThis = $(this);
        if ($(cacheThis).parent().parent().attr("id") == "list") {       //could just check the length on the closest id list
            //console.log( index + ": " + $( this ).text() );
            localToDoArray[index] = $(cacheThis).text();
            updateToDO = true;
        }
    });

    if (updateToDO) {
        localStorage.setItem("toDoStorage", JSON.stringify(localToDoArray));
        updateToDo = false;
    }
});

//Update local storage when sorting Recently Completed List
$("#recentlyCompletedTasks").on("sortupdate", function(event, ui) {
    var updateRC = false;
    var count = $("#recentlyCompletedTasks li").children().length;

    $("li").each(function(index) {
        var cacheThis = $(this);
        if ($(cacheThis).parent().parent().attr("id") == "recentlyCompletedTasks") {
            localRCArray[index - localToDoArray.length] = $(cacheThis).text();
            updateRC = true;
        }
    });

    if (updateRC) {
        localStorage.setItem("RCStorage", JSON.stringify(localRCArray));
        updateRC = false;
    }
});

//Save initial value on double click in a temp var
//$('li').dblclick(function() {
$('li').on("dblclick", function() {
    var unchangedEditText = $(this).text();

    //Compare updated value on blur
    $('li').on('blur', function() {
        if ($(this).text() !== "") {
            var updatedEditText = $(this).text();

            //If text was changed, find in storage and update value
            if (updatedEditText !== unchangedEditText) {
                if (($(this).parent().parent().attr('id')) == "list") {
                    for (i = 0; i < localToDoArray.length; i++) {
                        if (localToDoArray[i] == unchangedEditText) {
                            localToDoArray[i] = updatedEditText;
                            break;
                        }
                    }

                    //Update toDoStorage
                    localStorage.setItem("toDoStorage", JSON.stringify(localToDoArray));
                } else if (($(this).parent().parent().attr('id')) == "recentlyCompletedTasks") {
                    for (i = 0; i < localRCArray.length; i++) {
                        if (localRCArray[i] == unchangedEditText) {
                            localRCArray[i] = updatedEditText;
                            break;
                        }
                    }

                    //Update toDoStorage
                    localStorage.setItem("RCStorage", JSON.stringify(localRCArray));
                }
            }
        }
    });
});

//Delete from recently completed section
$("#emptyButton").on('click', function() {
    $(".chk:checked").each(function() {
        var deleteMeDiv = $(this).closest(".rcItemDiv"),
            deleteMeText = deleteMeDiv.children(".listClass").text();

        if (deleteMeText !== "") {
            //Remove from localStoredArray
            var index = localRCArray.indexOf(deleteMeText);

            //Update localRCArray
            if (index > -1) {
                //Remove item from localRCArray
                localRCArray.splice(index, 1);

                //Update toDoStorage
                localStorage.setItem("RCStorage", JSON.stringify(localRCArray));
            }
            deleteMeDiv.remove();
        }
    });
});

//Animation CSS
$('#RCtoggle').on('click', function() {
    $('#recentlyCompletedWrapper').toggleClass('slideClass');
});

}

run();
