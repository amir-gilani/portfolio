(function(){
  var imgs=[], queue=[], busy=false;
  function load(img){
    return new Promise(function(done){
      if(!img||!img.dataset.src){done();return;}
      var src=img.dataset.src;
      img.removeAttribute('data-src');
      img.addEventListener('load',done,{once:true});
      img.addEventListener('error',done,{once:true});
      img.src=src;
    });
  }
  function next(){
    if(busy)return;
    var img=queue.shift();
    if(!img)return;
    if(!img.dataset.src){next();return;}
    busy=true;
    load(img).then(function(){busy=false;setTimeout(next,300);});
  }
  function start(){
    imgs=[].slice.call(document.querySelectorAll('img[data-src]'));
    if(!imgs.length){requestAnimationFrame(start);return;}
    queue=imgs.slice();
    if(window.IntersectionObserver){
      var io=new IntersectionObserver(function(es){
        es.forEach(function(e){
          if(e.isIntersecting&&e.target.dataset.src){
            var idx=queue.indexOf(e.target);
            if(idx>-1)queue.splice(idx,1);
            queue.unshift(e.target);
            next();
          }
        });
      },{rootMargin:'150px'});
      imgs.forEach(function(i){io.observe(i);});
    }
    setTimeout(next,200);
  }
  if(document.readyState==='complete')start();
  else window.addEventListener('load',start);
})();