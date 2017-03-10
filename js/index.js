$(document).ready(function(){
    inputListener();
    GetImages(user_id);
});
var user_id = 4;
var image_counter = 0;
var file_array = [];

function inputListener(){

    var drag_upload = $(".drag-upload");
    var input_file = $(".input-file");

    input_file.on('dragenter', function(e){
        e.stopPropagation();
        e.preventDefault();
        drag_upload.addClass('active');
    });

    input_file.on('dragleave', function(e){
        e.stopPropagation();
        e.preventDefault();
        drag_upload.removeClass('active');
    });

    input_file.on('dragover', function(e){
        e.stopPropagation();
        e.preventDefault();
    });

    input_file.on('drop', function (e){
        e.preventDefault();
        drag_upload.removeClass('active');
        storeAndPreviewImage(e.originalEvent.dataTransfer.files);
    });

    input_file.on('mouseover', function(){
        drag_upload.addClass('active');
    });

    input_file.on('mouseout', function(){
        drag_upload.removeClass('active');
    });

    input_file.on('change', function(){
        storeAndPreviewImage($(this)[0].files);
    });

    $('.button').click(function(){
        var imageArray = [];
        var fileArray = [];

        var formData = new FormData();

        for(var i = 0; i < file_array.length; i++){
            var flag = 0;

            if($('#' + file_array[i].dom_id + " > .flag-icon-container").find("input").attr("checked") == 'checked') {
                flag = 1;
            }

            imageArray.push({
                'creator_id': file_array[i].creator_id,
                'filesize': file_array[i].filesize,
                'filetype': file_array[i].filetype,
                'flag': flag,
            });

            formData.append('file_array_' + i, file_array[i].filedata);
        }
        
        var json = JSON.stringify(imageArray);
        formData.append('image_array', json);
        formData.append('transaction_type', 'batch_save');

        $.ajax({
            url: './php/Controller/ImageController.php',
            data: formData,
            type: 'POST',
            contentType: false,
            processData: false,
            async: true,
            cache: false,
            dataType: "text",
            enctype: 'multipart/form-data',
            success: function(data) {
                // Success Code
                alert(data);

                $(".file-list").empty(); // remove content
                file_array = [];
                GetImages(user_id);

            },
            error: function() {
                // Error Code
                alert('Error');
            }
        });

    });

}

// Continue code here
function storeAndPreviewImage(files){

    for (var i = 0; i < files.length; i++){
        var dataUri;

        $('.file-list').append('<div id="image-item-' + image_counter + '" class="file-item">' +
            '<div class="delete-button-container">' +
                '<i class="delete-button material-icons">clear</i>' +
            '</div>' +
            '<div class="image-icon-container">' +
                '<div class="image-container">' +
                    '<img src="">' +
                '</div>' +
            '</div>' +
            '<div class="image-name">' +
            '</div>' +
            '<div class="image-filesize">' +
            '</div>' +
            '<div class="flag-icon-container">' +
                '<div class="custom-checkbox custom-checkbox-checked">' +
                '</div>' +
                '<input class="hidden" type="checkbox" checked>' +
            '</div>' +
        '</div>');

        $('#image-item-' + image_counter + ' > .image-name').text(files[i].name);
        $('#image-item-' + image_counter + ' > .image-filesize').text(formatBytes(files[i].size));
        $('#image-item-' + image_counter + ' > .flag-icon-container > .custom-checkbox').click(function(){
            
            if($(this).hasClass('custom-checkbox-checked')){
                $(this).removeClass('custom-checkbox-checked');
                $(this).parent().find('input').attr('checked', false);
            }
            else{
                $(this).addClass('custom-checkbox-checked');
                $(this).parent().find('input').attr('checked', true);
            }

        });

        $('#image-item-' + image_counter + ' > .delete-button-container').click(function(){
            removeFromFileArray($(this).parent());
            $(this).parent().remove();
        });

        var file_item_id = '#image-item-' + image_counter + ' > .image-icon-container > .image-container > img';

        fileReader(files[i], file_item_id, image_counter);

        // ----------------------------
        var filetype = fileType(files[i].type);

        var array = {
            'dom_id': 'image-item-' + image_counter,
            'creator_id': user_id,
            'filename': files[i].name,
            'filetype': filetype,
            'filesize': files[i].size,
            'filedata': files[i]
        };

        file_array.push(array);
        
        image_counter++;
        // ----------------------------

    }

}

function removeFromFileArray(element){
    var length = file_array.length;
    var dom_id = $(element).attr('id');

    for(var index = 0; index < length; index++){

        if(file_array[index].dom_id == dom_id){
            file_array.splice(index, 1);

            break;
        }
    }
}

function updateImage(file_id, flag){
    var formData = new FormData();
    formData.append('id', file_id);
    formData.append('flag', flag);
    formData.append('transaction_type', 'update');

    $.ajax({
        url: './php/Controller/ImageController.php',
        data: formData,
        type: 'POST',
        contentType: false,
        processData: false,
        async: true,
        cache: false,
        success: function(data) {
            // Success Code
            if(!data){
                alert(data);
            }
        },
        error: function() {
            // Error Code
            alert('Error');
        }
    });

}

function deleteImage(file_id, filename){

    var formData = new FormData();
    formData.append('id', file_id);
    formData.append('filename', filename);
    formData.append('transaction_type', 'delete');

    $.ajax({
        url: './php/Controller/ImageController.php',
        data: formData,
        type: 'POST',
        contentType: false,
        processData: false,
        async: true,
        cache: false,
        success: function(data) {
            // Success Code
            if(!data){
                alert(data);
            }
        },
        error: function() {
            // Error Code
            alert('Error');
        }
    });

}

function fileReader(file, file_item_id, image_counter){
    var reader = new FileReader();

    reader.onload = function (e) {
        $(file_item_id).attr('src', e.target.result);
    }

    reader.readAsDataURL(file);
}

function fileType(mime_type){

    if(mime_type == "image/bmp" || mime_type == "image/x-windows-bmp"){
        return ".bmp";
    }
    else if(mime_type == "image/gif"){
        return ".gif";
    }
    else if(mime_type == "image/x-icon"){
        return ".ico";
    }
    else if(mime_type == "image/jpeg" || mime_type == "image/pjpeg"){
        return ".jpg";
    }
    else if(mime_type == "image/png"){
        return ".png";
    }
    else{
        return ".jpg";
    }

}

function formatBytes(bytes,decimals) {
    if(bytes == 0) return '0 Byte';
    var k = 1000; // or 1024 for binary
    var dm = decimals + 1 || 2;
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    var i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}


function GetImages(creator_id){
    var formData = new FormData();
    formData.append('creator_id', creator_id);
    formData.append('transaction_type', 'get_list');

    $.ajax({
        url: './php/Controller/ImageController.php',
        data: formData,
        type: 'POST',
        contentType: false,
        processData: false,
        async: true,
        cache: false,
        success: function(data) {
            // Success Code
            obj = JSON.parse(data);

            $.each( obj, function( i, value ){
                var converted = formatBytes(value.filesize);

                $('.file-list').append('<div id="image-item-'+value.id+'" class="file-item">' +
                        '<div class="delete-button-container">' +
                            '<i class="delete-button material-icons">clear</i>' +
                        '</div>' +
                        '<div class="image-icon-container">' +
                            '<div class="image-container">' +
                                '<img src="images/' + value.creator_id + '/'+value.filename+'">' +
                            '</div>' +
                        '</div>' +
                        '<div class="image-name">' +
                            value.filename +
                        '</div>' +
                        '<div class="image-filesize">' +
                            converted +
                        '</div>' +
                        '<div class="flag-icon-container">' +
                            '<div class="custom-checkbox">' +
                            '</div>' +
                            '<input class="hidden" type="checkbox">' +
                        '</div>' +
                    '</div>');

                clickBox(value.flag , value.id);

                $('#image-item-' + value.id + ' > .delete-button-container').click(function(){
                    var file_id = $(this).parent().attr("id").replace("image-item-", "");
                    var filename = $(this).parent().find(".image-name").text().replace(" ", "");

                    deleteImage(file_id, filename);
                    $(this).parent().remove();
                });
                
                image_counter = value.id + 1;
  
            });

        },
        error: function() {
            // Error Code
            alert('Error');
        }
    });

}

function clickBox (flag, counter) {

    $('#image-item-' + counter + ' > .flag-icon-container > .custom-checkbox').click(function(){
        var flag = 0;
        var file_id = $(this).parent().parent().attr("id").replace("image-item-", "");

        if($(this).hasClass('custom-checkbox-checked')){
            $(this).removeClass('custom-checkbox-checked');
            $(this).parent().find('input').attr('checked', false);
        }
        else{
            flag = 1;
            $(this).addClass('custom-checkbox-checked');
            $(this).parent().find('input').attr('checked', true);
        }

        updateImage(file_id, flag);
    });

    if (flag == 1) {
        $('#image-item-' + counter + ' > .flag-icon-container > .custom-checkbox').addClass('custom-checkbox-checked');
        $('#image-item-' + counter + ' > .flag-icon-container > .custom-checkbox').parent().find('input').attr('checked', true);
    }
}








