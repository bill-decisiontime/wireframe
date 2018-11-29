$(document).ready(function()
{    
  var linkify_options = {
    target: function(href, type)
    {
      if (type === 'mention' || type === 'hashtag')
      {
        return '_blank';
      }      
    },
    formatHref: function(href, type)
    {
      if (type === 'mention')
      {
        href = 'https://twitter.com'+href;
      }
      
      if (type === 'hashtag')
      {
        href = 'https://twitter.com/hashtag/' + href.substring(1)+'?src=hash';
      }
      
      return href;
    }    
  };
  
  socket.on('got_tweet', function(tweet)
  {    
    var html = '<li class="list-group-item">'+tweet+'</li>';
    $('#tweet_list').prepend(html).linkify(linkify_options);
  });
});
