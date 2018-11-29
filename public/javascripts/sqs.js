$(document).ready(function()
{
  socket.on('got_sqs', function(msg)
  {
    var html = '<li class="list-group-item">msg: <code>'+msg.Body+'</code> id: <code>'+msg.MessageId+'</code></li>';
    $('#sqs_list').append(html);
  });
});
