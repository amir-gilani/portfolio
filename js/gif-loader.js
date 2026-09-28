/* Loads project GIFs from /assets one by one, after the page itself is ready.
   A GIF that scrolls into view before its turn jumps the queue. */
(function(){
  var GAP=350, queue=[], busy=false;
  function load(img){
    return new Promise(function(done){
      if(!img||!img.dataset.src){done();return;}
      var src=img.dataset.src; img.removeAttribute("data-src");
      img.addEventListener("load",done,{once:true});
      img.addEventListener("error",done,{once:true});
      img.src=src;
    });
  }
  function next(){
    if(busy)return; var img=queue.shift(); if(!img)return;
    if(!img.dataset.src){next();return;}
    busy=true;
    load(img).then(function(){busy=false;setTimeout(next,GAP);});
  }
  function start(){
    var imgs=[].slice.call(document.querySelectorAll("img[data-src]"));
    if(!imgs.length){requestAnimationFrame(start);return;}
    queue=imgs;
    if("IntersectionObserver" in window){
      var io=new IntersectionObserver(function(es){es.forEach(function(e){
        if(e.isIntersecting){io.unobserve(e.target);
          if(e.target.dataset.src){queue.splice(queue.indexOf(e.target),1);queue.unshift(e.target);next();}}
      });},{rootMargin:"200px 0px"});
      imgs.forEach(function(i){io.observe(i);});
    }
    setTimeout(next,250);
  }
  if(document.readyState==="complete")start(); else window.addEventListener("load",start);
})();
