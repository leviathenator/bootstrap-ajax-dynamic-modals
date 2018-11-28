<?php
    $title = 'Modal 3 with Server-Side Data';
    $body = 'This is modal Three. A dynamically loaded html template with server-side interaction';
?>
<template id="modal3-tmpl">
    <div class="modal fade" id="modal3" tabindex="-1" role="dialog" aria-labelledby="modal3Title" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-header">
            <h5 class="modal-title" id="modal3Title"><?php echo $title ?></h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
            </div>
            <div class="modal-body">
                <?php echo $body ?>
            </div>
            <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            <button id="popalert" type="button" class="btn btn-primary">Click Me</button>
            </div>
        </div>
        </div>
        <script>

            var modalThree = $('#modal3'),
                modalThreeButton = modalThree.find('#popalert');

            modalThreeButton.on('click', function(){
                alert('I did something.');
            });

        </script>
    </div>
</template>