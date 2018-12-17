fetch(`https://lesnayagavan.ru/siteContent`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      site:"ozerodom.ru"
    })
  })
    .then(function(response) {
      return response.json();
    })
    .then(function(photos) {
      //carousel
      var carousel = document.getElementsByClassName("carousel");
      var br = createEle("br");
      photos.carousel.map(function(photo){
        var divCarousel = createEle("div");
        var carouselImg = createEle("IMG");
        carouselImg.width = '100%';
        carouselImg.height = '100%';
        carouselImg.setAttribute("alt","Лесная гавань");
        carouselImg.setAttribute('data-src', photo);
        carousel.classList.add("autoplayphoto");
        append(carouselImg, divCarousel);        
        append(divCarousel, carousel);        
      });
      //advertising
      var advertising = document.getElementsByClassName("advertising");
      //1st photo
      var divAdvertising0 = createEle("div");
      var advertisinglImg0 = createEle("IMG");
      advertisinglImg0.setAttribute("alt","Лесная гавань");
      advertisinglImg0.setAttribute('data-src', photos.advertising[0]);
      advertisinglImg0.classList.add("img-responsive", "center-block", "img-thumbnail");
      append(advertisinglImg0, divAdvertising0);  
      append(br, divAdvertising0);  
      append(divAdvertising0, advertising);  
      //2nd photo
      var divAdvertising1 = createEle("div");
      var advertisinglImg1 = createEle("IMG");
      advertisinglImg1.setAttribute("alt","Лесная гавань");
      advertisinglImg1.setAttribute('data-src', photos.advertising[1]);
      advertisinglImg1.classList.add("img-responsive", "center-block", "img-thumbnail");
      append(advertisinglImg1, divAdvertising1);  
      append(divAdvertising1, advertising);  
      //genplan
      var genplan = document.getElementsByClassName("genplan");
      photos.genplan.map(function(photo){
        var divGenplan = createEle("div");
        var genplanlImg = createEle("IMG");
        genplanlImg.style.maxHeight = "772px";
        genplanlImg.setAttribute("alt","Лесная гавань");
        genplanlImg.setAttribute('data-src', photo);
        genplan.classList.add("img-responsive", "center-block", "img-thumbnail");
        append(genplanlImg, divGenplan);  
        append(br, divAdvertising0);       
        append(divGenplan, genplan);        
      });
      //gallery
      var gallery = document.getElementsByClassName("gallery");
      //1st photo
      var divGallery0 = createEle("div");
      var galleryImg0 = createEle("IMG");
      var galleryAnch0 = createEle("a");
      divGallery0.classList.add("col-md-3");
      galleryImg0.style.height = "122px";
      galleryImg0.setAttribute("alt","Лесная гавань");
      galleryImg0.setAttribute('data-src', photos.gallery[0]);
      galleryAnch0.classList.add("prettyphoto");
      galleryAnch0.setAttribute('rel', "prettyPhoto[pp_gal2]");
      galleryAnch0.setAttribute('href', photos.gallery[0]);
      galleryImg0.classList.add("lazy", "img-responsive", "center-block", "img-thumbnail"); 
      append(galleryImg0, galleryAnch0);  
      append(galleryAnch0, divGallery0);  
      append(br, divGallery0);  
      append(divGallery0, gallery); 
      //2nd photo
      var divGallery1 = createEle("div");
      var galleryImg1 = createEle("IMG");
      var galleryAnch1 = createEle("a");
      divGallery1.classList.add("col-md-3");
      galleryImg1.style.height = "122px";
      galleryImg1.setAttribute("alt","Лесная гавань");
      galleryImg1.setAttribute('data-src', photos.gallery[1]);
      galleryAnch1.classList.add("prettyphoto");
      galleryAnch1.setAttribute('rel', "prettyPhoto[pp_gal2]");
      galleryAnch1.setAttribute('href', photos.gallery[1]);
      galleryImg1.classList.add("lazy", "img-responsive", "center-block", "img-thumbnail"); 
      append(galleryImg1, galleryAnch1);  
      append(galleryAnch1, divGallery1);  
      append(br, divGallery1);  
      append(divGallery1, gallery); 
      //3rd photo
      var divGallery2 = createEle("div");
      var galleryImg2 = createEle("IMG");
      var galleryAnch2 = createEle("a");
      divGallery2.classList.add("col-md-3");
      galleryImg2.style.height = "122px";
      galleryImg2.setAttribute("alt","Лесная гавань");
      galleryImg2.setAttribute('data-src', photos.gallery[2]);
      galleryAnch2.classList.add("prettyphoto");
      galleryAnch2.setAttribute('rel', "prettyPhoto[pp_gal2]");
      galleryAnch2.setAttribute('href', photos.gallery[2]);
      galleryImg2.classList.add("lazy", "img-responsive", "center-block", "img-thumbnail"); 
      append(galleryImg2, galleryAnch2);  
      append(galleryAnch2, divGallery2);  
      append(br, divGallery2);  
      append(divGallery2, gallery); 
      //4th photo
      var divGallery3 = createEle("div");
      var galleryImg3 = createEle("IMG");
      var galleryAnch3 = createEle("a");
      divGallery3.classList.add("col-md-3");
      galleryImg3.style.height = "122px";
      galleryImg3.setAttribute("alt","Лесная гавань");
      galleryImg3.setAttribute('data-src', photos.gallery[3]);
      galleryAnch3.classList.add("prettyphoto");
      galleryAnch3.setAttribute('rel', "prettyPhoto[pp_gal2]");
      galleryAnch3.setAttribute('href', photos.gallery[3]);
      galleryImg3.classList.add("lazy", "img-responsive", "center-block", "img-thumbnail"); 
      append(galleryImg3, galleryAnch3);  
      append(galleryAnch3, divGallery3);  
      append(br, divGallery3);  
      append(divGallery3, gallery); 
      //show more
      var gallerySM = document.getElementsByClassName("gallerySM");
      photos.gallery.map(function(photo){
        var divGallerySM = createEle("div");
        var gallerySMImg = createEle("IMG");
        var gallerySMAnch = createEle("a");
        divGallerySM.classList.add("col-md-3");
        gallerySMImg.setAttribute("alt","Лесная гавань");
        gallerySMImg.setAttribute('data-src', photo);
        gallerySMAnch.classList.add("prettyphoto");
        gallerySMAnch.setAttribute('rel', "prettyPhoto[pp_gal2]");
        gallerySMAnch.setAttribute('href', photo);
        gallerySMImg.classList.add("lazy", "img-responsive", "center-block", "img-thumbnail"); 
        append(gallerySMImg, gallerySMAnch);  
        append(gallerySMAnch, divGallerySM);  
        append(br, divGallerySM);  
        append(divGallerySM, gallerySM);       
      });
      //path
      var path = document.getElementsByClassName("path");
      //1st photo
      var divPath0 = createEle("div");
      var pathImg0 = createEle("IMG");
      divPath0.classList.add("col-md-4");
      pathImg0.setAttribute("alt","Лесная гавань");
      pathImg0.setAttribute('data-src', photos.path[0]);
      pathImg0.classList.add("lazy", "img-responsive", "center-block", "img-thumbnail"); 
      append(pathImg0, divPath0);  
      append(divPath0, path);
      //2nd photo
      var divPath1 = createEle("div");
      var pathImg1 = createEle("IMG");
      divPath1.classList.add("col-md-4");
      pathImg1.setAttribute("alt","Лесная гавань");
      pathImg1.setAttribute('data-src', photos.path[1]);
      pathImg1.classList.add("lazy", "img-responsive", "center-block", "img-thumbnail"); 
      append(pathImg1, divPath1);  
      append(divPath1, path);
      //3rd photo
      var divPath2 = createEle("div");
      var pathImg2 = createEle("IMG");
      divPath2.classList.add("col-md-4");
      pathImg2.setAttribute("alt","Лесная гавань");
      pathImg2.setAttribute('data-src', photos.path[2]);
      pathImg2.classList.add("lazy", "img-responsive", "center-block", "img-thumbnail"); 
      append(pathImg2, divPath2);  
      append(divPath2, path);
    });